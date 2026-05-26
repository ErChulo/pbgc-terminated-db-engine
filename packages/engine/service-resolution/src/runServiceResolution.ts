import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedServiceOutput,
  parsePacketJson,
} from "@pbgc/db";
import { buildInputPacketNotActiveError } from "./errors";
import { resolveService } from "./resolveService";
import {
  buildServiceResolutionTraces,
  collectWarnings,
  writeModuleTraceRows,
} from "./trace";
import { validateServiceResolutionPacket } from "./validatePacket";
import {
  SERVICE_RESOLUTION_MODULE_VERSION,
  type RunServiceResolutionRequest,
  type RunServiceResolutionResult,
  type ServiceResolutionPacket,
  type ServiceResolutionOutput,
} from "./types";

export function runServiceResolution(db: Database, request: RunServiceResolutionRequest): RunServiceResolutionResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "service_resolution") {
    const error = buildInputPacketNotActiveError(request.input_packet_id, request.rule_version);
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, 1));
    return failedResult(calculation_run_id, [error]);
  }

  const packet = parsePacketJson<ServiceResolutionPacket>(record);
  const errors = validateServiceResolutionPacket(packet, request.input_packet_id, request.rule_version);
  if (errors.length > 0) {
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, errors.length));
    return failedResult(calculation_run_id, errors);
  }

  const values = resolveService(packet);
  const traceEntries = buildServiceResolutionTraces(values, packet, {
    inputPacketId: request.input_packet_id,
    caseId: request.case_id,
    subjectKey: request.subject_key,
    ruleVersion: request.rule_version,
    moduleVersion: SERVICE_RESOLUTION_MODULE_VERSION,
  });
  const warnings = collectWarnings(traceEntries, packet, request.input_packet_id, request.rule_version);
  const output: ServiceResolutionOutput = {
    resolved_service_comp_output_id: createDeterministicId("resolved-service"),
    calculation_run_id,
    case_id: request.case_id,
    subject_key: request.subject_key,
    ...values,
    compensation_resolved: null,
    average_compensation_resolved: null,
    covered_compensation_resolved: null,
  };
  const traces = writeModuleTraceRows(calculation_run_id, request.subject_key, traceEntries, packet, request.rule_version);
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", warnings.length, 0));
  insertResolvedServiceOutput(db, output);
  for (const trace of traces) insertModuleTrace(db, trace);
  return {
    calculation_run_id,
    run_status: "completed",
    resolved_service_comp_output_id: output.resolved_service_comp_output_id,
    warning_count: warnings.length,
    error_count: 0,
    warnings,
    errors: [],
    output,
    traces,
  };
}

function makeRun(
  request: RunServiceResolutionRequest,
  calculation_run_id: string,
  started_at: string,
  run_status: EngineRunRecord["run_status"],
  warning_count: number,
  error_count: number,
): EngineRunRecord {
  return {
    calculation_run_id,
    case_id: request.case_id,
    input_packet_id: request.input_packet_id,
    rule_version: request.rule_version,
    deliverable_version: request.deliverable_version,
    run_context: "service_resolution_mvp",
    started_at,
    completed_at: currentTimestamp(),
    run_status,
    warning_count,
    error_count,
  };
}

function failedResult(calculationRunId: string, errors: StructuredIssue[]): RunServiceResolutionResult {
  return {
    calculation_run_id: calculationRunId,
    run_status: "failed",
    warning_count: 0,
    error_count: errors.length,
    warnings: [],
    errors,
    traces: [],
  };
}

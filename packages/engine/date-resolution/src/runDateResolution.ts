import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedDatesOutput,
  parsePacketJson,
} from "@pbgc/db";
import { resolveDates } from "./resolveDates";
import { validateDateResolutionPacket } from "./validatePacket";
import { buildInputPacketNotActiveError } from "./errors";
import { buildDateResolutionTraces, collectWarnings, writeModuleTraceRows } from "./trace";
import {
  DATE_RESOLUTION_MODULE_NAME,
  DATE_RESOLUTION_MODULE_VERSION,
  type DateResolutionPacket,
  type RunDateResolutionRequest,
  type RunDateResolutionResult,
} from "./types";

export function runDateResolution(db: Database, request: RunDateResolutionRequest): RunDateResolutionResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "date_resolution") {
    const run = makeRun(request, calculation_run_id, started_at, "failed", 1);
    insertEngineRun(db, run);
    return {
      calculation_run_id,
      run_status: "failed",
      warning_count: 0,
      error_count: 1,
      warnings: [],
      errors: [buildInputPacketNotActiveError(request.input_packet_id, request.rule_version)],
      traces: [],
    };
  }

  const packet = parsePacketJson<DateResolutionPacket>(record);
  const errors = validateDateResolutionPacket(packet, request.input_packet_id, request.rule_version);
  if (errors.length > 0) {
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", errors.length));
    return {
      calculation_run_id,
      run_status: "failed",
      warning_count: 0,
      error_count: errors.length,
      warnings: [],
      errors,
      traces: [],
    };
  }

  const values = resolveDates(packet);
  const output = {
    resolved_dates_output_id: createDeterministicId("resolved-dates"),
    calculation_run_id,
    case_id: request.case_id,
    subject_key: request.subject_key,
    ...values,
  };
  const traceEntries = buildDateResolutionTraces(values, packet, {
    inputPacketId: request.input_packet_id,
    caseId: request.case_id,
    subjectKey: request.subject_key,
    ruleVersion: request.rule_version,
    moduleVersion: DATE_RESOLUTION_MODULE_VERSION,
  });
  const traces = writeModuleTraceRows(calculation_run_id, request.subject_key, traceEntries);
  const warnings = collectWarnings(traceEntries, request.rule_version);
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", warnings.length));
  insertResolvedDatesOutput(db, output);
  for (const trace of traces) insertModuleTrace(db, trace);
  return {
    calculation_run_id,
    run_status: "completed",
    resolved_dates_output_id: output.resolved_dates_output_id,
    warning_count: warnings.length,
    error_count: 0,
    warnings,
    errors: [],
    output,
    traces,
  };
}

function makeRun(
  request: RunDateResolutionRequest,
  calculation_run_id: string,
  started_at: string,
  run_status: EngineRunRecord["run_status"],
  error_or_warning_count: number,
): EngineRunRecord {
  return {
    calculation_run_id,
    case_id: request.case_id,
    input_packet_id: request.input_packet_id,
    rule_version: request.rule_version,
    deliverable_version: request.deliverable_version,
    run_context: "date_resolution_mvp",
    started_at,
    completed_at: currentTimestamp(),
    run_status,
    warning_count: run_status === "completed" ? error_or_warning_count : 0,
    error_count: run_status === "failed" ? error_or_warning_count : 0,
  };
}



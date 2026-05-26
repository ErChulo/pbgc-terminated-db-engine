import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedFormsOutput,
  parsePacketJson,
} from "@pbgc/db";
import { buildInputPacketNotActiveError } from "./errors";
import { resolveForms } from "./resolveForms";
import { buildFormTraces, collectWarnings, toModuleTraces } from "./trace";
import { validateFormResolutionPacket } from "./validatePacket";
import {
  FORM_RESOLUTION_MODULE_NAME,
  FORM_RESOLUTION_MODULE_VERSION,
  type FormResolutionOutput,
  type FormResolutionPacket,
  type RunFormResolutionRequest,
  type RunFormResolutionResult,
} from "./types";

export function runFormResolution(db: Database, request: RunFormResolutionRequest): RunFormResolutionResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "form_resolution") {
    const error = buildInputPacketNotActiveError(request.input_packet_id, request.rule_version);
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, 1));
    return failedResult(calculation_run_id, [error]);
  }

  const packet = parsePacketJson<FormResolutionPacket>(record);
  const errors = validateFormResolutionPacket(packet, request.input_packet_id, request.rule_version);
  if (errors.length > 0) {
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, errors.length));
    return failedResult(calculation_run_id, errors);
  }

  const { values, warnings } = resolveForms(packet, request.input_packet_id, request.rule_version);
  const output: FormResolutionOutput = {
    resolved_forms_output_id: createDeterministicId("resolved-form"),
    calculation_run_id,
    case_id: request.case_id,
    subject_key: request.subject_key,
    ...values,
  };
  const entries = buildFormTraces(calculation_run_id, request.subject_key, values, packet);
  collectWarnings(entries, packet);
  const traces = toModuleTraces(entries, calculation_run_id, request.subject_key, warnings);
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", warnings.length, 0));
  insertResolvedFormsOutput(db, output);
  for (const trace of traces) insertModuleTrace(db, trace);
  return {
    calculation_run_id,
    run_status: "completed",
    resolved_forms_output_id: output.resolved_forms_output_id,
    warning_count: warnings.length,
    error_count: 0,
    warnings,
    errors: [],
    output,
    traces,
  };
}

function makeRun(
  request: RunFormResolutionRequest,
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
    run_context: "form_resolution_mvp",
    started_at,
    completed_at: currentTimestamp(),
    run_status,
    warning_count,
    error_count,
  };
}

function failedResult(calculationRunId: string, errors: StructuredIssue[]): RunFormResolutionResult {
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

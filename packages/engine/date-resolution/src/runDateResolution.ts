import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type ModuleTrace } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedDatesOutput,
  parsePacketJson,
} from "@pbgc/db";
import { resolveDates } from "./resolveDates";
import { validateDateResolutionPacket } from "./validatePacket";
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
      errors: [{
        code: "INPUT_PACKET_NOT_ACTIVE",
        message: "Active date_resolution input packet was not found",
        input_packet_id: request.input_packet_id,
        module_name: DATE_RESOLUTION_MODULE_NAME,
        rule_version: request.rule_version,
      }],
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
  const traces = buildTraces(calculation_run_id, request.subject_key, values);
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", 0));
  insertResolvedDatesOutput(db, output);
  for (const trace of traces) insertModuleTrace(db, trace);
  return {
    calculation_run_id,
    run_status: "completed",
    resolved_dates_output_id: output.resolved_dates_output_id,
    warning_count: 0,
    error_count: 0,
    warnings: [],
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
  error_count: number,
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
    warning_count: 0,
    error_count,
  };
}

function buildTraces(calculationRunId: string, subjectKey: string, values: Record<string, string | number | null>): ModuleTrace[] {
  return Object.entries(values)
    .filter(([, value]) => value !== null)
    .map(([field, value]) => ({
      module_trace_id: createDeterministicId("trace"),
      calculation_run_id: calculationRunId,
      module_name: DATE_RESOLUTION_MODULE_NAME,
      subject_key: subjectKey,
      field_name: field,
      rule_applied: `${DATE_RESOLUTION_MODULE_NAME}@${DATE_RESOLUTION_MODULE_VERSION}:${field}`,
      input_fields_used_json: JSON.stringify(["case_plan_timeline", "resolved_plan_logic", "participant_role_population"]),
      intermediate_values_json: JSON.stringify({ module_version: DATE_RESOLUTION_MODULE_VERSION }),
      output_value: String(value),
      warning_note: null,
    }));
}

import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedCompensationOutput,
  parsePacketJson,
} from "@pbgc/db";
import { resolveCompensation } from "./resolveCompensation";
import { validateCompensationResolutionPacket } from "./validatePacket";
import {
  COMPENSATION_RESOLUTION_MODULE_NAME,
  COMPENSATION_RESOLUTION_MODULE_VERSION,
  type CompensationResolutionOutput,
  type CompensationResolutionPacket,
  type CompensationResolutionValues,
  type RunCompensationResolutionRequest,
  type RunCompensationResolutionResult,
} from "./types";

export function runCompensationResolution(db: Database, request: RunCompensationResolutionRequest): RunCompensationResolutionResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "compensation_resolution") {
    const error = makeIssue(
      "INPUT_PACKET_NOT_ACTIVE",
      "Active compensation_resolution input packet was not found",
      request.input_packet_id,
      request.rule_version,
    );
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, 1));
    return failedResult(calculation_run_id, [error]);
  }

  const packet = parsePacketJson<CompensationResolutionPacket>(record);
  const errors = validateCompensationResolutionPacket(packet, request.input_packet_id, request.rule_version);
  if (errors.length > 0) {
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, errors.length));
    return failedResult(calculation_run_id, errors);
  }

  const { values, warnings } = resolveCompensation(packet, request.input_packet_id, request.rule_version);
  const output: CompensationResolutionOutput = {
    resolved_service_comp_output_id: createDeterministicId("resolved-comp"),
    calculation_run_id,
    case_id: request.case_id,
    subject_key: request.subject_key,
    eligibility_service_resolved: null,
    vesting_service_resolved: null,
    benefit_service_resolved: null,
    accrual_service_resolved: null,
    ...values,
  };
  const traces = buildTraces(calculation_run_id, request.subject_key, values, warnings);
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", warnings.length, 0));
  insertResolvedCompensationOutput(db, output);
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
  request: RunCompensationResolutionRequest,
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
    run_context: "compensation_resolution_mvp",
    started_at,
    completed_at: currentTimestamp(),
    run_status,
    warning_count,
    error_count,
  };
}

function failedResult(calculationRunId: string, errors: StructuredIssue[]): RunCompensationResolutionResult {
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

function makeIssue(
  code: string,
  message: string,
  inputPacketId: string,
  ruleVersion: string,
  field_name?: string,
  input_group?: string,
): StructuredIssue {
  return {
    code,
    message,
    field_name,
    input_group,
    input_packet_id: inputPacketId,
    module_name: COMPENSATION_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

function buildTraces(
  calculationRunId: string,
  subjectKey: string,
  values: CompensationResolutionValues,
  warnings: StructuredIssue[],
): ModuleTrace[] {
  const warningNote = warnings.map((warning) => warning.message).join("; ") || null;
  return Object.entries(values)
    .filter(([, value]) => value !== null)
    .map(([field, value]) => ({
      module_trace_id: createDeterministicId("trace"),
      calculation_run_id: calculationRunId,
      module_name: COMPENSATION_RESOLUTION_MODULE_NAME,
      subject_key: subjectKey,
      field_name: field,
      rule_applied: `${COMPENSATION_RESOLUTION_MODULE_NAME}@${COMPENSATION_RESOLUTION_MODULE_VERSION}:final_average_pay`,
      input_fields_used_json: JSON.stringify([
        "case_plan_timeline",
        "resolved_plan_logic",
        "participant_role_population",
        "service_employment_history",
        "compensation_accrual_inputs",
        "benefit_administration_state",
        "limitation_packet",
      ]),
      intermediate_values_json: JSON.stringify({
        module_version: COMPENSATION_RESOLUTION_MODULE_VERSION,
        branch: field === "covered_compensation_resolved" ? "fixture_covered_compensation" : "fixture_final_average_pay",
        compensation_history_used: true,
        override_applied: false,
        covered_compensation_applied: field === "covered_compensation_resolved",
        compensation_limit_applied: false,
        frozen_benefit_support_applied: warnings.length > 0,
        pia_offset_applied: false,
      }),
      output_value: String(value),
      warning_note: warningNote,
    }));
}

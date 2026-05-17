import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedServiceOutput,
  parsePacketJson,
} from "@pbgc/db";
import { resolveService } from "./resolveService";
import { validateServiceResolutionPacket } from "./validatePacket";
import {
  SERVICE_RESOLUTION_MODULE_NAME,
  SERVICE_RESOLUTION_MODULE_VERSION,
  type RunServiceResolutionRequest,
  type RunServiceResolutionResult,
  type ServiceResolutionPacket,
  type ServiceResolutionOutput,
  type ServiceResolutionValues,
} from "./types";

export function runServiceResolution(db: Database, request: RunServiceResolutionRequest): RunServiceResolutionResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "service_resolution") {
    const error = makeIssue(
      "INPUT_PACKET_NOT_ACTIVE",
      "Active service_resolution input packet was not found",
      request.input_packet_id,
      request.rule_version,
    );
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
  const warnings = buildWarnings(packet, request.input_packet_id, request.rule_version);
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
  const traces = buildTraces(calculation_run_id, request.subject_key, values, warnings);
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

function buildWarnings(packet: { service_employment_history: { dote: string | null } }, inputPacketId: string, ruleVersion: string): StructuredIssue[] {
  if (packet.service_employment_history.dote !== null) return [];
  return [
    makeIssue(
      "ACTIVE_AT_DOPT_SERVICE_END",
      "Participant has no DOTE; service resolved through DOPT for the MVP fixture path",
      inputPacketId,
      ruleVersion,
      "dote",
      "service_employment_history",
    ),
  ];
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
    module_name: SERVICE_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

function buildTraces(
  calculationRunId: string,
  subjectKey: string,
  values: ServiceResolutionValues,
  warnings: StructuredIssue[],
): ModuleTrace[] {
  const warningNote = warnings.map((warning) => warning.message).join("; ") || null;
  return Object.entries(values)
    .filter(([, value]) => value !== null)
    .map(([field, value]) => ({
      module_trace_id: createDeterministicId("trace"),
      calculation_run_id: calculationRunId,
      module_name: SERVICE_RESOLUTION_MODULE_NAME,
      subject_key: subjectKey,
      field_name: field,
      rule_applied: `${SERVICE_RESOLUTION_MODULE_NAME}@${SERVICE_RESOLUTION_MODULE_VERSION}:plan_year_1000_hours`,
      input_fields_used_json: JSON.stringify([
        "case_plan_timeline",
        "resolved_plan_logic",
        "participant_role_population",
        "service_employment_history",
        "actuarial_assumption_factor_set",
        "limitation_packet",
      ]),
      intermediate_values_json: JSON.stringify({
        module_version: SERVICE_RESOLUTION_MODULE_VERSION,
        branch: "fixture_plan_year_inclusive",
        freeze_applied: field === "benefit_service_resolved" || field === "accrual_service_resolved",
        break_applied: false,
        transfer_applied: false,
        segment_applied: false,
        override_applied: false,
      }),
      output_value: String(value),
      warning_note: warningNote,
    }));
}

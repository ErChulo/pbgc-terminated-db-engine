import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedFormsOutput,
  parsePacketJson,
} from "@pbgc/db";
import { resolveForms } from "./resolveForms";
import { validateFormResolutionPacket } from "./validatePacket";
import {
  FORM_RESOLUTION_MODULE_NAME,
  FORM_RESOLUTION_MODULE_VERSION,
  type FormResolutionOutput,
  type FormResolutionPacket,
  type FormResolutionValues,
  type RunFormResolutionRequest,
  type RunFormResolutionResult,
} from "./types";

export function runFormResolution(db: Database, request: RunFormResolutionRequest): RunFormResolutionResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "form_resolution") {
    const error = makeIssue(
      "INPUT_PACKET_NOT_ACTIVE",
      "Active form_resolution input packet was not found",
      request.input_packet_id,
      request.rule_version,
    );
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
  const traces = buildTraces(calculation_run_id, request.subject_key, values, warnings, packet);
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
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

function buildTraces(
  calculationRunId: string,
  subjectKey: string,
  values: FormResolutionValues,
  warnings: StructuredIssue[],
  packet: FormResolutionPacket,
): ModuleTrace[] {
  const warningNote = warnings.map((warning) => warning.message).join("; ") || null;
  return Object.entries(values)
    .filter(([, value]) => value !== null)
    .map(([field, value]) => ({
      module_trace_id: createDeterministicId("trace"),
      calculation_run_id: calculationRunId,
      module_name: FORM_RESOLUTION_MODULE_NAME,
      subject_key: subjectKey,
      field_name: field,
      rule_applied: `${FORM_RESOLUTION_MODULE_NAME}@${FORM_RESOLUTION_MODULE_VERSION}:fixture_form_rules`,
      input_fields_used_json: JSON.stringify([
        "case_plan_timeline",
        "resolved_plan_logic",
        "participant_role_population",
        "benefit_administration_state",
        "actuarial_assumption_factor_set",
        "limitation_packet",
      ]),
      intermediate_values_json: JSON.stringify({
        module_version: FORM_RESOLUTION_MODULE_VERSION,
        branch: packet.benefit_administration_state.current_pay_status === "in_pay" ? "fixture_in_pay" : packet.participant_role_population.qdro_indicator ? "fixture_qdro" : "fixture_deferred",
        current_pay_applied: packet.benefit_administration_state.current_pay_status === "in_pay",
        qdro_applied: packet.participant_role_population.qdro_indicator,
        qpsa_applied: packet.participant_role_population.qpsa_indicator,
        death_benefit_applied: field === "form_code_death",
        lump_sum_applied: field === "lsoption",
        contribution_applied: false,
        pbgc_form_policy_applied: true,
      }),
      output_value: String(value),
      warning_note: warningNote,
    }));
}

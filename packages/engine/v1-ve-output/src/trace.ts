import { createDeterministicId, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import { V1_VE_OUTPUT_MODULE_NAME, V1_VE_OUTPUT_MODULE_VERSION, type V1VeOutputPacket, type V1VeOutputRow } from "./types";

function groupsForField(fieldName: string): string[] {
  if (
    [
      "bcv_rec_id",
      "custid",
      "retstat",
      "id",
      "fname",
      "lname",
      "sfname",
      "slname",
      "psex",
      "ssex",
      "mstat",
      "dob",
      "sdob",
      "dod",
      "relation",
      "non_spouse_benf",
      "qdro_indicator",
      "qpsa_indicator",
      "calc_indicator",
      "calculation_context",
    ].includes(fieldName)
  ) return ["case_plan_timeline", "participant_role_population", "benefit_administration_state", "limitation_packet"];
  if (["nrd", "erd", "eurd", "eprd", "rbd", "xra", "xrd", "sxra", "term_lw_xra", "term_lw_anb"].includes(fieldName)) return ["resolved_dates"];
  if (
    [
      "rettyp",
      "form_code_nsf",
      "form_code_nmf",
      "form_code_ptp",
      "form_code_ptp_qpsa",
      "form_code_death",
      "annuity_status_pay",
      "lsoption",
      "bs_ind",
      "br_ind",
      "ofa_indicator",
    ].includes(fieldName)
  ) return ["resolved_forms_status", "benefit_administration_state"];
  if (
    [
      "eligibility_service_resolved",
      "vesting_service_resolved",
      "benefit_service_resolved",
      "accrual_service_resolved",
      "compensation_resolved",
      "average_compensation_resolved",
      "covered_compensation_resolved",
    ].includes(fieldName)
  ) return ["resolved_service_compensation"];
  return ["benefit_kernel_output"];
}

export function buildV1VeTraces(
  calculationRunId: string,
  subjectKey: string,
  row: V1VeOutputRow,
  packet: V1VeOutputPacket,
  warnings: StructuredIssue[],
): ModuleTrace[] {
  const warningNote = warnings.map((warning) => warning.message).join("; ") || null;
  const outputFields = Object.entries(row).filter(([, value]) => value !== null);
  return outputFields.map(([field, value]) => ({
    module_trace_id: createDeterministicId("trace"),
    calculation_run_id: calculationRunId,
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    subject_key: subjectKey,
    field_name: field,
    rule_applied: `${V1_VE_OUTPUT_MODULE_NAME}@${V1_VE_OUTPUT_MODULE_VERSION}:direct_projection`,
    input_fields_used_json: JSON.stringify(groupsForField(field)),
    intermediate_values_json: JSON.stringify({
      module_version: V1_VE_OUTPUT_MODULE_VERSION,
      output_order_version: "0.1.0",
      subject_type: packet.subject_type,
      technical_override_applied: Boolean(packet.technical_output_override_packet),
      branch: packet.resolved_forms_status.annuity_status_pay === "in_pay" ? "in_pay" : packet.participant_role_population.qdro_indicator ? "qdro" : packet.participant_role_population.qpsa_indicator ? "qpsa" : "deferred_vested",
    }),
    output_value: String(value),
    warning_note: warningNote,
  }));
}

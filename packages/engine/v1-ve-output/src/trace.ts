import { createDeterministicId, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import { canonicalDdFieldName } from "./ddMapping";
import { V1_VE_OUTPUT_MODULE_NAME, V1_VE_OUTPUT_MODULE_VERSION, type V1VeOutputPacket, type V1VeOutputRow } from "./types";

function groupsForField(fieldName: string): string[] {
  const ddFieldName = canonicalDdFieldName(fieldName);
  if (
    [
      "BCV_REC_ID",
      "CASE",
      "RETSTAT",
      "ID",
      "CUSTID",
      "FNAME",
      "SSN",
      "LNAME",
      "SFNAME",
      "SLNAME",
      "PSEX",
      "SSEX",
      "MSTAT",
      "DOB",
      "SDOB",
      "DOD",
      "RELATION",
      "NON_SPOUSE_BENF",
      "QDRO_INDICATOR",
      "QPSA_INDICATOR",
      "CALC_INDICATOR",
      "CALCULATION_CONTEXT",
    ].includes(ddFieldName)
  ) return ["case_plan_timeline", "participant_role_population", "benefit_administration_state", "limitation_packet"];
  if (["NRD", "ERD", "EURD", "EPRD", "RBD", "XRA", "XRD", "SXRA", "TERM_LW_XRA", "TERM_LW_ANB"].includes(ddFieldName)) return ["resolved_dates"];
  if (
    [
      "RETTYP",
      "FORM_CODE_NSF",
      "FORM_CODE_NMF",
      "FORM_CODE_PTP",
      "FORM_CODE_PTP_QPSA",
      "FORM_CODE_DEATH",
      "ANNUITY_STATUS_PAY",
      "LSOPTION",
      "BS_IND",
      "BR_IND",
      "OFA_INDICATOR",
    ].includes(ddFieldName)
  ) return ["resolved_forms_status", "benefit_administration_state"];
  if (
    [
      "ELIGIBILITY_SERVICE_RESOLVED",
      "VESTING_SERVICE_RESOLVED",
      "BENEFIT_SERVICE_RESOLVED",
      "ACCRUAL_SERVICE_RESOLVED",
      "COMPENSATION_RESOLVED",
      "AVERAGE_COMPENSATION_RESOLVED",
      "COVERED_COMPENSATION_RESOLVED",
    ].includes(ddFieldName)
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
    rule_applied: `${V1_VE_OUTPUT_MODULE_NAME}@${V1_VE_OUTPUT_MODULE_VERSION}:dd_first_projection`,
    input_fields_used_json: JSON.stringify(groupsForField(field)),
    intermediate_values_json: JSON.stringify({
      module_version: V1_VE_OUTPUT_MODULE_VERSION,
      output_order_version: "0.1.0",
      dd_field_name: canonicalDdFieldName(field),
      subject_type: packet.subject_type,
      technical_override_applied: Boolean(packet.technical_output_override_packet),
      branch: packet.resolved_forms_status.annuity_status_pay === "in_pay" ? "in_pay" : packet.participant_role_population.qdro_indicator ? "qdro" : packet.participant_role_population.qpsa_indicator ? "qpsa" : "deferred_vested",
    }),
    output_value: String(value),
    warning_note: warningNote,
  }));
}

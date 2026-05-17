import type { StructuredIssue } from "@pbgc/shared";
import { V1_VE_OUTPUT_MODULE_NAME, type V1VeOutputPacket } from "./types";

const REQUIRED_GROUPS = [
  "case_plan_timeline",
  "participant_role_population",
  "benefit_administration_state",
  "limitation_packet",
  "resolved_dates",
  "resolved_service_compensation",
  "resolved_forms_status",
  "benefit_kernel_output",
] as const;

const REQUIRED_FIELDS: Record<(typeof REQUIRED_GROUPS)[number], string[]> = {
  case_plan_timeline: ["case_id", "plan_id", "dopt", "dotr", "bpd", "dobf"],
  participant_role_population: [
    "bcv_rec_id",
    "custid",
    "retstat",
    "id",
    "fname",
    "lname",
    "mstat",
    "dob",
    "non_spouse_benf",
    "qdro_indicator",
    "qpsa_indicator",
    "retirement_status_as_of_dopt",
    "payment_status_as_of_dopt",
  ],
  benefit_administration_state: [
    "dor",
    "asd",
    "sbcd",
    "current_form_code",
    "current_payment_amount",
    "current_pay_status",
    "elected_form_indicator",
    "spouse_beneficiary_commencement_state",
  ],
  limitation_packet: [
    "calc_indicator",
    "calculation_context",
    "section_436_applicable_indicator",
    "phase_in_limitation_indicator",
    "annuity_starting_date_limitation_indicator",
    "death_benefit_limitation_indicator",
    "form_of_benefit_limitation_indicator",
    "actuarial_equivalence_limitation_indicator",
  ],
  resolved_dates: ["nrd", "erd", "eurd", "eprd", "rbd", "xra", "xrd", "sxra", "term_lw_xra", "term_lw_anb"],
  resolved_service_compensation: [
    "eligibility_service_resolved",
    "vesting_service_resolved",
    "benefit_service_resolved",
    "accrual_service_resolved",
    "compensation_resolved",
    "average_compensation_resolved",
    "covered_compensation_resolved",
  ],
  resolved_forms_status: [
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
  ],
  benefit_kernel_output: [
    "term_mb_nrd_nsf",
    "term_surv_mb_nrd",
    "term_surv_mb_eurd",
    "term_surv_mb_erd",
    "rbd_surv_mb_term",
    "term_surv_mb_ard",
    "xrd_mb_term",
    "xrd_surv_mb_term",
    "xrd_mb_qpsa_term",
    "ls_term",
    "ls_qpsa",
    "xrd_mb_title_iv",
    "nrd_mb_title_iv_nsf",
    "eurd_mb_title_iv_nsf",
    "erd_mb_title_iv_nsf",
    "rbd_mb_title_iv",
    "ard_mb_title_iv",
    "pvmb_title_iv_no_q_no_l",
    "pvmb_title_iv_qpsa",
    "pvmb_title_iv_no_load",
    "title_iv_load",
    "pvmb_title_iv",
    "xrd_mb_4022c",
    "pvmb_4022c_no_q_no_l",
    "pvmb_4022c_qpsa",
    "pvmb_4022c_no_load",
    "load_4022c",
    "pvmb_4022c",
    "pvmb_bas_ungb_no_q_no_l",
    "pvmb_bas_ungb_qpsa",
    "bnnfa_pvmb_no_load",
    "bnnfa_load",
    "bnnfa_pvmb",
    "pvpbl_ann_rates_no_q_no_l",
    "pvpbl_ann_rates_qpsa",
    "pvpbl_ann_rates_no_load",
    "pbl_load",
    "pvpbl_ann_rates",
    "pvf_lev_ann",
    "pvf_lev_ls",
    "pvf_qpsa_ls",
    "pvmb_term_no_q_no_l",
    "pvmb_term_qpsa",
    "pvmb_term_no_load",
    "term_load",
    "pvmb_term",
  ],
};

const ALLOWED_OVERRIDES = new Set([
  "term_mb_nrd_nsf",
  "xrd_mb_term",
  "xrd_mb_title_iv",
  "pvmb_title_iv",
  "pvmb_term",
]);

export function validateV1VeOutputPacket(packet: V1VeOutputPacket, inputPacketId: string, ruleVersion: string): StructuredIssue[] {
  const errors: StructuredIssue[] = [];
  if (packet.packet_type !== "v1_ve_output") {
    errors.push(issue("INVALID_PACKET_TYPE", "Packet type must be v1_ve_output", inputPacketId, ruleVersion, "packet_type"));
  }
  if (packet.schema_version !== "0.1.0") {
    errors.push(issue("UNSUPPORTED_SCHEMA_VERSION", "Only schema version 0.1.0 is supported", inputPacketId, ruleVersion, "schema_version"));
  }

  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(issue("MISSING_INPUT_GROUP", `Missing required V1/VE input group ${group}`, inputPacketId, ruleVersion, undefined, group));
      continue;
    }
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in value)) {
        errors.push(issue("MISSING_INPUT_FIELD", `Missing required V1/VE input field ${group}.${field}`, inputPacketId, ruleVersion, field, group));
      }
    }
  }

  if (packet.resolved_forms_status.annuity_status_pay === "in_pay" && packet.benefit_administration_state.current_pay_status !== "in_pay") {
    errors.push(issue("MISSING_IN_PAY_PACKET", "In-pay output requires a reviewed pay-status path", inputPacketId, ruleVersion, "current_pay_status", "benefit_administration_state"));
  }
  if (packet.participant_role_population.qdro_indicator && packet.resolved_forms_status.bs_ind === null && packet.resolved_forms_status.br_ind === null) {
    errors.push(issue("MISSING_QDRO_PACKET", "QDRO output requires reviewed QDRO branch state", inputPacketId, ruleVersion, "bs_ind", "resolved_forms_status"));
  }
  if (packet.participant_role_population.qpsa_indicator && packet.resolved_forms_status.form_code_ptp_qpsa === null && packet.resolved_forms_status.form_code_death === null) {
    errors.push(issue("MISSING_QPSA_PACKET", "QPSA output requires reviewed QPSA branch state", inputPacketId, ruleVersion, "form_code_ptp_qpsa", "resolved_forms_status"));
  }

  if (packet.technical_output_override_packet && !ALLOWED_OVERRIDES.has(packet.technical_output_override_packet.output_column_name)) {
    errors.push(issue("UNSUPPORTED_OVERRIDE_FIELD", "Technical override field is not supported by the V1/VE MVP", inputPacketId, ruleVersion, "output_column_name", "technical_output_override_packet"));
  }

  return errors;
}

export function validateOverrideFieldName(fieldName: string): fieldName is keyof V1VeOutputPacket["benefit_kernel_output"] {
  return ALLOWED_OVERRIDES.has(fieldName);
}

function issue(
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
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

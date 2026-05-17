import type { StructuredIssue } from "@pbgc/shared";
import { BENEFIT_KERNEL_MODULE_NAME, type BenefitKernelPacket } from "./types";

const REQUIRED_GROUPS = [
  "case_plan_timeline",
  "resolved_plan_logic",
  "participant_role_population",
  "service_employment_history",
  "compensation_accrual_inputs",
  "benefit_administration_state",
  "actuarial_assumption_factor_set",
  "limitation_packet",
  "resolved_dates",
  "resolved_service_compensation",
  "resolved_forms_status",
] as const;

const REQUIRED_FIELDS: Record<(typeof REQUIRED_GROUPS)[number], string[]> = {
  case_plan_timeline: ["case_id", "plan_id", "dopt", "dotr", "bpd", "dobf"],
  resolved_plan_logic: [
    "accrued_benefit_formula",
    "normal_single_form_rule",
    "normal_married_form_rule",
    "early_reduced_retirement_rule",
    "early_retirement_adjustment_rule",
    "default_actuarial_equivalence_rule",
    "deferred_vested_normal_retirement_rule",
    "deferred_vested_early_retirement_rule",
    "late_retirement_rule",
    "eligibility_service_rule",
    "vesting_service_rule",
    "benefit_service_rule",
    "accrual_factor_rule",
    "short_service_factor_rule",
    "compensation_definition_rule",
    "average_compensation_rule",
    "covered_compensation_rule",
    "pia_offset_rule",
    "supplemental_benefit_rule",
    "form_conversion_basis_rule",
    "late_retirement_adjustment_rule",
    "suspension_of_benefits_rule",
    "disability_benefit_rule",
    "pre_retirement_death_benefit_rule",
    "post_retirement_death_benefit_rule",
    "vesting_schedule_rule",
    "cash_out_rule",
    "mandatory_employee_contribution_rule",
    "voluntary_employee_contribution_rule",
    "top_heavy_rule",
    "consensual_lump_sum_rule",
    "additional_provisions_of_note",
  ],
  participant_role_population: [
    "bcv_rec_id",
    "custid",
    "retstat",
    "id",
    "role_type",
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
    "five_percent_owner_indicator",
    "substantial_owner_indicator",
    "retirement_status_as_of_dopt",
    "payment_status_as_of_dopt",
  ],
  service_employment_history: [
    "doh",
    "dop",
    "dote",
    "service_basis_code",
    "service_hours_requirement",
    "service_period_basis",
    "plan_anniversary_service_basis",
    "vesting_service_at_dopt",
    "benefit_service_at_dopt",
    "accrual_service_at_dopt",
  ],
  compensation_accrual_inputs: [
    "compensation_basis_code",
    "average_compensation_period",
    "compensation_history_available_indicator",
    "final_average_compensation",
    "covered_compensation_amount",
    "frozen_accrued_benefit_indicator",
    "frozen_accrued_monthly_benefit",
    "accrued_benefit_at_dopt",
    "vested_percentage_at_dopt",
  ],
  benefit_administration_state: [
    "dor",
    "asd",
    "sbcd",
    "current_form_code",
    "current_payment_amount",
    "payment_history_available_indicator",
    "check_register_available_indicator",
    "current_pay_status",
    "elected_form_indicator",
    "spouse_beneficiary_commencement_state",
  ],
  actuarial_assumption_factor_set: [
    "assumption_set_id",
    "plan_factor_table_id",
    "interest_basis_code",
    "mortality_basis_code",
    "pre_retirement_mortality_code",
    "post_retirement_mortality_code",
    "retirement_age_convention",
    "form_conversion_method",
    "lookback_period",
    "stability_period",
    "required_beginning_date_method",
    "lump_sum_basis_code",
    "annuity_basis_code",
  ],
  limitation_packet: [
    "calc_indicator",
    "calculation_context",
    "section_436_applicable_indicator",
    "bankruptcy_plan_indicator",
    "bpd_limitation_indicator",
    "majority_owner_limitation_indicator",
    "aggregate_limit_applicable_indicator",
    "accrued_at_termination_limitation_indicator",
    "phase_in_limitation_indicator",
    "vested_at_termination_limitation_indicator",
    "annuity_starting_date_limitation_indicator",
    "death_benefit_limitation_indicator",
    "form_of_benefit_limitation_indicator",
    "actuarial_equivalence_limitation_indicator",
    "ongoing_employment_contingency_indicator",
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
};

export function validateBenefitKernelPacket(packet: BenefitKernelPacket, inputPacketId: string, ruleVersion: string): StructuredIssue[] {
  const errors: StructuredIssue[] = [];
  if (packet.packet_type !== "benefit_kernel") {
    errors.push(issue("INVALID_PACKET_TYPE", "Packet type must be benefit_kernel", inputPacketId, ruleVersion, "packet_type"));
  }
  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(issue("MISSING_INPUT_GROUP", `Missing required benefit input group ${group}`, inputPacketId, ruleVersion, undefined, group));
      continue;
    }
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in value)) {
        errors.push(issue("MISSING_INPUT_FIELD", `Missing required benefit input field ${group}.${field}`, inputPacketId, ruleVersion, field, group));
      }
    }
  }

  if (packet.resolved_plan_logic.accrued_benefit_formula !== "1.5pct_final_avg_pay_x_service" && packet.resolved_plan_logic.accrued_benefit_formula !== "1.0pct_plus_integration") {
    errors.push(issue("UNSUPPORTED_ACCRUED_BENEFIT_FORMULA", "MVP supports only committed benefit formula fixture values", inputPacketId, ruleVersion, "accrued_benefit_formula", "resolved_plan_logic"));
  }
  if (packet.resolved_plan_logic.normal_single_form_rule !== "sla") {
    errors.push(issue("UNSUPPORTED_NORMAL_SINGLE_FORM_RULE", "MVP supports only sla normal single form rule", inputPacketId, ruleVersion, "normal_single_form_rule", "resolved_plan_logic"));
  }
  if (packet.resolved_plan_logic.normal_married_form_rule !== "qjsa_50") {
    errors.push(issue("UNSUPPORTED_NORMAL_MARRIED_FORM_RULE", "MVP supports only qjsa_50 normal married form rule", inputPacketId, ruleVersion, "normal_married_form_rule", "resolved_plan_logic"));
  }
  if (packet.resolved_plan_logic.pre_retirement_death_benefit_rule !== "qpsa") {
    errors.push(issue("UNSUPPORTED_DEATH_BENEFIT_RULE", "MVP supports only qpsa pre-retirement death benefit rule", inputPacketId, ruleVersion, "pre_retirement_death_benefit_rule", "resolved_plan_logic"));
  }
  if (packet.resolved_plan_logic.consensual_lump_sum_rule !== "not_available") {
    errors.push(issue("UNSUPPORTED_LUMP_SUM_RULE", "MVP supports only not_available consensual lump-sum rule", inputPacketId, ruleVersion, "consensual_lump_sum_rule", "resolved_plan_logic"));
  }
  return errors;
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
    module_name: BENEFIT_KERNEL_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

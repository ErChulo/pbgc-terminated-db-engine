import type { StructuredIssue } from "@pbgc/shared";
import {
  buildBlankFieldError,
  buildMalformedNumberError,
  buildMissingConditionalPacketError,
  buildMissingInputGroupError,
  buildUnsupportedControlledRuleError,
} from "./errors";
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

const NUMERIC_FIELDS = new Set<string>([
  "vesting_service_at_dopt",
  "benefit_service_at_dopt",
  "accrual_service_at_dopt",
  "final_average_compensation",
  "covered_compensation_amount",
  "frozen_accrued_monthly_benefit",
  "accrued_benefit_at_dopt",
  "vested_percentage_at_dopt",
  "current_payment_amount",
  "xra",
  "sxra",
  "term_lw_xra",
  "term_lw_anb",
  "eligibility_service_resolved",
  "vesting_service_resolved",
  "benefit_service_resolved",
  "accrual_service_resolved",
  "compensation_resolved",
  "average_compensation_resolved",
  "covered_compensation_resolved",
]);

const SUPPORTED_ACCRUED_FORMULAS = new Set([
  "1.5pct_final_avg_pay_x_service",
  "1.0pct_plus_integration",
]);

const SUPPORTED_FORM_RULES = new Set(["sla"]);
const SUPPORTED_MARRIED_FORM_RULES = new Set(["qjsa_50"]);
const SUPPORTED_DEATH_RULES = new Set(["qpsa"]);
const SUPPORTED_LUMP_SUM_RULES = new Set(["not_available"]);

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return !Number.isFinite(value);
  return false;
}

function isMalformedNumber(value: unknown, _group: string, field: string): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return !Number.isFinite(value) || (NUMERIC_FIELDS.has(field) && value < 0);
  if (typeof value === "string") return isNaN(Number(value.replace(/,/g, "")));
  return typeof value !== "number";
}

export function validateBenefitKernelPacket(packet: BenefitKernelPacket, inputPacketId: string, ruleVersion: string): StructuredIssue[] {
  const errors: StructuredIssue[] = [];

  if (packet.packet_type !== "benefit_kernel") {
    errors.push(buildBlankFieldError("packet_type", "packet_type", inputPacketId, ruleVersion, "invalid packet type"));
  }

  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(buildMissingInputGroupError(group, inputPacketId, ruleVersion));
      continue;
    }
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in (value as Record<string, unknown>))) {
        errors.push(buildBlankFieldError(group, field, inputPacketId, ruleVersion, "missing field"));
        continue;
      }
      const fieldValue = (value as Record<string, unknown>)[field];
      if (isBlank(fieldValue)) {
        errors.push(buildBlankFieldError(group, field, inputPacketId, ruleVersion));
      } else if (NUMERIC_FIELDS.has(field) && isMalformedNumber(fieldValue, group, field)) {
        errors.push(buildMalformedNumberError(group, field, inputPacketId, ruleVersion));
      }
    }
  }

  // Controlled rule checks
  if (!SUPPORTED_ACCRUED_FORMULAS.has(packet.resolved_plan_logic.accrued_benefit_formula)) {
    errors.push(buildUnsupportedControlledRuleError(
      "resolved_plan_logic", "accrued_benefit_formula",
      "MVP supports only 1.5pct_final_avg_pay_x_service and 1.0pct_plus_integration",
      inputPacketId, ruleVersion,
    ));
  }
  if (!SUPPORTED_FORM_RULES.has(packet.resolved_plan_logic.normal_single_form_rule)) {
    errors.push(buildUnsupportedControlledRuleError(
      "resolved_plan_logic", "normal_single_form_rule",
      "MVP supports only sla",
      inputPacketId, ruleVersion,
    ));
  }
  if (!SUPPORTED_MARRIED_FORM_RULES.has(packet.resolved_plan_logic.normal_married_form_rule)) {
    errors.push(buildUnsupportedControlledRuleError(
      "resolved_plan_logic", "normal_married_form_rule",
      "MVP supports only qjsa_50",
      inputPacketId, ruleVersion,
    ));
  }
  if (!SUPPORTED_DEATH_RULES.has(packet.resolved_plan_logic.pre_retirement_death_benefit_rule)) {
    errors.push(buildUnsupportedControlledRuleError(
      "resolved_plan_logic", "pre_retirement_death_benefit_rule",
      "MVP supports only qpsa",
      inputPacketId, ruleVersion,
    ));
  }
  if (!SUPPORTED_LUMP_SUM_RULES.has(packet.resolved_plan_logic.consensual_lump_sum_rule)) {
    errors.push(buildUnsupportedControlledRuleError(
      "resolved_plan_logic", "consensual_lump_sum_rule",
      "MVP supports only not_available",
      inputPacketId, ruleVersion,
    ));
  }

  // Conditional packet trigger checks
  if (packet.limitation_packet.section_436_applicable_indicator && !packet.section_436_packet) {
    errors.push(buildMissingConditionalPacketError("section_436_packet", "section_436_applicable_indicator", inputPacketId, ruleVersion));
  }
  if (packet.limitation_packet.aggregate_limit_applicable_indicator && !packet.aggregate_limit_packet) {
    errors.push(buildMissingConditionalPacketError("aggregate_limit_packet", "aggregate_limit_applicable_indicator", inputPacketId, ruleVersion));
  }
  if (packet.participant_role_population.qdro_indicator && !packet.qdro_packet) {
    errors.push(buildMissingConditionalPacketError("qdro_packet", "qdro_indicator", inputPacketId, ruleVersion));
  }
  if (packet.participant_role_population.qpsa_indicator && !packet.qpsa_packet) {
    errors.push(buildMissingConditionalPacketError("qpsa_packet", "qpsa_indicator", inputPacketId, ruleVersion));
  }
  if (packet.benefit_administration_state.current_pay_status === "in_pay" && !packet.in_pay_packet) {
    errors.push(buildMissingConditionalPacketError("in_pay_packet", "current_pay_status=in_pay", inputPacketId, ruleVersion));
  }
  // death_benefit_packet only required when an actual death event is indicated (not just the plan provision)
  if ((packet.participant_role_population.dod !== null || packet.participant_role_population.role_type === "beneficiary") && !packet.death_benefit_packet) {
    errors.push(buildMissingConditionalPacketError("death_benefit_packet", "dod_or_beneficiary_role", inputPacketId, ruleVersion));
  }
  if (packet.resolved_plan_logic.mandatory_employee_contribution_rule !== null && (packet.resolved_plan_logic.mandatory_employee_contribution_rule as string).trim() !== "" && !packet.mandatory_employee_contribution_packet) {
    errors.push(buildMissingConditionalPacketError("mandatory_employee_contribution_packet", "mandatory_employee_contribution_rule set", inputPacketId, ruleVersion));
  }
  if (packet.resolved_plan_logic.voluntary_employee_contribution_rule !== null && (packet.resolved_plan_logic.voluntary_employee_contribution_rule as string).trim() !== "" && !packet.voluntary_employee_contribution_packet) {
    errors.push(buildMissingConditionalPacketError("voluntary_employee_contribution_packet", "voluntary_employee_contribution_rule set", inputPacketId, ruleVersion));
  }
  if (packet.resolved_plan_logic.disability_benefit_rule !== null && (packet.resolved_plan_logic.disability_benefit_rule as string).trim() !== "" && !packet.disability_packet) {
    errors.push(buildMissingConditionalPacketError("disability_packet", "disability_benefit_rule set", inputPacketId, ruleVersion));
  }

  return errors;
}

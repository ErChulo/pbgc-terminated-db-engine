import type { StructuredIssue } from "@pbgc/shared";
import { FORM_RESOLUTION_MODULE_NAME, type FormResolutionPacket } from "./types";

const REQUIRED_GROUPS = [
  "case_plan_timeline",
  "resolved_plan_logic",
  "participant_role_population",
  "benefit_administration_state",
  "actuarial_assumption_factor_set",
  "limitation_packet",
] as const;

const REQUIRED_FIELDS: Record<(typeof REQUIRED_GROUPS)[number], string[]> = {
  case_plan_timeline: ["case_id", "plan_id", "dopt", "bpd", "dobf"],
  resolved_plan_logic: [
    "normal_single_form_rule",
    "normal_married_form_rule",
    "form_conversion_basis_rule",
    "pre_retirement_death_benefit_rule",
    "post_retirement_death_benefit_rule",
    "consensual_lump_sum_rule",
    "default_actuarial_equivalence_rule",
  ],
  participant_role_population: [
    "bcv_rec_id",
    "retstat",
    "id",
    "role_type",
    "mstat",
    "psex",
    "ssex",
    "dod",
    "relation",
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
  actuarial_assumption_factor_set: ["form_conversion_method", "lump_sum_basis_code", "annuity_basis_code"],
  limitation_packet: [
    "annuity_starting_date_limitation_indicator",
    "death_benefit_limitation_indicator",
    "form_of_benefit_limitation_indicator",
    "actuarial_equivalence_limitation_indicator",
  ],
};

export function validateFormResolutionPacket(packet: FormResolutionPacket, inputPacketId: string, ruleVersion: string): StructuredIssue[] {
  const errors: StructuredIssue[] = [];
  if (packet.packet_type !== "form_resolution") {
    errors.push(issue("INVALID_PACKET_TYPE", "Packet type must be form_resolution", inputPacketId, ruleVersion, "packet_type"));
  }
  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(issue("MISSING_INPUT_GROUP", `Missing required form input group ${group}`, inputPacketId, ruleVersion, undefined, group));
      continue;
    }
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in value)) {
        errors.push(issue("MISSING_INPUT_FIELD", `Missing required form input field ${group}.${field}`, inputPacketId, ruleVersion, field, group));
      }
    }
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
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

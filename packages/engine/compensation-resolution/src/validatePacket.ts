import type { StructuredIssue } from "@pbgc/shared";
import { COMPENSATION_RESOLUTION_MODULE_NAME, type CompensationResolutionPacket } from "./types";

const REQUIRED_GROUPS = [
  "case_plan_timeline",
  "resolved_plan_logic",
  "participant_role_population",
  "service_employment_history",
  "compensation_accrual_inputs",
  "benefit_administration_state",
  "limitation_packet",
] as const;

const REQUIRED_FIELDS: Record<(typeof REQUIRED_GROUPS)[number], string[]> = {
  case_plan_timeline: ["case_id", "plan_id", "plan_anniversary", "dopt", "bpd", "dobf"],
  resolved_plan_logic: [
    "accrued_benefit_formula",
    "compensation_definition_rule",
    "average_compensation_rule",
    "covered_compensation_rule",
    "pia_offset_rule",
    "eligibility_service_rule",
    "benefit_service_rule",
    "accrual_factor_rule",
    "short_service_factor_rule",
  ],
  participant_role_population: ["bcv_rec_id", "retstat", "id", "role_type", "dob", "retirement_status_as_of_dopt"],
  service_employment_history: ["doh", "dop", "dote"],
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
  benefit_administration_state: ["dor", "asd"],
  limitation_packet: ["bankruptcy_plan_indicator", "bpd_limitation_indicator"],
};

export function validateCompensationResolutionPacket(
  packet: CompensationResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];
  if (packet.packet_type !== "compensation_resolution") {
    errors.push(issue("INVALID_PACKET_TYPE", "Packet type must be compensation_resolution", inputPacketId, ruleVersion, "packet_type"));
  }
  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(issue("MISSING_INPUT_GROUP", `Missing required compensation input group ${group}`, inputPacketId, ruleVersion, undefined, group));
      continue;
    }
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in value)) {
        errors.push(issue("MISSING_INPUT_FIELD", `Missing required compensation input field ${group}.${field}`, inputPacketId, ruleVersion, field, group));
      }
    }
  }
  if (packet.compensation_accrual_inputs.compensation_basis_code !== "final_average_pay") {
    errors.push(issue("UNSUPPORTED_COMPENSATION_BASIS", "MVP supports only final_average_pay fixture compensation basis", inputPacketId, ruleVersion, "compensation_basis_code", "compensation_accrual_inputs"));
  }
  if (packet.compensation_accrual_inputs.average_compensation_period !== "5_year") {
    errors.push(issue("UNSUPPORTED_AVERAGE_COMPENSATION_PERIOD", "MVP supports only 5_year fixture average compensation period", inputPacketId, ruleVersion, "average_compensation_period", "compensation_accrual_inputs"));
  }
  if (packet.resolved_plan_logic.average_compensation_rule !== "highest_consecutive_5_years") {
    errors.push(issue("UNSUPPORTED_AVERAGE_COMPENSATION_RULE", "MVP supports only highest_consecutive_5_years fixture rule", inputPacketId, ruleVersion, "average_compensation_rule", "resolved_plan_logic"));
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
    module_name: COMPENSATION_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

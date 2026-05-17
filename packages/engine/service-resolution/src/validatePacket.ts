import type { StructuredIssue } from "@pbgc/shared";
import { SERVICE_RESOLUTION_MODULE_NAME, type ServiceResolutionPacket } from "./types";

const REQUIRED_GROUPS = [
  "case_plan_timeline",
  "resolved_plan_logic",
  "participant_role_population",
  "service_employment_history",
  "actuarial_assumption_factor_set",
  "limitation_packet",
] as const;

const REQUIRED_FIELDS: Record<(typeof REQUIRED_GROUPS)[number], string[]> = {
  case_plan_timeline: ["case_id", "plan_id", "plan_anniversary", "dopt", "bpd", "dobf"],
  resolved_plan_logic: [
    "participation_eligibility_rule",
    "participation_date_rule",
    "normal_retirement_eligibility_rule",
    "early_unreduced_retirement_rule",
    "early_reduced_retirement_rule",
    "deferred_vested_normal_retirement_rule",
    "deferred_vested_early_retirement_rule",
    "eligibility_service_rule",
    "vesting_service_rule",
    "benefit_service_rule",
    "accrued_benefit_formula",
    "accrual_factor_rule",
    "short_service_factor_rule",
    "transfer_rule",
    "one_year_break_in_service_rule",
  ],
  participant_role_population: ["bcv_rec_id", "retstat", "id", "role_type", "retirement_status_as_of_dopt"],
  service_employment_history: [
    "doh",
    "dop",
    "dote",
    "service_basis_code",
    "service_hours_requirement",
    "service_period_basis",
    "plan_anniversary_service_basis",
  ],
  actuarial_assumption_factor_set: ["retirement_age_convention"],
  limitation_packet: ["bankruptcy_plan_indicator", "bpd_limitation_indicator", "ongoing_employment_contingency_indicator"],
};

export function validateServiceResolutionPacket(
  packet: ServiceResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];
  if (packet.packet_type !== "service_resolution") {
    errors.push(issue("INVALID_PACKET_TYPE", "Packet type must be service_resolution", inputPacketId, ruleVersion, "packet_type"));
  }
  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(issue("MISSING_INPUT_GROUP", `Missing required service input group ${group}`, inputPacketId, ruleVersion, undefined, group));
      continue;
    }
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in value)) {
        errors.push(issue("MISSING_INPUT_FIELD", `Missing required service input field ${group}.${field}`, inputPacketId, ruleVersion, field, group));
      }
    }
  }
  const history = packet.service_employment_history;
  if (history.service_basis_code !== "plan_year_1000_hours") {
    errors.push(issue("UNSUPPORTED_SERVICE_BASIS", "MVP supports only plan_year_1000_hours fixture service basis", inputPacketId, ruleVersion, "service_basis_code", "service_employment_history"));
  }
  if (history.service_period_basis !== "plan_anniversary") {
    errors.push(issue("UNSUPPORTED_SERVICE_PERIOD_BASIS", "MVP supports only plan_anniversary service period basis", inputPacketId, ruleVersion, "service_period_basis", "service_employment_history"));
  }
  if (history.service_hours_requirement !== 1000) {
    errors.push(issue("UNSUPPORTED_HOURS_REQUIREMENT", "MVP supports only 1000-hour plan-year service fixtures", inputPacketId, ruleVersion, "service_hours_requirement", "service_employment_history"));
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
    module_name: SERVICE_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

import type { StructuredIssue } from "@pbgc/shared";
import {
  buildBlankFieldError,
  buildMalformedDateError,
  buildInvalidDateOrderingError,
  buildInvalidPacketTypeError,
  buildUnsupportedValueError,
} from "./errors";
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

const DATE_FIELDS_BY_GROUP: Record<string, string[]> = {
  case_plan_timeline: ["dopt", "bpd", "dobf"],
  service_employment_history: ["doh", "dop", "dote"],
};

const DATE_ORDERING_RULES: Array<{ group: string; earlier: string; later: string }> = [
  { group: "service_employment_history", earlier: "doh", later: "dop" },
  { group: "service_employment_history", earlier: "doh", later: "dote" },
  { group: "service_employment_history", earlier: "dop", later: "dote" },
];

function isMalformedDate(value: string): boolean {
  if (value.length !== 10) return true;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return true;
  if (date.toISOString().slice(0, 10) !== value) return true;
  return false;
}

export function validateServiceResolutionPacket(
  packet: ServiceResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];

  if (packet.packet_type !== "service_resolution") {
    errors.push(buildInvalidPacketTypeError(inputPacketId, ruleVersion));
  }

  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(
        buildBlankFieldError(group, "(entire group missing)", inputPacketId, ruleVersion),
      );
      continue;
    }

    const groupRecord = value as Record<string, unknown>;

    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in groupRecord)) {
        errors.push(
          buildBlankFieldError(group, field, inputPacketId, ruleVersion),
        );
        continue;
      }

      const fieldValue = groupRecord[field];

      // Blank string check for required string fields
      if (typeof fieldValue === "string" && fieldValue.trim() === "") {
        errors.push(buildBlankFieldError(group, field, inputPacketId, ruleVersion));
        continue;
      }

      // Malformed date check
      const dateFields = DATE_FIELDS_BY_GROUP[group];
      if (dateFields && dateFields.includes(field)) {
        if (typeof fieldValue === "string" && fieldValue !== null) {
          // Skip null dates (they are allowed for optional date fields)
          if (isMalformedDate(fieldValue)) {
            errors.push(
              buildMalformedDateError(group, field, fieldValue as string, inputPacketId, ruleVersion),
            );
          }
        }
      }
    }

    // Date ordering validation for service_employment_history
    if (group === "service_employment_history") {
      for (const rule of DATE_ORDERING_RULES) {
        const earlierVal = groupRecord[rule.earlier] as string | null;
        const laterVal = groupRecord[rule.later] as string | null;

        if (earlierVal && laterVal && !isMalformedDate(earlierVal) && !isMalformedDate(laterVal)) {
          const earlierDate = new Date(`${earlierVal}T00:00:00.000Z`);
          const laterDate = new Date(`${laterVal}T00:00:00.000Z`);
          if (earlierDate.getTime() > laterDate.getTime()) {
            errors.push(
              buildInvalidDateOrderingError(
                rule.group,
                rule.earlier,
                rule.later,
                earlierVal,
                laterVal,
                inputPacketId,
                ruleVersion,
              ),
            );
          }
        }
      }
    }
  }

  const history = packet.service_employment_history;
  if (history && typeof history === "object") {
    if (history.service_basis_code !== "plan_year_1000_hours") {
      errors.push(
        buildUnsupportedValueError("service_employment_history", "service_basis_code", "MVP supports only plan_year_1000_hours", inputPacketId, ruleVersion),
      );
    }
    if (history.service_period_basis !== "plan_anniversary") {
      errors.push(
        buildUnsupportedValueError("service_employment_history", "service_period_basis", "MVP supports only plan_anniversary", inputPacketId, ruleVersion),
      );
    }
    if (history.service_hours_requirement !== 1000) {
      errors.push(
        buildUnsupportedValueError("service_employment_history", "service_hours_requirement", "MVP supports only 1000-hour fixtures", inputPacketId, ruleVersion),
      );
    }
  }

  return errors;
}

import type { StructuredIssue } from "@pbgc/shared";
import {
  buildBlankFieldError,
  buildConditionalPacketMissingError,
  buildInvalidPacketTypeError,
  buildMalformedAmountError,
  buildMissingGroupError,
  buildNegativeAmountError,
  buildUnsupportedAveragePeriodError,
  buildUnsupportedAverageRuleError,
  buildUnsupportedBasisError,
} from "./errors";
import type { CompensationResolutionPacket } from "./types";

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

const NUMERIC_FIELDS: Record<string, string[]> = {
  compensation_accrual_inputs: [
    "final_average_compensation",
    "covered_compensation_amount",
    "frozen_accrued_monthly_benefit",
    "accrued_benefit_at_dopt",
    "vested_percentage_at_dopt",
  ],
};

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

function isMalformedAmount(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return !Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.trim().replace(/,/g, ""));
    return !Number.isFinite(parsed);
  }
  return typeof value !== "number" && typeof value !== "string";
}

type GroupValue = Record<string, unknown> | null | undefined;

export function validateCompensationResolutionPacket(
  packet: CompensationResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];

  if (packet.packet_type !== "compensation_resolution") {
    errors.push(buildInvalidPacketTypeError(inputPacketId, ruleVersion));
  }

  for (const group of REQUIRED_GROUPS) {
    const value = (packet as Record<string, unknown>)[group] as GroupValue;
    if (!value || typeof value !== "object") {
      errors.push(buildMissingGroupError(group, inputPacketId, ruleVersion));
      continue;
    }
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in value)) {
        errors.push(buildBlankFieldError(group, field, inputPacketId, ruleVersion, "entire group missing or field absent"));
      } else {
        const fieldValue = value[field];
        if (isBlank(fieldValue)) {
          errors.push(buildBlankFieldError(group, field, inputPacketId, ruleVersion));
        }
      }
    }
    const numericFields = NUMERIC_FIELDS[group];
    if (numericFields) {
      for (const field of numericFields) {
        if (field in value) {
          const fieldValue = value[field];
          if (fieldValue !== null && fieldValue !== undefined && fieldValue !== "") {
            if (isMalformedAmount(fieldValue)) {
              errors.push(buildMalformedAmountError(group, field, fieldValue, inputPacketId, ruleVersion));
            } else if (typeof fieldValue === "number" && fieldValue < 0) {
              errors.push(buildNegativeAmountError(group, field, fieldValue, inputPacketId, ruleVersion));
            }
          }
        }
      }
    }
  }

  if (packet.compensation_accrual_inputs) {
    const inputs = packet.compensation_accrual_inputs;
    if (inputs.compensation_basis_code !== "final_average_pay") {
      errors.push(buildUnsupportedBasisError("compensation_basis_code", inputs.compensation_basis_code, inputPacketId, ruleVersion));
    }
    if (inputs.average_compensation_period !== "5_year") {
      errors.push(buildUnsupportedAveragePeriodError(inputs.average_compensation_period, inputPacketId, ruleVersion));
    }
  }

  if (packet.resolved_plan_logic) {
    if (packet.resolved_plan_logic.average_compensation_rule !== "highest_consecutive_5_years") {
      errors.push(buildUnsupportedAverageRuleError(packet.resolved_plan_logic.average_compensation_rule, inputPacketId, ruleVersion));
    }
  }

  // Conditional packet triggers
  if (packet.compensation_accrual_inputs) {
    const inputs = packet.compensation_accrual_inputs;
    if (inputs.frozen_accrued_benefit_indicator && !packet.frozen_benefit_support_packet) {
      errors.push(
        buildConditionalPacketMissingError("frozen_accrued_benefit_indicator", "frozen_benefit_support_packet", inputPacketId, ruleVersion),
      );
    }
  }

  return errors;
}

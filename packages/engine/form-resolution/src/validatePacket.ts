import type { StructuredIssue } from "@pbgc/shared";
import {
  buildBlankFieldError,
  buildConflictingPayStatusError,
  buildInvalidPacketTypeError,
  buildMalformedBooleanError,
  buildMissingConditionalPacketError,
  buildMissingGroupError,
  buildUnsupportedRuleError,
} from "./errors";
import type { FormResolutionPacket } from "./types";

const REQUIRED_GROUPS = [
  "case_plan_timeline",
  "resolved_plan_logic",
  "participant_role_population",
  "benefit_administration_state",
  "actuarial_assumption_factor_set",
  "limitation_packet",
] as const;

type GroupName = (typeof REQUIRED_GROUPS)[number];

const REQUIRED_FIELDS: Record<GroupName, string[]> = {
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

const BOOLEAN_FIELDS: Record<string, string[]> = {
  participant_role_population: ["non_spouse_benf", "qdro_indicator", "qpsa_indicator"],
  benefit_administration_state: ["elected_form_indicator"],
  limitation_packet: [
    "annuity_starting_date_limitation_indicator",
    "death_benefit_limitation_indicator",
    "form_of_benefit_limitation_indicator",
    "actuarial_equivalence_limitation_indicator",
  ],
};

const SUPPORTED_FORM_RULES: Record<string, Set<string>> = {
  normal_single_form_rule: new Set(["sla"]),
  normal_married_form_rule: new Set(["qjsa_50"]),
  pre_retirement_death_benefit_rule: new Set(["qpsa"]),
  consensual_lump_sum_rule: new Set(["not_available"]),
};

export function validateFormResolutionPacket(
  packet: FormResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];

  if (packet.packet_type !== "form_resolution") {
    errors.push(buildInvalidPacketTypeError(inputPacketId, ruleVersion));
    return errors;
  }

  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(buildMissingGroupError(group, inputPacketId, ruleVersion));
      continue;
    }

    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in value)) {
        errors.push(buildBlankFieldError(group, field, inputPacketId, ruleVersion));
        continue;
      }
      const fieldValue = (value as Record<string, unknown>)[field];
      if (isBlank(fieldValue)) {
        errors.push(buildBlankFieldError(group, field, inputPacketId, ruleVersion));
      }
    }

    const booleanFields = BOOLEAN_FIELDS[group];
    if (booleanFields) {
      for (const field of booleanFields) {
        const fieldValue = (value as Record<string, unknown>)[field];
        if (fieldValue !== undefined && fieldValue !== null && typeof fieldValue !== "boolean") {
          errors.push(buildMalformedBooleanError(group, field, inputPacketId, ruleVersion));
        }
      }
    }
  }

  // Validate supported form rules
  if (packet.resolved_plan_logic) {
    for (const [field, supportedValues] of Object.entries(SUPPORTED_FORM_RULES)) {
      const value = (packet.resolved_plan_logic as Record<string, unknown>)[field];
      if (value !== null && value !== undefined && !supportedValues.has(String(value))) {
        errors.push(
          buildUnsupportedRuleError(
            "resolved_plan_logic",
            field,
            `Expected one of: ${[...supportedValues].join(", ")}`,
            inputPacketId,
            ruleVersion,
          ),
        );
      }
    }
  }

  // Conditional packet validation
  checkConditionalPackets(packet, inputPacketId, ruleVersion, errors);

  // Conflicting pay status
  if (
    packet.benefit_administration_state?.current_pay_status === "in_pay" &&
    !packet.in_pay_packet
  ) {
    errors.push(
      buildMissingConditionalPacketError("in_pay", "benefit_administration_state", inputPacketId, ruleVersion),
    );
  }

  if (
    packet.participant_role_population?.qpsa_indicator === true &&
    !packet.qpsa_packet
  ) {
    errors.push(
      buildMissingConditionalPacketError("QPSA", "participant_role_population", inputPacketId, ruleVersion),
    );
  }

  if (
    packet.participant_role_population?.qdro_indicator === true &&
    !packet.qdro_packet
  ) {
    errors.push(
      buildMissingConditionalPacketError("QDRO", "participant_role_population", inputPacketId, ruleVersion),
    );
  }

  return errors;
}

function checkConditionalPackets(
  packet: FormResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
  errors: StructuredIssue[],
): void {
  const role = packet.participant_role_population;
  if (role?.role_type === "beneficiary" || (role?.dod && role.dod !== null)) {
    if (!packet.death_benefit_packet) {
      errors.push(
        buildMissingConditionalPacketError("death_benefit", "participant_role_population", inputPacketId, ruleVersion),
      );
    }
  }
}

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return !Number.isFinite(value);
  return false;
}

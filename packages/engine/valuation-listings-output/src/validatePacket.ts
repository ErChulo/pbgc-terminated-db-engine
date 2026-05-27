import type { StructuredIssue } from "@pbgc/shared";
import { VALUATION_LISTINGS_OUTPUT_MODULE_NAME, type ValuationListingsOutputPacket, type ValuationListingsRowType } from "./types";
import {
  buildBlankFieldError,
  buildMalformedNumberError,
  buildMissingConditionalPacketError,
  buildMissingInputGroupError,
  buildMissingUpstreamOutputGroupError,
  buildUnsupportedControlledRuleError,
} from "./errors";

const SUPPORTED_LISTING_ROW_TYPES: readonly ValuationListingsRowType[] = [
  "participant",
  "beneficiary",
  "alternate_payee",
  "survivor",
  "summary_support",
];

const REQUIRED_GROUPS = [
  "case_plan_timeline",
  "participant_role_population",
  "service_employment_history",
  "compensation_accrual_inputs",
  "benefit_administration_state",
  "limitation_packet",
  "resolved_dates",
  "resolved_service_compensation",
  "resolved_forms_status",
  "benefit_kernel_output",
  "v1_ve_output_row",
] as const;

const NON_NULLABLE_STRING_FIELDS: Record<string, readonly string[]> = {
  packet: ["case_id", "subject_key", "listing_row_type"],
  participant_role_population: ["bcv_rec_id", "custid", "retstat", "id", "fname", "lname", "mstat"],
  limitation_packet: ["calculation_context"],
  compensation_accrual_inputs: ["compensation_basis_code", "average_compensation_period"],
  benefit_administration_state: ["current_pay_status"],
};

const NUMERIC_FIELDS: Set<string> = new Set([
  "final_average_compensation",
  "covered_compensation_amount",
  "frozen_accrued_monthly_benefit",
  "accrued_benefit_at_dopt",
  "vested_percentage_at_dopt",
  "current_payment_amount",
]);

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return !Number.isFinite(value);
  return false;
}

function isMalformedNumber(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return !Number.isFinite(value) || value < 0;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return false;
    const n = Number(trimmed.replace(/,/g, ""));
    return !Number.isFinite(n) || n < 0;
  }
  return false;
}

function checkControlledRules(
  packet: ValuationListingsOutputPacket,
  inputPacketId: string,
  ruleVersion: string,
  errors: StructuredIssue[],
): void {
  if (typeof packet.listing_row_type === "string" && packet.listing_row_type.trim().length > 0) {
    if (!(SUPPORTED_LISTING_ROW_TYPES as readonly string[]).includes(packet.listing_row_type)) {
      errors.push(
        buildUnsupportedControlledRuleError(
          inputPacketId,
          "listing_row_type",
          packet.listing_row_type,
          SUPPORTED_LISTING_ROW_TYPES,
          ruleVersion,
        ),
      );
    }
  }
}

function checkConditionalTriggers(
  packet: ValuationListingsOutputPacket,
  inputPacketId: string,
  ruleVersion: string,
  errors: StructuredIssue[],
): void {
  const inPay = packet.benefit_administration_state?.current_pay_status === "in_pay";
  if (inPay) {
    const amount = packet.benefit_administration_state?.current_payment_amount;
    if (amount === null || amount === undefined || (typeof amount === "number" && !Number.isFinite(amount))) {
      errors.push(
        buildMissingConditionalPacketError(inputPacketId, "in_pay_current_payment_amount", ruleVersion),
      );
    }
  }

  if (packet.participant_role_population?.qdro_indicator) {
    if (
      !packet.benefit_administration_state?.spouse_beneficiary_commencement_state &&
      !packet.benefit_administration_state?.current_form_code
    ) {
      errors.push(
        buildMissingConditionalPacketError(inputPacketId, "qdro_form_state", ruleVersion),
      );
    }
  }

  if (packet.participant_role_population?.qpsa_indicator) {
    if (!packet.resolved_forms_status?.form_code_ptp_qpsa) {
      errors.push(
        buildMissingConditionalPacketError(inputPacketId, "qpsa_form_code", ruleVersion),
      );
    }
  }

  const override = packet.technical_output_override_packet;
  if (override) {
    if (!override.output_column_name || override.output_column_name.trim().length === 0) {
      errors.push(buildBlankFieldError(inputPacketId, "output_column_name", "technical_output_override_packet", ruleVersion));
    }
    if (!override.override_note || override.override_note.trim().length === 0) {
      errors.push(buildBlankFieldError(inputPacketId, "override_note", "technical_output_override_packet", ruleVersion));
    }
  }
}

export function validateValuationListingsOutputPacket(
  packet: ValuationListingsOutputPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];

  if (!packet.case_id) {
    errors.push(
      buildMissingInputGroupError(inputPacketId, "case_id", ruleVersion),
    );
  }
  if (!packet.subject_key) {
    errors.push(
      buildMissingInputGroupError(inputPacketId, "subject_key", ruleVersion),
    );
  }
  if (!packet.listing_row_type) {
    errors.push(
      buildMissingInputGroupError(inputPacketId, "listing_row_type", ruleVersion),
    );
  }

  for (const group of REQUIRED_GROUPS) {
    const groupValue = (packet as Record<string, unknown>)[group];
    if (!groupValue || typeof groupValue !== "object") {
      errors.push(
        buildMissingInputGroupError(inputPacketId, group, ruleVersion),
      );
    }
  }

  for (const [group, fields] of Object.entries(NON_NULLABLE_STRING_FIELDS)) {
    const groupObj = group === "packet" ? (packet as unknown as Record<string, unknown>) : (packet as Record<string, unknown>)[group] as Record<string, unknown> | undefined;
    if (!groupObj) continue;
    for (const field of fields) {
      const value = groupObj[field];
      if (isBlank(value)) {
        errors.push(buildBlankFieldError(inputPacketId, field, group, ruleVersion));
      }
    }
  }

  const compensationGroup = packet.compensation_accrual_inputs;
  if (compensationGroup) {
    for (const field of ["final_average_compensation", "covered_compensation_amount", "frozen_accrued_monthly_benefit", "accrued_benefit_at_dopt", "vested_percentage_at_dopt"]) {
      const value = (compensationGroup as Record<string, unknown>)[field];
      if (isMalformedNumber(value)) {
        errors.push(buildMalformedNumberError(inputPacketId, field, "compensation_accrual_inputs", ruleVersion));
      }
    }
  }

  const adminGroup = packet.benefit_administration_state;
  if (adminGroup) {
    const amt = adminGroup.current_payment_amount;
    if (amt !== null && amt !== undefined && isMalformedNumber(amt)) {
      errors.push(buildMalformedNumberError(inputPacketId, "current_payment_amount", "benefit_administration_state", ruleVersion));
    }
  }

  checkControlledRules(packet, inputPacketId, ruleVersion, errors);
  checkConditionalTriggers(packet, inputPacketId, ruleVersion, errors);

  return errors;
}

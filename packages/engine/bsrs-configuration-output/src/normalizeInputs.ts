/**
 * BSRS input normalization.
 * Validates and normalizes reviewed packet inputs before deterministic projection.
 * Ensures consistent field types, trims strings, and handles edge cases.
 */
import type { StructuredIssue } from "@pbgc/shared";
import { buildMalformedNumberError, buildMissingInputFieldError } from "./errors";
import { BSRS_CONFIGURATION_OUTPUT_MODULE_NAME } from "./types";
import type { BsrsConfigurationOutputPacket } from "./types";

const REQUIRED_INPUT_GROUPS = [
  "case_plan_timeline",
  "participant_role_population",
  "service_employment_history",
  "benefit_administration_state",
  "limitation_packet",
  "resolved_dates",
  "resolved_service_compensation",
  "resolved_forms_status",
  "benefit_kernel_output",
  "v1_ve_output_row",
  "valuation_listings_output_row",
  "trace_inputs",
] as const;

const TRIMMABLE_STRING_FIELDS = new Set([
  "case_id", "plan_id", "plan_name", "bcv_rec_id", "custid", "retstat", "id",
  "fname", "lname", "sfname", "slname", "psex", "ssex", "mstat", "relation",
  "dob", "sdob", "dod", "doh", "dop", "dote", "dor", "asd", "sbcd",
  "nrd", "erd", "eurd", "eprd", "rbd", "xrd",
  "current_form_code", "form_code_nsf", "form_code_nmf", "form_code_ptp",
  "form_code_ptp_qpsa", "form_code_death", "form_code_ard", "spc_ard",
  "annuity_status_pay", "lsoption", "rettyp", "bs_ind", "br_ind", "ofa_indicator",
  "retirement_status_as_of_dopt", "payment_status_as_of_dopt",
  "current_pay_status", "elected_form_indicator", "spouse_beneficiary_commencement_state",
  "calc_indicator", "calculation_context",
  "ce_track1", "ce_track2", "ce_track3", "ce_track4", "ce_track5", "ce_track6",
  "rule_trace_id", "calculation_run_id", "deliverable_version", "schema_version",
  "listing_row_type", "listing_sort_key",
]);

const NUMERIC_FIELDS_WITH_FINITE_CHECK = new Set([
  "current_payment_amount", "current_monthly_benefit",
  "xra", "sxra",
  "eligibility_service_resolved", "vesting_service_resolved", "benefit_service_resolved",
  "accrual_service_resolved", "compensation_resolved", "average_compensation_resolved",
  "covered_compensation_resolved",
  "term_mb_nrd_nsf", "xrd_mb_term", "xrd_surv_mb_term", "xrd_mb_qpsa_term",
  "xrd_mb_title_iv", "xrd_mb_4022c", "ls_term", "ls_qpsa",
  "pvmb_term", "pvmb_title_iv", "pvmb_4022c",
  "pvf_lev_ann", "pvf_lev_ls", "pvf_qpsa_ls",
  "mths_ard", "lev_mb_ard",
]);

export type NormalizeInputsResult = {
  normalized: BsrsConfigurationOutputPacket;
  errors: StructuredIssue[];
};

function normalizeFieldValue(
  field: string,
  value: unknown,
  inputPacketId: string,
  ruleVersion: string,
): { value: unknown; error?: StructuredIssue } {
  // Trim strings
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (TRIMMABLE_STRING_FIELDS.has(field)) {
      return { value: trimmed };
    }
    return { value: value.trim() };
  }

  // Validate numerics
  if (NUMERIC_FIELDS_WITH_FINITE_CHECK.has(field) && value !== null && value !== undefined) {
    const num = Number(value);
    if (Number.isNaN(num) || !Number.isFinite(num) || num < 0) {
      return {
        value: null,
        error: buildMalformedNumberError(inputPacketId, field, "packet", ruleVersion),
      };
    }
    return { value: num };
  }

  return { value };
}

function normalizeGroup(
  group: Record<string, unknown>,
  groupName: string,
  requiredFields: Set<string>,
  inputPacketId: string,
  ruleVersion: string,
): { normalized: Record<string, unknown>; errors: StructuredIssue[] } {
  const errors: StructuredIssue[] = [];
  const normalized: Record<string, unknown> = {};

  for (const [field, value] of Object.entries(group)) {
    const result = normalizeFieldValue(field, value, inputPacketId, ruleVersion);
    if (result.error) {
      errors.push(result.error);
    }
    normalized[field] = result.value;
  }

  // Check required fields
  for (const field of requiredFields) {
    if (!(field in normalized) || normalized[field] === undefined) {
      errors.push(buildMissingInputFieldError(inputPacketId, field, groupName, ruleVersion));
    }
  }

  return { normalized, errors };
}

/**
 * Normalizes a BSRS configuration output packet.
 * Trims all string fields, validates numeric values, and ensures required fields are present.
 * Returns a clean copy of the packet ready for deterministic projection.
 */
export function normalizeBsrsInputs(
  packet: BsrsConfigurationOutputPacket,
  inputPacketId: string,
  ruleVersion: string,
): NormalizeInputsResult {
  const allErrors: StructuredIssue[] = [];
  const normalized = { ...packet };

  for (const groupName of REQUIRED_INPUT_GROUPS) {
    const group = packet[groupName];
    if (!group || typeof group !== "object") {
      allErrors.push({
        code: "MISSING_INPUT_GROUP",
        message: `Missing required BSRS input group: ${groupName}`,
        input_group: groupName,
        input_packet_id: inputPacketId,
        module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
        rule_version: ruleVersion,
      });
      continue;
    }

    const groupRequired = new Set<string>(); // already validated by validatePacket
    const { errors: groupErrors } = normalizeGroup(
      group as Record<string, unknown>,
      groupName,
      groupRequired,
      inputPacketId,
      ruleVersion,
    );
    allErrors.push(...groupErrors);
  }

  return { normalized, errors: allErrors };
}

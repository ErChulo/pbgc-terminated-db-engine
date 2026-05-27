import type { StructuredIssue } from "@pbgc/shared";
import type { BsrsConfigurationOutputPacket, BsrsStatementRowType } from "./types";
import {
  buildBlankFieldError,
  buildInvalidPacketTypeError,
  buildMalformedNumberError,
  buildMissingConditionalPacketError,
  buildMissingInputFieldError,
  buildMissingInputGroupError,
  buildUnsupportedControlledRuleError,
  buildUnsupportedSchemaVersionError,
} from "./errors";

const REQUIRED_GROUPS = [
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

const REQUIRED_FIELDS: Record<(typeof REQUIRED_GROUPS)[number], string[]> = {
  case_plan_timeline: ["case_id", "plan_id", "plan_name", "dopt", "dotr", "bpd"],
  participant_role_population: [
    "bcv_rec_id", "custid", "retstat", "id", "role_type", "fname", "lname",
    "sfname", "slname", "psex", "ssex", "mstat", "relation", "non_spouse_benf",
    "dob", "sdob", "dod", "retirement_status_as_of_dopt", "payment_status_as_of_dopt",
    "qdro_indicator", "qpsa_indicator",
  ],
  service_employment_history: ["doh", "dop", "dote"],
  benefit_administration_state: [
    "dor", "asd", "sbcd", "current_form_code", "current_payment_amount",
    "current_pay_status", "elected_form_indicator", "spouse_beneficiary_commencement_state",
  ],
  limitation_packet: ["calc_indicator", "calculation_context"],
  resolved_dates: ["nrd", "erd", "eurd", "eprd", "rbd", "xra", "xrd", "sxra"],
  resolved_service_compensation: [
    "eligibility_service_resolved", "vesting_service_resolved", "benefit_service_resolved",
    "accrual_service_resolved", "compensation_resolved", "average_compensation_resolved",
    "covered_compensation_resolved",
  ],
  resolved_forms_status: [
    "rettyp", "form_code_nsf", "form_code_nmf", "form_code_ptp", "form_code_ptp_qpsa",
    "form_code_death", "annuity_status_pay", "lsoption", "bs_ind", "br_ind", "ofa_indicator",
  ],
  benefit_kernel_output: [
    "term_mb_nrd_nsf", "xrd_mb_term", "xrd_surv_mb_term", "xrd_mb_qpsa_term",
    "xrd_mb_title_iv", "xrd_mb_4022c", "ls_term", "ls_qpsa", "pvmb_term",
    "pvmb_title_iv", "pvmb_4022c", "pvf_lev_ann", "pvf_lev_ls", "pvf_qpsa_ls",
  ],
  v1_ve_output_row: ["term_mb_nrd_nsf", "xrd_mb_term", "pvmb_term", "ls_term", "ls_qpsa"],
  valuation_listings_output_row: ["term_mb_nrd_nsf", "xrd_mb_term", "pvmb_term", "listing_row_type", "listing_sort_key"],
  trace_inputs: [
    "ce_track1", "ce_track2", "ce_track3", "ce_track4", "ce_track5", "ce_track6",
    "rule_trace_id", "calculation_run_id", "deliverable_version", "schema_version",
  ],
};

const NON_NULLABLE_STRING_FIELDS: string[] = [
  "case_id", "plan_id", "plan_name",
  "bcv_rec_id", "custid", "retstat", "id", "fname", "lname", "mstat",
  "retirement_status_as_of_dopt", "payment_status_as_of_dopt",
  "dopt", "asd",
  "current_pay_status", "elected_form_indicator",
  "calc_indicator", "calculation_context",
  "annuity_status_pay", "rettyp",
  "statement_row_type", "statement_sort_key",
  "ce_track1", "ce_track2", "ce_track3", "ce_track4", "ce_track5", "ce_track6",
  "rule_trace_id", "calculation_run_id", "deliverable_version", "schema_version",
];

const NUMERIC_FIELDS: string[] = [
  "current_payment_amount", "current_monthly_benefit",
  "xra", "sxra",
  "eligibility_service_resolved", "vesting_service_resolved", "benefit_service_resolved",
  "accrual_service_resolved", "compensation_resolved", "average_compensation_resolved",
  "covered_compensation_resolved",
  "term_mb_nrd_nsf", "xrd_mb_term", "xrd_surv_mb_term", "xrd_mb_qpsa_term",
  "xrd_mb_title_iv", "xrd_mb_4022c", "ls_term", "ls_qpsa",
  "pvmb_term", "pvmb_title_iv", "pvmb_4022c",
  "pvf_lev_ann", "pvf_lev_ls", "pvf_qpsa_ls",
  "listing_sort_key",
];

const SUPPORTED_STATEMENT_ROW_TYPES: readonly BsrsStatementRowType[] = [
  "participant", "beneficiary", "alternate_payee", "survivor", "suppressed",
];

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim().length === 0) return true;
  return false;
}

function isMalformedNumber(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return !Number.isFinite(value) || value < 0;
  return false;
}

function checkControlledRules(
  packet: BsrsConfigurationOutputPacket,
  groupObj: Record<string, unknown>,
  group: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];

  if (group === "packet") {
    const rowType = packet.statement_row_type;
    if (typeof rowType === "string" && !SUPPORTED_STATEMENT_ROW_TYPES.includes(rowType as BsrsStatementRowType)) {
      errors.push(buildUnsupportedControlledRuleError(
        inputPacketId, "statement_row_type", "packet",
        rowType, SUPPORTED_STATEMENT_ROW_TYPES, ruleVersion,
      ));
    }
  }

  if (group === "limitation_packet") {
    const calcIndicator = groupObj["calc_indicator"];
    if (typeof calcIndicator === "string" && calcIndicator.trim().length > 0) {
      const trimmed = calcIndicator.trim().toUpperCase();
      if (!["V", "R", "D"].includes(trimmed)) {
        errors.push(buildUnsupportedControlledRuleError(
          inputPacketId, "calc_indicator", "limitation_packet",
          calcIndicator, ["V", "R", "D"], ruleVersion,
        ));
      }
    }
  }

  return errors;
}

export function validateBsrsConfigurationPacket(
  packet: BsrsConfigurationOutputPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];

  if (packet.packet_type !== "bsrs_configuration_output") {
    errors.push(buildInvalidPacketTypeError(inputPacketId, ruleVersion));
  }
  if (packet.schema_version !== "0.1.0") {
    errors.push(buildUnsupportedSchemaVersionError(inputPacketId, ruleVersion));
  }

  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(buildMissingInputGroupError(inputPacketId, group, ruleVersion));
      continue;
    }
    const groupObj = value as Record<string, unknown>;
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in groupObj)) {
        errors.push(buildMissingInputFieldError(inputPacketId, field, group, ruleVersion));
      }
    }

    // Blank string checks for non-nullable string fields
    for (const field of NON_NULLABLE_STRING_FIELDS) {
      if (field in groupObj && isBlank(groupObj[field])) {
        errors.push(buildBlankFieldError(inputPacketId, field, group, ruleVersion));
      }
    }

    // Malformed number checks
    for (const field of NUMERIC_FIELDS) {
      if (field in groupObj && isMalformedNumber(groupObj[field])) {
        errors.push(buildMalformedNumberError(inputPacketId, field, group, ruleVersion));
      }
    }

    // Controlled rule checks
    errors.push(...checkControlledRules(packet, groupObj, group, inputPacketId, ruleVersion));
  }

  // Check top-level packet fields that are not inside REQUIRED_GROUPS
  const packetRoot = packet as unknown as Record<string, unknown>;
  for (const field of NON_NULLABLE_STRING_FIELDS) {
    if (field in packetRoot && isBlank(packetRoot[field])) {
      errors.push(buildBlankFieldError(inputPacketId, field, "packet", ruleVersion));
    }
  }
  if (typeof packetRoot["statement_row_type"] === "string" && !SUPPORTED_STATEMENT_ROW_TYPES.includes(packetRoot["statement_row_type"] as BsrsStatementRowType)) {
    errors.push(buildUnsupportedControlledRuleError(
      inputPacketId, "statement_row_type", "packet",
      packetRoot["statement_row_type"] as string, SUPPORTED_STATEMENT_ROW_TYPES, ruleVersion,
    ));
  }

  // Conditional packet triggers
  if (packet.benefit_administration_state.current_pay_status === "in_pay" && !packet.in_pay_packet) {
    errors.push(buildMissingConditionalPacketError(
      inputPacketId, "in_pay_packet",
      "In-pay", ruleVersion,
    ));
  }
  if (packet.participant_role_population.qdro_indicator && !packet.qdro_packet) {
    errors.push(buildMissingConditionalPacketError(
      inputPacketId, "qdro_packet",
      "QDRO", ruleVersion,
    ));
  }
  if (packet.participant_role_population.qpsa_indicator && !packet.qpsa_packet) {
    errors.push(buildMissingConditionalPacketError(
      inputPacketId, "qpsa_packet",
      "QPSA", ruleVersion,
    ));
  }
  if (packet.statement_row_type === "survivor" && !packet.death_benefit_packet) {
    errors.push(buildMissingConditionalPacketError(
      inputPacketId, "death_benefit_packet",
      "Survivor", ruleVersion,
    ));
  }

  return errors;
}

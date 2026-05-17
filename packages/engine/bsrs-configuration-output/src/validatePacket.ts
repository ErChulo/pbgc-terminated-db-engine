import type { StructuredIssue } from "@pbgc/shared";
import { BSRS_CONFIGURATION_OUTPUT_MODULE_NAME, type BsrsConfigurationOutputPacket } from "./types";

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
    "relation",
    "non_spouse_benf",
    "dob",
    "sdob",
    "dod",
    "retirement_status_as_of_dopt",
    "payment_status_as_of_dopt",
    "qdro_indicator",
    "qpsa_indicator",
  ],
  service_employment_history: ["doh", "dop", "dote"],
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
  limitation_packet: ["calc_indicator", "calculation_context"],
  resolved_dates: ["nrd", "erd", "eurd", "eprd", "rbd", "xra", "xrd", "sxra"],
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
  benefit_kernel_output: [
    "term_mb_nrd_nsf",
    "xrd_mb_term",
    "xrd_surv_mb_term",
    "xrd_mb_qpsa_term",
    "xrd_mb_title_iv",
    "xrd_mb_4022c",
    "ls_term",
    "ls_qpsa",
    "pvmb_term",
    "pvmb_title_iv",
    "pvmb_4022c",
    "pvf_lev_ann",
    "pvf_lev_ls",
    "pvf_qpsa_ls",
  ],
  v1_ve_output_row: ["term_mb_nrd_nsf", "xrd_mb_term", "pvmb_term", "ls_term", "ls_qpsa"],
  valuation_listings_output_row: ["term_mb_nrd_nsf", "xrd_mb_term", "pvmb_term", "listing_row_type", "listing_sort_key"],
  trace_inputs: [
    "ce_track1",
    "ce_track2",
    "ce_track3",
    "ce_track4",
    "ce_track5",
    "ce_track6",
    "rule_trace_id",
    "calculation_run_id",
    "deliverable_version",
    "schema_version",
  ],
};

function issue(code: string, message: string, field_name: string | undefined, input_group: string | undefined, inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code,
    message,
    field_name,
    input_group,
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function validateBsrsConfigurationPacket(packet: BsrsConfigurationOutputPacket, inputPacketId: string, ruleVersion: string): StructuredIssue[] {
  const errors: StructuredIssue[] = [];
  if (packet.packet_type !== "bsrs_configuration_output") {
    errors.push(issue("INVALID_PACKET_TYPE", "Packet type must be bsrs_configuration_output", "packet_type", "packet", inputPacketId, ruleVersion));
  }
  if (packet.schema_version !== "0.1.0") {
    errors.push(issue("UNSUPPORTED_SCHEMA_VERSION", "Only schema version 0.1.0 is supported", "schema_version", "packet", inputPacketId, ruleVersion));
  }
  for (const group of REQUIRED_GROUPS) {
    const value = packet[group];
    if (!value || typeof value !== "object") {
      errors.push(issue("MISSING_INPUT_GROUP", `Missing required BSRS input group ${group}`, undefined, group, inputPacketId, ruleVersion));
      continue;
    }
    for (const field of REQUIRED_FIELDS[group]) {
      if (!(field in value)) {
        errors.push(issue("MISSING_INPUT_FIELD", `Missing required BSRS input field ${group}.${field}`, field, group, inputPacketId, ruleVersion));
      }
    }
  }
  if (packet.benefit_administration_state.current_pay_status === "in_pay" && !packet.in_pay_packet) {
    errors.push(issue("MISSING_IN_PAY_PACKET", "In-pay BSRS output requires a reviewed in_pay_packet", "in_pay_packet", "packet", inputPacketId, ruleVersion));
  }
  if (packet.participant_role_population.qdro_indicator && !packet.qdro_packet) {
    errors.push(issue("MISSING_QDRO_PACKET", "QDRO BSRS output requires a reviewed qdro_packet", "qdro_packet", "packet", inputPacketId, ruleVersion));
  }
  if (packet.participant_role_population.qpsa_indicator && !packet.qpsa_packet) {
    errors.push(issue("MISSING_QPSA_PACKET", "QPSA BSRS output requires a reviewed qpsa_packet", "qpsa_packet", "packet", inputPacketId, ruleVersion));
  }
  if (packet.statement_row_type === "survivor" && !packet.death_benefit_packet) {
    errors.push(issue("MISSING_DEATH_PACKET", "Survivor BSRS output requires a reviewed death_benefit_packet", "death_benefit_packet", "packet", inputPacketId, ruleVersion));
  }
  return errors;
}

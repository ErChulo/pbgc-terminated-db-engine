import { createDeterministicId, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import { canonicalDdFieldName } from "./ddMapping";
import { VALUATION_LISTINGS_OUTPUT_MODULE_NAME, VALUATION_LISTINGS_OUTPUT_MODULE_VERSION, type ValuationListingsOutputPacket, type ValuationListingsOutputRow } from "./types";

function sourceFieldsFor(fieldName: string): string[] {
  switch (fieldName) {
    case "case_id":
    case "plan_id":
    case "listing_row_type":
    case "listing_sort_key":
      return [`packet.${fieldName}`];
    case "role_type":
    case "bcv_rec_id":
    case "custid":
    case "retstat":
    case "id":
    case "fname":
    case "lname":
    case "sfname":
    case "slname":
    case "psex":
    case "ssex":
    case "mstat":
    case "dob":
    case "sdob":
    case "dod":
    case "relation":
    case "non_spouse_benf":
    case "qdro_indicator":
    case "qpsa_indicator":
      return [`participant_role_population.${fieldName}`];
    case "calc_indicator":
    case "calculation_context":
      return [`limitation_packet.${fieldName}`];
    case "doh":
    case "dop":
    case "dote":
      return [`service_employment_history.${fieldName}`];
    case "dor":
    case "asd":
    case "sbcd":
    case "current_form_code":
    case "current_payment_amount":
    case "current_pay_status":
    case "elected_form_indicator":
    case "spouse_beneficiary_commencement_state":
      return [`benefit_administration_state.${fieldName}`];
    case "nrd":
    case "erd":
    case "eurd":
    case "eprd":
    case "rbd":
    case "xra":
    case "xrd":
    case "sxra":
    case "term_lw_xra":
    case "term_lw_anb":
      return [`resolved_dates.${fieldName}`];
    case "eligibility_service_resolved":
    case "vesting_service_resolved":
    case "benefit_service_resolved":
    case "accrual_service_resolved":
    case "compensation_resolved":
    case "average_compensation_resolved":
    case "covered_compensation_resolved":
      return [`resolved_service_compensation.${fieldName}`];
    case "rettyp":
    case "form_code_nsf":
    case "form_code_nmf":
    case "form_code_ptp":
    case "form_code_ptp_qpsa":
    case "form_code_death":
    case "annuity_status_pay":
    case "lsoption":
    case "bs_ind":
    case "br_ind":
    case "ofa_indicator":
      return [`resolved_forms_status.${fieldName}`];
    case "valuation_listings_output_rule_trace":
    case "valuation_listings_output_warning_flag":
    case "valuation_listings_output_warning_note":
      return [`row.${fieldName}`];
    default:
      return [`v1_ve_output_row.${fieldName}`];
  }
}

export function buildValuationListingTraces(
  calculationRunId: string,
  subjectKey: string,
  row: ValuationListingsOutputRow,
  packet: ValuationListingsOutputPacket,
  warnings: StructuredIssue[],
): ModuleTrace[] {
  const warningNote = warnings.map((warning) => warning.message).join("; ") || null;
  return Object.entries(row)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([fieldName, value]) => ({
      module_trace_id: createDeterministicId("trace"),
      calculation_run_id: calculationRunId,
      module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
      subject_key: subjectKey,
      field_name: fieldName,
      rule_applied: `${VALUATION_LISTINGS_OUTPUT_MODULE_NAME}@${VALUATION_LISTINGS_OUTPUT_MODULE_VERSION}:dd_first_projection`,
      input_fields_used_json: JSON.stringify(sourceFieldsFor(fieldName)),
      intermediate_values_json: JSON.stringify({
        module_version: VALUATION_LISTINGS_OUTPUT_MODULE_VERSION,
        dd_field_name: canonicalDdFieldName(fieldName),
        listing_row_type: packet.listing_row_type,
        subject_type: packet.subject_type,
        warning_count: warnings.length,
      }),
      output_value: String(value),
      warning_note: warningNote,
    }));
}

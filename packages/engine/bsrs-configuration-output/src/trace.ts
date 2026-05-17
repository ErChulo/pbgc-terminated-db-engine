import { createDeterministicId, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import { canonicalDdFieldName } from "./ddMapping";
import { BSRS_CONFIGURATION_OUTPUT_MODULE_NAME, BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION, type BsrsConfigurationOutputPacket, type BsrsConfigurationOutputRow } from "./types";

function sourceFieldsFor(fieldName: string): string[] {
  switch (fieldName) {
    case "case_id":
    case "plan_id":
    case "bcv_rec_id":
    case "custid":
    case "retstat":
    case "id":
      return ["case_plan_timeline", "participant_role_population"];
    case "calc_indicator":
    case "calculation_context":
      return ["limitation_packet"];
    case "role_type":
    case "fname":
    case "lname":
    case "sfname":
    case "slname":
    case "psex":
    case "ssex":
    case "mstat":
    case "relation":
    case "non_spouse_benf":
    case "dob":
    case "sdob":
    case "dod":
      return ["participant_role_population"];
    case "doh":
    case "dop":
    case "dote":
      return ["service_employment_history"];
    case "dor":
    case "asd":
    case "sbcd":
    case "current_form_code":
    case "current_payment_amount":
    case "current_pay_status":
      return ["benefit_administration_state"];
    case "nrd":
    case "erd":
    case "eurd":
    case "eprd":
    case "rbd":
    case "xra":
    case "xrd":
    case "sxra":
      return ["resolved_dates"];
    case "form_code_nsf":
    case "form_code_nmf":
    case "form_code_ptp":
    case "form_code_ptp_qpsa":
    case "form_code_death":
    case "form_code_ard":
    case "spc_ard":
    case "mths_ard":
    case "lev_mb_ard":
    case "annuity_status_pay":
    case "lsoption":
    case "rettyp":
    case "bs_ind":
    case "br_ind":
    case "ofa_indicator":
      return ["resolved_forms_status", "in_pay_packet"];
    case "term_mb_nrd_nsf":
    case "xrd_mb_term":
    case "xrd_surv_mb_term":
    case "xrd_mb_qpsa_term":
    case "xrd_mb_title_iv":
    case "xrd_mb_4022c":
    case "ls_term":
    case "ls_qpsa":
    case "pvmb_term":
    case "pvmb_title_iv":
    case "pvmb_4022c":
    case "pvf_lev_ann":
    case "pvf_lev_ls":
    case "pvf_qpsa_ls":
      return ["v1_ve_output_row", "valuation_listings_output_row"];
    case "statement_population_indicator":
    case "statement_type_code":
    case "statement_status_code":
    case "benefit_effective_date_for_statement":
    case "display_form_code":
    case "display_monthly_amount":
    case "display_survivor_amount":
    case "display_lump_sum_amount":
    case "recalculation_trigger_indicator":
    case "recalculation_reason_code":
    case "suppress_statement_indicator":
    case "suppression_reason_code":
      return ["valuation_listings_output_row", "v1_ve_output_row", "benefit_administration_state"];
    case "ce_track1":
    case "ce_track2":
    case "ce_track3":
    case "ce_track4":
    case "ce_track5":
    case "ce_track6":
    case "rule_trace_id":
    case "calculation_run_id":
    case "deliverable_version":
    case "schema_version":
      return ["trace_inputs"];
    case "bsrs_configuration_output_rule_trace":
    case "bsrs_configuration_output_warning_flag":
    case "bsrs_configuration_output_warning_note":
      return ["row"];
    default:
      return ["packet"];
  }
}

export function buildBsrsConfigurationTraces(
  calculationRunId: string,
  subjectKey: string,
  row: BsrsConfigurationOutputRow,
  packet: BsrsConfigurationOutputPacket,
  warnings: StructuredIssue[],
): ModuleTrace[] {
  const warningNote = warnings.map((warning) => warning.message).join("; ") || null;
  return Object.entries(row)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([fieldName, value]) => ({
      module_trace_id: createDeterministicId("trace"),
      calculation_run_id: calculationRunId,
      module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
      subject_key: subjectKey,
      field_name: fieldName,
      rule_applied: `${BSRS_CONFIGURATION_OUTPUT_MODULE_NAME}@${BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION}:dd_first_projection`,
      input_fields_used_json: JSON.stringify(sourceFieldsFor(fieldName)),
      intermediate_values_json: JSON.stringify({
        module_version: BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION,
        dd_field_name: canonicalDdFieldName(fieldName),
        statement_row_type: packet.statement_row_type,
        statement_population_indicator: row.statement_population_indicator,
        suppress_statement_indicator: row.suppress_statement_indicator,
        recalculation_trigger_indicator: row.recalculation_trigger_indicator,
      }),
      output_value: String(value),
      warning_note: warningNote,
    }));
}

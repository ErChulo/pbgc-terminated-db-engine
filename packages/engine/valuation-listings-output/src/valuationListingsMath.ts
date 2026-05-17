import type { StructuredIssue } from "@pbgc/shared";
import type { BenefitKernelFieldName } from "@pbgc/benefit-kernel";
import type { V1VeOutputRow } from "@pbgc/v1-ve-output";
import { canonicalDdFieldName, hasDdMapping } from "./ddMapping";
import { VALUATION_LISTINGS_OUTPUT_MODULE_NAME, VALUATION_LISTINGS_OUTPUT_MODULE_VERSION, type ValuationListingsOutputPacket, type ValuationListingsOutputRow } from "./types";

function pickBenefitFields(packet: ValuationListingsOutputPacket): Pick<V1VeOutputRow, BenefitKernelFieldName> {
  return {
    term_mb_nrd_nsf: packet.v1_ve_output_row.term_mb_nrd_nsf,
    term_surv_mb_nrd: packet.v1_ve_output_row.term_surv_mb_nrd,
    term_surv_mb_eurd: packet.v1_ve_output_row.term_surv_mb_eurd,
    term_surv_mb_erd: packet.v1_ve_output_row.term_surv_mb_erd,
    rbd_surv_mb_term: packet.v1_ve_output_row.rbd_surv_mb_term,
    term_surv_mb_ard: packet.v1_ve_output_row.term_surv_mb_ard,
    xrd_mb_term: packet.v1_ve_output_row.xrd_mb_term,
    xrd_surv_mb_term: packet.v1_ve_output_row.xrd_surv_mb_term,
    xrd_mb_qpsa_term: packet.v1_ve_output_row.xrd_mb_qpsa_term,
    ls_term: packet.v1_ve_output_row.ls_term,
    ls_qpsa: packet.v1_ve_output_row.ls_qpsa,
    xrd_mb_title_iv: packet.v1_ve_output_row.xrd_mb_title_iv,
    nrd_mb_title_iv_nsf: packet.v1_ve_output_row.nrd_mb_title_iv_nsf,
    eurd_mb_title_iv_nsf: packet.v1_ve_output_row.eurd_mb_title_iv_nsf,
    erd_mb_title_iv_nsf: packet.v1_ve_output_row.erd_mb_title_iv_nsf,
    rbd_mb_title_iv: packet.v1_ve_output_row.rbd_mb_title_iv,
    ard_mb_title_iv: packet.v1_ve_output_row.ard_mb_title_iv,
    pvmb_title_iv_no_q_no_l: packet.v1_ve_output_row.pvmb_title_iv_no_q_no_l,
    pvmb_title_iv_qpsa: packet.v1_ve_output_row.pvmb_title_iv_qpsa,
    pvmb_title_iv_no_load: packet.v1_ve_output_row.pvmb_title_iv_no_load,
    title_iv_load: packet.v1_ve_output_row.title_iv_load,
    pvmb_title_iv: packet.v1_ve_output_row.pvmb_title_iv,
    xrd_mb_4022c: packet.v1_ve_output_row.xrd_mb_4022c,
    pvmb_4022c_no_q_no_l: packet.v1_ve_output_row.pvmb_4022c_no_q_no_l,
    pvmb_4022c_qpsa: packet.v1_ve_output_row.pvmb_4022c_qpsa,
    pvmb_4022c_no_load: packet.v1_ve_output_row.pvmb_4022c_no_load,
    load_4022c: packet.v1_ve_output_row.load_4022c,
    pvmb_4022c: packet.v1_ve_output_row.pvmb_4022c,
    pvmb_bas_ungb_no_q_no_l: packet.v1_ve_output_row.pvmb_bas_ungb_no_q_no_l,
    pvmb_bas_ungb_qpsa: packet.v1_ve_output_row.pvmb_bas_ungb_qpsa,
    bnnfa_pvmb_no_load: packet.v1_ve_output_row.bnnfa_pvmb_no_load,
    bnnfa_load: packet.v1_ve_output_row.bnnfa_load,
    bnnfa_pvmb: packet.v1_ve_output_row.bnnfa_pvmb,
    pvpbl_ann_rates_no_q_no_l: packet.v1_ve_output_row.pvpbl_ann_rates_no_q_no_l,
    pvpbl_ann_rates_qpsa: packet.v1_ve_output_row.pvpbl_ann_rates_qpsa,
    pvpbl_ann_rates_no_load: packet.v1_ve_output_row.pvpbl_ann_rates_no_load,
    pbl_load: packet.v1_ve_output_row.pbl_load,
    pvpbl_ann_rates: packet.v1_ve_output_row.pvpbl_ann_rates,
    pvf_lev_ann: packet.v1_ve_output_row.pvf_lev_ann,
    pvf_lev_ls: packet.v1_ve_output_row.pvf_lev_ls,
    pvf_qpsa_ls: packet.v1_ve_output_row.pvf_qpsa_ls,
    pvmb_term_no_q_no_l: packet.v1_ve_output_row.pvmb_term_no_q_no_l,
    pvmb_term_qpsa: packet.v1_ve_output_row.pvmb_term_qpsa,
    pvmb_term_no_load: packet.v1_ve_output_row.pvmb_term_no_load,
    term_load: packet.v1_ve_output_row.term_load,
    pvmb_term: packet.v1_ve_output_row.pvmb_term,
  };
}

export function projectValuationListingRow(packet: ValuationListingsOutputPacket): ValuationListingsOutputRow {
  return {
    ...pickBenefitFields(packet),
    case_id: packet.case_id,
    plan_id: packet.case_plan_timeline.plan_id,
    listing_row_type: packet.listing_row_type,
    listing_sort_key: `${packet.listing_row_type}|${packet.participant_role_population.bcv_rec_id}`,
    role_type: packet.subject_type,
    bcv_rec_id: packet.participant_role_population.bcv_rec_id,
    custid: packet.participant_role_population.custid,
    retstat: packet.participant_role_population.retstat,
    id: packet.participant_role_population.id,
    fname: packet.participant_role_population.fname,
    lname: packet.participant_role_population.lname,
    sfname: packet.participant_role_population.sfname,
    slname: packet.participant_role_population.slname,
    psex: packet.participant_role_population.psex,
    ssex: packet.participant_role_population.ssex,
    mstat: packet.participant_role_population.mstat,
    dob: packet.participant_role_population.dob,
    sdob: packet.participant_role_population.sdob,
    dod: packet.participant_role_population.dod,
    relation: packet.participant_role_population.relation,
    non_spouse_benf: packet.participant_role_population.non_spouse_benf,
    qdro_indicator: packet.participant_role_population.qdro_indicator,
    qpsa_indicator: packet.participant_role_population.qpsa_indicator,
    calc_indicator: packet.limitation_packet.calc_indicator ? "V" : "R",
    calculation_context: packet.limitation_packet.calculation_context,
    doh: packet.service_employment_history.doh,
    dop: packet.service_employment_history.dop,
    dote: packet.service_employment_history.dote,
    dor: packet.benefit_administration_state.dor,
    asd: packet.benefit_administration_state.asd,
    sbcd: packet.benefit_administration_state.sbcd,
    current_form_code: packet.benefit_administration_state.current_form_code,
    current_payment_amount: packet.benefit_administration_state.current_payment_amount,
    current_pay_status: packet.benefit_administration_state.current_pay_status,
    elected_form_indicator: packet.benefit_administration_state.elected_form_indicator,
    spouse_beneficiary_commencement_state: packet.benefit_administration_state.spouse_beneficiary_commencement_state,
    nrd: packet.resolved_dates.nrd,
    erd: packet.resolved_dates.erd,
    eurd: packet.resolved_dates.eurd,
    eprd: packet.resolved_dates.eprd,
    rbd: packet.resolved_dates.rbd,
    xra: packet.resolved_dates.xra,
    xrd: packet.resolved_dates.xrd,
    sxra: packet.resolved_dates.sxra,
    term_lw_xra: packet.resolved_dates.term_lw_xra,
    term_lw_anb: packet.resolved_dates.term_lw_anb,
    eligibility_service_resolved: packet.resolved_service_compensation.eligibility_service_resolved,
    vesting_service_resolved: packet.resolved_service_compensation.vesting_service_resolved,
    benefit_service_resolved: packet.resolved_service_compensation.benefit_service_resolved,
    accrual_service_resolved: packet.resolved_service_compensation.accrual_service_resolved,
    compensation_resolved: packet.resolved_service_compensation.compensation_resolved,
    average_compensation_resolved: packet.resolved_service_compensation.average_compensation_resolved,
    covered_compensation_resolved: packet.resolved_service_compensation.covered_compensation_resolved,
    rettyp: packet.resolved_forms_status.rettyp,
    form_code_nsf: packet.resolved_forms_status.form_code_nsf,
    form_code_nmf: packet.resolved_forms_status.form_code_nmf,
    form_code_ptp: packet.resolved_forms_status.form_code_ptp,
    form_code_ptp_qpsa: packet.resolved_forms_status.form_code_ptp_qpsa,
    form_code_death: packet.resolved_forms_status.form_code_death,
    annuity_status_pay: packet.resolved_forms_status.annuity_status_pay,
    lsoption: packet.resolved_forms_status.lsoption,
    bs_ind: packet.resolved_forms_status.bs_ind,
    br_ind: packet.resolved_forms_status.br_ind,
    ofa_indicator: packet.resolved_forms_status.ofa_indicator,
    valuation_listings_output_rule_trace: `${VALUATION_LISTINGS_OUTPUT_MODULE_NAME}@${VALUATION_LISTINGS_OUTPUT_MODULE_VERSION}:dd_first_projection`,
    valuation_listings_output_warning_flag: false,
    valuation_listings_output_warning_note: null,
  };
}

export function applyValuationListingOverride(row: ValuationListingsOutputRow, packet: ValuationListingsOutputPacket, inputPacketId: string): StructuredIssue[] {
  const warnings: StructuredIssue[] = [];
  const override = packet.technical_output_override_packet;
  if (!override) return warnings;

  const ddFieldName = canonicalDdFieldName(override.output_column_name);
  const outputFieldName = resolveOutputFieldName(ddFieldName);
  if (!hasDdMapping(outputFieldName) || !(outputFieldName in row)) return warnings;

  (row as Record<string, string | number | boolean | null>)[outputFieldName] = override.override_value;
  warnings.push({
    code: "TECHNICAL_OVERRIDE_APPLIED",
    message: `Technical override applied to ${outputFieldName}`,
    field_name: outputFieldName,
    input_group: "technical_output_override_packet",
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: VALUATION_LISTINGS_OUTPUT_MODULE_VERSION,
  });
  return warnings;
}

export function addNullWarnings(row: ValuationListingsOutputRow, inputPacketId: string): StructuredIssue[] {
  const warnings: StructuredIssue[] = [];
  for (const fieldName of ["term_mb_nrd_nsf", "xrd_mb_term", "pvmb_term"] as const) {
    if (row[fieldName] !== null) continue;
    warnings.push({
      code: "NULL_OUTPUT_FIELD",
      message: `Valuation listing field ${fieldName} resolved to null for the current branch`,
      field_name: fieldName,
      input_group: "v1_ve_output_row",
      input_packet_id: inputPacketId,
      module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
      rule_version: VALUATION_LISTINGS_OUTPUT_MODULE_VERSION,
    });
  }
  if (warnings.length > 0) {
    row.valuation_listings_output_warning_flag = true;
    row.valuation_listings_output_warning_note = warnings.map((warning) => warning.message).join("; ");
  }
  return warnings;
}

function resolveOutputFieldName(ddFieldName: string): string {
  return ddFieldName === "FORM_CODE" ? "current_form_code" : ddFieldName.toLowerCase();
}

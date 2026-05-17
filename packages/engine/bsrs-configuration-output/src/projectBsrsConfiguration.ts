import { canonicalDdFieldName } from "./ddMapping";
import { BSRS_CONFIGURATION_OUTPUT_MODULE_NAME, BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION, type BsrsConfigurationOutputPacket, type BsrsConfigurationOutputRow } from "./types";

function derivedStatementType(packet: BsrsConfigurationOutputPacket): string {
  if (packet.statement_row_type === "survivor") return "survivor_statement";
  if (packet.benefit_administration_state.current_pay_status === "in_pay") return "benefit_statement";
  if (packet.statement_row_type === "suppressed") return "no_statement";
  return "retirement_statement";
}

function derivedStatementStatus(packet: BsrsConfigurationOutputPacket): string {
  if (packet.statement_row_type === "suppressed") return "suppressed";
  return packet.benefit_administration_state.current_pay_status === "in_pay" ? "active" : "pending";
}

function derivedDisplayMonthlyAmount(packet: BsrsConfigurationOutputPacket): number | null {
  return packet.benefit_administration_state.current_payment_amount ?? packet.valuation_listings_output_row.term_mb_nrd_nsf ?? packet.v1_ve_output_row.term_mb_nrd_nsf ?? null;
}

function derivedDisplaySurvivorAmount(packet: BsrsConfigurationOutputPacket): number | null {
  return packet.valuation_listings_output_row.xrd_surv_mb_term ?? packet.valuation_listings_output_row.xrd_mb_qpsa_term ?? null;
}

function derivedDisplayLumpSumAmount(packet: BsrsConfigurationOutputPacket): number | null {
  return packet.valuation_listings_output_row.ls_qpsa ?? packet.valuation_listings_output_row.ls_term ?? null;
}

export function projectBsrsConfigurationRow(packet: BsrsConfigurationOutputPacket): BsrsConfigurationOutputRow {
  const inPay = packet.benefit_administration_state.current_pay_status === "in_pay";
  const suppress = packet.statement_row_type === "suppressed";
  const displayMonthlyAmount = derivedDisplayMonthlyAmount(packet);
  return {
    case_id: packet.case_id,
    plan_id: packet.case_plan_timeline.plan_id,
    bcv_rec_id: packet.participant_role_population.bcv_rec_id,
    custid: packet.participant_role_population.custid,
    retstat: packet.participant_role_population.retstat,
    id: packet.participant_role_population.id,
    calc_indicator: packet.limitation_packet.calc_indicator ? "V" : "R",
    calculation_context: packet.limitation_packet.calculation_context,
    role_type: packet.subject_type,
    fname: packet.participant_role_population.fname,
    lname: packet.participant_role_population.lname,
    sfname: packet.participant_role_population.sfname,
    slname: packet.participant_role_population.slname,
    psex: packet.participant_role_population.psex,
    ssex: packet.participant_role_population.ssex,
    mstat: packet.participant_role_population.mstat,
    relation: packet.participant_role_population.relation,
    non_spouse_benf: packet.participant_role_population.non_spouse_benf,
    dob: packet.participant_role_population.dob,
    sdob: packet.participant_role_population.sdob,
    dod: packet.participant_role_population.dod,
    doh: packet.service_employment_history.doh,
    dop: packet.service_employment_history.dop,
    dote: packet.service_employment_history.dote,
    dor: packet.benefit_administration_state.dor,
    asd: packet.benefit_administration_state.asd,
    sbcd: packet.benefit_administration_state.sbcd,
    nrd: packet.resolved_dates.nrd,
    erd: packet.resolved_dates.erd,
    eurd: packet.resolved_dates.eurd,
    eprd: packet.resolved_dates.eprd,
    rbd: packet.resolved_dates.rbd,
    xra: packet.resolved_dates.xra,
    xrd: packet.resolved_dates.xrd,
    sxra: packet.resolved_dates.sxra,
    current_form_code: packet.benefit_administration_state.current_form_code,
    form_code_nsf: packet.resolved_forms_status.form_code_nsf,
    form_code_nmf: packet.resolved_forms_status.form_code_nmf,
    form_code_ptp: packet.resolved_forms_status.form_code_ptp,
    form_code_ptp_qpsa: packet.resolved_forms_status.form_code_ptp_qpsa,
    form_code_death: packet.resolved_forms_status.form_code_death,
    form_code_ard: inPay ? packet.in_pay_packet?.form_code_ard ?? packet.benefit_administration_state.current_form_code : null,
    spc_ard: inPay ? packet.in_pay_packet?.spc_ard ?? null : null,
    mths_ard: inPay ? packet.in_pay_packet?.mths_ard ?? null : null,
    lev_mb_ard: inPay ? packet.in_pay_packet?.lev_mb_ard ?? null : null,
    annuity_status_pay: packet.resolved_forms_status.annuity_status_pay,
    lsoption: packet.resolved_forms_status.lsoption,
    rettyp: packet.resolved_forms_status.rettyp,
    bs_ind: packet.resolved_forms_status.bs_ind,
    br_ind: packet.resolved_forms_status.br_ind,
    ofa_indicator: packet.resolved_forms_status.ofa_indicator,
    term_mb_nrd_nsf: packet.v1_ve_output_row.term_mb_nrd_nsf,
    xrd_mb_term: packet.v1_ve_output_row.xrd_mb_term,
    xrd_surv_mb_term: packet.v1_ve_output_row.xrd_surv_mb_term,
    xrd_mb_qpsa_term: packet.v1_ve_output_row.xrd_mb_qpsa_term,
    xrd_mb_title_iv: packet.v1_ve_output_row.xrd_mb_title_iv,
    xrd_mb_4022c: packet.v1_ve_output_row.xrd_mb_4022c,
    current_payment_amount: packet.benefit_administration_state.current_payment_amount,
    ls_term: packet.v1_ve_output_row.ls_term,
    ls_qpsa: packet.v1_ve_output_row.ls_qpsa,
    pvmb_term: packet.v1_ve_output_row.pvmb_term,
    pvmb_title_iv: packet.v1_ve_output_row.pvmb_title_iv,
    pvmb_4022c: packet.v1_ve_output_row.pvmb_4022c,
    pvf_lev_ann: packet.v1_ve_output_row.pvf_lev_ann,
    pvf_lev_ls: packet.v1_ve_output_row.pvf_lev_ls,
    pvf_qpsa_ls: packet.v1_ve_output_row.pvf_qpsa_ls,
    statement_population_indicator: suppress ? "N" : "Y",
    statement_type_code: derivedStatementType(packet),
    statement_status_code: derivedStatementStatus(packet),
    benefit_effective_date_for_statement: packet.resolved_dates.nrd ?? packet.benefit_administration_state.dor ?? packet.case_plan_timeline.dotr ?? null,
    display_form_code: packet.benefit_administration_state.current_form_code ?? packet.resolved_forms_status.rettyp,
    display_monthly_amount: displayMonthlyAmount,
    display_survivor_amount: derivedDisplaySurvivorAmount(packet),
    display_lump_sum_amount: derivedDisplayLumpSumAmount(packet),
    recalculation_trigger_indicator: packet.participant_role_population.qdro_indicator || packet.participant_role_population.qpsa_indicator ? "Y" : "N",
    recalculation_reason_code: packet.participant_role_population.qdro_indicator ? "QDRO_BRANCH" : packet.participant_role_population.qpsa_indicator ? "QPSA_BRANCH" : null,
    suppress_statement_indicator: suppress ? "Y" : "N",
    suppression_reason_code: suppress ? "SUPPRESSED_ROW" : null,
    ce_track1: packet.trace_inputs.ce_track1,
    ce_track2: packet.trace_inputs.ce_track2,
    ce_track3: packet.trace_inputs.ce_track3,
    ce_track4: packet.trace_inputs.ce_track4,
    ce_track5: packet.trace_inputs.ce_track5,
    ce_track6: packet.trace_inputs.ce_track6,
    rule_trace_id: packet.trace_inputs.rule_trace_id,
    calculation_run_id: packet.trace_inputs.calculation_run_id,
    deliverable_version: packet.trace_inputs.deliverable_version,
    schema_version: packet.trace_inputs.schema_version,
    statement_row_type: packet.statement_row_type,
    statement_sort_key: packet.statement_sort_key,
    bsrs_configuration_output_rule_trace: `${BSRS_CONFIGURATION_OUTPUT_MODULE_NAME}@${BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION}:dd_first_projection|${canonicalDdFieldName("bsrs_configuration_output_rule_trace")}`,
    bsrs_configuration_output_warning_flag: false,
    bsrs_configuration_output_warning_note: null,
  };
}

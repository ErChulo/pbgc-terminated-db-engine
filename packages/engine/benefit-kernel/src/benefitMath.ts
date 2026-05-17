import type { BenefitKernelPacket, BenefitKernelValues } from "./types";

export function computeBenefitValues(packet: BenefitKernelPacket): BenefitKernelValues {
  const values = emptyBenefitValues();
  const supportedFormula = packet.resolved_plan_logic.accrued_benefit_formula === "1.5pct_final_avg_pay_x_service";
  const qpsa = Boolean(packet.participant_role_population.qpsa_indicator);
  const inPay = packet.benefit_administration_state.current_pay_status === "in_pay";
  const qdro = Boolean(packet.participant_role_population.qdro_indicator);

  if (supportedFormula && !qpsa && !qdro && !inPay) {
    const annualBenefit = (packet.compensation_accrual_inputs.final_average_compensation ?? 0) * 0.015 * (packet.service_employment_history.benefit_service_at_dopt ?? 0);
    const monthlyBenefit = annualBenefit / 12;
    values.term_mb_nrd_nsf = round2(monthlyBenefit);
    values.xrd_mb_term = round2(monthlyBenefit);
    values.pvmb_term = round2(monthlyBenefit * 79.36);
    return values;
  }

  return values;
}

export function emptyBenefitValues(): BenefitKernelValues {
  return {
    term_mb_nrd_nsf: null,
    term_surv_mb_nrd: null,
    term_surv_mb_eurd: null,
    term_surv_mb_erd: null,
    rbd_surv_mb_term: null,
    term_surv_mb_ard: null,
    xrd_mb_term: null,
    xrd_surv_mb_term: null,
    xrd_mb_qpsa_term: null,
    ls_term: null,
    ls_qpsa: null,
    xrd_mb_title_iv: null,
    nrd_mb_title_iv_nsf: null,
    eurd_mb_title_iv_nsf: null,
    erd_mb_title_iv_nsf: null,
    rbd_mb_title_iv: null,
    ard_mb_title_iv: null,
    pvmb_title_iv_no_q_no_l: null,
    pvmb_title_iv_qpsa: null,
    pvmb_title_iv_no_load: null,
    title_iv_load: null,
    pvmb_title_iv: null,
    xrd_mb_4022c: null,
    pvmb_4022c_no_q_no_l: null,
    pvmb_4022c_qpsa: null,
    pvmb_4022c_no_load: null,
    load_4022c: null,
    pvmb_4022c: null,
    pvmb_bas_ungb_no_q_no_l: null,
    pvmb_bas_ungb_qpsa: null,
    bnnfa_pvmb_no_load: null,
    bnnfa_load: null,
    bnnfa_pvmb: null,
    pvpbl_ann_rates_no_q_no_l: null,
    pvpbl_ann_rates_qpsa: null,
    pvpbl_ann_rates_no_load: null,
    pbl_load: null,
    pvpbl_ann_rates: null,
    pvf_lev_ann: null,
    pvf_lev_ls: null,
    pvf_qpsa_ls: null,
    pvmb_term_no_q_no_l: null,
    pvmb_term_qpsa: null,
    pvmb_term_no_load: null,
    term_load: null,
    pvmb_term: null,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

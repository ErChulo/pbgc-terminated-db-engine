import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";

export const BENEFIT_KERNEL_MODULE_NAME = "benefit_kernel" as const;
export const BENEFIT_KERNEL_MODULE_VERSION = "0.1.0" as const;

export type NullableDate = string | null;
export type BenefitSubjectType = "participant" | "beneficiary" | "alternate_payee";

export const BENEFIT_KERNEL_OUTPUT_FIELDS = [
  "term_mb_nrd_nsf",
  "term_surv_mb_nrd",
  "term_surv_mb_eurd",
  "term_surv_mb_erd",
  "rbd_surv_mb_term",
  "term_surv_mb_ard",
  "xrd_mb_term",
  "xrd_surv_mb_term",
  "xrd_mb_qpsa_term",
  "ls_term",
  "ls_qpsa",
  "xrd_mb_title_iv",
  "nrd_mb_title_iv_nsf",
  "eurd_mb_title_iv_nsf",
  "erd_mb_title_iv_nsf",
  "rbd_mb_title_iv",
  "ard_mb_title_iv",
  "pvmb_title_iv_no_q_no_l",
  "pvmb_title_iv_qpsa",
  "pvmb_title_iv_no_load",
  "title_iv_load",
  "pvmb_title_iv",
  "xrd_mb_4022c",
  "pvmb_4022c_no_q_no_l",
  "pvmb_4022c_qpsa",
  "pvmb_4022c_no_load",
  "load_4022c",
  "pvmb_4022c",
  "pvmb_bas_ungb_no_q_no_l",
  "pvmb_bas_ungb_qpsa",
  "bnnfa_pvmb_no_load",
  "bnnfa_load",
  "bnnfa_pvmb",
  "pvpbl_ann_rates_no_q_no_l",
  "pvpbl_ann_rates_qpsa",
  "pvpbl_ann_rates_no_load",
  "pbl_load",
  "pvpbl_ann_rates",
  "pvf_lev_ann",
  "pvf_lev_ls",
  "pvf_qpsa_ls",
  "pvmb_term_no_q_no_l",
  "pvmb_term_qpsa",
  "pvmb_term_no_load",
  "term_load",
  "pvmb_term",
] as const;

export type BenefitKernelFieldName = (typeof BENEFIT_KERNEL_OUTPUT_FIELDS)[number];
export type BenefitKernelValues = Record<BenefitKernelFieldName, number | null>;

export type BenefitKernelPacket = {
  packet_type: "benefit_kernel";
  schema_version: "0.1.0";
  case_id: string;
  subject_type: BenefitSubjectType;
  subject_key: string;
  case_plan_timeline: {
    case_id: string;
    plan_id: string;
    dopt: NullableDate;
    dotr: NullableDate;
    bpd: NullableDate;
    dobf: NullableDate;
  };
  resolved_plan_logic: {
    accrued_benefit_formula: string;
    normal_single_form_rule: string;
    normal_married_form_rule: string;
    early_reduced_retirement_rule: string;
    early_retirement_adjustment_rule: string;
    default_actuarial_equivalence_rule: string;
    deferred_vested_normal_retirement_rule: string;
    deferred_vested_early_retirement_rule: string;
    late_retirement_rule: string;
    eligibility_service_rule: string;
    vesting_service_rule: string;
    benefit_service_rule: string;
    accrual_factor_rule: string;
    short_service_factor_rule: string;
    compensation_definition_rule: string;
    average_compensation_rule: string;
    covered_compensation_rule: string | null;
    pia_offset_rule: string | null;
    supplemental_benefit_rule: string | null;
    form_conversion_basis_rule: string;
    late_retirement_adjustment_rule: string;
    suspension_of_benefits_rule: string | null;
    disability_benefit_rule: string | null;
    pre_retirement_death_benefit_rule: string;
    post_retirement_death_benefit_rule: string | null;
    vesting_schedule_rule: string;
    cash_out_rule: string | null;
    mandatory_employee_contribution_rule: string | null;
    voluntary_employee_contribution_rule: string | null;
    top_heavy_rule: string | null;
    consensual_lump_sum_rule: string;
    additional_provisions_of_note: string | null;
  };
  participant_role_population: {
    bcv_rec_id: string;
    custid: string;
    retstat: string;
    id: string;
    role_type: BenefitSubjectType;
    fname: string;
    lname: string;
    sfname: string | null;
    slname: string | null;
    psex: string | null;
    ssex: string | null;
    mstat: string;
    dob: NullableDate;
    sdob: NullableDate;
    dod: NullableDate;
    relation: string | null;
    non_spouse_benf: boolean;
    qdro_indicator: boolean;
    qpsa_indicator: boolean;
    five_percent_owner_indicator: boolean;
    substantial_owner_indicator: boolean;
    retirement_status_as_of_dopt: string | null;
    payment_status_as_of_dopt: string;
  };
  service_employment_history: {
    doh: NullableDate;
    dop: NullableDate;
    dote: NullableDate;
    service_basis_code: string;
    service_hours_requirement: string;
    service_period_basis: string;
    plan_anniversary_service_basis: string;
    vesting_service_at_dopt: number;
    benefit_service_at_dopt: number;
    accrual_service_at_dopt: number;
  };
  compensation_accrual_inputs: {
    compensation_basis_code: string;
    average_compensation_period: string;
    compensation_history_available_indicator: boolean;
    final_average_compensation: number | null;
    covered_compensation_amount: number | null;
    frozen_accrued_benefit_indicator: boolean;
    frozen_accrued_monthly_benefit: number | null;
    accrued_benefit_at_dopt: number | null;
    vested_percentage_at_dopt: number | null;
  };
  benefit_administration_state: {
    dor: NullableDate;
    asd: NullableDate;
    sbcd: string | null;
    current_form_code: string | null;
    current_payment_amount: number | null;
    payment_history_available_indicator: boolean;
    check_register_available_indicator: boolean;
    current_pay_status: string;
    elected_form_indicator: boolean;
    spouse_beneficiary_commencement_state: string | null;
  };
  actuarial_assumption_factor_set: {
    assumption_set_id: string;
    plan_factor_table_id: string;
    interest_basis_code: string;
    mortality_basis_code: string;
    pre_retirement_mortality_code: string;
    post_retirement_mortality_code: string;
    retirement_age_convention: string;
    form_conversion_method: string;
    lookback_period: string;
    stability_period: string;
    required_beginning_date_method: string;
    lump_sum_basis_code: string | null;
    annuity_basis_code: string;
  };
  limitation_packet: {
    calc_indicator: boolean;
    calculation_context: string;
    section_436_applicable_indicator: boolean;
    bankruptcy_plan_indicator: boolean;
    bpd_limitation_indicator: boolean;
    majority_owner_limitation_indicator: boolean;
    aggregate_limit_applicable_indicator: boolean;
    accrued_at_termination_limitation_indicator: boolean;
    phase_in_limitation_indicator: boolean;
    vested_at_termination_limitation_indicator: boolean;
    annuity_starting_date_limitation_indicator: boolean;
    death_benefit_limitation_indicator: boolean;
    form_of_benefit_limitation_indicator: boolean;
    actuarial_equivalence_limitation_indicator: boolean;
    ongoing_employment_contingency_indicator: boolean;
  };
  resolved_dates: {
    nrd: NullableDate;
    erd: NullableDate;
    eurd: NullableDate;
    eprd: NullableDate;
    rbd: NullableDate;
    xra: number | null;
    xrd: NullableDate;
    sxra: number | null;
    term_lw_xra: number | null;
    term_lw_anb: number | null;
  };
  resolved_service_compensation: {
    eligibility_service_resolved: number | null;
    vesting_service_resolved: number | null;
    benefit_service_resolved: number | null;
    accrual_service_resolved: number | null;
    compensation_resolved: number | null;
    average_compensation_resolved: number | null;
    covered_compensation_resolved: number | null;
  };
  resolved_forms_status: {
    rettyp: string | null;
    form_code_nsf: string | null;
    form_code_nmf: string | null;
    form_code_ptp: string | null;
    form_code_ptp_qpsa: string | null;
    form_code_death: string | null;
    annuity_status_pay: string | null;
    lsoption: string | null;
    bs_ind: string | null;
    br_ind: string | null;
    ofa_indicator: string | null;
  };
  section_436_packet?: {
    plan_year: string;
    aftap: string;
    certification_date: string;
    aftap_doc_id: string;
    presumed_aftap_rule: string;
    restriction_period_start: string;
    restriction_period_end: string;
  };
  aggregate_limit_packet?: {
    prior_plan_indicator: boolean;
    prior_plan_id: string;
    prior_plan_dopt: NullableDate;
    prior_plan_dotr: NullableDate;
    prior_plan_termination_initiation_date: NullableDate;
    prior_plan_benefit_payable_from_pbgc_funds: boolean;
    current_plan_indicator: boolean;
    aggregate_limit_payee_group_id: string;
  };
  qdro_packet?: {
    qdro_type: string;
    separate_interest_indicator: boolean;
    alternate_payee_name: string;
    alternate_payee_dob: NullableDate;
    qdro_effective_date: NullableDate;
    qdro_award_description: string;
  };
  qpsa_packet?: {
    participant_date_of_death: NullableDate;
    qpsa_eligibility_date: NullableDate;
    qpsa_commencement_date: NullableDate;
    qpsa_form_rule: string;
    qpsa_survivor_percentage: number | null;
  };
  in_pay_packet?: {
    form_code_ard: string;
    spc_ard: string;
    mths_ard: string;
    lev_mb_ard: number | null;
    current_monthly_benefit: number | null;
    last_payment_date: NullableDate;
  };
  death_benefit_packet?: {
    death_before_commencement_indicator: boolean;
    death_after_commencement_indicator: boolean;
    survivor_type: string;
    survivor_asd: NullableDate;
    death_benefit_form: string;
    death_benefit_amount: number | null;
  };
  mandatory_employee_contribution_packet?: {
    mec_balance: number | null;
    mec_interest_basis: string;
    mec_withdrawal_indicator: boolean;
    mec_offset_rule: string;
  };
  voluntary_employee_contribution_packet?: {
    vec_balance: number | null;
    vec_interest_basis: string;
    vec_distribution_rule: string;
  };
  disability_packet?: {
    disability_status: string;
    disability_onset_date: NullableDate;
    disability_benefit_start_date: NullableDate;
    disability_benefit_amount_rule: string;
  };
  asset_recovery_packet?: {
    asset_value_at_dopt: number | null;
    asset_statement_id: string;
    section_4044_allocation_available_indicator: boolean;
    section_4022c_amount_available_indicator: boolean;
    sparr_indicator: boolean;
    sparr_ratio: number | null;
    recovery_ratio: number | null;
    duec_indicator: boolean;
    duec_amount: number | null;
  };
  cash_balance_packet?: {
    initial_account_balance_rule: string;
    benefit_credit_rule: string;
    interest_credit_rule: string;
    interest_credit_timing_rule: string;
    annuity_conversion_factor_rule: string;
    annuity_conversion_method_rule: string;
  };
};

export type BenefitKernelOutput = {
  benefit_kernel_output_id: string;
  calculation_run_id: string;
  case_id: string;
  subject_key: string;
} & BenefitKernelValues;

export type RunBenefitKernelRequest = {
  case_id: string;
  subject_type: BenefitSubjectType;
  subject_key: string;
  input_packet_id: string;
  rule_version: "0.1.0";
  deliverable_version: "0.1.0";
};

export type RunBenefitKernelResult = {
  calculation_run_id: string;
  run_status: "completed" | "failed";
  benefit_kernel_output_id?: string;
  warning_count: number;
  error_count: number;
  warnings: StructuredIssue[];
  errors: StructuredIssue[];
  output?: BenefitKernelOutput;
  traces: ModuleTrace[];
};

export type BenefitKernelFixture = {
  test_case_id: string;
  description: string;
  accrued_benefit_formula: string;
  average_compensation_resolved: string;
  benefit_service_resolved: string;
  form_code_nsf: string;
  xrd: string;
  phase_in_limitation_indicator: string;
  section_436_applicable_indicator: string;
  expected_term_mb_nrd_nsf: string;
  expected_xrd_mb_term: string;
  expected_pvmb_term: string;
};

import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";
import type { BenefitKernelFieldName, BenefitKernelOutput } from "@pbgc/benefit-kernel";
import type { V1VeOutputRow } from "@pbgc/v1-ve-output";

export const VALUATION_LISTINGS_OUTPUT_MODULE_NAME = "valuation_listings_output" as const;
export const VALUATION_LISTINGS_OUTPUT_MODULE_VERSION = "0.1.0" as const;
export const VALUATION_LISTINGS_OUTPUT_ADAPTER_VERSION = "0.1.0" as const;

export type ValuationListingsSubjectType = "participant" | "beneficiary" | "alternate_payee";
export type ValuationListingsRowType = "participant" | "beneficiary" | "alternate_payee" | "survivor" | "summary_support";

export const VALUATION_LISTINGS_OUTPUT_FIELDS = [
  "case_id",
  "plan_id",
  "listing_row_type",
  "listing_sort_key",
  "role_type",
  "bcv_rec_id",
  "custid",
  "retstat",
  "id",
  "fname",
  "lname",
  "sfname",
  "slname",
  "psex",
  "ssex",
  "mstat",
  "dob",
  "sdob",
  "dod",
  "relation",
  "non_spouse_benf",
  "qdro_indicator",
  "qpsa_indicator",
  "calc_indicator",
  "calculation_context",
  "doh",
  "dop",
  "dote",
  "dor",
  "asd",
  "sbcd",
  "current_form_code",
  "current_payment_amount",
  "current_pay_status",
  "elected_form_indicator",
  "spouse_beneficiary_commencement_state",
  "nrd",
  "erd",
  "eurd",
  "eprd",
  "rbd",
  "xra",
  "xrd",
  "sxra",
  "term_lw_xra",
  "term_lw_anb",
  "eligibility_service_resolved",
  "vesting_service_resolved",
  "benefit_service_resolved",
  "accrual_service_resolved",
  "compensation_resolved",
  "average_compensation_resolved",
  "covered_compensation_resolved",
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
  "valuation_listings_output_rule_trace",
  "valuation_listings_output_warning_flag",
  "valuation_listings_output_warning_note",
] as const;

export type ValuationListingsOutputFieldName = (typeof VALUATION_LISTINGS_OUTPUT_FIELDS)[number];

export type ValuationListingsOutputRow = {
  case_id: string;
  plan_id: string;
  listing_row_type: ValuationListingsRowType;
  listing_sort_key: string;
  role_type: ValuationListingsSubjectType;
  bcv_rec_id: string;
  custid: string;
  retstat: string;
  id: string;
  fname: string;
  lname: string;
  sfname: string | null;
  slname: string | null;
  psex: string | null;
  ssex: string | null;
  mstat: string;
  dob: string | null;
  sdob: string | null;
  dod: string | null;
  relation: string | null;
  non_spouse_benf: boolean;
  qdro_indicator: boolean;
  qpsa_indicator: boolean;
  calc_indicator: string;
  calculation_context: string;
  doh: string | null;
  dop: string | null;
  dote: string | null;
  dor: string | null;
  asd: string | null;
  sbcd: string | null;
  current_form_code: string | null;
  current_payment_amount: number | null;
  current_pay_status: string;
  elected_form_indicator: boolean;
  spouse_beneficiary_commencement_state: string | null;
  nrd: string | null;
  erd: string | null;
  eurd: string | null;
  eprd: string | null;
  rbd: string | null;
  xra: number | null;
  xrd: string | null;
  sxra: number | null;
  term_lw_xra: number | null;
  term_lw_anb: number | null;
  eligibility_service_resolved: number | null;
  vesting_service_resolved: number | null;
  benefit_service_resolved: number | null;
  accrual_service_resolved: number | null;
  compensation_resolved: number | null;
  average_compensation_resolved: number | null;
  covered_compensation_resolved: number | null;
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
  valuation_listings_output_rule_trace: string;
  valuation_listings_output_warning_flag: boolean;
  valuation_listings_output_warning_note: string | null;
} & Pick<V1VeOutputRow, BenefitKernelFieldName>;

export type ValuationListingOutputRowRecord = {
  valuation_listing_output_row_id: string;
  calculation_run_id: string;
  case_id: string;
  plan_id: string;
  subject_key: string;
  listing_row_type: ValuationListingsRowType;
  listing_sort_key: string;
  row_json: string;
  adapter_version: string;
};

export type ValuationListingsOutputMetadata = {
  case_id: string;
  plan_id: string;
  bcv_rec_id: string;
  calculation_run_id: string;
  deliverable_version: "0.1.0";
  adapter_version: typeof VALUATION_LISTINGS_OUTPUT_ADAPTER_VERSION;
  listing_row_type: ValuationListingsRowType;
  listing_sort_key: string;
};

export type ValuationListingsOutputArtifact = {
  row: ValuationListingsOutputRow;
  metadata: ValuationListingsOutputMetadata;
  warnings: StructuredIssue[];
  traces: ModuleTrace[];
};

export type ValuationListingsOutputPacket = {
  packet_type: "valuation_listings_output";
  schema_version: "0.1.0";
  case_id: string;
  subject_type: ValuationListingsSubjectType;
  subject_key: string;
  listing_row_type: ValuationListingsRowType;
  case_plan_timeline: {
    case_id: string;
    plan_id: string;
    dopt: string | null;
    dotr: string | null;
    bpd: string | null;
    dobf: string | null;
  };
  participant_role_population: {
    bcv_rec_id: string;
    custid: string;
    retstat: string;
    id: string;
    role_type: ValuationListingsSubjectType;
    fname: string;
    lname: string;
    sfname: string | null;
    slname: string | null;
    psex: string | null;
    ssex: string | null;
    mstat: string;
    dob: string | null;
    sdob: string | null;
    dod: string | null;
    relation: string | null;
    non_spouse_benf: boolean;
    qdro_indicator: boolean;
    qpsa_indicator: boolean;
    retirement_status_as_of_dopt: string | null;
    payment_status_as_of_dopt: string;
  };
  service_employment_history: {
    doh: string | null;
    dop: string | null;
    dote: string | null;
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
    dor: string | null;
    asd: string | null;
    sbcd: string | null;
    current_form_code: string | null;
    current_payment_amount: number | null;
    current_pay_status: string;
    elected_form_indicator: boolean;
    spouse_beneficiary_commencement_state: string | null;
  };
  limitation_packet: {
    calc_indicator: boolean;
    calculation_context: string;
    section_436_applicable_indicator: boolean;
    phase_in_limitation_indicator: boolean;
    annuity_starting_date_limitation_indicator: boolean;
    death_benefit_limitation_indicator: boolean;
    form_of_benefit_limitation_indicator: boolean;
    actuarial_equivalence_limitation_indicator: boolean;
  };
  resolved_dates: {
    nrd: string | null;
    erd: string | null;
    eurd: string | null;
    eprd: string | null;
    rbd: string | null;
    xra: number | null;
    xrd: string | null;
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
  benefit_kernel_output: Pick<BenefitKernelOutput, BenefitKernelFieldName>;
  v1_ve_output_row: V1VeOutputRow;
  technical_output_override_packet?: {
    output_column_name: string;
    override_value: string;
    override_note: string;
  };
};

export type ValuationListingsOutputRequest = {
  case_id: string;
  subject_type: ValuationListingsSubjectType;
  subject_key: string;
  input_packet_id: string;
  rule_version: "0.1.0";
  deliverable_version: "0.1.0";
};

export type ValuationListingsOutputResult = {
  calculation_run_id: string;
  run_status: "completed" | "failed";
  valuation_listing_output_row_id?: string;
  warning_count: number;
  error_count: number;
  warnings: StructuredIssue[];
  errors: StructuredIssue[];
  output?: ValuationListingsOutputArtifact;
  traces: ModuleTrace[];
};

export type ValuationListingsFixture = {
  test_case_id: string;
  description: string;
  listing_row_type: ValuationListingsRowType;
  date_fixture: {
    test_case_id: string;
    description: string;
    retstat: string;
    role_type: ValuationListingsSubjectType;
    dob: string;
    dote: string;
    dod: string;
    dopt: string;
    plan_anniversary: string;
    normal_retirement_eligibility_rule: string;
    normal_retirement_start_rule: string;
    early_reduced_retirement_rule: string;
  };
  service_fixture: {
    test_case_id: string;
    description: string;
    doh: string;
    dop: string;
    dote: string;
    dopt: string;
    service_basis_code: string;
    service_hours_requirement: string;
    service_period_basis: string;
    plan_anniversary_service_basis: string;
    dobf: string;
  };
  compensation_fixture: {
    test_case_id: string;
    description: string;
    compensation_basis_code: string;
    average_compensation_rule: string;
    compensation_history_available_indicator: string;
    final_average_compensation: string;
    covered_compensation_amount: string;
    frozen_accrued_benefit_indicator: string;
  };
  form_fixture: {
    test_case_id: string;
    description: string;
    role_type: ValuationListingsSubjectType;
    mstat: string;
    current_pay_status: string;
    qdro_indicator: string;
    qpsa_indicator: string;
    normal_single_form_rule: string;
    normal_married_form_rule: string;
    pre_retirement_death_benefit_rule: string;
    consensual_lump_sum_rule: string;
  };
  benefit_fixture: {
    test_case_id: string;
    description: string;
    section_436_applicable_indicator: string;
    phase_in_limitation_indicator: string;
    accrued_benefit_formula: string;
  };
};

import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";
import type { BenefitKernelFieldName, BenefitKernelOutput } from "@pbgc/benefit-kernel";

export const V1_VE_OUTPUT_MODULE_NAME = "v1_ve_output" as const;
export const V1_VE_OUTPUT_MODULE_VERSION = "0.1.0" as const;
export const V1_VE_OUTPUT_ADAPTER_VERSION = "0.1.0" as const;

export type V1VeSubjectType = "participant" | "beneficiary" | "alternate_payee";

export type V1VeOutputRow = {
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
  eligibility_service_resolved: number | null;
  vesting_service_resolved: number | null;
  benefit_service_resolved: number | null;
  accrual_service_resolved: number | null;
  compensation_resolved: number | null;
  average_compensation_resolved: number | null;
  covered_compensation_resolved: number | null;
} & Pick<BenefitKernelOutput, BenefitKernelFieldName>;

export type V1VeOutputRowRecord = {
  v1_ve_output_row_id: string;
  calculation_run_id: string;
  case_id: string;
  plan_id: string;
  subject_key: string;
  row_json: string;
  listing_sort_key: string | null;
  adapter_version: string;
};

export type V1VeOutputMetadata = {
  case_id: string;
  plan_id: string;
  bcv_rec_id: string;
  calculation_run_id: string;
  deliverable_version: "0.1.0";
  adapter_version: typeof V1_VE_OUTPUT_ADAPTER_VERSION;
};

export type V1VeOutputArtifact = {
  row: V1VeOutputRow;
  metadata: V1VeOutputMetadata;
  warnings: StructuredIssue[];
  traces: ModuleTrace[];
};

export type V1VeOutputPacket = {
  packet_type: "v1_ve_output";
  schema_version: "0.1.0";
  case_id: string;
  subject_type: V1VeSubjectType;
  subject_key: string;
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
    calc_indicator: string;
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
  technical_output_override_packet?: {
    output_column_name: string;
    override_value: string;
    override_note: string;
  };
};

export type V1VeOutputRequest = {
  case_id: string;
  subject_type: V1VeSubjectType;
  subject_key: string;
  input_packet_id: string;
  rule_version: "0.1.0";
  deliverable_version: "0.1.0";
};

export type V1VeOutputResult = {
  calculation_run_id: string;
  run_status: "completed" | "failed";
  v1_ve_output_row_id?: string;
  warning_count: number;
  error_count: number;
  warnings: StructuredIssue[];
  errors: StructuredIssue[];
  output?: V1VeOutputArtifact;
  traces: ModuleTrace[];
};

export type V1VeFixture = {
  test_case_id: string;
  description: string;
  date_fixture: {
    test_case_id: string;
    description: string;
    retstat: string;
    role_type: V1VeSubjectType;
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
    role_type: V1VeSubjectType;
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
    accrued_benefit_formula: string;
    average_compensation_resolved: string;
    benefit_service_resolved: string;
    form_code_nsf: string;
    xrd: string;
    phase_in_limitation_indicator: string;
    section_436_applicable_indicator: string;
  };
};

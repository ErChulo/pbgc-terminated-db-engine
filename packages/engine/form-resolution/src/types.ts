import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";

export const FORM_RESOLUTION_MODULE_NAME = "form_resolution" as const;
export const FORM_RESOLUTION_MODULE_VERSION = "0.1.0" as const;

export type NullableDate = string | null;
export type FormSubjectType = "participant" | "beneficiary" | "alternate_payee";

export type FormResolutionPacket = {
  packet_type: "form_resolution";
  schema_version: "0.1.0";
  case_id: string;
  subject_type: FormSubjectType;
  subject_key: string;
  case_plan_timeline: {
    case_id: string;
    plan_id: string;
    dopt: NullableDate;
    bpd: NullableDate;
    dobf: NullableDate;
  };
  resolved_plan_logic: {
    normal_single_form_rule: string;
    normal_married_form_rule: string;
    form_conversion_basis_rule: string;
    pre_retirement_death_benefit_rule: string;
    post_retirement_death_benefit_rule: string | null;
    consensual_lump_sum_rule: string;
    default_actuarial_equivalence_rule: string;
  };
  participant_role_population: {
    bcv_rec_id: string;
    retstat: string;
    id: string;
    role_type: FormSubjectType;
    mstat: string;
    psex: string | null;
    ssex: string | null;
    dod: NullableDate;
    relation: string | null;
    non_spouse_benf: boolean;
    qdro_indicator: boolean;
    qpsa_indicator: boolean;
    retirement_status_as_of_dopt: string | null;
    payment_status_as_of_dopt: string;
  };
  benefit_administration_state: {
    dor: NullableDate;
    asd: NullableDate;
    sbcd: string | null;
    current_form_code: string | null;
    current_payment_amount: number | null;
    current_pay_status: string;
    elected_form_indicator: boolean;
    spouse_beneficiary_commencement_state: string | null;
  };
  actuarial_assumption_factor_set: {
    form_conversion_method: string;
    lump_sum_basis_code: string | null;
    annuity_basis_code: string;
  };
  limitation_packet: {
    annuity_starting_date_limitation_indicator: boolean;
    death_benefit_limitation_indicator: boolean;
    form_of_benefit_limitation_indicator: boolean;
    actuarial_equivalence_limitation_indicator: boolean;
  };
  in_pay_packet?: {
    current_form_code: string | null;
    annuity_status_pay: string;
  };
  qpsa_packet?: {
    qpsa_form_code: string;
  };
  qdro_packet?: {
    qdro_form_treatment: string;
  };
  death_benefit_packet?: {
    death_form_code: string;
  };
  mandatory_employee_contribution_packet?: {
    contribution_form_treatment: string;
  };
  voluntary_employee_contribution_packet?: {
    contribution_form_treatment: string;
  };
};

export type FormResolutionValues = {
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

export type FormResolutionOutput = {
  resolved_forms_output_id: string;
  calculation_run_id: string;
  case_id: string;
  subject_key: string;
} & FormResolutionValues;

export type RunFormResolutionRequest = {
  case_id: string;
  subject_type: FormSubjectType;
  subject_key: string;
  input_packet_id: string;
  rule_version: "0.1.0";
  deliverable_version: "0.1.0";
};

export type RunFormResolutionResult = {
  calculation_run_id: string;
  run_status: "completed" | "failed";
  resolved_forms_output_id?: string;
  warning_count: number;
  error_count: number;
  warnings: StructuredIssue[];
  errors: StructuredIssue[];
  output?: FormResolutionOutput;
  traces: ModuleTrace[];
};

export type FormResolutionFixture = {
  test_case_id: string;
  description: string;
  role_type: FormSubjectType;
  mstat: string;
  current_pay_status: string;
  qdro_indicator: string;
  qpsa_indicator: string;
  normal_single_form_rule: string;
  normal_married_form_rule: string;
  pre_retirement_death_benefit_rule: string;
  consensual_lump_sum_rule: string;
  expected_rettyp: string;
  expected_form_code_nsf: string;
  expected_form_code_nmf: string;
  expected_form_code_death: string;
  expected_lsoption: string;
};

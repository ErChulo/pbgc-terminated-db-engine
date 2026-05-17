import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";

export const COMPENSATION_RESOLUTION_MODULE_NAME = "compensation_resolution" as const;
export const COMPENSATION_RESOLUTION_MODULE_VERSION = "0.1.0" as const;

export type NullableDate = string | null;
export type CompensationSubjectType = "participant" | "beneficiary" | "alternate_payee";

export type CompensationResolutionPacket = {
  packet_type: "compensation_resolution";
  schema_version: "0.1.0";
  case_id: string;
  subject_type: CompensationSubjectType;
  subject_key: string;
  case_plan_timeline: {
    case_id: string;
    plan_id: string;
    plan_anniversary: string;
    dopt: NullableDate;
    bpd: NullableDate;
    dobf: NullableDate;
  };
  resolved_plan_logic: {
    accrued_benefit_formula: string;
    compensation_definition_rule: string;
    average_compensation_rule: string;
    covered_compensation_rule: string | null;
    pia_offset_rule: string | null;
    eligibility_service_rule: string;
    benefit_service_rule: string;
    accrual_factor_rule: string | null;
    short_service_factor_rule: string | null;
  };
  participant_role_population: {
    bcv_rec_id: string;
    retstat: string;
    id: string;
    role_type: CompensationSubjectType;
    dob: NullableDate;
    retirement_status_as_of_dopt: string | null;
  };
  service_employment_history: {
    doh: NullableDate;
    dop: NullableDate;
    dote: NullableDate;
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
  };
  limitation_packet: {
    bankruptcy_plan_indicator: boolean;
    bpd_limitation_indicator: boolean;
  };
  frozen_benefit_support_packet?: {
    freeze_basis_note: string;
    frozen_accrual_date: NullableDate;
    frozen_benefit_support_source: string;
  };
};

export type CompensationResolutionValues = {
  compensation_resolved: number | null;
  average_compensation_resolved: number | null;
  covered_compensation_resolved: number | null;
};

export type CompensationResolutionOutput = {
  resolved_service_comp_output_id: string;
  calculation_run_id: string;
  case_id: string;
  subject_key: string;
  eligibility_service_resolved: number | null;
  vesting_service_resolved: number | null;
  benefit_service_resolved: number | null;
  accrual_service_resolved: number | null;
  compensation_resolved: number | null;
  average_compensation_resolved: number | null;
  covered_compensation_resolved: number | null;
};

export type RunCompensationResolutionRequest = {
  case_id: string;
  subject_type: CompensationSubjectType;
  subject_key: string;
  input_packet_id: string;
  rule_version: "0.1.0";
  deliverable_version: "0.1.0";
};

export type RunCompensationResolutionResult = {
  calculation_run_id: string;
  run_status: "completed" | "failed";
  resolved_service_comp_output_id?: string;
  warning_count: number;
  error_count: number;
  warnings: StructuredIssue[];
  errors: StructuredIssue[];
  output?: CompensationResolutionOutput;
  traces: ModuleTrace[];
};

export type CompensationResolutionFixture = {
  test_case_id: string;
  description: string;
  compensation_basis_code: string;
  average_compensation_rule: string;
  compensation_history_available_indicator: string;
  final_average_compensation: string;
  covered_compensation_amount: string;
  frozen_accrued_benefit_indicator: string;
  expected_compensation_resolved: string;
  expected_average_compensation_resolved: string;
  expected_covered_compensation_resolved: string;
};

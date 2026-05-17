import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";

export const SERVICE_RESOLUTION_MODULE_NAME = "service_resolution" as const;
export const SERVICE_RESOLUTION_MODULE_VERSION = "0.1.0" as const;

export type NullableDate = string | null;
export type ServiceSubjectType = "participant" | "beneficiary" | "alternate_payee";

export type ServiceResolutionPacket = {
  packet_type: "service_resolution";
  schema_version: "0.1.0";
  case_id: string;
  subject_type: ServiceSubjectType;
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
    participation_eligibility_rule: string;
    participation_date_rule: string;
    normal_retirement_eligibility_rule: string;
    early_unreduced_retirement_rule: string | null;
    early_reduced_retirement_rule: string;
    deferred_vested_normal_retirement_rule: string;
    deferred_vested_early_retirement_rule: string | null;
    eligibility_service_rule: string;
    vesting_service_rule: string;
    benefit_service_rule: string;
    accrued_benefit_formula: string;
    accrual_factor_rule: string;
    short_service_factor_rule: string | null;
    transfer_rule: string | null;
    one_year_break_in_service_rule: string | null;
  };
  participant_role_population: {
    bcv_rec_id: string;
    retstat: string;
    id: string;
    role_type: ServiceSubjectType;
    retirement_status_as_of_dopt: string | null;
  };
  service_employment_history: {
    doh: NullableDate;
    dop: NullableDate;
    dote: NullableDate;
    service_basis_code: string;
    service_hours_requirement: number;
    service_period_basis: string;
    plan_anniversary_service_basis: string;
  };
  actuarial_assumption_factor_set: {
    retirement_age_convention: string;
  };
  limitation_packet: {
    bankruptcy_plan_indicator: boolean;
    bpd_limitation_indicator: boolean;
    ongoing_employment_contingency_indicator: boolean;
  };
  frozen_accrual_packet?: {
    accrual_freeze_date: NullableDate;
    freeze_basis_note: string | null;
  };
};

export type ServiceResolutionOutput = {
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

export type ServiceResolutionValues = Omit<
  ServiceResolutionOutput,
  | "resolved_service_comp_output_id"
  | "calculation_run_id"
  | "case_id"
  | "subject_key"
  | "compensation_resolved"
  | "average_compensation_resolved"
  | "covered_compensation_resolved"
>;

export type RunServiceResolutionRequest = {
  case_id: string;
  subject_type: ServiceSubjectType;
  subject_key: string;
  input_packet_id: string;
  rule_version: "0.1.0";
  deliverable_version: "0.1.0";
};

export type RunServiceResolutionResult = {
  calculation_run_id: string;
  run_status: "completed" | "failed";
  resolved_service_comp_output_id?: string;
  warning_count: number;
  error_count: number;
  warnings: StructuredIssue[];
  errors: StructuredIssue[];
  output?: ServiceResolutionOutput;
  traces: ModuleTrace[];
};

export type ServiceResolutionFixture = {
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
  expected_eligibility_service: string;
  expected_vesting_service: string;
  expected_benefit_service: string;
  expected_accrual_service: string;
};

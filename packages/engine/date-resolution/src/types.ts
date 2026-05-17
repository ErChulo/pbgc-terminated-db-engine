import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";

export const DATE_RESOLUTION_MODULE_NAME = "date_resolution" as const;
export const DATE_RESOLUTION_MODULE_VERSION = "0.1.0" as const;

export type NullableDate = string | null;

export type DateResolutionPacket = {
  packet_type: "date_resolution";
  schema_version: "0.1.0";
  case_id: string;
  subject_type: "participant" | "beneficiary" | "alternate_payee";
  subject_key: string;
  case_plan_timeline: {
    case_id: string;
    plan_id: string;
    plan_anniversary: string;
    dopt: NullableDate;
    dotr: NullableDate;
    bpd: NullableDate;
  };
  resolved_plan_logic: {
    normal_retirement_eligibility_rule: string;
    normal_retirement_start_rule: string;
    early_unreduced_retirement_rule: string | null;
    early_reduced_retirement_rule: string;
    deferred_vested_normal_retirement_rule: string | null;
    deferred_vested_early_retirement_rule: string | null;
    late_retirement_rule: string | null;
    default_actuarial_equivalence_rule: string | null;
  };
  participant_role_population: {
    bcv_rec_id: string;
    retstat: string;
    id: string;
    role_type: "participant" | "beneficiary" | "alternate_payee";
    dob: NullableDate;
    sdob: NullableDate;
    dod: NullableDate;
    non_spouse_benf: boolean;
    retirement_status_as_of_dopt: string | null;
  };
  service_employment_history: {
    doh: NullableDate;
    dop: NullableDate;
    dote: NullableDate;
  };
  benefit_administration_state: {
    dor: NullableDate;
    asd: NullableDate;
    sbcd: NullableDate;
    current_pay_status: string | null;
  };
  actuarial_assumption_factor_set: {
    retirement_age_convention: string;
    required_beginning_date_method: string;
  };
  limitation_packet: {
    bankruptcy_plan_indicator: boolean;
    bpd_limitation_indicator: boolean;
    annuity_starting_date_limitation_indicator: boolean;
  };
};

export type DateResolutionOutput = {
  resolved_dates_output_id: string;
  calculation_run_id: string;
  case_id: string;
  subject_key: string;
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

export type DateResolutionValues = Omit<
  DateResolutionOutput,
  "resolved_dates_output_id" | "calculation_run_id" | "case_id" | "subject_key"
>;

export type RunDateResolutionRequest = {
  case_id: string;
  subject_type: DateResolutionPacket["subject_type"];
  subject_key: string;
  input_packet_id: string;
  rule_version: "0.1.0";
  deliverable_version: "0.1.0";
};

export type RunDateResolutionResult = {
  calculation_run_id: string;
  run_status: "completed" | "failed";
  resolved_dates_output_id?: string;
  warning_count: number;
  error_count: number;
  warnings: StructuredIssue[];
  errors: StructuredIssue[];
  output?: DateResolutionOutput;
  traces: ModuleTrace[];
};

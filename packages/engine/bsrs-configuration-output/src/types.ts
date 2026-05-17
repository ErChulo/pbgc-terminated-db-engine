import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";
import type { ValuationListingsFixture, ValuationListingsOutputPacket, ValuationListingsOutputRow } from "@pbgc/valuation-listings-output";

export const BSRS_CONFIGURATION_OUTPUT_MODULE_NAME = "bsrs_configuration_output" as const;
export const BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION = "0.1.0" as const;
export const BSRS_CONFIGURATION_OUTPUT_ADAPTER_VERSION = "0.1.0" as const;

export type BsrsSubjectType = "participant" | "beneficiary" | "alternate_payee";
export type BsrsStatementRowType = "participant" | "beneficiary" | "alternate_payee" | "survivor" | "suppressed";

export const BSRS_CONFIGURATION_OUTPUT_FIELDS = [
  "case_id",
  "plan_id",
  "bcv_rec_id",
  "custid",
  "retstat",
  "id",
  "calc_indicator",
  "calculation_context",
  "role_type",
  "fname",
  "lname",
  "sfname",
  "slname",
  "psex",
  "ssex",
  "mstat",
  "relation",
  "non_spouse_benf",
  "dob",
  "sdob",
  "dod",
  "doh",
  "dop",
  "dote",
  "dor",
  "asd",
  "sbcd",
  "nrd",
  "erd",
  "eurd",
  "eprd",
  "rbd",
  "xra",
  "xrd",
  "sxra",
  "current_form_code",
  "form_code_nsf",
  "form_code_nmf",
  "form_code_ptp",
  "form_code_ptp_qpsa",
  "form_code_death",
  "form_code_ard",
  "spc_ard",
  "mths_ard",
  "lev_mb_ard",
  "annuity_status_pay",
  "lsoption",
  "rettyp",
  "bs_ind",
  "br_ind",
  "ofa_indicator",
  "term_mb_nrd_nsf",
  "xrd_mb_term",
  "xrd_surv_mb_term",
  "xrd_mb_qpsa_term",
  "xrd_mb_title_iv",
  "xrd_mb_4022c",
  "current_payment_amount",
  "ls_term",
  "ls_qpsa",
  "pvmb_term",
  "pvmb_title_iv",
  "pvmb_4022c",
  "pvf_lev_ann",
  "pvf_lev_ls",
  "pvf_qpsa_ls",
  "statement_population_indicator",
  "statement_type_code",
  "statement_status_code",
  "benefit_effective_date_for_statement",
  "display_form_code",
  "display_monthly_amount",
  "display_survivor_amount",
  "display_lump_sum_amount",
  "recalculation_trigger_indicator",
  "recalculation_reason_code",
  "suppress_statement_indicator",
  "suppression_reason_code",
  "ce_track1",
  "ce_track2",
  "ce_track3",
  "ce_track4",
  "ce_track5",
  "ce_track6",
  "rule_trace_id",
  "calculation_run_id",
  "deliverable_version",
  "schema_version",
  "statement_row_type",
  "statement_sort_key",
  "bsrs_configuration_output_rule_trace",
  "bsrs_configuration_output_warning_flag",
  "bsrs_configuration_output_warning_note",
] as const;

export type BsrsConfigurationOutputFieldName = (typeof BSRS_CONFIGURATION_OUTPUT_FIELDS)[number];

export type BsrsConfigurationOutputRow = {
  case_id: string;
  plan_id: string;
  bcv_rec_id: string;
  custid: string;
  retstat: string;
  id: string;
  calc_indicator: string;
  calculation_context: string;
  role_type: BsrsSubjectType;
  fname: string;
  lname: string;
  sfname: string | null;
  slname: string | null;
  psex: string | null;
  ssex: string | null;
  mstat: string;
  relation: string | null;
  non_spouse_benf: boolean;
  dob: string | null;
  sdob: string | null;
  dod: string | null;
  doh: string | null;
  dop: string | null;
  dote: string | null;
  dor: string | null;
  asd: string | null;
  sbcd: string | null;
  nrd: string | null;
  erd: string | null;
  eurd: string | null;
  eprd: string | null;
  rbd: string | null;
  xra: number | null;
  xrd: string | null;
  sxra: number | null;
  current_form_code: string | null;
  form_code_nsf: string | null;
  form_code_nmf: string | null;
  form_code_ptp: string | null;
  form_code_ptp_qpsa: string | null;
  form_code_death: string | null;
  form_code_ard: string | null;
  spc_ard: string | null;
  mths_ard: number | null;
  lev_mb_ard: number | null;
  annuity_status_pay: string | null;
  lsoption: string | null;
  rettyp: string | null;
  bs_ind: string | null;
  br_ind: string | null;
  ofa_indicator: string | null;
  term_mb_nrd_nsf: number | null;
  xrd_mb_term: number | null;
  xrd_surv_mb_term: number | null;
  xrd_mb_qpsa_term: number | null;
  xrd_mb_title_iv: number | null;
  xrd_mb_4022c: number | null;
  current_payment_amount: number | null;
  ls_term: number | null;
  ls_qpsa: number | null;
  pvmb_term: number | null;
  pvmb_title_iv: number | null;
  pvmb_4022c: number | null;
  pvf_lev_ann: number | null;
  pvf_lev_ls: number | null;
  pvf_qpsa_ls: number | null;
  statement_population_indicator: string;
  statement_type_code: string;
  statement_status_code: string;
  benefit_effective_date_for_statement: string | null;
  display_form_code: string | null;
  display_monthly_amount: number | null;
  display_survivor_amount: number | null;
  display_lump_sum_amount: number | null;
  recalculation_trigger_indicator: string;
  recalculation_reason_code: string | null;
  suppress_statement_indicator: string;
  suppression_reason_code: string | null;
  ce_track1: string;
  ce_track2: string;
  ce_track3: string;
  ce_track4: string;
  ce_track5: string;
  ce_track6: string;
  rule_trace_id: string;
  calculation_run_id: string;
  deliverable_version: string;
  schema_version: string;
  statement_row_type: BsrsStatementRowType;
  statement_sort_key: string;
  bsrs_configuration_output_rule_trace: string;
  bsrs_configuration_output_warning_flag: boolean;
  bsrs_configuration_output_warning_note: string | null;
};

export type BsrsConfigurationOutputRecord = {
  bsrs_configuration_output_row_id: string;
  calculation_run_id: string;
  case_id: string;
  plan_id: string;
  subject_key: string;
  statement_row_type: BsrsStatementRowType;
  statement_sort_key: string;
  row_json: string;
  adapter_version: string;
};

export type BsrsConfigurationOutputMetadata = {
  case_id: string;
  plan_id: string;
  bcv_rec_id: string;
  calculation_run_id: string;
  deliverable_version: "0.1.0";
  adapter_version: typeof BSRS_CONFIGURATION_OUTPUT_ADAPTER_VERSION;
  statement_row_type: BsrsStatementRowType;
  statement_sort_key: string;
};

export type BsrsConfigurationOutputArtifact = {
  row: BsrsConfigurationOutputRow;
  metadata: BsrsConfigurationOutputMetadata;
  warnings: StructuredIssue[];
  traces: ModuleTrace[];
};

export type BsrsConfigurationOutputPacket = {
  packet_type: "bsrs_configuration_output";
  schema_version: "0.1.0";
  case_id: string;
  subject_type: BsrsSubjectType;
  subject_key: string;
  statement_row_type: BsrsStatementRowType;
  statement_sort_key: string;
  case_plan_timeline: ValuationListingsOutputPacket["case_plan_timeline"] & { plan_name: string };
  participant_role_population: ValuationListingsOutputPacket["participant_role_population"];
  service_employment_history: ValuationListingsOutputPacket["service_employment_history"];
  benefit_administration_state: ValuationListingsOutputPacket["benefit_administration_state"] & { current_monthly_benefit?: number | null; last_payment_date?: string | null };
  limitation_packet: ValuationListingsOutputPacket["limitation_packet"];
  resolved_dates: ValuationListingsOutputPacket["resolved_dates"];
  resolved_service_compensation: ValuationListingsOutputPacket["resolved_service_compensation"];
  resolved_forms_status: ValuationListingsOutputPacket["resolved_forms_status"] & {
    form_code_ard?: string | null;
    spc_ard?: string | null;
    mths_ard?: number | null;
    lev_mb_ard?: number | null;
  };
  benefit_kernel_output: ValuationListingsOutputPacket["benefit_kernel_output"];
  v1_ve_output_row: ValuationListingsOutputPacket["v1_ve_output_row"];
  valuation_listings_output_row: ValuationListingsOutputRow;
  in_pay_packet?: {
    form_code_ard: string;
    spc_ard: string;
    mths_ard: number;
    lev_mb_ard: number;
    current_monthly_benefit: number | null;
    last_payment_date: string | null;
  };
  qdro_packet?: {
    qdro_type: string;
    separate_interest_indicator: boolean;
    alternate_payee_name: string;
    alternate_payee_dob: string | null;
    qdro_effective_date: string | null;
  };
  qpsa_packet?: {
    qpsa_survivor_percentage: number;
    qpsa_commencement_date: string | null;
    qpsa_form_rule: string;
  };
  death_benefit_packet?: {
    survivor_type: string;
    survivor_asd: string | null;
    death_benefit_form: string;
    death_benefit_amount: number | null;
  };
  bsrs_projection_override_packet?: {
    output_field_name: string;
    override_value: string;
    override_note: string;
  };
  trace_inputs: {
    ce_track1: string;
    ce_track2: string;
    ce_track3: string;
    ce_track4: string;
    ce_track5: string;
    ce_track6: string;
    rule_trace_id: string;
    calculation_run_id: string;
    deliverable_version: "0.1.0";
    schema_version: "0.1.0";
  };
};

export type BsrsConfigurationOutputRequest = {
  case_id: string;
  subject_type: BsrsSubjectType;
  subject_key: string;
  input_packet_id: string;
  rule_version: "0.1.0";
  deliverable_version: "0.1.0";
};

export type BsrsConfigurationOutputResult = {
  calculation_run_id: string;
  run_status: "completed" | "failed";
  bsrs_configuration_output_row_id?: string;
  warning_count: number;
  error_count: number;
  warnings: StructuredIssue[];
  errors: StructuredIssue[];
  output?: BsrsConfigurationOutputArtifact;
  traces: ModuleTrace[];
};

export type BsrsConfigurationFixture = {
  test_case_id: string;
  description: string;
  statement_row_type?: BsrsStatementRowType;
  valuation_fixture: ValuationListingsFixture;
};

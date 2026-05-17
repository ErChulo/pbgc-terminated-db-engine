export type RunStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type StructuredIssue = {
  code: string;
  message: string;
  field_name?: string;
  input_group?: string;
  input_packet_id?: string;
  module_name: "date_resolution" | "service_resolution";
  rule_version: string;
};

export type TraceInputField = {
  group: string;
  field: string;
  value: string | number | boolean | null;
};

export type ModuleTrace = {
  module_trace_id: string;
  calculation_run_id: string;
  module_name: "date_resolution" | "service_resolution";
  subject_key: string;
  field_name: string;
  rule_applied: string;
  input_fields_used_json: string;
  intermediate_values_json: string;
  output_value: string | null;
  warning_note: string | null;
};

export type EngineRunRecord = {
  calculation_run_id: string;
  case_id: string;
  input_packet_id: string | null;
  rule_version: string;
  deliverable_version: string;
  run_context: string | null;
  started_at: string;
  completed_at: string | null;
  run_status: RunStatus;
  warning_count: number;
  error_count: number;
};

export type DeterministicResult<T> =
  | { ok: true; value: T; warnings: StructuredIssue[] }
  | { ok: false; errors: StructuredIssue[]; warnings: StructuredIssue[] };

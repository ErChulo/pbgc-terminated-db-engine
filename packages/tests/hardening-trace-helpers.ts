import type { Database } from "sql.js";
import type { ModuleTrace } from "@pbgc/shared";
import { listModuleTraces } from "@pbgc/db";

export type HardeningTraceRecord = {
  module_trace_id: string;
  calculation_run_id: string;
  module_name: string;
  subject_key: string;
  field_name: string;
  rule_applied: string;
  input_fields_used_json: string;
  intermediate_values_json: string;
  output_value: string | null;
  warning_note: string | null;
};

/**
 * Fetches all module traces for a given run/module and normalizes them
 * for comparison (drops IDs that vary between runs).
 */
export function fetchNormalizedTraces(
  db: Database,
  calculationRunId: string,
  moduleName: "benefit_kernel" | "v1_ve_output" | "valuation_listings_output" | "bsrs_configuration_output",
): Omit<HardeningTraceRecord, "module_trace_id" | "calculation_run_id">[] {
  const traces = listModuleTraces(db, calculationRunId, moduleName as unknown as ModuleTrace["module_name"]) as HardeningTraceRecord[];
  return traces.map((t) => ({
    module_name: t.module_name,
    subject_key: t.subject_key,
    field_name: t.field_name,
    rule_applied: t.rule_applied,
    input_fields_used_json: t.input_fields_used_json,
    intermediate_values_json: t.intermediate_values_json,
    output_value: t.output_value,
    warning_note: t.warning_note,
  }));
}

/**
 * Asserts that two trace sets are equivalent (same fields, same values)
 * regardless of trace ID or calculation run ID.
 */
export function expectTracesEquivalent(
  tracesA: Omit<HardeningTraceRecord, "module_trace_id" | "calculation_run_id">[],
  tracesB: Omit<HardeningTraceRecord, "module_trace_id" | "calculation_run_id">[],
): void {
  if (tracesA.length !== tracesB.length) {
    throw new Error(`Trace count mismatch: ${tracesA.length} vs ${tracesB.length}`);
  }

  const sortKey = (t: typeof tracesA[0]) =>
    `${t.field_name}|${t.rule_applied}|${t.input_fields_used_json}|${t.output_value ?? "null"}|${t.warning_note ?? "null"}`;

  const sortedA = [...tracesA].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  const sortedB = [...tracesB].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  for (let i = 0; i < sortedA.length; i++) {
    if (sortKey(sortedA[i]) !== sortKey(sortedB[i])) {
      throw new Error(`Trace mismatch at index ${i}: field "${sortedA[i].field_name}" vs "${sortedB[i].field_name}"`);
    }
  }
}

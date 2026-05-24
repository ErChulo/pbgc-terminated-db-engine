import { buildBsrsConfigurationPacketFromFixture, resolveBsrsConfigurationOutput } from "@pbgc/bsrs-configuration-output";
import {
  buildEvidenceForInventory,
  buildEvidenceForValueInventory,
  reconcileSharedFacts,
  reconcileSharedValues,
  type ReconciliationComparison,
  type ReconciliationSliceName,
  type ReconciliationStatus,
  type ValueComparisonRecord,
} from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "../../../../packages/tests/bsrs-configuration-output-fixtures";

export type WorkbenchStatus = "agreement" | "drift" | "warning" | "nullable" | "unsupported" | "formatting-only";
export type WorkbenchStatusFilterValue = "all" | WorkbenchStatus;

export type WorkbenchFilterOption = {
  value: WorkbenchStatusFilterValue;
  label: string;
  kind: "status";
  ordering_key: string;
  row_count: number;
};

export type WorkbenchStatusFilterState = {
  value: WorkbenchStatusFilterValue;
  label: string;
};

export type WorkbenchDisplayField = {
  field_name: string;
  display_label: string;
  value: string;
  is_null: boolean;
};

export type WorkbenchOutputPanel = {
  slice_name: ReconciliationSliceName;
  panel_label: string;
  case_id: string;
  row_identity: string;
  fields: WorkbenchDisplayField[];
  warnings: string[];
  trace_count: number;
};

export type WorkbenchSampleContext = {
  sample_id: string;
  sample_label: string;
  fixed_sample_label: string;
  selector_label: string;
  artifact_basis: string;
  mock_case_label: string;
  mock_population_label: string;
  no_real_person_data_notice: string;
  generated_at: string;
};

export type ApprovedSampleOption = {
  sample_id: string;
  sample_label: string;
  selector_label: string;
  artifact_basis: string;
  mock_case_label: string;
  mock_population_label: string;
  ordering_key: string;
  is_default: boolean;
};

export type WorkbenchTraceCue = {
  left_source_path: string;
  right_source_path: string;
  rule_version: string;
  producing_module: string;
};

export type WorkbenchTraceDetail = {
  control_id: string;
  row_kind: "reconciliation" | "shared_fact" | "shared_value";
  row_label: string;
  collapsed_label: string;
  compared_sources: [ReconciliationSliceName, ReconciliationSliceName];
  compared_fields: [string, string];
  raw_values: [string, string];
  normalized_values: [string, string];
  status: WorkbenchStatus;
  severity_label: string;
  mapping_basis: string;
  source_paths: [string, string];
  rule_version: string;
  producing_module: string;
  stable_evidence_basis: string;
};

export type WorkbenchSharedFactRow = {
  comparison_id: string;
  fact_label: string;
  status: WorkbenchStatus;
  severity_label: string;
  left_source: ReconciliationSliceName;
  left_field: string;
  left_value: string;
  right_source: ReconciliationSliceName;
  right_field: string;
  right_value: string;
  mapping_basis: string;
  ordering_key: string;
  trace: WorkbenchTraceCue;
  trace_detail: WorkbenchTraceDetail;
};

export type WorkbenchSharedValueRow = {
  comparison_id: string;
  value_label: string;
  status: WorkbenchStatus;
  severity: "info" | "warning" | "error";
  severity_label: string;
  left_source: ReconciliationSliceName;
  left_field: string;
  left_value: string;
  left_normalized_value: string;
  right_source: ReconciliationSliceName;
  right_field: string;
  right_value: string;
  right_normalized_value: string;
  mapping_basis: string;
  required_or_nullable_basis: string;
  normalization_basis: string;
  ordering_key: string;
  trace: WorkbenchTraceCue;
  trace_detail: WorkbenchTraceDetail;
};

export type WorkbenchReconciliationRow = {
  comparison_id: string;
  rule_key: string;
  status: WorkbenchStatus;
  severity: "info" | "warning" | "error";
  canonical_semantic_name: string;
  compared_slices: [ReconciliationSliceName, ReconciliationSliceName];
  compared_fields: [string, string];
  compared_values: [string, string];
  normalized_values: [string, string];
  mapping_basis: string;
  source_paths: [string, string];
  trace: WorkbenchTraceCue;
  trace_detail: WorkbenchTraceDetail;
};

export type WorkbenchFilteredRowGroup<Row> = {
  group_name: string;
  active_status: WorkbenchStatusFilterValue;
  rows: Row[];
  empty_state: string | null;
  visible_count: number;
  unfiltered_count: number;
};

export type WorkbenchFilterSummary = {
  selected_sample_id: string;
  active_status: WorkbenchStatusFilterState;
  visible_counts: {
    reconciliation: number;
    shared_facts: number;
    shared_values: number;
  };
  unfiltered_counts: {
    reconciliation: number;
    shared_facts: number;
    shared_values: number;
  };
};

export type ReconciliationWorkbenchState = {
  sample_id: string;
  sample_label: string;
  case_id: string;
  plan_id: string;
  generated_at: string;
  sample_options: ApprovedSampleOption[];
  selected_sample: ApprovedSampleOption;
  sample_context: WorkbenchSampleContext;
  output_panels: WorkbenchOutputPanel[];
  shared_fact_rows: WorkbenchSharedFactRow[];
  shared_value_rows: WorkbenchSharedValueRow[];
  reconciliation_rows: WorkbenchReconciliationRow[];
  status_filter: WorkbenchStatusFilterState;
  status_filter_options: WorkbenchFilterOption[];
  filtered_shared_fact_rows: WorkbenchSharedFactRow[];
  filtered_shared_value_rows: WorkbenchSharedValueRow[];
  filtered_reconciliation_rows: WorkbenchReconciliationRow[];
  filtered_row_groups: {
    shared_facts: WorkbenchFilteredRowGroup<WorkbenchSharedFactRow>;
    shared_values: WorkbenchFilteredRowGroup<WorkbenchSharedValueRow>;
    reconciliation: WorkbenchFilteredRowGroup<WorkbenchReconciliationRow>;
  };
  filter_summary: WorkbenchFilterSummary;
  findings: WorkbenchReconciliationRow[];
};

const MOCK_CASE_LABEL = "Mock case context: simulated PBGC terminated DB case";
const MOCK_POPULATION_LABEL = "Mock population context: simulated participant cohort";
const NO_REAL_PERSON_DATA_NOTICE =
  "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is used on this workbench.";
const HIDDEN_SHARED_FACT_KEYS = new Set(["participant_identifier.bcv_rec_id"]);
const APPROVED_SAMPLE_SOURCE_PATH = "packages/tests/bsrs-configuration-output-fixtures.ts";

const PANEL_FIELDS = {
  bsrs_configuration_output: ["id", "retstat", "form_code_nsf", "xra", "current_payment_amount"],
  v1_ve_output: ["id", "retstat", "form_code_nsf", "xra", "term_mb_nrd_nsf"],
  valuation_listings_output: ["id", "retstat", "form_code_nsf", "xra", "current_payment_amount"],
} as const satisfies Record<ReconciliationSliceName, readonly string[]>;

const PANEL_LABELS = {
  bsrs_configuration_output: "BSRS Configuration",
  v1_ve_output: "V1/VE Output",
  valuation_listings_output: "Valuation Listings",
} as const satisfies Record<ReconciliationSliceName, string>;

const STATUS_ORDER: WorkbenchStatus[] = ["agreement", "drift", "warning", "nullable", "unsupported", "formatting-only"];

export function buildApprovedSampleReconciliationWorkbench(
  options: { sample_id?: string; status_filter?: WorkbenchStatusFilterValue } = {},
): ReconciliationWorkbenchState {
  const fixtures = parseBsrsConfigurationFixtures();
  const sampleOptions = buildApprovedSampleOptions(fixtures);
  const selectedSample = resolveSelectedSample(sampleOptions, options.sample_id);
  const fixture = fixtures.find((candidate) => candidate.test_case_id === selectedSample.sample_id);
  if (!fixture) throw new Error("Missing approved BSRS configuration fixture");

  const packet = buildBsrsConfigurationPacketFromFixture(fixture);
  const bsrs = resolveBsrsConfigurationOutput(packet, `packet-${fixture.test_case_id}`, "0.1.0");
  const outputRows = {
    bsrs_configuration_output: bsrs.row,
    v1_ve_output: packet.v1_ve_output_row,
    valuation_listings_output: packet.valuation_listings_output_row,
  };

  const sharedFactEvidence = [
    ...buildEvidenceForInventory({
      case_id: packet.case_id,
      slice: "bsrs_configuration_output",
      row: outputRows.bsrs_configuration_output,
      source_path: "packages/tests/bsrs-configuration-output-fixtures.ts",
    }),
    ...buildEvidenceForInventory({
      case_id: packet.case_id,
      slice: "v1_ve_output",
      row: outputRows.v1_ve_output,
      source_path: "packages/tests/v1-ve-output-fixtures.ts",
    }),
    ...buildEvidenceForInventory({
      case_id: packet.case_id,
      slice: "valuation_listings_output",
      row: outputRows.valuation_listings_output,
      source_path: "packages/tests/valuation-listings-output-fixtures.ts",
    }),
  ];
  const valueEvidence = [
    ...buildEvidenceForValueInventory({
      case_id: packet.case_id,
      slice: "bsrs_configuration_output",
      row: outputRows.bsrs_configuration_output,
      source_path: "packages/tests/bsrs-configuration-output-fixtures.ts",
    }),
    ...buildEvidenceForValueInventory({
      case_id: packet.case_id,
      slice: "v1_ve_output",
      row: outputRows.v1_ve_output,
      source_path: "packages/tests/v1-ve-output-fixtures.ts",
    }),
    ...buildEvidenceForValueInventory({
      case_id: packet.case_id,
      slice: "valuation_listings_output",
      row: outputRows.valuation_listings_output,
      source_path: "packages/tests/valuation-listings-output-fixtures.ts",
    }),
  ];
  const sharedFacts = reconcileSharedFacts({ evidence: sharedFactEvidence });
  const reconciliation = reconcileSharedValues({ evidence: valueEvidence });
  const sharedFactRows = sharedFacts.comparisons
    .filter((comparison) => !HIDDEN_SHARED_FACT_KEYS.has(comparison.fact_key))
    .map(toWorkbenchSharedFactRow)
    .sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));
  const sharedValueRows = reconciliation.comparisons
    .map(toWorkbenchSharedValueRow)
    .sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));
  const reconciliationRows = reconciliation.comparisons.map(toWorkbenchReconciliationRow);
  const statusOptions = buildStatusFilterOptions({
    sharedFactRows,
    sharedValueRows,
    reconciliationRows,
  });
  const activeStatus = resolveStatusFilter(options.status_filter, statusOptions);
  const filteredRowGroups = buildFilteredRowGroups({
    activeStatus: activeStatus.value,
    sharedFactRows,
    sharedValueRows,
    reconciliationRows,
  });

  const generatedAt = selectedSample.artifact_basis;
  return {
    sample_id: fixture.test_case_id,
    sample_label: fixture.description,
    case_id: packet.case_id,
    plan_id: bsrs.row.plan_id,
    generated_at: generatedAt,
    sample_options: sampleOptions,
    selected_sample: selectedSample,
    sample_context: {
      sample_id: fixture.test_case_id,
      sample_label: fixture.description,
      fixed_sample_label:
        sampleOptions.length === 1 ? `Fixed approved sample: ${selectedSample.sample_id}` : `Selected approved sample: ${selectedSample.sample_id}`,
      selector_label: selectedSample.selector_label,
      artifact_basis: selectedSample.artifact_basis,
      mock_case_label: selectedSample.mock_case_label,
      mock_population_label: selectedSample.mock_population_label,
      no_real_person_data_notice: NO_REAL_PERSON_DATA_NOTICE,
      generated_at: generatedAt,
    },
    output_panels: (Object.keys(PANEL_LABELS) as ReconciliationSliceName[]).map((sliceName) =>
      buildOutputPanel(sliceName, packet.case_id, outputRows[sliceName], bsrs.warnings.map((warning) => warning.message)),
    ),
    shared_fact_rows: sharedFactRows,
    shared_value_rows: sharedValueRows,
    reconciliation_rows: reconciliationRows,
    status_filter: activeStatus,
    status_filter_options: statusOptions,
    filtered_shared_fact_rows: filteredRowGroups.shared_facts.rows,
    filtered_shared_value_rows: filteredRowGroups.shared_values.rows,
    filtered_reconciliation_rows: filteredRowGroups.reconciliation.rows,
    filtered_row_groups: filteredRowGroups,
    filter_summary: {
      selected_sample_id: fixture.test_case_id,
      active_status: activeStatus,
      visible_counts: {
        reconciliation: filteredRowGroups.reconciliation.visible_count,
        shared_facts: filteredRowGroups.shared_facts.visible_count,
        shared_values: filteredRowGroups.shared_values.visible_count,
      },
      unfiltered_counts: {
        reconciliation: filteredRowGroups.reconciliation.unfiltered_count,
        shared_facts: filteredRowGroups.shared_facts.unfiltered_count,
        shared_values: filteredRowGroups.shared_values.unfiltered_count,
      },
    },
    findings: reconciliationRows.filter((row) => row.status === "drift" || row.status === "warning"),
  };
}

function buildStatusFilterOptions(args: {
  sharedFactRows: WorkbenchSharedFactRow[];
  sharedValueRows: WorkbenchSharedValueRow[];
  reconciliationRows: WorkbenchReconciliationRow[];
}): WorkbenchFilterOption[] {
  const rows = [...args.sharedFactRows, ...args.sharedValueRows, ...args.reconciliationRows];
  const counts = new Map<WorkbenchStatus, number>();
  rows.forEach((row) => counts.set(row.status, (counts.get(row.status) ?? 0) + 1));
  return [
    {
      value: "all",
      label: "All statuses",
      kind: "status",
      ordering_key: "000000|all",
      row_count: rows.length,
    },
    ...STATUS_ORDER.filter((status) => counts.has(status)).map((status, index) => ({
      value: status,
      label: formatStatusLabel(status),
      kind: "status" as const,
      ordering_key: `${String(index + 1).padStart(6, "0")}|${status}`,
      row_count: counts.get(status) ?? 0,
    })),
  ];
}

function resolveStatusFilter(
  requested: WorkbenchStatusFilterValue | undefined,
  statusOptions: WorkbenchFilterOption[],
): WorkbenchStatusFilterState {
  const selected = statusOptions.find((option) => option.value === (requested ?? "all")) ?? statusOptions[0];
  return {
    value: selected.value,
    label: selected.label,
  };
}

function buildFilteredRowGroups(args: {
  activeStatus: WorkbenchStatusFilterValue;
  sharedFactRows: WorkbenchSharedFactRow[];
  sharedValueRows: WorkbenchSharedValueRow[];
  reconciliationRows: WorkbenchReconciliationRow[];
}): ReconciliationWorkbenchState["filtered_row_groups"] {
  return {
    shared_facts: buildFilteredRowGroup("Shared Facts", args.sharedFactRows, args.activeStatus),
    shared_values: buildFilteredRowGroup("Shared Values", args.sharedValueRows, args.activeStatus),
    reconciliation: buildFilteredRowGroup("Reconciliation", args.reconciliationRows, args.activeStatus),
  };
}

function buildFilteredRowGroup<Row extends { status: WorkbenchStatus }>(
  groupName: string,
  rows: Row[],
  activeStatus: WorkbenchStatusFilterValue,
): WorkbenchFilteredRowGroup<Row> {
  const filteredRows = activeStatus === "all" ? rows : rows.filter((row) => row.status === activeStatus);
  return {
    group_name: groupName,
    active_status: activeStatus,
    rows: filteredRows,
    empty_state:
      filteredRows.length === 0 && activeStatus !== "all" ? `No ${groupName} rows match status ${formatStatusLabel(activeStatus)}.` : null,
    visible_count: filteredRows.length,
    unfiltered_count: rows.length,
  };
}

function buildApprovedSampleOptions(fixtures: ReturnType<typeof parseBsrsConfigurationFixtures>): ApprovedSampleOption[] {
  return fixtures
    .map((fixture, index) => ({
      sample_id: fixture.test_case_id,
      sample_label: fixture.description,
      selector_label: `${fixture.test_case_id} - ${fixture.description}`,
      artifact_basis: `source:${APPROVED_SAMPLE_SOURCE_PATH}#${fixture.test_case_id}`,
      mock_case_label: MOCK_CASE_LABEL,
      mock_population_label: MOCK_POPULATION_LABEL,
      ordering_key: `${String(index + 1).padStart(6, "0")}|${fixture.test_case_id}`,
      is_default: index === 0,
    }))
    .sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));
}

function resolveSelectedSample(sampleOptions: ApprovedSampleOption[], requestedSampleId: string | undefined): ApprovedSampleOption {
  const defaultSample = sampleOptions.find((sample) => sample.is_default) ?? sampleOptions[0];
  if (!defaultSample) throw new Error("Missing approved BSRS sample option");
  if (!requestedSampleId) return defaultSample;
  return sampleOptions.find((sample) => sample.sample_id === requestedSampleId) ?? defaultSample;
}

function buildOutputPanel(
  sliceName: ReconciliationSliceName,
  caseId: string,
  row: Record<string, string | number | boolean | null | undefined>,
  bsrsWarnings: string[],
): WorkbenchOutputPanel {
  return {
    slice_name: sliceName,
    panel_label: PANEL_LABELS[sliceName],
    case_id: caseId,
    row_identity: String(row.id ?? row.bcv_rec_id ?? caseId),
    fields: PANEL_FIELDS[sliceName].map((fieldName) => ({
      field_name: fieldName,
      display_label: fieldName,
      value: formatValue(row[fieldName] ?? null),
      is_null: row[fieldName] === null || row[fieldName] === undefined,
    })),
    warnings: sliceName === "bsrs_configuration_output" ? bsrsWarnings : [],
    trace_count: PANEL_FIELDS[sliceName].length,
  };
}

function toWorkbenchSharedFactRow(comparison: ReconciliationComparison): WorkbenchSharedFactRow {
  const row = {
    comparison_id: comparison.comparison_id,
    fact_label: comparison.canonical_semantic_name,
    status: mapSharedFactStatus(comparison.status),
    severity_label: comparison.status === "drift" ? "Error" : "None",
    left_source: comparison.left_slice,
    left_field: comparison.left_field,
    left_value: formatValue(comparison.left_value),
    right_source: comparison.right_slice,
    right_field: comparison.right_field,
    right_value: formatValue(comparison.right_value),
    mapping_basis: comparison.mapping_basis,
    ordering_key: `${comparison.fact_key}|${comparison.comparison_id}`,
    trace: {
      left_source_path: comparison.left_source_path,
      right_source_path: comparison.right_source_path,
      rule_version: comparison.rule_version,
      producing_module: comparison.producing_module,
    },
  };
  return {
    ...row,
    trace_detail: buildTraceDetail({
      row_id: row.comparison_id,
      row_kind: "shared_fact",
      row_label: row.fact_label,
      compared_sources: [row.left_source, row.right_source],
      compared_fields: [row.left_field, row.right_field],
      raw_values: [row.left_value, row.right_value],
      normalized_values: [ABSENCE_MARKER, ABSENCE_MARKER],
      status: row.status,
      severity_label: row.severity_label,
      mapping_basis: row.mapping_basis,
      source_paths: [row.trace.left_source_path, row.trace.right_source_path],
      trace: row.trace,
      stable_evidence_basis: row.ordering_key,
    }),
  };
}

function toWorkbenchReconciliationRow(comparison: ValueComparisonRecord): WorkbenchReconciliationRow {
  const compared_slices: [ReconciliationSliceName, ReconciliationSliceName] = [comparison.left_slice, comparison.right_slice];
  const compared_fields: [string, string] = [comparison.left_field, comparison.right_field];
  const compared_values: [string, string] = [formatValue(comparison.left_value), formatValue(comparison.right_value)];
  const normalized_values: [string, string] = [
    formatOptionalValue(comparison.left_normalized_value),
    formatOptionalValue(comparison.right_normalized_value),
  ];
  const source_paths: [string, string] = [comparison.left_source_path, comparison.right_source_path];
  const row = {
    comparison_id: comparison.comparison_id,
    rule_key: comparison.rule_key,
    status: mapStatus(comparison.status),
    severity: comparison.severity,
    canonical_semantic_name: comparison.canonical_semantic_name,
    compared_slices,
    compared_fields,
    compared_values,
    normalized_values,
    mapping_basis: comparison.mapping_basis,
    source_paths,
    trace: {
      left_source_path: comparison.left_source_path,
      right_source_path: comparison.right_source_path,
      rule_version: comparison.rule_version,
      producing_module: comparison.producing_module,
    },
  };
  return {
    ...row,
    trace_detail: buildTraceDetail({
      row_id: row.comparison_id,
      row_kind: "reconciliation",
      row_label: row.canonical_semantic_name,
      compared_sources: row.compared_slices,
      compared_fields: row.compared_fields,
      raw_values: row.compared_values,
      normalized_values: row.normalized_values,
      status: row.status,
      severity_label: formatSeverity(row.severity),
      mapping_basis: row.mapping_basis,
      source_paths: row.source_paths,
      trace: row.trace,
      stable_evidence_basis: row.rule_key,
    }),
  };
}

function toWorkbenchSharedValueRow(comparison: ValueComparisonRecord): WorkbenchSharedValueRow {
  const row = {
    comparison_id: comparison.comparison_id,
    value_label: comparison.canonical_semantic_name,
    status: mapStatus(comparison.status),
    severity: comparison.severity,
    severity_label: formatSeverity(comparison.severity),
    left_source: comparison.left_slice,
    left_field: comparison.left_field,
    left_value: formatValue(comparison.left_value),
    left_normalized_value: formatOptionalValue(comparison.left_normalized_value),
    right_source: comparison.right_slice,
    right_field: comparison.right_field,
    right_value: formatValue(comparison.right_value),
    right_normalized_value: formatOptionalValue(comparison.right_normalized_value),
    mapping_basis: comparison.mapping_basis,
    required_or_nullable_basis: comparison.required_or_nullable_basis,
    normalization_basis: comparison.normalization_basis,
    ordering_key: `${comparison.rule_key}|${comparison.comparison_id}`,
    trace: {
      left_source_path: comparison.left_source_path,
      right_source_path: comparison.right_source_path,
      rule_version: comparison.rule_version,
      producing_module: comparison.producing_module,
    },
  };
  return {
    ...row,
    trace_detail: buildTraceDetail({
      row_id: row.comparison_id,
      row_kind: "shared_value",
      row_label: row.value_label,
      compared_sources: [row.left_source, row.right_source],
      compared_fields: [row.left_field, row.right_field],
      raw_values: [row.left_value, row.right_value],
      normalized_values: [row.left_normalized_value, row.right_normalized_value],
      status: row.status,
      severity_label: row.severity_label,
      mapping_basis: row.mapping_basis,
      source_paths: [row.trace.left_source_path, row.trace.right_source_path],
      trace: row.trace,
      stable_evidence_basis: row.ordering_key,
    }),
  };
}

const ABSENCE_MARKER = "Not applicable";

function buildTraceDetail(args: {
  row_id: string;
  row_kind: WorkbenchTraceDetail["row_kind"];
  row_label: string;
  compared_sources: [ReconciliationSliceName, ReconciliationSliceName];
  compared_fields: [string, string];
  raw_values: [string, string];
  normalized_values: [string, string];
  status: WorkbenchStatus;
  severity_label: string;
  mapping_basis: string;
  source_paths: [string, string];
  trace: WorkbenchTraceCue;
  stable_evidence_basis: string;
}): WorkbenchTraceDetail {
  return {
    control_id: `trace-${args.row_kind}-${args.row_id}`,
    row_kind: args.row_kind,
    row_label: args.row_label,
    collapsed_label: `Trace details for ${args.row_label}`,
    compared_sources: args.compared_sources,
    compared_fields: args.compared_fields,
    raw_values: args.raw_values,
    normalized_values: args.normalized_values,
    status: args.status,
    severity_label: args.severity_label,
    mapping_basis: args.mapping_basis || ABSENCE_MARKER,
    source_paths: [formatOptionalText(args.source_paths[0]), formatOptionalText(args.source_paths[1])],
    rule_version: formatOptionalText(args.trace.rule_version),
    producing_module: formatOptionalText(args.trace.producing_module),
    stable_evidence_basis: args.stable_evidence_basis,
  };
}

function mapSharedFactStatus(status: ReconciliationStatus): WorkbenchStatus {
  if (status === "accepted") return "agreement";
  if (status === "drift") return "drift";
  if (status === "absent_optional") return "nullable";
  if (status === "formatting_only") return "formatting-only";
  return "unsupported";
}

function mapStatus(status: ValueComparisonRecord["status"]): WorkbenchStatus {
  if (status === "accepted") return "agreement";
  if (status === "blocking_mismatch") return "drift";
  if (status === "non_blocking_warning") return "warning";
  if (status === "accepted_nullable") return "nullable";
  if (status === "formatting_only") return "formatting-only";
  return "unsupported";
}

function formatSeverity(severity: "info" | "warning" | "error"): string {
  if (severity === "error") return "Error";
  if (severity === "warning") return "Warning";
  return "Info";
}

function formatStatusLabel(status: WorkbenchStatus): string {
  return status
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatValue(value: string | number | boolean | null): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function formatOptionalValue(value: string | number | boolean | null): string {
  return value === null ? ABSENCE_MARKER : formatValue(value);
}

function formatOptionalText(value: string | null | undefined): string {
  return value ? value : ABSENCE_MARKER;
}

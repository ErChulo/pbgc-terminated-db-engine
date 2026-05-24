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
  mock_case_label: string;
  mock_population_label: string;
  no_real_person_data_notice: string;
  generated_at: string;
};

export type WorkbenchTraceCue = {
  left_source_path: string;
  right_source_path: string;
  rule_version: string;
  producing_module: string;
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
};

export type ReconciliationWorkbenchState = {
  sample_id: string;
  sample_label: string;
  case_id: string;
  plan_id: string;
  generated_at: string;
  sample_context: WorkbenchSampleContext;
  output_panels: WorkbenchOutputPanel[];
  shared_fact_rows: WorkbenchSharedFactRow[];
  shared_value_rows: WorkbenchSharedValueRow[];
  reconciliation_rows: WorkbenchReconciliationRow[];
  findings: WorkbenchReconciliationRow[];
};

const STABLE_GENERATED_AT = "source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001";
const FIXED_SAMPLE_LABEL = "Fixed approved sample: BSRS001";
const MOCK_CASE_LABEL = "Mock case context: simulated PBGC terminated DB case";
const MOCK_POPULATION_LABEL = "Mock population context: simulated participant cohort";
const NO_REAL_PERSON_DATA_NOTICE =
  "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is used on this workbench.";
const HIDDEN_SHARED_FACT_KEYS = new Set(["participant_identifier.bcv_rec_id"]);

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

export function buildApprovedSampleReconciliationWorkbench(): ReconciliationWorkbenchState {
  const fixture = parseBsrsConfigurationFixtures()[0];
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
  const sharedValueRows = reconciliation.comparisons
    .map(toWorkbenchSharedValueRow)
    .sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));
  const reconciliationRows = reconciliation.comparisons.map(toWorkbenchReconciliationRow);

  return {
    sample_id: fixture.test_case_id,
    sample_label: fixture.description,
    case_id: packet.case_id,
    plan_id: bsrs.row.plan_id,
    generated_at: STABLE_GENERATED_AT,
    sample_context: {
      sample_id: fixture.test_case_id,
      sample_label: fixture.description,
      fixed_sample_label: FIXED_SAMPLE_LABEL,
      mock_case_label: MOCK_CASE_LABEL,
      mock_population_label: MOCK_POPULATION_LABEL,
      no_real_person_data_notice: NO_REAL_PERSON_DATA_NOTICE,
      generated_at: STABLE_GENERATED_AT,
    },
    output_panels: (Object.keys(PANEL_LABELS) as ReconciliationSliceName[]).map((sliceName) =>
      buildOutputPanel(sliceName, packet.case_id, outputRows[sliceName], bsrs.warnings.map((warning) => warning.message)),
    ),
    shared_fact_rows: sharedFacts.comparisons
      .filter((comparison) => !HIDDEN_SHARED_FACT_KEYS.has(comparison.fact_key))
      .map(toWorkbenchSharedFactRow)
      .sort((left, right) => left.ordering_key.localeCompare(right.ordering_key)),
    shared_value_rows: sharedValueRows,
    reconciliation_rows: reconciliationRows,
    findings: reconciliationRows.filter((row) => row.status === "drift" || row.status === "warning"),
  };
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
  return {
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
}

function toWorkbenchReconciliationRow(comparison: ValueComparisonRecord): WorkbenchReconciliationRow {
  return {
    comparison_id: comparison.comparison_id,
    rule_key: comparison.rule_key,
    status: mapStatus(comparison.status),
    severity: comparison.severity,
    canonical_semantic_name: comparison.canonical_semantic_name,
    compared_slices: [comparison.left_slice, comparison.right_slice],
    compared_fields: [comparison.left_field, comparison.right_field],
    compared_values: [formatValue(comparison.left_value), formatValue(comparison.right_value)],
  };
}

function toWorkbenchSharedValueRow(comparison: ValueComparisonRecord): WorkbenchSharedValueRow {
  return {
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

function formatValue(value: string | number | boolean | null): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function formatOptionalValue(value: string | number | boolean | null): string {
  return value === null ? "Not applicable" : formatValue(value);
}

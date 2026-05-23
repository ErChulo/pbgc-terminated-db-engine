import { buildBsrsConfigurationPacketFromFixture, resolveBsrsConfigurationOutput } from "@pbgc/bsrs-configuration-output";
import {
  buildEvidenceForValueInventory,
  reconcileSharedValues,
  type ReconciliationSliceName,
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
  output_panels: WorkbenchOutputPanel[];
  reconciliation_rows: WorkbenchReconciliationRow[];
  findings: WorkbenchReconciliationRow[];
};

const STABLE_GENERATED_AT = "source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001";

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

  const evidence = [
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
  const reconciliation = reconcileSharedValues({ evidence });
  const reconciliationRows = reconciliation.comparisons.map(toWorkbenchReconciliationRow);

  return {
    sample_id: fixture.test_case_id,
    sample_label: fixture.description,
    case_id: packet.case_id,
    plan_id: bsrs.row.plan_id,
    generated_at: STABLE_GENERATED_AT,
    output_panels: (Object.keys(PANEL_LABELS) as ReconciliationSliceName[]).map((sliceName) =>
      buildOutputPanel(sliceName, packet.case_id, outputRows[sliceName], bsrs.warnings.map((warning) => warning.message)),
    ),
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

function mapStatus(status: ValueComparisonRecord["status"]): WorkbenchStatus {
  if (status === "accepted") return "agreement";
  if (status === "blocking_mismatch") return "drift";
  if (status === "non_blocking_warning") return "warning";
  if (status === "accepted_nullable") return "nullable";
  if (status === "formatting_only") return "formatting-only";
  return "unsupported";
}

function formatValue(value: string | number | boolean | null): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

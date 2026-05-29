import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildEvidenceForValueInventory,
  reconcileSharedValues,
  resetDeterminismForTests,
  SELECTED_SHARED_VALUE_INVENTORY,
  type ReconciliationEvidence,
  type ValueReconciliationRule,
} from "@pbgc/shared";
import { buildBsrsConfigurationPacketFromFixture, resolveBsrsConfigurationOutput } from "@pbgc/bsrs-configuration-output";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";
import { compareRepeatedRuns, expectExactKeys } from "./hardening-helpers";

const REPO_ROOT = process.cwd();

function buildCurrentOutputEvidence(): ReconciliationEvidence[] {
  resetDeterminismForTests();
  const bsrsPacket = buildBsrsConfigurationPacketFromFixture(parseBsrsConfigurationFixtures()[0]);
  const v1Row = bsrsPacket.v1_ve_output_row;
  const valuationRow = bsrsPacket.valuation_listings_output_row;
  const bsrsRow = resolveBsrsConfigurationOutput(bsrsPacket, "packet-BSRS001", "0.1.0").row;

  return [
    ...buildEvidenceForValueInventory({
      case_id: bsrsPacket.case_id,
      slice: "v1_ve_output",
      row: v1Row,
      source_path: "packages/tests/v1-ve-output-fixtures.ts",
    }),
    ...buildEvidenceForValueInventory({
      case_id: bsrsPacket.case_id,
      slice: "valuation_listings_output",
      row: valuationRow,
      source_path: "packages/tests/valuation-listings-output-fixtures.ts",
    }),
    ...buildEvidenceForValueInventory({
      case_id: bsrsPacket.case_id,
      slice: "bsrs_configuration_output",
      row: bsrsRow,
      source_path: "packages/tests/bsrs-configuration-output-fixtures.ts",
    }),
  ];
}

function withEvidenceValue(
  evidence: readonly ReconciliationEvidence[],
  slice: ReconciliationEvidence["slice"],
  field: string,
  value: string | number | boolean | null,
): ReconciliationEvidence[] {
  return evidence.map((item) => (item.slice === slice && item.field === field ? { ...item, value } : item));
}

describe("hardening cross-slice value reconciliation", () => {
  it("defines the MVP selected shared-value inventory across required value categories", () => {
    expect(SELECTED_SHARED_VALUE_INVENTORY.map((rule) => [rule.rule_key, rule.value_type])).toEqual([
      ["participant_identifier.id", "identifier"],
      ["form_reference.form_code_nsf", "form_code"],
      ["nullable_fact.current_payment_amount", "nullable"],
      ["numeric_value.xra", "numeric"],
      ["categorical_value.retstat", "categorical"],
    ]);
    for (const rule of SELECTED_SHARED_VALUE_INVENTORY) {
      expect(Object.keys(rule.fields_by_slice).length).toBeGreaterThanOrEqual(2);
      expect(rule.reviewed_fact_context).toContain("reviewed");
      expect(rule.required_or_nullable_basis.length).toBeGreaterThan(0);
      expect(rule.normalization_basis.length).toBeGreaterThan(0);
    }
  });

  it("accepts selected participant identifier, form, nullable, numeric, and categorical values across current output evidence", () => {
    const result = reconcileSharedValues({ evidence: buildCurrentOutputEvidence() });
    const statusByRule = new Map(result.comparisons.map((comparison) => [comparison.rule_key, comparison.status]));

    expect(statusByRule.get("participant_identifier.id")).toBe("accepted");
    expect(statusByRule.get("form_reference.form_code_nsf")).toBe("accepted");
    expect(statusByRule.get("nullable_fact.current_payment_amount")).toBe("accepted_nullable");
    expect(statusByRule.get("numeric_value.xra")).toBe("accepted");
    expect(statusByRule.get("categorical_value.retstat")).toBe("accepted");
    expect(result.findings).toEqual([]);
  });

  it("records DD-backed and approved fallback basis metadata before value comparison", () => {
    const result = reconcileSharedValues({ evidence: buildCurrentOutputEvidence() });
    const idComparison = result.comparisons.find((comparison) => comparison.rule_key === "participant_identifier.id");
    const nullableComparison = result.comparisons.find((comparison) => comparison.rule_key === "nullable_fact.current_payment_amount");

    expect(idComparison).toMatchObject({
      canonical_semantic_name: "ID",
      mapping_basis: "dd",
      dd_field_name: "ID",
      fallback_name: null,
      severity: "info",
      code: "CROSS_SLICE_VALUE_ACCEPTED",
    });
    expect(nullableComparison).toMatchObject({
      canonical_semantic_name: "current_payment_amount",
      mapping_basis: "approved_fallback",
      dd_field_name: null,
      fallback_name: "current_payment_amount",
      severity: "info",
      code: "CROSS_SLICE_VALUE_ACCEPTED_NULLABLE",
    });
  });

  it("emits severity-based structured drift findings with raw and normalized values", () => {
    const result = reconcileSharedValues({
      evidence: withEvidenceValue(buildCurrentOutputEvidence(), "valuation_listings_output", "xra", 99),
    });

    const finding = result.findings.find((item) => item.rule_key === "numeric_value.xra");
    expect(finding).toMatchObject({
      code: "CROSS_SLICE_VALUE_REQUIRED_MISMATCH",
      severity: "error",
      category: "cross_slice_value_reconciliation",
      value_type: "numeric",
      canonical_semantic_name: "XRA",
      mapping_basis: "dd",
      dd_field_name: "XRA",
      fallback_name: null,
      reviewed_fact_context: "reviewed expected retirement age value shared by output slices",
      rule_version: "0.1.0",
      producing_module: "cross_slice_reconciliation",
    });
    expect(finding?.compared_values).toEqual([65, 99]);
    expect(finding?.normalized_values).toEqual([65, 99]);
    expectExactKeys(finding ?? {}, [
      "canonical_semantic_name",
      "case_id",
      "category",
      "code",
      "compared_fields",
      "compared_slices",
      "compared_values",
      "dd_field_name",
      "fallback_name",
      "mapping_basis",
      "message",
      "normalization_basis",
      "normalized_values",
      "producing_module",
      "required_or_nullable_basis",
      "reviewed_fact_context",
      "rule_key",
      "rule_version",
      "severity",
      "source_paths",
      "value_type",
    ]);
  });

  it("classifies nullable value differences as non-blocking warnings with basis metadata", () => {
    const evidence = withEvidenceValue(
      withEvidenceValue(buildCurrentOutputEvidence(), "bsrs_configuration_output", "current_payment_amount", 41),
      "valuation_listings_output",
      "current_payment_amount",
      42,
    );
    const result = reconcileSharedValues({ evidence });

    const comparison = result.comparisons.find((item) => item.rule_key === "nullable_fact.current_payment_amount" && item.status === "non_blocking_warning");
    expect(comparison).toMatchObject({
      severity: "warning",
      code: "CROSS_SLICE_VALUE_WARNING_MISMATCH",
      mapping_basis: "approved_fallback",
      fallback_name: "current_payment_amount",
    });
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        rule_key: "nullable_fact.current_payment_amount",
        severity: "warning",
        code: "CROSS_SLICE_VALUE_WARNING_MISMATCH",
        required_or_nullable_basis: "nullable unless the participant is in current-pay status under current contracts",
      }),
    );
  });

  it("classifies required selected value differences as blocking mismatches (T025)", () => {
    // Change retstat (blocking_required_mismatch) across slices to trigger blocking finding
    const evidence = withEvidenceValue(
      withEvidenceValue(buildCurrentOutputEvidence(), "bsrs_configuration_output", "retstat", "1"),
      "valuation_listings_output",
      "retstat",
      "99",
    );
    const result = reconcileSharedValues({ evidence });

    const finding = result.findings.find((f) => f.rule_key === "categorical_value.retstat");
    expect(finding).toMatchObject({
      severity: "error",
      code: "CROSS_SLICE_VALUE_REQUIRED_MISMATCH",
      value_type: "categorical",
      canonical_semantic_name: "RETSTAT",
      required_or_nullable_basis: "required by current participant population contracts",
    });
  });

  it("classifies unsupported selected branches as unsupported rather than factual drift (T027)", () => {
    const retstatRule = SELECTED_SHARED_VALUE_INVENTORY.find((r) => r.rule_key === "categorical_value.retstat")!;
    const customInventory: ValueReconciliationRule[] = [
      {
        ...retstatRule,
        unsupported_branch_codes: ["99", "XX"],
      },
    ];

    const allEvidence = buildCurrentOutputEvidence();
    const evidence = withEvidenceValue(
      withEvidenceValue(allEvidence, "bsrs_configuration_output", "retstat", "99"),
      "valuation_listings_output",
      "retstat",
      "1",
    ).filter((e) => !(e.slice === "v1_ve_output" && e.field === "retstat"));
    const result = reconcileSharedValues({ evidence, inventory: customInventory });

    const unsupportedComparisons = result.comparisons.filter((c) => c.status === "unsupported");
    expect(unsupportedComparisons.length).toBeGreaterThanOrEqual(1);
    expect(unsupportedComparisons[0]).toMatchObject({
      code: "CROSS_SLICE_VALUE_UNSUPPORTED",
      severity: "info",
      rule_key: "categorical_value.retstat",
    });
    // Unsupported comparisons should not produce findings
    const unsupportedFindings = result.findings.filter((f) => f.rule_key === "categorical_value.retstat");
    expect(unsupportedFindings).toEqual([]);
  });

  it("accepts numeric and categorical formatting-only variants without blocking findings (T028)", () => {
    const retstatRule = SELECTED_SHARED_VALUE_INVENTORY.find((r) => r.rule_key === "categorical_value.retstat")!;
    const customInventory: ValueReconciliationRule[] = [
      {
        ...retstatRule,
        accepted_format_variants: ["1", "01"],
      },
    ];

    const allEvidence = buildCurrentOutputEvidence();
    const evidence = withEvidenceValue(
      withEvidenceValue(allEvidence, "bsrs_configuration_output", "retstat", "1"),
      "valuation_listings_output",
      "retstat",
      "01",
    ).filter((e) => !(e.slice === "v1_ve_output" && e.field === "retstat"));
    const result = reconcileSharedValues({ evidence, inventory: customInventory });

    const formattingComparisons = result.comparisons.filter(
      (c) => c.rule_key === "categorical_value.retstat" && c.status === "formatting_only",
    );
    expect(formattingComparisons.length).toBeGreaterThanOrEqual(1);
    expect(formattingComparisons[0]).toMatchObject({
      code: "CROSS_SLICE_VALUE_FORMATTING_ONLY",
      severity: "info",
    });
    // Formatting-only differences should not produce findings
    expect(result.findings).toEqual([]);
  });

  it("includes full classification metadata in every comparison and finding (T029)", () => {
    const evidence = withEvidenceValue(buildCurrentOutputEvidence(), "valuation_listings_output", "xra", 99);
    const result = reconcileSharedValues({ evidence });

    for (const comparison of result.comparisons) {
      expect(comparison.comparison_id.length).toBeGreaterThan(0);
      expect(comparison.rule_key.length).toBeGreaterThan(0);
      expect(comparison.case_id.length).toBeGreaterThan(0);
      expect(comparison.reviewed_fact_context).toContain("reviewed");
      expect(comparison.value_type.length).toBeGreaterThan(0);
      expect(comparison.canonical_semantic_name.length).toBeGreaterThan(0);
      expect(["dd", "approved_fallback"]).toContain(comparison.mapping_basis);
      expect(comparison.required_or_nullable_basis.length).toBeGreaterThan(0);
      expect(comparison.normalization_basis.length).toBeGreaterThan(0);
      expect(["accepted", "accepted_nullable", "blocking_mismatch", "non_blocking_warning", "formatting_only", "unsupported"]).toContain(comparison.status);
      expect(["error", "warning", "info"]).toContain(comparison.severity);
      expect(comparison.code.startsWith("CROSS_SLICE")).toBe(true);
      expect(comparison.rule_version).toBe("0.1.0");
      expect(comparison.producing_module).toBe("cross_slice_reconciliation");
    }

    for (const finding of result.findings) {
      expect(finding.code.startsWith("CROSS_SLICE")).toBe(true);
      expect(["error", "warning", "info"]).toContain(finding.severity);
      expect(finding.category).toBe("cross_slice_value_reconciliation");
      expect(finding.compared_slices.length).toBe(2);
      expect(finding.compared_fields.length).toBe(2);
      expect(finding.compared_values.length).toBe(2);
      expect(finding.normalized_values.length).toBe(2);
      expect(finding.source_paths.length).toBe(2);
      expect(finding.rule_version).toBe("0.1.0");
      expect(finding.producing_module).toBe("cross_slice_reconciliation");
      expect(finding.message.length).toBeGreaterThan(0);
    }
  });

  it("preserves existing output shapes under value reconciliation (T036)", () => {
    // Value reconciliation must not alter the output fixture shapes
    const evidence = buildCurrentOutputEvidence();
    const result = reconcileSharedValues({ evidence });

    // Comparisons and findings are the only outputs — no new adapter modules
    expect(Array.isArray(result.comparisons)).toBe(true);
    expect(Array.isArray(result.findings)).toBe(true);
    // All comparisons have stable shape
    for (const comparison of result.comparisons) {
      expectExactKeys(comparison, [
        "canonical_semantic_name",
        "case_id",
        "code",
        "comparison_id",
        "dd_field_name",
        "fallback_name",
        "left_field",
        "left_normalized_value",
        "left_slice",
        "left_source_path",
        "left_value",
        "mapping_basis",
        "normalization_basis",
        "producing_module",
        "required_or_nullable_basis",
        "reviewed_fact_context",
        "right_field",
        "right_normalized_value",
        "right_slice",
        "right_source_path",
        "right_value",
        "rule_key",
        "rule_version",
        "severity",
        "status",
        "value_type",
      ]);
    }
  });

  it("keeps value reconciliation finding payloads stable across repeated runs (T037)", async () => {
    const evidence = withEvidenceValue(buildCurrentOutputEvidence(), "valuation_listings_output", "xra", 99);
    const [first, second] = await compareRepeatedRuns(() => reconcileSharedValues({ evidence }));

    expect(second).toEqual(first);
  });

  it("proves value reconciliation does not write unrelated output-adapter rows (T038)", () => {
    // Value reconciliation is a shared-level validation module.
    // It must not depend on or write to output adapter packages.
    const crossSliceSource = readFileSync(
      join(REPO_ROOT, "packages/shared/src/crossSliceReconciliation.ts"),
      "utf8",
    );

    const bannedImports = [
      "@pbgc/bsrs-configuration-output",
      "@pbgc/v1-ve-output",
      "@pbgc/valuation-listings-output",
      "@pbgc/benefit-kernel",
      "@pbgc/date-resolution",
      "@pbgc/service-resolution",
      "@pbgc/compensation-resolution",
      "@pbgc/form-resolution",
    ];

    for (const banned of bannedImports) {
      expect(crossSliceSource, `must not import ${banned}`).not.toContain(banned);
    }

    // Must not contain persistence/adaptation primitives
    expect(crossSliceSource).not.toContain("createTable");
    expect(crossSliceSource).not.toContain("INSERT INTO");
    expect(crossSliceSource).not.toContain("@pbgc/db");
    expect(crossSliceSource).not.toContain("migration");
  });

  it("keeps value reconciliation results stable across repeated runs", async () => {
    const [first, second] = await compareRepeatedRuns(() => reconcileSharedValues({ evidence: buildCurrentOutputEvidence() }));

    expect(second).toEqual(first);
  });
});

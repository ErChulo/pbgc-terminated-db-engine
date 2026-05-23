import { describe, expect, it } from "vitest";
import {
  buildEvidenceForValueInventory,
  reconcileSharedValues,
  resetDeterminismForTests,
  SELECTED_SHARED_VALUE_INVENTORY,
  type ReconciliationEvidence,
} from "@pbgc/shared";
import { buildBsrsConfigurationPacketFromFixture, resolveBsrsConfigurationOutput } from "@pbgc/bsrs-configuration-output";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";
import { compareRepeatedRuns, expectExactKeys } from "./hardening-helpers";

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

  it("keeps value reconciliation results stable across repeated runs", async () => {
    const [first, second] = await compareRepeatedRuns(() => reconcileSharedValues({ evidence: buildCurrentOutputEvidence() }));

    expect(second).toEqual(first);
  });
});

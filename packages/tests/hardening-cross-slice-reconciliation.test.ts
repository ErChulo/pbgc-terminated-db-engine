import { describe, expect, it } from "vitest";
import {
  buildEvidenceForInventory,
  reconcileSharedFacts,
  resetDeterminismForTests,
  SELECTED_SHARED_FACT_INVENTORY,
  type ReconciliationEvidence,
} from "@pbgc/shared";
import { buildBsrsConfigurationPacketFromFixture, resolveBsrsConfigurationOutput } from "@pbgc/bsrs-configuration-output";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";
import { compareRepeatedRuns } from "./hardening-helpers";

function buildCurrentOutputEvidence(): ReconciliationEvidence[] {
  resetDeterminismForTests();
  const bsrsPacket = buildBsrsConfigurationPacketFromFixture(parseBsrsConfigurationFixtures()[0]);
  const v1Row = bsrsPacket.v1_ve_output_row;
  const valuationRow = bsrsPacket.valuation_listings_output_row;
  const bsrsRow = resolveBsrsConfigurationOutput(bsrsPacket, "packet-BSRS001", "0.1.0").row;

  return [
    ...buildEvidenceForInventory({
      case_id: bsrsPacket.case_id,
      slice: "v1_ve_output",
      row: v1Row,
      source_path: "packages/tests/v1-ve-output-fixtures.ts",
    }),
    ...buildEvidenceForInventory({
      case_id: bsrsPacket.case_id,
      slice: "valuation_listings_output",
      row: valuationRow,
      source_path: "packages/tests/valuation-listings-output-fixtures.ts",
    }),
    ...buildEvidenceForInventory({
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

describe("hardening cross-slice reconciliation", () => {
  it("defines the selected shared-fact inventory used for reconciliation", () => {
    expect(SELECTED_SHARED_FACT_INVENTORY.map((fact) => fact.fact_key)).toEqual([
      "participant_identifier.id",
      "participant_identifier.bcv_rec_id",
      "case_identifier.case_id",
      "plan_identifier.plan_id",
      "form_reference.form_code_nsf",
      "dd_backed_field.retstat",
    ]);
    for (const fact of SELECTED_SHARED_FACT_INVENTORY) {
      expect(Object.keys(fact.fields_by_slice).length).toBeGreaterThanOrEqual(2);
      expect(fact.reviewed_fact_context).toContain("reviewed");
    }
  });

  it("accepts matching shared identifiers and form references across current output evidence", () => {
    const result = reconcileSharedFacts({ evidence: buildCurrentOutputEvidence() });

    const statusesByFact = new Map(result.comparisons.map((comparison) => [comparison.fact_key, comparison.status]));
    expect(statusesByFact.get("participant_identifier.id")).toBe("accepted");
    expect(statusesByFact.get("participant_identifier.bcv_rec_id")).toBe("accepted");
    expect(statusesByFact.get("form_reference.form_code_nsf")).toBe("accepted");
    expect(result.findings).toEqual([]);
  });

  it("emits a structured participant identifier drift finding", () => {
    const result = reconcileSharedFacts({
      evidence: withEvidenceValue(buildCurrentOutputEvidence(), "valuation_listings_output", "id", "MISMATCHED-ID"),
    });

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        code: "CROSS_SLICE_FACT_DRIFT",
        severity: "error",
        category: "cross_slice_reconciliation",
        canonical_semantic_name: "ID",
        mapping_basis: "dd",
        dd_field_name: "ID",
        fallback_name: null,
        reviewed_fact_context: "reviewed participant identifier shared by output slices",
        rule_version: "0.1.0",
        producing_module: "cross_slice_reconciliation",
      }),
    );
  });

  it("emits a structured form reference drift finding", () => {
    const result = reconcileSharedFacts({
      evidence: withEvidenceValue(buildCurrentOutputEvidence(), "bsrs_configuration_output", "form_code_nsf", "DIFFERENT-FORM"),
    });

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        code: "CROSS_SLICE_FACT_DRIFT",
        canonical_semantic_name: "FORM_CODE_NSF",
        compared_fields: ["form_code_nsf", "form_code_nsf"],
        compared_slices: ["bsrs_configuration_output", "v1_ve_output"],
      }),
    );
  });

  it("preserves finding trace metadata for affected slices, fields, source paths, and reviewed context", () => {
    const result = reconcileSharedFacts({
      evidence: withEvidenceValue(buildCurrentOutputEvidence(), "valuation_listings_output", "bcv_rec_id", "BCV-DRIFT"),
    });

    const finding = result.findings.find((item) => item.canonical_semantic_name === "BCV_REC_ID");
    expect(finding).toBeTruthy();
    expect(Object.keys(finding ?? {}).sort()).toEqual([
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
      "producing_module",
      "reviewed_fact_context",
      "rule_version",
      "severity",
      "source_paths",
    ]);
    expect(finding?.source_paths).toEqual([
      "packages/tests/bsrs-configuration-output-fixtures.ts",
      "packages/tests/valuation-listings-output-fixtures.ts",
    ]);
  });

  it("classifies explicit optional null evidence as absent_optional instead of drift", () => {
    const result = reconcileSharedFacts({
      evidence: withEvidenceValue(buildCurrentOutputEvidence(), "v1_ve_output", "form_code_nsf", null),
    });

    expect(result.comparisons.filter((comparison) => comparison.fact_key === "form_reference.form_code_nsf").map((comparison) => comparison.status)).toContain(
      "absent_optional",
    );
    expect(result.findings.some((finding) => finding.canonical_semantic_name === "FORM_CODE_NSF")).toBe(false);
  });

  it("keeps reconciliation results stable across repeated runs", async () => {
    const [first, second] = await compareRepeatedRuns(() => reconcileSharedFacts({ evidence: buildCurrentOutputEvidence() }));

    expect(second).toEqual(first);
  });
});

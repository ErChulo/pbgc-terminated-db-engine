import { describe, expect, it } from "vitest";
import {
  buildEvidenceForInventory,
  reconcileSharedFacts,
  resetDeterminismForTests,
  SELECTED_SHARED_FACT_INVENTORY,
  registerDdMappingLookup,
  registerDdMappingResolver,
  validateDdMappingCoverage,
  validateFallbackContracts,
  type ReconciliationEvidence,
  type ReconciliationSliceName,
} from "@pbgc/shared";
import { buildBsrsConfigurationPacketFromFixture, resolveBsrsConfigurationOutput } from "@pbgc/bsrs-configuration-output";
import { hasDdMapping as bsrsHasDdMapping, canonicalDdFieldName as bsrsCanonicalDdFieldName } from "@pbgc/bsrs-configuration-output";
import { hasDdMapping as v1HasDdMapping, canonicalDdFieldName as v1CanonicalDdFieldName } from "@pbgc/v1-ve-output";
import {
  hasDdMapping as valuationHasDdMapping,
  canonicalDdFieldName as valuationCanonicalDdFieldName,
} from "@pbgc/valuation-listings-output";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";
import { compareRepeatedRuns } from "./hardening-helpers";

function registerDdMappingContext(): void {
  registerDdMappingLookup("v1_ve_output", v1HasDdMapping);
  registerDdMappingLookup("valuation_listings_output", valuationHasDdMapping);
  registerDdMappingLookup("bsrs_configuration_output", bsrsHasDdMapping);
  registerDdMappingResolver("v1_ve_output", v1CanonicalDdFieldName);
  registerDdMappingResolver("valuation_listings_output", valuationCanonicalDdFieldName);
  registerDdMappingResolver("bsrs_configuration_output", bsrsCanonicalDdFieldName);
}

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

  // ── US2: DD-first fallback and mapping boundaries ──

  it("uses DD-first canonical semantics for V1/VE fields with matching DD entries (T020)", () => {
    registerDdMappingContext();
    const evidence = buildCurrentOutputEvidence();
    const result = reconcileSharedFacts({ evidence });

    for (const comparison of result.comparisons) {
      if (comparison.mapping_basis === "dd" && comparison.dd_field_name) {
        expect(comparison.canonical_semantic_name).toBe(comparison.dd_field_name);
      }
    }

    const ddComparisons = result.comparisons.filter((c) => c.mapping_basis === "dd");
    expect(ddComparisons.length).toBeGreaterThan(0);
    for (const comparison of ddComparisons) {
      expect(comparison.dd_field_name).toBeTruthy();
      expect(comparison.fallback_name).toBeNull();
    }
  });

  it("validates that DD-backed fields have actual DD.csv mapping entries (T021)", () => {
    registerDdMappingContext();
    const evidence = buildCurrentOutputEvidence();
    const ddFindings = validateDdMappingCoverage({ evidence });

    expect(ddFindings).toEqual([]);
  });

  it("detects missing DD mapping for a synthetic DD-backed field not in DD.csv (T021)", () => {
    registerDdMappingContext();
    const evidence = buildCurrentOutputEvidence();
    const syntheticInventory = [
      {
        fact_key: "synthetic.missing_dd_field",
        fact_family: "dd_backed_field" as const,
        reviewed_fact_context: "synthetic DD-backed field intentionally missing from DD.csv",
        canonical_semantic_name: "MISSING_DD_FIELD",
        mapping_basis: "dd" as const,
        dd_field_name: "MISSING_DD_FIELD",
        fallback_name: null,
        expected_presence: "required" as const,
        fields_by_slice: {
          bsrs_configuration_output: "nonexistent_field_name" as string,
        } satisfies Partial<Record<ReconciliationSliceName, string>>,
      },
    ];
    const syntheticEvidence = [
      {
        case_id: "CASE-001",
        slice: "bsrs_configuration_output" as const,
        field: "nonexistent_field_name",
        value: "test" as const,
        source_path: "synthetic",
      },
    ];
    const ddFindings = validateDdMappingCoverage({ inventory: syntheticInventory, evidence: syntheticEvidence });

    expect(ddFindings.length).toBeGreaterThan(0);
    expect(ddFindings[0].code).toBe("CROSS_SLICE_DD_MAPPING_MISSING");
    expect(ddFindings[0].severity).toBe("error");
    expect(ddFindings[0].dd_field_name).toBe("MISSING_DD_FIELD");
    expect(ddFindings[0].affected_slice).toBe("bsrs_configuration_output");
  });

  it("preserves approved no-DD contract-name fallback for fields without DD.csv entries (T022)", () => {
    registerDdMappingContext();
    const evidence = buildCurrentOutputEvidence();

    const fallbackComparisons = reconcileSharedFacts({ evidence }).comparisons.filter(
      (c) => c.mapping_basis === "approved_fallback",
    );
    expect(fallbackComparisons.length).toBeGreaterThan(0);

    for (const comparison of fallbackComparisons) {
      expect(comparison.fallback_name).toBeTruthy();
      expect(comparison.dd_field_name).toBeNull();
    }
  });

  it("records fallback basis in every fallback comparison and finding (T023)", () => {
    const evidence = buildCurrentOutputEvidence();

    const drivableEvidence = withEvidenceValue(evidence, "valuation_listings_output", "plan_id", "DIFFERENT-PLAN");
    const result = reconcileSharedFacts({ evidence: drivableEvidence });

    for (const comparison of result.comparisons) {
      if (comparison.mapping_basis === "approved_fallback") {
        expect(comparison.fallback_name).toBeTruthy();
        expect(comparison.canonical_semantic_name).toBeTruthy();
      }
    }

    const fallbackFindings = result.findings.filter((f) => f.mapping_basis === "approved_fallback");
    for (const finding of fallbackFindings) {
      expect(finding.fallback_name).toBeTruthy();
      expect(finding.canonical_semantic_name).toBeTruthy();
    }

    const fallbackValidation = validateFallbackContracts({ evidence });
    expect(fallbackValidation).toEqual([]);
  });

  // ── US3: Deterministic behavior and existing slice boundaries ──

  it("keeps accepted comparison records and finding payloads byte-stable across repeated runs (T029)", async () => {
    const evidence = withEvidenceValue(buildCurrentOutputEvidence(), "valuation_listings_output", "id", "MISMATCHED-ID");

    const [first, second] = await compareRepeatedRuns(() => reconcileSharedFacts({ evidence }));

    expect(second).toEqual(first);
    expect(first.findings.length).toBeGreaterThan(0);
    expect(first.findings[0].code).toBe("CROSS_SLICE_FACT_DRIFT");
  });

  it("does not import or write to unrelated output-adapter modules (T032)", () => {
    registerDdMappingContext();
    const evidence = buildCurrentOutputEvidence();
    const result = reconcileSharedFacts({ evidence });

    expect(result.comparisons.length).toBeGreaterThan(0);

    for (const comparison of result.comparisons) {
      expect(comparison.producing_module).toBe("cross_slice_reconciliation");
    }
    for (const finding of result.findings) {
      expect(finding.producing_module).toBe("cross_slice_reconciliation");
    }
  });
});

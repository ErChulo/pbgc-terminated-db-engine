import { describe, expect, it } from "vitest";
import {
  BSRS_CONFIGURATION_OUTPUT_FIELDS,
  hasDdMapping as hasBsrsDdMapping,
  canonicalDdFieldName as bsrsCanonicalName,
} from "@pbgc/bsrs-configuration-output";
import { loadDdCsvFieldSet, expectDdMappingCoverage, expectFallbackContractNames } from "./hardening-dd-helpers";

describe("hardening DD.csv canonical-name regression — BSRS", () => {
  it("verifies every BSRS DD-mapped field resolves to a DD.csv field name", () => {
    const ddFields = loadDdCsvFieldSet();
    expect(ddFields.size).toBeGreaterThan(100);

    const outputs = BSRS_CONFIGURATION_OUTPUT_FIELDS as readonly string[];
    const mapped = outputs.filter((f) => hasBsrsDdMapping(f));
    expect(mapped.length).toBeGreaterThan(30);

    for (const field of mapped) {
      const canonical = bsrsCanonicalName(field);
      expect(
        ddFields.has(canonical),
        `BSRS field "${field}" maps to "${canonical}" which is not in DD.csv`,
      ).toBe(true);
    }
  });

  it("enforces DD-first naming with coverage assertion helper (BSRS)", () => {
    expectDdMappingCoverage(
      BSRS_CONFIGURATION_OUTPUT_FIELDS as readonly string[],
      hasBsrsDdMapping,
      bsrsCanonicalName,
    );
  });

  it("confirms BSRS non-mapped fields fall back to approved fallback contract names", () => {
    // BSRS falls back to the field name itself (not toUpperCase) for non-mapped fields
    // The bsrsCanonicalName returns the field name unchanged for non-DD fields
    expectFallbackContractNames(
      BSRS_CONFIGURATION_OUTPUT_FIELDS as readonly string[],
      hasBsrsDdMapping,
      bsrsCanonicalName,
    );
  });

  it("verifies BSRS DD-mapped field count has not regressed", () => {
    const ddFields = loadDdCsvFieldSet();

    const bsrsMapped = (BSRS_CONFIGURATION_OUTPUT_FIELDS as readonly string[]).filter(
      (f) => hasBsrsDdMapping(f),
    );
    expect(bsrsMapped.length, "BSRS DD-mapped field count").toBeGreaterThanOrEqual(40);

    // Every canonical name must exist in DD.csv
    for (const field of bsrsMapped) {
      const canonical = bsrsCanonicalName(field);
      expect(ddFields.has(canonical)).toBe(true);
    }
  });

  it("confirms DD-backed fields cover participant identifiers and benefit amounts", () => {
    const ddFields = loadDdCsvFieldSet();

    // Core identifier fields must have DD mappings
    const identifierFields = ["case_id", "bcv_rec_id", "id", "fname", "lname", "dob", "retstat"];
    for (const field of identifierFields) {
      expect(hasBsrsDdMapping(field), `BSRS field "${field}" should have DD mapping`).toBe(true);
      expect(ddFields.has(bsrsCanonicalName(field))).toBe(true);
    }

    // Benefit amount fields must have DD mappings
    const benefitFields = ["xrd_mb_term", "xrd_mb_title_iv", "xrd_mb_4022c", "pvmb_term", "pvmb_title_iv", "pvmb_4022c"];
    for (const field of benefitFields) {
      expect(hasBsrsDdMapping(field), `BSRS field "${field}" should have DD mapping`).toBe(true);
      expect(ddFields.has(bsrsCanonicalName(field))).toBe(true);
    }
  });

  it("confirms non-DD fields use contract names without false DD claims", () => {
    // Fields that should NOT have DD mappings
    const nonDdFields = [
      "plan_id",
      "custid",
      "calculation_context",
      "role_type",
      "statement_row_type",
      "statement_sort_key",
      "bsrs_configuration_output_rule_trace",
      "bsrs_configuration_output_warning_flag",
      "bsrs_configuration_output_warning_note",
    ];

    for (const field of nonDdFields) {
      expect(hasBsrsDdMapping(field), `BSRS field "${field}" should NOT have DD mapping`).toBe(false);
      // Fallback should return the field name unchanged
      expect(bsrsCanonicalName(field)).toBe(field);
    }
  });
});

import { describe, expect, it } from "vitest";
import { V1_VE_OUTPUT_FIELDS, hasDdMapping as hasV1DdMapping, canonicalDdFieldName as v1CanonicalName } from "@pbgc/v1-ve-output";
import {
  VALUATION_LISTINGS_OUTPUT_FIELDS,
  hasDdMapping as hasVlDdMapping,
  canonicalDdFieldName as vlCanonicalName,
} from "@pbgc/valuation-listings-output";
import { loadDdCsvFieldSet, expectDdMappingCoverage, expectFallbackContractNames } from "./hardening-dd-helpers";

describe("hardening DD.csv canonical-name regression — output slices", () => {
  it("verifies every V1/VE DD-mapped field resolves to a DD.csv field name", () => {
    const ddFields = loadDdCsvFieldSet();
    expect(ddFields.size).toBeGreaterThan(100);

    const outputs = V1_VE_OUTPUT_FIELDS as readonly string[];
    const mapped = outputs.filter((f) => hasV1DdMapping(f));
    expect(mapped.length).toBeGreaterThan(20);

    for (const field of mapped) {
      const canonical = v1CanonicalName(field);
      expect(
        ddFields.has(canonical),
        `V1/VE field "${field}" maps to "${canonical}" which is not in DD.csv`,
      ).toBe(true);
    }
  });

  it("enforces DD-first naming with coverage assertion helper (V1/VE)", () => {
    expectDdMappingCoverage(
      V1_VE_OUTPUT_FIELDS as readonly string[],
      hasV1DdMapping,
      v1CanonicalName,
    );
  });

  it("confirms V1/VE non-mapped fields fall back to contract names", () => {
    expectFallbackContractNames(
      V1_VE_OUTPUT_FIELDS as readonly string[],
      hasV1DdMapping,
      v1CanonicalName,
      { fallbackTransform: "toUpperCase" },
    );
  });

  it("verifies every valuation-listings DD-mapped field resolves to a DD.csv field name", () => {
    const ddFields = loadDdCsvFieldSet();

    const outputs = VALUATION_LISTINGS_OUTPUT_FIELDS as readonly string[];
    const mapped = outputs.filter((f) => hasVlDdMapping(f));
    expect(mapped.length).toBeGreaterThan(30);

    for (const field of mapped) {
      const canonical = vlCanonicalName(field);
      expect(
        ddFields.has(canonical),
        `Valuation-listings field "${field}" maps to "${canonical}" which is not in DD.csv`,
      ).toBe(true);
    }
  });

  it("enforces DD-first naming with coverage assertion helper (valuation-listings)", () => {
    expectDdMappingCoverage(
      VALUATION_LISTINGS_OUTPUT_FIELDS as readonly string[],
      hasVlDdMapping,
      vlCanonicalName,
    );
  });

  it("confirms valuation-listings non-mapped fields fall back to contract names", () => {
    expectFallbackContractNames(
      VALUATION_LISTINGS_OUTPUT_FIELDS as readonly string[],
      hasVlDdMapping,
      vlCanonicalName,
      { fallbackTransform: "toUpperCase" },
    );
  });

  it("confirms DD.csv field counts have not regressed across slices", () => {
    const ddFields = loadDdCsvFieldSet();

    const v1Mapped = (V1_VE_OUTPUT_FIELDS as readonly string[]).filter((f) => hasV1DdMapping(f));
    const vlMapped = (VALUATION_LISTINGS_OUTPUT_FIELDS as readonly string[]).filter((f) => hasVlDdMapping(f));

    // Regression checks: field counts should not decrease
    expect(v1Mapped.length, "V1/VE DD-mapped field count").toBeGreaterThanOrEqual(40);
    expect(vlMapped.length, "Valuation-listings DD-mapped field count").toBeGreaterThanOrEqual(50);

    // DD.csv should have all expected canonical names
    for (const field of v1Mapped) {
      expect(ddFields.has(v1CanonicalName(field))).toBe(true);
    }
    for (const field of vlMapped) {
      expect(ddFields.has(vlCanonicalName(field))).toBe(true);
    }
  });
});

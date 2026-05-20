import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  buildApprovedBsrsFallbackFieldVocabulary,
  buildCurrentCommittedFieldVocabulary,
  extractBsrsFieldReferences,
  parseBsrsSample,
  parseDdCsvFieldNames,
  resolveBsrsFieldReference,
  validateBsrsFieldReferences,
} from "@pbgc/bsrs-configuration-output";
import { describe, expect, it } from "vitest";

const REPO_ROOT = process.cwd();
const DD_CSV_PATH = join(REPO_ROOT, "artifacts/mappings/DD.csv");
const BSRS_CONFIG_ROOT = join(REPO_ROOT, "artifacts/reference/approved-samples/bsrs-config");

function listFiles(root: string): string[] {
  return readdirSync(root)
    .flatMap((entry) => {
      const path = join(root, entry);
      return statSync(path).isDirectory() ? listFiles(path) : [path];
    })
    .sort();
}

function approvedSamples() {
  return listFiles(BSRS_CONFIG_ROOT)
    .filter((path) => path.endsWith(".txt"))
    .map((path) =>
      parseBsrsSample({
        source_path: relative(REPO_ROOT, path),
        text: readFileSync(path, "utf8"),
      }),
    );
}

function approvedValidationInput() {
  const samples = approvedSamples();
  const ddFieldNames = parseDdCsvFieldNames(readFileSync(DD_CSV_PATH, "utf8"));
  const currentFieldNames = buildCurrentCommittedFieldVocabulary();
  return {
    samples,
    ddFieldNames,
    currentFieldNames,
    approvedFallbackFields: buildApprovedBsrsFallbackFieldVocabulary({ samples, ddFieldNames, currentFieldNames }),
  };
}

describe("BSRS field-reference hardening", () => {
  it("keeps approved BSRS sample field references valid", () => {
    const input = approvedValidationInput();

    expect(validateBsrsFieldReferences(input)).toEqual([]);
    expect(extractBsrsFieldReferences(input.samples).length).toBeGreaterThan(100);
  });

  it("resolves DD-backed field references through DD.csv names", () => {
    const input = approvedValidationInput();

    expect(resolveBsrsFieldReference("SSN", input)).toEqual(
      expect.objectContaining({
        canonical_name: "SSN",
        dd_backed: true,
        token: "SSN",
        vocabulary_source: "dd_csv",
      }),
    );
    expect(resolveBsrsFieldReference("non_spouse_benf", input)).toEqual(
      expect.objectContaining({
        canonical_name: "NON_SPOUSE_BENF",
        dd_backed: true,
        token: "non_spouse_benf",
        vocabulary_source: "dd_csv",
      }),
    );
  });

  it("preserves approved no-DD fallback field references from committed samples", () => {
    const input = approvedValidationInput();

    expect(resolveBsrsFieldReference("D050", input)).toEqual(
      expect.objectContaining({
        approved_fallback: true,
        dd_backed: false,
        token: "D050",
        vocabulary_source: "approved_sample_fallback",
      }),
    );
  });

  it("recognizes current committed output field names as field vocabulary", () => {
    const input = approvedValidationInput();

    expect(input.currentFieldNames).toContain("CURRENT_PAYMENT_AMOUNT");
    expect(resolveBsrsFieldReference("current_payment_amount", input)).toEqual(
      expect.objectContaining({
        canonical_name: "CURRENT_PAYMENT_AMOUNT",
        token: "current_payment_amount",
        vocabulary_source: "current_committed_field",
      }),
    );
  });
});

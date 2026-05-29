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

  it("reports unknown field-like tokens as structured errors (T019)", () => {
    const synthetic = parseBsrsSample({
      source_path: "synthetic/unknown-field.txt",
      text: "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat\n1\t\tABC_DEF_UNKNOWN_FIELD\tMISSING_FIELD\tTL\t$2\n",
    });

    const input = approvedValidationInput();
    const findings = validateBsrsFieldReferences({
      samples: [synthetic],
      ddFieldNames: input.ddFieldNames,
      currentFieldNames: input.currentFieldNames,
      approvedFallbackFields: new Set(),
    });

    const finding = findings.find(
      (f) => f.code === "BSRS_FIELD_REFERENCE_UNKNOWN" && f.token === "ABC_DEF_UNKNOWN_FIELD",
    );
    expect(finding).toBeDefined();
    expect(finding?.severity).toBe("error");
    expect(finding?.category).toBe("field_reference");
    expect(finding?.source_path).toBe("synthetic/unknown-field.txt");
    expect(finding?.row_index).toBe(2);
    expect(finding?.column_name).toBe("Description");
    expect(finding?.message).toContain("ABC_DEF_UNKNOWN_FIELD");
  });

  it("ignores quoted narrative text when extracting field references (T020)", () => {
    const synthetic = parseBsrsSample({
      source_path: "synthetic/quoted-narrative.txt",
      text: 'PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat\n1\t\t"This FIELD_TOKEN_IN_QUOTES should be ignored"\tIGNORED\tTL\t$2\n',
    });

    const input = approvedValidationInput();
    const findings = validateBsrsFieldReferences({
      samples: [synthetic],
      ddFieldNames: input.ddFieldNames,
      currentFieldNames: input.currentFieldNames,
      approvedFallbackFields: new Set(),
    });

    const narrativeFinding = findings.find((f) => f.token === "FIELD_TOKEN_IN_QUOTES");
    expect(narrativeFinding).toBeUndefined();
  });

  it("classifies documented control tokens as non-field references (T021)", () => {
    const synthetic = parseBsrsSample({
      source_path: "synthetic/control-tokens.txt",
      text: "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat\n1\t\tAND OR NOT BOLD HLINE TRUE FALSE BU TL TC TR TH\tIGNORED\tTL\t$2\n",
    });

    const input = approvedValidationInput();
    const findings = validateBsrsFieldReferences({
      samples: [synthetic],
      ddFieldNames: input.ddFieldNames,
      currentFieldNames: input.currentFieldNames,
      approvedFallbackFields: input.approvedFallbackFields,
    });

    const controlTokens = ["AND", "OR", "NOT", "BOLD", "HLINE", "TRUE", "FALSE", "BU", "TL", "TC", "TR", "TH"];
    const controlFindings = findings.filter((f) => controlTokens.includes(f.token ?? ""));
    expect(controlFindings).toEqual([]);
  });

  it("keeps field-reference findings stable across repeated runs (T022)", () => {
    const input = approvedValidationInput();

    const first = JSON.stringify(validateBsrsFieldReferences(input));
    const second = JSON.stringify(validateBsrsFieldReferences(input));

    expect(second).toBe(first);
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

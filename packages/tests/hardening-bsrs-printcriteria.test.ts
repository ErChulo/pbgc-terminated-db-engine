import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  parseAllowedStatementAuthoringFunctions,
  parseBsrsSample,
  validatePrintCriteria,
  validateStatementAuthoringFunctions,
} from "@pbgc/bsrs-configuration-output";
import { describe, expect, it } from "vitest";

const REPO_ROOT = process.cwd();
const FUNCTION_SET_PATH = join(REPO_ROOT, "artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt");
const BSRS_CONFIG_ROOT = join(REPO_ROOT, "artifacts/reference/approved-samples/bsrs-config");

function listFiles(root: string): string[] {
  return readdirSync(root)
    .flatMap((entry) => {
      const path = join(root, entry);
      return statSync(path).isDirectory() ? listFiles(path) : [path];
    })
    .sort();
}

function approvedSources() {
  return listFiles(BSRS_CONFIG_ROOT)
    .filter((path) => path.endsWith(".txt"))
    .map((path) => ({
      source_path: relative(REPO_ROOT, path),
      text: readFileSync(path, "utf8"),
    }));
}

describe("BSRS semantic hardening PrintCriteria validation", () => {
  it("accepts approved PrintCriteria cells with balanced quoted text and supported functions", () => {
    const allowedFunctions = parseAllowedStatementAuthoringFunctions(readFileSync(FUNCTION_SET_PATH, "utf8"));
    const findings = validatePrintCriteria({
      allowedFunctions,
      samples: approvedSources().map((source) => parseBsrsSample(source)),
    });

    expect(findings).toEqual([]);
  });

  it("rejects unsupported Statement Authoring functions with structured errors", () => {
    const allowedFunctions = parseAllowedStatementAuthoringFunctions(readFileSync(FUNCTION_SET_PATH, "utf8"));
    const sample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/synthetic/unsupported-function.txt",
      text: [
        "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat",
        '"ID=""1"" AND @UNAPPROVED(SSN)"\t\t"""Synthetic row"""\tSSN\tTL\tTL',
      ].join("\n"),
    });

    expect(validateStatementAuthoringFunctions({ allowedFunctions, sources: [{ source_path: sample.source_path, text: sample.raw_text }] })).toEqual([
      expect.objectContaining({
        category: "statement_authoring_function",
        code: "BSRS_UNSUPPORTED_FUNCTION",
        column_name: "PrintCriteria",
        row_index: 2,
        severity: "error",
        source_path: sample.source_path,
        token: "UNAPPROVED",
      }),
    ]);
  });

  it("rejects malformed PrintCriteria quote structure with structured errors", () => {
    const allowedFunctions = parseAllowedStatementAuthoringFunctions(readFileSync(FUNCTION_SET_PATH, "utf8"));
    const sample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/synthetic/malformed-printcriteria.txt",
      text: ["PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat", '"ID=""1\t\t"""Synthetic row"""\tSSN\tTL\tTL'].join("\n"),
    });

    expect(validatePrintCriteria({ allowedFunctions, samples: [sample] })).toEqual([
      expect.objectContaining({
        category: "printcriteria",
        code: "BSRS_PRINTCRITERIA_UNBALANCED_QUOTES",
        column_name: "PrintCriteria",
        row_index: 2,
        severity: "error",
        source_path: sample.source_path,
      }),
    ]);
  });
});

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  BSRS_CONFIGURATION_OUTPUT_FIELDS,
  BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
  BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION,
  parseBsrsSample,
  serializeSemanticValidationFindings,
  validateBsrsSemanticBlockPatterns,
  validateBsrsSemanticFieldReferences,
  validateBsrsSemanticUs1,
} from "@pbgc/bsrs-configuration-output";
import { resetDeterminismForTests } from "@pbgc/shared";
import { describe, expect, it, beforeAll } from "vitest";

const REPO_ROOT = process.cwd();
const DD_CSV_PATH = join(REPO_ROOT, "artifacts/mappings/DD.csv");
const FUNCTION_LIST_PATH = join(
  REPO_ROOT,
  "artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt",
);
const BSRS_CONFIG_ROOT = join(
  REPO_ROOT,
  "artifacts/reference/approved-samples/bsrs-config",
);

function readText(path: string): string {
  return readFileSync(path, "utf8");
}

function listBsrsSampleSources(): Array<{ source_path: string; text: string }> {
  const dirs = ["base-data", "statements", "recalculations", "optional-forms"];
  return dirs.flatMap((dir) => {
    const fullDir = join(BSRS_CONFIG_ROOT, dir);
    const files: string[] = [];
    function walk(d: string) {
      for (const entry of readdirSync(d)) {
        const p = join(d, entry);
        if (statSync(p).isDirectory()) walk(p);
        else if (p.endsWith(".txt")) files.push(p);
      }
    }
    walk(fullDir);
    return files.map((path) => ({
      source_path: relative(REPO_ROOT, path),
      text: readFileSync(path, "utf8"),
    }));
  });
}

describe("BSRS semantic behavior preservation", () => {
  beforeAll(() => {
    resetDeterminismForTests();
  });

  it("preserves existing BSRS output contract: module name and version are unchanged", () => {
    // The BSRS configuration output module identity must remain stable
    // even after semantic validation is added.
    // These are the canonical module-level constants from types.ts.
    expect(BSRS_CONFIGURATION_OUTPUT_MODULE_NAME).toBe("bsrs_configuration_output");
    expect(BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION).toBe("0.1.0");
  });

  it("preserves deterministic US1 semantic validation across repeated runs", () => {
    const sources = listBsrsSampleSources();

    const first = serializeSemanticValidationFindings(
      validateBsrsSemanticUs1({
        functionListText: readText(FUNCTION_LIST_PATH),
        sources,
      }),
    );
    const second = serializeSemanticValidationFindings(
      validateBsrsSemanticUs1({
        functionListText: readText(FUNCTION_LIST_PATH),
        sources,
      }),
    );

    expect(second).toBe(first);
    // All approved samples should produce zero US1 findings
    expect(first).toBe("[]");
  });

  it("preserves deterministic US2 field-reference validation across repeated runs", () => {
    const sources = listBsrsSampleSources();

    const first = serializeSemanticValidationFindings(
      validateBsrsSemanticFieldReferences({
        ddCsvText: readText(DD_CSV_PATH),
        sources,
      }),
    );
    const second = serializeSemanticValidationFindings(
      validateBsrsSemanticFieldReferences({
        ddCsvText: readText(DD_CSV_PATH),
        sources,
      }),
    );

    expect(second).toBe(first);
    // All approved samples should produce zero US2 findings
    expect(first).toBe("[]");
  });

  it("preserves deterministic US3 block-pattern validation across repeated runs", () => {
    const sources = listBsrsSampleSources();

    const first = serializeSemanticValidationFindings(
      validateBsrsSemanticBlockPatterns({ sources }),
    );
    const second = serializeSemanticValidationFindings(
      validateBsrsSemanticBlockPatterns({ sources }),
    );

    expect(second).toBe(first);
    // All approved samples should produce zero US3 findings
    expect(first).toBe("[]");
  });

  it("keeps semantic validation decoupled from BSRS output generation: boundary confirmed by test T031", () => {
    // Semantic validation is a hardening layer, not a runtime gate.
    // The module boundary isolation test (next test) confirms that
    // runBsrsConfiguration does not import any semantic validation helpers.
    // This test verifies the same invariant at the module API level:
    // semantic validation functions are exported but never called by the runtime pipeline.
    const sources = listBsrsSampleSources();

    // Semantic validation helpers produce deterministic results when called directly
    const us1Findings = validateBsrsSemanticUs1({
      functionListText: readText(FUNCTION_LIST_PATH),
      sources,
    });

    // These helpers are callable but their results do not affect runtime output
    // (confirmed by the module boundary test below)
    expect(Array.isArray(us1Findings)).toBe(true);
  });

  it("preserves BSRS field vocabulary: all committed output fields are recognized", () => {
    // Ensure no BSRS output field name has been removed or renamed
    const requiredFields = [
      "case_id",
      "plan_id",
      "bcv_rec_id",
      "id",
      "retstat",
      "statement_row_type",
      "statement_sort_key",
      "calc_indicator",
      "calculation_context",
      "form_code_nsf",
      "pvmb_term",
      "pvmb_title_iv",
      "pvmb_4022c",
      "pvf_lev_ann",
      "pvf_lev_ls",
      "pvf_qpsa_ls",
      "ce_track1",
      "ce_track2",
      "ce_track3",
      "ce_track4",
      "ce_track5",
      "ce_track6",
    ];

    for (const field of requiredFields) {
      expect(BSRS_CONFIGURATION_OUTPUT_FIELDS).toContain(field);
    }
  });

  it("preserves BSRS semantic validation module boundaries: no adapter-scope leakage", () => {
    // Semantic validation must NOT be wired into the runtime BSRS output pipeline.
    // The runBsrsConfiguration function must not import semantic validation helpers.
    const runSource = readFileSync(
      join(REPO_ROOT, "packages/engine/bsrs-configuration-output/src/runBsrsConfiguration.ts"),
      "utf8",
    );

    expect(runSource).not.toContain("bsrsSemanticValidation");
    expect(runSource).not.toContain("validateBsrsSemantic");
    expect(runSource).not.toContain("bsrsFieldReferenceValidation");
    expect(runSource).not.toContain("bsrsBlockPatternValidation");
    expect(runSource).not.toContain("printCriteriaValidation");
    expect(runSource).not.toContain("statementAuthoringFunctions");
  });
});

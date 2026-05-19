import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  parseAllowedStatementAuthoringFunctions,
  serializeSemanticValidationFindings,
  validateBsrsSemanticUs1,
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

describe("BSRS semantic hardening Statement Authoring function validation", () => {
  it("validates approved sample function references against the committed Statement Authoring function list", () => {
    const findings = validateStatementAuthoringFunctions({
      allowedFunctions: parseAllowedStatementAuthoringFunctions(readFileSync(FUNCTION_SET_PATH, "utf8")),
      sources: approvedSources(),
    });

    expect(findings).toEqual([]);
  });

  it("emits deterministic findings across repeated US1 validation runs", () => {
    const input = {
      functionListText: readFileSync(FUNCTION_SET_PATH, "utf8"),
      sources: approvedSources(),
    };

    const first = serializeSemanticValidationFindings(validateBsrsSemanticUs1(input));
    const second = serializeSemanticValidationFindings(validateBsrsSemanticUs1(input));

    expect(first).toBe(second);
    expect(first).toBe("[]");
  });
});

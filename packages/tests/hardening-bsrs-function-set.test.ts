import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
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

function readAllowedFunctions(): Set<string> {
  const text = readFileSync(FUNCTION_SET_PATH, "utf8");
  const names = text
    .split(/\r?\n/)
    .map((line) => line.trim().toUpperCase())
    .filter((line) => /^[A-Z][A-Z0-9_]*$/.test(line));
  return new Set(names);
}

function extractStatementAuthoringFunctions(text: string): string[] {
  return [...text.matchAll(/@([A-Za-z][A-Za-z0-9_]*)\s*\(/g)].map((match) => match[1].toUpperCase());
}

function findDisallowedFunctions(text: string, allowedFunctions: Set<string>): string[] {
  return [...new Set(extractStatementAuthoringFunctions(text).filter((name) => !allowedFunctions.has(name)))].sort();
}

describe("hardening BSRS Statement Authoring function-set validation", () => {
  it("loads the committed allowed function set as the canonical backend validation source", () => {
    const allowedFunctions = readAllowedFunctions();

    expect(allowedFunctions.size).toBeGreaterThan(30);
    expect([...allowedFunctions].sort()).toContain("IF");
    expect([...allowedFunctions].sort()).toContain("ISDATE");
    expect([...allowedFunctions].sort()).toContain("ROUND");
    expect([...allowedFunctions].sort()).toContain("STRING");
  });

  it("keeps approved BSRS configuration samples within the allowed Statement Authoring function set", () => {
    const allowedFunctions = readAllowedFunctions();
    const configFiles = listFiles(BSRS_CONFIG_ROOT).filter((path) => path.endsWith(".txt"));
    const usedFunctions = new Set<string>();
    const failures: string[] = [];

    for (const configFile of configFiles) {
      const text = readFileSync(configFile, "utf8");
      extractStatementAuthoringFunctions(text).forEach((name) => usedFunctions.add(name));
      for (const name of findDisallowedFunctions(text, allowedFunctions)) {
        failures.push(`${relative(REPO_ROOT, configFile)}: ${name}`);
      }
    }

    expect(configFiles.length).toBeGreaterThanOrEqual(6);
    expect([...usedFunctions].sort()).toEqual(expect.arrayContaining(["CHAR", "IF", "ISDATE", "RIGHT", "ROUND", "STRING"]));
    expect(failures).toEqual([]);
  });

  it("rejects a BSRS expression that references an unapproved function", () => {
    const allowedFunctions = readAllowedFunctions();

    expect(findDisallowedFunctions("@IF(ID=\"1\", @RIGHT(SSN, 4), \"\")", allowedFunctions)).toEqual([]);
    expect(findDisallowedFunctions("@IF(ID=\"1\", @UNAPPROVED(SSN), \"\")", allowedFunctions)).toEqual(["UNAPPROVED"]);
  });
});

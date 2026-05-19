import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = process.cwd();
const BSRS_CONFIG_ROOT = join(REPO_ROOT, "artifacts/reference/approved-samples/bsrs-config");

type ParsedTsv = {
  file: string;
  headers: string[];
  rows: string[][];
};

function listFiles(root: string): string[] {
  return readdirSync(root)
    .flatMap((entry) => {
      const path = join(root, entry);
      return statSync(path).isDirectory() ? listFiles(path) : [path];
    })
    .sort();
}

function parseTsv(file: string): ParsedTsv {
  const lines = readFileSync(file, "utf8")
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.length > 0);
  const [headerLine, ...rowLines] = lines;
  return {
    file,
    headers: headerLine.split("\t"),
    rows: rowLines.map((line) => line.split("\t")),
  };
}

function expectHeaders(parsed: ParsedTsv, requiredHeaders: readonly string[]): void {
  expect(parsed.headers).toEqual(expect.arrayContaining([...requiredHeaders]));
}

describe("hardening BSRS approved-sample configuration shape", () => {
  it("keeps all approved BSRS configuration samples parseable as tab-delimited backend fixtures", () => {
    const files = listFiles(BSRS_CONFIG_ROOT).filter((path) => path.endsWith(".txt"));

    expect(files.map((file) => relative(BSRS_CONFIG_ROOT, file))).toEqual([
      "base-data/sample-bsrs-baseData-config.txt",
      "optional-forms/qpsa-qdro/sample-bsrs-OFA_QPSA-QDRO-config.txt",
      "optional-forms/single-and-joint/sample-bsrs-OFA_SingleAndJoint-config.txt",
      "optional-forms/single-life/sample-bsrs-OFA_SingleLife-config.txt",
      "recalculations/sample-bsrs-recalculation-config.txt",
      "statements/sample-bsrs-statement-config.txt",
    ]);

    for (const parsed of files.map(parseTsv)) {
      expect(parsed.rows.length, relative(REPO_ROOT, parsed.file)).toBeGreaterThan(0);
      for (const row of parsed.rows) {
        expect(row.length, relative(REPO_ROOT, parsed.file)).toBeLessThanOrEqual(parsed.headers.length);
        expect(row.length, relative(REPO_ROOT, parsed.file)).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("preserves the approved base-data configuration columns and field references", () => {
    const parsed = parseTsv(join(BSRS_CONFIG_ROOT, "base-data/sample-bsrs-baseData-config.txt"));
    expectHeaders(parsed, [
      "Description",
      "FieldName",
      "TableName",
      "MaskType",
      "Mask",
      "Required",
      "LowerBound",
      "UpperBound",
      "ErrorMessage",
    ]);

    const fieldNames = parsed.rows.map((row) => row[parsed.headers.indexOf("FieldName")]);
    const tableNames = parsed.rows.map((row) => row[parsed.headers.indexOf("TableName")]);
    expect(fieldNames).toEqual(["LNAME", "FNAME", "MNAME", "SSN", "PSEX", "DOB", "PCI"]);
    expect(tableNames.every((tableName) => /^BCV\d+$/.test(tableName))).toBe(true);
  });

  it("preserves approved statement and optional-form row shape for backend validation", () => {
    const files = listFiles(BSRS_CONFIG_ROOT).filter((path) => path.endsWith(".txt") && !path.includes("/base-data/"));

    for (const parsed of files.map(parseTsv)) {
      expectHeaders(parsed, ["PrintCriteria", "Description", "Detail", "DescFormat", "DtlFormat"]);
      expect(parsed.headers.some((header) => header === "Line" || header === "Lie"), relative(REPO_ROOT, parsed.file)).toBe(true);
      expect(
        parsed.rows.some((row) => row.some((cell) => cell.includes("@") || cell.includes('"""'))),
        relative(REPO_ROOT, parsed.file),
      ).toBe(true);
    }
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Load DD.csv as a Set of canonical field names.
 * Returns the set of DD field names from artifacts/mappings/DD.csv.
 */
export function loadDdCsvFieldSet(): Set<string> {
  const ddCsv = readFileSync(resolve(process.cwd(), "artifacts/mappings/DD.csv"), "utf8");
  return new Set(
    ddCsv
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.split(",")[0]?.replace(/^\"/, "").replace(/\"$/, "").trim())
      .filter((field): field is string => Boolean(field)),
  );
}

/**
 * Asserts that every field in the emitted output that has a DD mapping
 * resolves to a valid DD.csv field name.
 */
export function expectDdMappingCoverage(
  outputFields: readonly string[],
  hasMapping: (field: string) => boolean,
  canonicalName: (field: string) => string,
): void {
  const ddFields = loadDdCsvFieldSet();
  const mappedFields: string[] = [];

  for (const field of outputFields) {
    if (hasMapping(field)) {
      const canonical = canonicalName(field);
      if (!ddFields.has(canonical)) {
        throw new Error(`DD-backed field "${field}" maps to "${canonical}" which is not in DD.csv`);
      }
      mappedFields.push(field);
    }
  }

  if (mappedFields.length === 0) {
    throw new Error("No DD-mapped fields found in output — verify hasDdMapping() implementation");
  }
}

/**
 * Asserts that fields without DD.csv mappings fall back to approved contract names.
 * Accepts optional transform for slices that use .toUpperCase() as fallback (V1/VE, VL).
 */
export function expectFallbackContractNames(
  outputFields: readonly string[],
  hasMapping: (field: string) => boolean,
  canonicalName: (field: string) => string,
  options?: { fallbackTransform?: "identity" | "toUpperCase" },
): void {
  const transform = options?.fallbackTransform === "toUpperCase"
    ? (s: string) => s.toUpperCase()
    : (s: string) => s;

  for (const field of outputFields) {
    if (!hasMapping(field)) {
      const canonical = canonicalName(field);
      const expected = transform(field);
      if (canonical !== expected) {
        throw new Error(`Non-mapped field "${field}" should fall back to "${expected}", got "${canonical}"`);
      }
    }
  }
}

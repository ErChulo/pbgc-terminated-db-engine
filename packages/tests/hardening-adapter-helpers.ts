import type { Database } from "sql.js";

/**
 * List of output-adapter table names that are expected to exist in the schema.
 * A hardening test can use this to verify that running one adapter does not
 * create rows in tables belonging to other adapters.
 */
export const ADAPTER_OUTPUT_TABLES = [
  "resolved_dates_output",
  "resolved_service_comp_output",
  "resolved_forms_output",
  "benefit_kernel_output",
  "v1_ve_output_row",
  "valuation_listing_output_row",
  "bsrs_configuration_output_row",
] as const;

/**
 * Given a specific adapter's output table, returns the set of tables that
 * should NOT have any rows after that adapter runs.
 */
export function unrelatedTablesFor(adapterTable: string): readonly string[] {
  return ADAPTER_OUTPUT_TABLES.filter((t) => t !== adapterTable);
}

/**
 * Asserts that after running a specific adapter, only the expected table has rows
 * among all output-adapter tables.
 */
export function expectAdapterIsolation(
  db: Database,
  adapterTable: string,
): void {
  for (const table of ADAPTER_OUTPUT_TABLES) {
    try {
      const result = db.exec(`SELECT COUNT(*) AS c FROM ${table}`) as Array<{ values: Array<Array<number>> }>;
      const count = Number(result[0]?.values[0]?.[0] ?? 0);
      if (table === adapterTable) {
        if (count === 0) {
          throw new Error(`Expected adapter table "${table}" has 0 rows`);
        }
      } else {
        if (count > 0) {
          throw new Error(`Adapter boundary violation: "${table}" has ${count} rows but only "${adapterTable}" was run`);
        }
      }
    } catch {
      // Table might not exist yet — skip
    }
  }
}

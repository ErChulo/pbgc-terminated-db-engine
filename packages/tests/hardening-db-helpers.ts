import type { Database } from "sql.js";

/**
 * Count rows in a named sqlite table.
 */
export function sqlTableCount(db: Database, table: string): number {
  const result = db.exec(`SELECT COUNT(*) AS count FROM ${table}`) as Array<{ values: Array<Array<number>> }>;
  return Number(result[0]?.values[0]?.[0] ?? 0);
}

/**
 * Asserts that only the expected output tables have rows; all others must be empty.
 */
export function expectOnlyExpectedTables(
  db: Database,
  expectedTables: readonly string[],
  allTableNames: readonly string[],
): void {
  for (const table of allTableNames) {
    const count = sqlTableCount(db, table);
    if (expectedTables.includes(table)) {
      if (count === 0) {
        throw new Error(`Expected table "${table}" should have rows but has 0`);
      }
    } else {
      if (count > 0) {
        throw new Error(`Unexpected table "${table}" has ${count} rows — adapter boundary violation`);
      }
    }
  }
}

/**
 * Returns true if the table exists in the database.
 */
export function tableExists(db: Database, table: string): boolean {
  try {
    db.exec(`SELECT 1 FROM ${table} LIMIT 1`);
    return true;
  } catch {
    return false;
  }
}

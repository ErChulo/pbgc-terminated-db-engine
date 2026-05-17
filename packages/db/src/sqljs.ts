import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";

export type SqlJsContext = {
  SQL: SqlJsStatic;
  db: Database;
};

export async function createSqlJsContext(existingBytes?: Uint8Array): Promise<SqlJsContext> {
  const SQL = await initSqlJs({
    locateFile: (file) => `/sqljs/${file === "sql-wasm-browser.wasm" ? "sql-wasm.wasm" : file}`,
  });
  const db = existingBytes ? new SQL.Database(existingBytes) : new SQL.Database();
  db.exec("PRAGMA foreign_keys = ON;");
  return { SQL, db };
}

export function createSqlJsContextFromStatic(SQL: SqlJsStatic, existingBytes?: Uint8Array): SqlJsContext {
  const db = existingBytes ? new SQL.Database(existingBytes) : new SQL.Database();
  db.exec("PRAGMA foreign_keys = ON;");
  return { SQL, db };
}

export function exportDatabase(db: Database): Uint8Array {
  return db.export();
}

export function runSql(db: Database, sqlText: string): void {
  db.exec(sqlText);
}

export function queryAll(
  db: Database,
  sqlText: string,
  params: (string | number | null)[] = [],
): Record<string, unknown>[] {
  const stmt = db.prepare(sqlText);
  stmt.bind(params);
  const rows: Record<string, unknown>[] = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

export function queryOne(
  db: Database,
  sqlText: string,
  params: (string | number | null)[] = [],
): Record<string, unknown> | null {
  return queryAll(db, sqlText, params)[0] ?? null;
}

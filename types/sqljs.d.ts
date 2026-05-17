declare module "sql.js" {
  export type SqlValue = string | number | Uint8Array | null;

  export type Statement = {
    bind(values?: SqlValue[]): boolean;
    step(): boolean;
    getAsObject(): Record<string, unknown>;
    free(): void;
  };

  export class Database {
    constructor(data?: Uint8Array);
    exec(sql: string): unknown[];
    export(): Uint8Array;
    prepare(sql: string): Statement;
    run(sql: string, params?: SqlValue[]): void;
  }

  export type SqlJsStatic = {
    Database: typeof Database;
  };

  export default function initSqlJs(config?: {
    locateFile?: (file: string) => string;
  }): Promise<SqlJsStatic>;
}

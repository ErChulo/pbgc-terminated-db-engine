import migration0001 from "../../../packages/db/migrations/sqlite_migration_0001_v0.1.0.sql.txt?raw";
import migration0002 from "../../../packages/db/migrations/sqlite_migration_0002_reference_tables_v0.1.0.sql.txt?raw";
import migration0003 from "../../../packages/db/migrations/sqlite_migration_0003_engine_packets_v0.1.0.sql.txt?raw";
import migration0004 from "../../../packages/db/migrations/sqlite_migration_0004_engine_outputs_v0.1.0.sql.txt?raw";
import migration0005 from "../../../packages/db/migrations/sqlite_migration_0005_output_adapters_v0.1.0.sql.txt?raw";
import seedCaseShell from "../../../packages/db/seeds/seed_case_shell_v0.1.0.sql.txt?raw";
import seedReferenceTables from "../../../packages/db/seeds/seed_reference_tables_v0.1.0.sql.txt?raw";

export type SqlArtifact = {
  name: string;
  sql: string;
};

export const MVP_MIGRATIONS: SqlArtifact[] = [
  { name: "sqlite_migration_0001_v0.1.0", sql: migration0001 },
  { name: "sqlite_migration_0002_reference_tables_v0.1.0", sql: migration0002 },
  { name: "sqlite_migration_0003_engine_packets_v0.1.0", sql: migration0003 },
  { name: "sqlite_migration_0004_engine_outputs_v0.1.0", sql: migration0004 },
  { name: "sqlite_migration_0005_output_adapters_v0.1.0", sql: migration0005 },
];

export const MVP_SEEDS: SqlArtifact[] = [
  { name: "seed_case_shell_v0.1.0", sql: seedCaseShell },
  { name: "seed_reference_tables_v0.1.0", sql: seedReferenceTables },
];

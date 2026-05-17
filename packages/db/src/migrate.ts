import type { Database } from "sql.js";
import { MVP_MIGRATIONS, MVP_SEEDS, type SqlArtifact } from "./artifacts";
import { runSql } from "./sqljs";

export function applySqlArtifacts(db: Database, artifacts: SqlArtifact[]): void {
  for (const artifact of artifacts) {
    try {
      runSql(db, artifact.sql);
    } catch (error) {
      throw new Error(`Failed to apply SQL artifact ${artifact.name}: ${(error as Error).message}`);
    }
  }
}

export function applyMvpDatabaseFoundation(db: Database): void {
  applySqlArtifacts(db, MVP_MIGRATIONS);
  applySqlArtifacts(db, MVP_SEEDS);
}

/**
 * BSRS deterministic row ordering.
 * Ensures output rows are consistently ordered across repeated runs.
 * Sort precedence: statement_row_type → statement_sort_key → calculation_run_id.
 */
import type { BsrsConfigurationOutputArtifact } from "./types";

const ROW_TYPE_SORT_ORDER: Record<string, number> = {
  participant: 1,
  beneficiary: 2,
  alternate_payee: 3,
  survivor: 4,
  suppressed: 5,
};

/**
 * Sort a collection of BSRS output artifacts deterministically.
 * Order: statement_row_type (participant → beneficiary → alternate_payee → survivor → suppressed),
 * then statement_sort_key alphabetically, then calculation_run_id.
 */
export function sortBsrsOutputRows(artifacts: readonly BsrsConfigurationOutputArtifact[]): BsrsConfigurationOutputArtifact[] {
  return [...artifacts].sort((a, b) => {
    const typeA = ROW_TYPE_SORT_ORDER[a.metadata.statement_row_type] ?? 99;
    const typeB = ROW_TYPE_SORT_ORDER[b.metadata.statement_row_type] ?? 99;
    if (typeA !== typeB) return typeA - typeB;

    const keyA = a.metadata.statement_sort_key;
    const keyB = b.metadata.statement_sort_key;
    if (keyA !== keyB) return keyA.localeCompare(keyB, undefined, { sensitivity: "base" });

    return a.metadata.calculation_run_id.localeCompare(b.metadata.calculation_run_id, undefined, { sensitivity: "base" });
  });
}

/**
 * Compute a stable statement_sort_key for a BSRS row based on its metadata.
 * Format: `{statement_row_type}|{bcv_rec_id}|{case_id}`
 */
export function computeBsrsStatementSortKey(
  statementRowType: string,
  bcvRecId: string,
  caseId: string,
): string {
  return `${statementRowType}|${bcvRecId}|${caseId}`;
}

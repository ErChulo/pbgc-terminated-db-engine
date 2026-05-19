import type { BsrsSemanticValidationFinding } from "./semanticValidationTypes";

export function sortSemanticValidationFindings(findings: readonly BsrsSemanticValidationFinding[]): BsrsSemanticValidationFinding[] {
  return [...findings].sort(
    (left, right) =>
      left.source_path.localeCompare(right.source_path) ||
      left.row_index - right.row_index ||
      left.column_name.localeCompare(right.column_name) ||
      left.code.localeCompare(right.code) ||
      left.token.localeCompare(right.token),
  );
}

export function serializeSemanticValidationFindings(findings: readonly BsrsSemanticValidationFinding[]): string {
  return JSON.stringify(sortSemanticValidationFindings(findings));
}

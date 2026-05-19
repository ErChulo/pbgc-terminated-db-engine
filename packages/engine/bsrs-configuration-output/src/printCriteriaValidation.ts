import type { BsrsParsedSample } from "./bsrsSampleParser";
import { makeBsrsSemanticFinding, type BsrsSemanticValidationFinding } from "./semanticValidationTypes";
import { extractStatementAuthoringFunctionNames } from "./statementAuthoringFunctions";

export function validatePrintCriteria(input: {
  allowedFunctions: ReadonlySet<string>;
  samples: readonly BsrsParsedSample[];
}): BsrsSemanticValidationFinding[] {
  return input.samples.flatMap((sample) =>
    sample.rows.flatMap((row) => {
      const printCriteria = row.values.PrintCriteria ?? "";
      const findings: BsrsSemanticValidationFinding[] = [];

      if (!hasBalancedDoubleQuotes(printCriteria)) {
        findings.push(
          makeBsrsSemanticFinding({
            code: "BSRS_PRINTCRITERIA_UNBALANCED_QUOTES",
            severity: "error",
            category: "printcriteria",
            source_path: sample.source_path,
            row_index: row.row_index,
            column_name: "PrintCriteria",
            token: printCriteria,
            message: "PrintCriteria has unbalanced quoted text",
          }),
        );
      }

      for (const name of extractStatementAuthoringFunctionNames(printCriteria)) {
        if (!input.allowedFunctions.has(name)) {
          findings.push(
            makeBsrsSemanticFinding({
              code: "BSRS_PRINTCRITERIA_UNSUPPORTED_FUNCTION",
              severity: "error",
              category: "printcriteria",
              source_path: sample.source_path,
              row_index: row.row_index,
              column_name: "PrintCriteria",
              token: name,
              message: `PrintCriteria references unsupported Statement Authoring function ${name}`,
            }),
          );
        }
      }

      return findings;
    }),
  );
}

function hasBalancedDoubleQuotes(value: string): boolean {
  return (value.match(/"/g) ?? []).length % 2 === 0;
}

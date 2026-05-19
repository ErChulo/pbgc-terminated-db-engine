import { parseBsrsSample } from "./bsrsSampleParser";
import { makeBsrsSemanticFinding, type BsrsSemanticValidationFinding, type BsrsSemanticValidationSource } from "./semanticValidationTypes";

export type StatementAuthoringFunctionReference = {
  name: string;
  source_path: string;
  row_index: number;
  column_name: string;
};

export function parseAllowedStatementAuthoringFunctions(text: string): Set<string> {
  return new Set(
    text
      .split(/\r?\n/)
      .map((line) => line.trim().toUpperCase())
      .filter((line) => /^[A-Z][A-Z0-9_]*$/.test(line)),
  );
}

export function extractStatementAuthoringFunctionNames(text: string): string[] {
  return [...text.matchAll(/@([A-Za-z][A-Za-z0-9_]*)\s*\(/g)].map((match) => match[1].toUpperCase());
}

export function extractStatementAuthoringFunctionReferences(sources: readonly BsrsSemanticValidationSource[]): StatementAuthoringFunctionReference[] {
  return sources.flatMap((source) => {
    const sample = parseBsrsSample(source);
    return sample.rows.flatMap((row) =>
      Object.entries(row.values).flatMap(([column_name, value]) =>
        extractStatementAuthoringFunctionNames(value).map((name) => ({
          name,
          source_path: sample.source_path,
          row_index: row.row_index,
          column_name,
        })),
      ),
    );
  });
}

export function validateStatementAuthoringFunctions(input: {
  allowedFunctions: ReadonlySet<string>;
  sources: readonly BsrsSemanticValidationSource[];
}): BsrsSemanticValidationFinding[] {
  return extractStatementAuthoringFunctionReferences(input.sources)
    .filter((reference) => !input.allowedFunctions.has(reference.name))
    .map((reference) =>
      makeBsrsSemanticFinding({
        code: "BSRS_UNSUPPORTED_FUNCTION",
        severity: "error",
        category: "statement_authoring_function",
        source_path: reference.source_path,
        row_index: reference.row_index,
        column_name: reference.column_name,
        token: reference.name,
        message: `Unsupported Statement Authoring function ${reference.name}`,
      }),
    );
}

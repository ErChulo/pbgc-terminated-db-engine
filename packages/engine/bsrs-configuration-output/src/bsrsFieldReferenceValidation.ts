import { parseBsrsSample, type BsrsParsedSample } from "./bsrsSampleParser";
import { canonicalDdFieldName } from "./ddMapping";
import { makeBsrsSemanticFinding, type BsrsSemanticValidationFinding, type BsrsSemanticValidationSource } from "./semanticValidationTypes";
import { BSRS_CONFIGURATION_OUTPUT_FIELDS } from "./types";

export type FieldVocabularySource = "dd_csv" | "current_committed_field" | "approved_sample_fallback" | "control";

export type BsrsFieldReference = {
  token: string;
  normalized_token: string;
  source_path: string;
  row_index: number;
  column_name: string;
};

export type BsrsFieldResolution = {
  token: string;
  normalized_token: string;
  canonical_name: string;
  vocabulary_source: FieldVocabularySource;
  dd_backed: boolean;
  approved_fallback: boolean;
};

export type BsrsFieldReferenceValidationInput = {
  samples: readonly BsrsParsedSample[];
  ddFieldNames: ReadonlySet<string>;
  currentFieldNames: ReadonlySet<string>;
  approvedFallbackFields: ReadonlySet<string>;
};

const CONTROL_TOKENS = new Set([
  "AND",
  "OR",
  "NOT",
  "TRUE",
  "FALSE",
  "HLINE",
  "BOLD",
  "BU",
  "TL",
  "TC",
  "TR",
  "TH",
  "D4",
  "F4",
]);

export function parseDdCsvFieldNames(text: string): Set<string> {
  const names = text
    .split(/\r?\n/)
    .map((line) => line.split(",")[0]?.trim().replace(/^"|"$/g, "").toUpperCase() ?? "")
    .filter((fieldName) => /^[A-Z][A-Z0-9_]*$/.test(fieldName) && fieldName !== "FIELD_NAME");
  return new Set(names);
}

export function buildCurrentCommittedFieldVocabulary(): Set<string> {
  const names = BSRS_CONFIGURATION_OUTPUT_FIELDS.flatMap((fieldName) => [
    normalizeFieldToken(fieldName),
    normalizeFieldToken(canonicalDdFieldName(fieldName)),
  ]);
  return new Set(names);
}

export function buildApprovedBsrsFallbackFieldVocabulary(input: {
  samples: readonly BsrsParsedSample[];
  ddFieldNames: ReadonlySet<string>;
  currentFieldNames: ReadonlySet<string>;
}): Set<string> {
  const fallbackFields = extractBsrsFieldReferences(input.samples)
    .map((reference) => reference.normalized_token)
    .filter((token) => !input.ddFieldNames.has(token))
    .filter((token) => !input.currentFieldNames.has(token))
    .filter((token) => !isControlToken(token));
  return new Set(fallbackFields);
}

export function extractBsrsFieldReferences(samples: readonly BsrsParsedSample[]): BsrsFieldReference[] {
  return samples.flatMap((sample) =>
    sample.rows.flatMap((row) =>
      Object.entries(row.values).flatMap(([column_name, value]) =>
        extractTokensOutsideQuotedText(value).map((token) => ({
          token,
          normalized_token: normalizeFieldToken(token),
          source_path: sample.source_path,
          row_index: row.row_index,
          column_name,
        })),
      ),
    ),
  );
}

export function resolveBsrsFieldReference(
  token: string,
  input: Pick<BsrsFieldReferenceValidationInput, "ddFieldNames" | "currentFieldNames" | "approvedFallbackFields">,
): BsrsFieldResolution | null {
  const normalized = normalizeFieldToken(token);
  if (input.ddFieldNames.has(normalized)) {
    return makeResolution(token, normalized, normalized, "dd_csv", true, false);
  }
  if (input.currentFieldNames.has(normalized)) {
    return makeResolution(token, normalized, normalized, "current_committed_field", false, false);
  }
  if (input.approvedFallbackFields.has(normalized)) {
    return makeResolution(token, normalized, normalized, "approved_sample_fallback", false, true);
  }
  if (isControlToken(normalized)) {
    return makeResolution(token, normalized, normalized, "control", false, false);
  }
  return null;
}

export function validateBsrsFieldReferences(input: BsrsFieldReferenceValidationInput): BsrsSemanticValidationFinding[] {
  return extractBsrsFieldReferences(input.samples).flatMap((reference) => {
    const resolution = resolveBsrsFieldReference(reference.token, input);
    if (resolution) return [];
    return [
      makeBsrsSemanticFinding({
        code: "BSRS_FIELD_REFERENCE_UNKNOWN",
        severity: "error",
        category: "field_reference",
        source_path: reference.source_path,
        row_index: reference.row_index,
        column_name: reference.column_name,
        token: reference.token,
        message: `Unknown BSRS field reference ${reference.token}`,
      }),
    ];
  });
}

export function validateBsrsFieldReferencesFromSources(input: {
  sources: readonly BsrsSemanticValidationSource[];
  ddCsvText: string;
}): BsrsSemanticValidationFinding[] {
  const samples = input.sources.map(parseBsrsSample);
  const ddFieldNames = parseDdCsvFieldNames(input.ddCsvText);
  const currentFieldNames = buildCurrentCommittedFieldVocabulary();
  return validateBsrsFieldReferences({
    samples,
    ddFieldNames,
    currentFieldNames,
    approvedFallbackFields: buildApprovedBsrsFallbackFieldVocabulary({ samples, ddFieldNames, currentFieldNames }),
  });
}

function makeResolution(
  token: string,
  normalizedToken: string,
  canonicalName: string,
  vocabularySource: FieldVocabularySource,
  ddBacked: boolean,
  approvedFallback: boolean,
): BsrsFieldResolution {
  return {
    token,
    normalized_token: normalizedToken,
    canonical_name: canonicalName,
    vocabulary_source: vocabularySource,
    dd_backed: ddBacked,
    approved_fallback: approvedFallback,
  };
}

function normalizeFieldToken(token: string): string {
  return token.trim().toUpperCase();
}

function isControlToken(token: string): boolean {
  return CONTROL_TOKENS.has(token) || /^I\d{3}$/.test(token) || /^LN$/.test(token);
}

function extractTokensOutsideQuotedText(value: string): string[] {
  const unquoted = stripDoubleQuotedText(value);
  const tokens = [...unquoted.matchAll(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)]
    .filter((match) => unquoted[match.index - 1] !== "@")
    .map((match) => match[0])
    .filter((token) => !/^[A-Za-z]$/.test(token));
  return [...new Set(tokens)];
}

function stripDoubleQuotedText(value: string): string {
  let result = "";
  let inQuote = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char !== '"') {
      if (!inQuote) result += char;
      continue;
    }
    if (inQuote && value[index + 1] === '"') {
      index += 1;
      continue;
    }
    inQuote = !inQuote;
  }
  return result;
}

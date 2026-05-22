import { parseBsrsSample } from "./bsrsSampleParser";
import { normalizeBsrsSemanticSources } from "./bsrsSampleLoader";
import { validateOptionalFormBlockPatterns, validateRecalculationBlockPatterns, validateStatementBlockPatterns } from "./bsrsBlockPatternValidation";
import { validateBsrsFieldReferencesFromSources } from "./bsrsFieldReferenceValidation";
import { validatePrintCriteria } from "./printCriteriaValidation";
import { type BsrsSemanticValidationFinding, type BsrsSemanticValidationSource } from "./semanticValidationTypes";
import { parseAllowedStatementAuthoringFunctions, validateStatementAuthoringFunctions } from "./statementAuthoringFunctions";
import { sortSemanticValidationFindings } from "./semanticValidationTrace";

export function validateBsrsSemanticUs1(input: {
  functionListText: string;
  sources: readonly BsrsSemanticValidationSource[];
}): BsrsSemanticValidationFinding[] {
  const allowedFunctions = parseAllowedStatementAuthoringFunctions(input.functionListText);
  const sources = normalizeBsrsSemanticSources(input.sources);
  const samples = sources.map(parseBsrsSample);

  return sortSemanticValidationFindings([
    ...validateStatementAuthoringFunctions({ allowedFunctions, sources }),
    ...validatePrintCriteria({ allowedFunctions, samples }),
  ]);
}

export function validateBsrsSemanticFieldReferences(input: {
  ddCsvText: string;
  sources: readonly BsrsSemanticValidationSource[];
}): BsrsSemanticValidationFinding[] {
  return sortSemanticValidationFindings(validateBsrsFieldReferencesFromSources(input));
}

export function validateBsrsSemanticBlockPatterns(input: {
  sources: readonly BsrsSemanticValidationSource[];
}): BsrsSemanticValidationFinding[] {
  const sources = normalizeBsrsSemanticSources(input.sources);
  const samples = sources.map(parseBsrsSample);

  return sortSemanticValidationFindings([
    ...validateStatementBlockPatterns(samples).findings,
    ...validateRecalculationBlockPatterns(samples).findings,
    ...validateOptionalFormBlockPatterns(samples).findings,
  ]);
}

import type { BsrsSemanticValidationSource } from "./semanticValidationTypes";

export function normalizeBsrsSemanticSources(sources: readonly BsrsSemanticValidationSource[]): BsrsSemanticValidationSource[] {
  return [...sources]
    .map((source) => ({
      source_path: source.source_path.replaceAll("\\", "/"),
      text: source.text,
    }))
    .sort((left, right) => left.source_path.localeCompare(right.source_path));
}

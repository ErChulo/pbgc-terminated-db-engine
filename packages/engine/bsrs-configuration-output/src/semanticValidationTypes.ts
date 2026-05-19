import { BSRS_CONFIGURATION_OUTPUT_MODULE_NAME, BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION } from "./types";

export const BSRS_SEMANTIC_VALIDATION_RULE_VERSION = `${BSRS_CONFIGURATION_OUTPUT_MODULE_NAME}@${BSRS_CONFIGURATION_OUTPUT_MODULE_VERSION}:semantic_validation`;
export const BSRS_SEMANTIC_VALIDATION_MODULE = BSRS_CONFIGURATION_OUTPUT_MODULE_NAME;

export type BsrsSemanticValidationSeverity = "warning" | "error";

export type BsrsSemanticValidationCategory =
  | "statement_authoring_function"
  | "printcriteria"
  | "field_reference"
  | "block_pattern";

export type BsrsSemanticValidationFinding = {
  code: string;
  severity: BsrsSemanticValidationSeverity;
  category: BsrsSemanticValidationCategory;
  source_path: string;
  row_index: number;
  column_name: string;
  token: string;
  message: string;
  rule_version: string;
  producing_module: typeof BSRS_SEMANTIC_VALIDATION_MODULE;
};

export type BsrsSemanticValidationSource = {
  source_path: string;
  text: string;
};

export function makeBsrsSemanticFinding(
  finding: Omit<BsrsSemanticValidationFinding, "rule_version" | "producing_module"> & {
    rule_version?: string;
  },
): BsrsSemanticValidationFinding {
  return {
    ...finding,
    rule_version: finding.rule_version ?? BSRS_SEMANTIC_VALIDATION_RULE_VERSION,
    producing_module: BSRS_SEMANTIC_VALIDATION_MODULE,
  };
}

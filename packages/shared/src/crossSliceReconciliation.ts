export const CROSS_SLICE_RECONCILIATION_MODULE_NAME = "cross_slice_reconciliation" as const;
export const CROSS_SLICE_RECONCILIATION_RULE_VERSION = "0.1.0" as const;

export type ReconciliationSliceName = "bsrs_configuration_output" | "v1_ve_output" | "valuation_listings_output";

export type SharedFactFamily =
  | "participant_identifier"
  | "plan_identifier"
  | "case_identifier"
  | "form_reference"
  | "dd_backed_field";

export type ReconciliationMappingBasis = "dd" | "approved_fallback";

export type ReconciliationStatus =
  | "accepted"
  | "drift"
  | "unsupported"
  | "absent_optional"
  | "formatting_only";

export type ReconciliationSeverity = "warning" | "error";

export type ValueFactFamily =
  | "participant_identifier"
  | "form_reference"
  | "nullable_fact"
  | "categorical_value"
  | "numeric_value";

export type ValueType = "identifier" | "form_code" | "categorical" | "numeric" | "boolean" | "nullable";

export type ValueReconciliationStatus =
  | "accepted"
  | "blocking_mismatch"
  | "non_blocking_warning"
  | "accepted_nullable"
  | "unsupported"
  | "formatting_only";

export type ValueReconciliationSeverity = "error" | "warning" | "info";

export type ValueReconciliationRule = {
  rule_key: string;
  fact_family: ValueFactFamily;
  value_type: ValueType;
  reviewed_fact_context: string;
  canonical_semantic_name: string;
  mapping_basis: ReconciliationMappingBasis;
  dd_field_name: string | null;
  fallback_name: string | null;
  fields_by_slice: Partial<Record<ReconciliationSliceName, string>>;
  required_or_nullable_basis: string;
  normalization_basis: string;
  severity_policy: "blocking_required_mismatch" | "nullable_non_blocking";
  accepted_format_variants?: readonly string[];
  unsupported_branch_codes?: readonly string[];
};

export type ValueComparisonRecord = {
  comparison_id: string;
  rule_key: string;
  case_id: string;
  reviewed_fact_context: string;
  value_type: ValueType;
  canonical_semantic_name: string;
  mapping_basis: ReconciliationMappingBasis;
  dd_field_name: string | null;
  fallback_name: string | null;
  required_or_nullable_basis: string;
  normalization_basis: string;
  left_slice: ReconciliationSliceName;
  left_field: string;
  left_value: string | number | boolean | null;
  left_normalized_value: string | number | boolean | null;
  left_source_path: string;
  right_slice: ReconciliationSliceName;
  right_field: string;
  right_value: string | number | boolean | null;
  right_normalized_value: string | number | boolean | null;
  right_source_path: string;
  status: ValueReconciliationStatus;
  severity: ValueReconciliationSeverity;
  code: string;
  rule_version: string;
  producing_module: typeof CROSS_SLICE_RECONCILIATION_MODULE_NAME;
};

export type ValueReconciliationFinding = {
  code: string;
  severity: ValueReconciliationSeverity;
  category: "cross_slice_value_reconciliation";
  case_id: string;
  rule_key: string;
  reviewed_fact_context: string;
  value_type: ValueType;
  canonical_semantic_name: string;
  mapping_basis: ReconciliationMappingBasis;
  dd_field_name: string | null;
  fallback_name: string | null;
  required_or_nullable_basis: string;
  normalization_basis: string;
  compared_slices: [ReconciliationSliceName, ReconciliationSliceName];
  compared_fields: [string, string];
  compared_values: [string | number | boolean | null, string | number | boolean | null];
  normalized_values: [string | number | boolean | null, string | number | boolean | null];
  source_paths: [string, string];
  rule_version: string;
  producing_module: typeof CROSS_SLICE_RECONCILIATION_MODULE_NAME;
  message: string;
};

export type CrossSliceValueReconciliationResult = {
  comparisons: ValueComparisonRecord[];
  findings: ValueReconciliationFinding[];
};

export type SharedFactDefinition = {
  fact_key: string;
  fact_family: SharedFactFamily;
  reviewed_fact_context: string;
  canonical_semantic_name: string;
  mapping_basis: ReconciliationMappingBasis;
  dd_field_name: string | null;
  fallback_name: string | null;
  expected_presence: "required" | "optional";
  fields_by_slice: Partial<Record<ReconciliationSliceName, string>>;
  accepted_format_variants?: readonly string[];
  unsupported_branch_codes?: readonly string[];
};

export type ReconciliationEvidence = {
  case_id: string;
  slice: ReconciliationSliceName;
  field: string;
  value: string | number | boolean | null;
  source_path: string;
};

export type ReconciliationComparison = {
  comparison_id: string;
  case_id: string;
  fact_key: string;
  fact_family: SharedFactFamily;
  reviewed_fact_context: string;
  canonical_semantic_name: string;
  mapping_basis: ReconciliationMappingBasis;
  dd_field_name: string | null;
  fallback_name: string | null;
  left_slice: ReconciliationSliceName;
  left_field: string;
  left_value: string | number | boolean | null;
  left_source_path: string;
  right_slice: ReconciliationSliceName;
  right_field: string;
  right_value: string | number | boolean | null;
  right_source_path: string;
  status: ReconciliationStatus;
  rule_version: string;
  producing_module: typeof CROSS_SLICE_RECONCILIATION_MODULE_NAME;
};

export type CrossSliceDriftFinding = {
  code: string;
  severity: ReconciliationSeverity;
  category: "cross_slice_reconciliation";
  case_id: string;
  reviewed_fact_context: string;
  canonical_semantic_name: string;
  mapping_basis: ReconciliationMappingBasis;
  dd_field_name: string | null;
  fallback_name: string | null;
  compared_slices: [ReconciliationSliceName, ReconciliationSliceName];
  compared_fields: [string, string];
  compared_values: [string | number | boolean | null, string | number | boolean | null];
  source_paths: [string, string];
  rule_version: string;
  producing_module: typeof CROSS_SLICE_RECONCILIATION_MODULE_NAME;
  message: string;
};

export type CrossSliceReconciliationResult = {
  comparisons: ReconciliationComparison[];
  findings: CrossSliceDriftFinding[];
};

export const SELECTED_SHARED_FACT_INVENTORY: readonly SharedFactDefinition[] = [
  {
    fact_key: "participant_identifier.id",
    fact_family: "participant_identifier",
    reviewed_fact_context: "reviewed participant identifier shared by output slices",
    canonical_semantic_name: "ID",
    mapping_basis: "dd",
    dd_field_name: "ID",
    fallback_name: null,
    expected_presence: "required",
    fields_by_slice: {
      bsrs_configuration_output: "id",
      v1_ve_output: "id",
      valuation_listings_output: "id",
    },
  },
  {
    fact_key: "participant_identifier.bcv_rec_id",
    fact_family: "participant_identifier",
    reviewed_fact_context: "reviewed BCV record identifier shared by output slices",
    canonical_semantic_name: "BCV_REC_ID",
    mapping_basis: "dd",
    dd_field_name: "BCV_REC_ID",
    fallback_name: null,
    expected_presence: "required",
    fields_by_slice: {
      bsrs_configuration_output: "bcv_rec_id",
      v1_ve_output: "bcv_rec_id",
      valuation_listings_output: "bcv_rec_id",
    },
  },
  {
    fact_key: "case_identifier.case_id",
    fact_family: "case_identifier",
    reviewed_fact_context: "reviewed case identifier shared by output slices",
    canonical_semantic_name: "CASE",
    mapping_basis: "dd",
    dd_field_name: "CASE",
    fallback_name: null,
    expected_presence: "required",
    fields_by_slice: {
      bsrs_configuration_output: "case_id",
      valuation_listings_output: "case_id",
    },
  },
  {
    fact_key: "plan_identifier.plan_id",
    fact_family: "plan_identifier",
    reviewed_fact_context: "reviewed plan identifier shared by output slices",
    canonical_semantic_name: "plan_id",
    mapping_basis: "approved_fallback",
    dd_field_name: null,
    fallback_name: "plan_id",
    expected_presence: "required",
    fields_by_slice: {
      bsrs_configuration_output: "plan_id",
      valuation_listings_output: "plan_id",
    },
  },
  {
    fact_key: "form_reference.form_code_nsf",
    fact_family: "form_reference",
    reviewed_fact_context: "reviewed normal single form code shared by output slices",
    canonical_semantic_name: "FORM_CODE_NSF",
    mapping_basis: "dd",
    dd_field_name: "FORM_CODE_NSF",
    fallback_name: null,
    expected_presence: "optional",
    fields_by_slice: {
      bsrs_configuration_output: "form_code_nsf",
      v1_ve_output: "form_code_nsf",
      valuation_listings_output: "form_code_nsf",
    },
  },
  {
    fact_key: "dd_backed_field.retstat",
    fact_family: "dd_backed_field",
    reviewed_fact_context: "reviewed retirement status shared by output slices",
    canonical_semantic_name: "RETSTAT",
    mapping_basis: "dd",
    dd_field_name: "RETSTAT",
    fallback_name: null,
    expected_presence: "required",
    fields_by_slice: {
      bsrs_configuration_output: "retstat",
      v1_ve_output: "retstat",
      valuation_listings_output: "retstat",
    },
  },
];

export const SELECTED_SHARED_VALUE_INVENTORY: readonly ValueReconciliationRule[] = [
  {
    rule_key: "participant_identifier.id",
    fact_family: "participant_identifier",
    value_type: "identifier",
    reviewed_fact_context: "reviewed participant identifier value shared by output slices",
    canonical_semantic_name: "ID",
    mapping_basis: "dd",
    dd_field_name: "ID",
    fallback_name: null,
    fields_by_slice: {
      bsrs_configuration_output: "id",
      v1_ve_output: "id",
      valuation_listings_output: "id",
    },
    required_or_nullable_basis: "required by current BSRS, V1/VE, and valuation-listing output contracts",
    normalization_basis: "trim string values and compare upper-case identifier text",
    severity_policy: "blocking_required_mismatch",
  },
  {
    rule_key: "form_reference.form_code_nsf",
    fact_family: "form_reference",
    value_type: "form_code",
    reviewed_fact_context: "reviewed normal single form value shared by output slices",
    canonical_semantic_name: "FORM_CODE_NSF",
    mapping_basis: "dd",
    dd_field_name: "FORM_CODE_NSF",
    fallback_name: null,
    fields_by_slice: {
      bsrs_configuration_output: "form_code_nsf",
      v1_ve_output: "form_code_nsf",
      valuation_listings_output: "form_code_nsf",
    },
    required_or_nullable_basis: "nullable by current form-resolution and output contracts when a branch has no normal single form",
    normalization_basis: "trim string values and compare upper-case form codes",
    severity_policy: "nullable_non_blocking",
  },
  {
    rule_key: "nullable_fact.current_payment_amount",
    fact_family: "nullable_fact",
    value_type: "nullable",
    reviewed_fact_context: "reviewed current payment amount nullable across statement and valuation evidence",
    canonical_semantic_name: "current_payment_amount",
    mapping_basis: "approved_fallback",
    dd_field_name: null,
    fallback_name: "current_payment_amount",
    fields_by_slice: {
      bsrs_configuration_output: "current_payment_amount",
      valuation_listings_output: "current_payment_amount",
    },
    required_or_nullable_basis: "nullable unless the participant is in current-pay status under current contracts",
    normalization_basis: "preserve nulls and compare numeric payment amounts when present",
    severity_policy: "nullable_non_blocking",
  },
  {
    rule_key: "numeric_value.xra",
    fact_family: "numeric_value",
    value_type: "numeric",
    reviewed_fact_context: "reviewed expected retirement age value shared by output slices",
    canonical_semantic_name: "XRA",
    mapping_basis: "dd",
    dd_field_name: "XRA",
    fallback_name: null,
    fields_by_slice: {
      bsrs_configuration_output: "xra",
      v1_ve_output: "xra",
      valuation_listings_output: "xra",
    },
    required_or_nullable_basis: "nullable only when expected retirement age is not resolved by current contracts",
    normalization_basis: "compare finite numeric values after deterministic numeric coercion",
    severity_policy: "blocking_required_mismatch",
  },
  {
    rule_key: "categorical_value.retstat",
    fact_family: "categorical_value",
    value_type: "categorical",
    reviewed_fact_context: "reviewed retirement status category shared by output slices",
    canonical_semantic_name: "RETSTAT",
    mapping_basis: "dd",
    dd_field_name: "RETSTAT",
    fallback_name: null,
    fields_by_slice: {
      bsrs_configuration_output: "retstat",
      v1_ve_output: "retstat",
      valuation_listings_output: "retstat",
    },
    required_or_nullable_basis: "required by current participant population contracts",
    normalization_basis: "trim string values and compare upper-case retirement status codes",
    severity_policy: "blocking_required_mismatch",
  },
];

export function buildEvidenceForInventory(args: {
  case_id: string;
  slice: ReconciliationSliceName;
  row: Record<string, string | number | boolean | null | undefined>;
  source_path: string;
  inventory?: readonly SharedFactDefinition[];
}): ReconciliationEvidence[] {
  const inventory = args.inventory ?? SELECTED_SHARED_FACT_INVENTORY;
  return inventory
    .flatMap((fact) => {
      const field = fact.fields_by_slice[args.slice];
      if (!field) return [];
      return [
        {
          case_id: args.case_id,
          slice: args.slice,
          field,
          value: args.row[field] ?? null,
          source_path: args.source_path,
        },
      ];
    })
    .sort(compareEvidence);
}

export function reconcileSharedFacts(args: {
  inventory?: readonly SharedFactDefinition[];
  evidence: readonly ReconciliationEvidence[];
  rule_version?: string;
}): CrossSliceReconciliationResult {
  const inventory = [...(args.inventory ?? SELECTED_SHARED_FACT_INVENTORY)].sort(compareSharedFacts);
  const evidence = [...args.evidence].sort(compareEvidence);
  const ruleVersion = args.rule_version ?? CROSS_SLICE_RECONCILIATION_RULE_VERSION;
  const comparisons = sortReconciliationComparisons(inventory.flatMap((fact) => compareFactEvidence(fact, evidence, ruleVersion)));
  return {
    comparisons,
    findings: comparisons.filter((comparison) => comparison.status === "drift").map(toDriftFinding).sort(compareFindings),
  };
}

export function buildEvidenceForValueInventory(args: {
  case_id: string;
  slice: ReconciliationSliceName;
  row: Record<string, string | number | boolean | null | undefined>;
  source_path: string;
  inventory?: readonly ValueReconciliationRule[];
}): ReconciliationEvidence[] {
  const inventory = args.inventory ?? SELECTED_SHARED_VALUE_INVENTORY;
  return inventory
    .flatMap((rule) => {
      const field = rule.fields_by_slice[args.slice];
      if (!field) return [];
      return [
        {
          case_id: args.case_id,
          slice: args.slice,
          field,
          value: args.row[field] ?? null,
          source_path: args.source_path,
        },
      ];
    })
    .sort(compareEvidence);
}

export function reconcileSharedValues(args: {
  inventory?: readonly ValueReconciliationRule[];
  evidence: readonly ReconciliationEvidence[];
  rule_version?: string;
}): CrossSliceValueReconciliationResult {
  const inventory = [...(args.inventory ?? SELECTED_SHARED_VALUE_INVENTORY)].sort((left, right) => left.rule_key.localeCompare(right.rule_key));
  const evidence = [...args.evidence].sort(compareEvidence);
  const ruleVersion = args.rule_version ?? CROSS_SLICE_RECONCILIATION_RULE_VERSION;
  const comparisons = sortValueComparisonRecords(inventory.flatMap((rule) => compareValueEvidence(rule, evidence, ruleVersion)));
  return {
    comparisons,
    findings: comparisons.filter((comparison) => comparison.status === "blocking_mismatch" || comparison.status === "non_blocking_warning").map(toValueFinding).sort(compareValueFindings),
  };
}

export function normalizeReviewedValue(value: string | number | boolean | null): string | number | boolean | null {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed.toUpperCase();
}

export function sortReconciliationComparisons(comparisons: readonly ReconciliationComparison[]): ReconciliationComparison[] {
  return [...comparisons].sort(compareComparisons).map((comparison, index) => ({
    ...comparison,
    comparison_id: `comparison-${String(index + 1).padStart(6, "0")}`,
  }));
}

export function normalizeValueForRule(rule: ValueReconciliationRule, value: string | number | boolean | null): string | number | boolean | null {
  if (value === null) return null;
  if (rule.value_type === "numeric" || rule.value_type === "nullable") {
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length === 0) return null;
      const numeric = Number(trimmed.replace(/,/g, ""));
      return Number.isFinite(numeric) ? numeric : trimmed.toUpperCase();
    }
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed.toUpperCase();
  }
  return value;
}

export function sortValueComparisonRecords(comparisons: readonly ValueComparisonRecord[]): ValueComparisonRecord[] {
  return [...comparisons].sort(compareValueComparisons).map((comparison, index) => ({
    ...comparison,
    comparison_id: `value-comparison-${String(index + 1).padStart(6, "0")}`,
  }));
}

function compareValueEvidence(
  rule: ValueReconciliationRule,
  evidence: readonly ReconciliationEvidence[],
  ruleVersion: string,
): ValueComparisonRecord[] {
  const ruleEvidence = evidence.filter((item) => rule.fields_by_slice[item.slice] === item.field).sort(compareEvidence);
  const pairs: ValueComparisonRecord[] = [];
  for (let leftIndex = 0; leftIndex < ruleEvidence.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < ruleEvidence.length; rightIndex += 1) {
      const left = ruleEvidence[leftIndex];
      const right = ruleEvidence[rightIndex];
      if (left.case_id !== right.case_id) continue;
      const leftNormalizedValue = normalizeValueForRule(rule, left.value);
      const rightNormalizedValue = normalizeValueForRule(rule, right.value);
      const classification = classifyValueComparison(rule, left.value, right.value, leftNormalizedValue, rightNormalizedValue);
      pairs.push({
        comparison_id: "",
        rule_key: rule.rule_key,
        case_id: left.case_id,
        reviewed_fact_context: rule.reviewed_fact_context,
        value_type: rule.value_type,
        canonical_semantic_name: rule.canonical_semantic_name,
        mapping_basis: rule.mapping_basis,
        dd_field_name: rule.dd_field_name,
        fallback_name: rule.fallback_name,
        required_or_nullable_basis: rule.required_or_nullable_basis,
        normalization_basis: rule.normalization_basis,
        left_slice: left.slice,
        left_field: left.field,
        left_value: left.value,
        left_normalized_value: leftNormalizedValue,
        left_source_path: left.source_path,
        right_slice: right.slice,
        right_field: right.field,
        right_value: right.value,
        right_normalized_value: rightNormalizedValue,
        right_source_path: right.source_path,
        status: classification.status,
        severity: classification.severity,
        code: classification.code,
        rule_version: ruleVersion,
        producing_module: CROSS_SLICE_RECONCILIATION_MODULE_NAME,
      });
    }
  }
  return pairs.sort(compareValueComparisons);
}

function classifyValueComparison(
  rule: ValueReconciliationRule,
  leftRaw: string | number | boolean | null,
  rightRaw: string | number | boolean | null,
  leftNormalized: string | number | boolean | null,
  rightNormalized: string | number | boolean | null,
): Pick<ValueComparisonRecord, "status" | "severity" | "code"> {
  const unsupportedCodes = new Set((rule.unsupported_branch_codes ?? []).map((code) => code.toUpperCase()));
  if (typeof leftNormalized === "string" && unsupportedCodes.has(leftNormalized)) return { status: "unsupported", severity: "info", code: "CROSS_SLICE_VALUE_UNSUPPORTED" };
  if (typeof rightNormalized === "string" && unsupportedCodes.has(rightNormalized)) return { status: "unsupported", severity: "info", code: "CROSS_SLICE_VALUE_UNSUPPORTED" };
  if (leftNormalized === null || rightNormalized === null) {
    if (rule.severity_policy === "nullable_non_blocking") return { status: "accepted_nullable", severity: "info", code: "CROSS_SLICE_VALUE_ACCEPTED_NULLABLE" };
    return { status: "blocking_mismatch", severity: "error", code: "CROSS_SLICE_VALUE_REQUIRED_MISMATCH" };
  }
  if (leftNormalized === rightNormalized) {
    if (String(leftRaw) !== String(rightRaw) && (rule.value_type === "numeric" || rule.value_type === "categorical" || rule.value_type === "form_code")) {
      return { status: "formatting_only", severity: "info", code: "CROSS_SLICE_VALUE_FORMATTING_ONLY" };
    }
    return { status: "accepted", severity: "info", code: "CROSS_SLICE_VALUE_ACCEPTED" };
  }
  if (bothAcceptedValueFormatVariants(rule, leftNormalized, rightNormalized)) {
    return { status: "formatting_only", severity: "info", code: "CROSS_SLICE_VALUE_FORMATTING_ONLY" };
  }
  if (rule.severity_policy === "nullable_non_blocking") {
    return { status: "non_blocking_warning", severity: "warning", code: "CROSS_SLICE_VALUE_WARNING_MISMATCH" };
  }
  return { status: "blocking_mismatch", severity: "error", code: "CROSS_SLICE_VALUE_REQUIRED_MISMATCH" };
}

function bothAcceptedValueFormatVariants(
  rule: ValueReconciliationRule,
  left: string | number | boolean | null,
  right: string | number | boolean | null,
): boolean {
  const variants = new Set((rule.accepted_format_variants ?? []).map((value) => value.toUpperCase()));
  return typeof left === "string" && typeof right === "string" && variants.has(left) && variants.has(right);
}

function toValueFinding(comparison: ValueComparisonRecord): ValueReconciliationFinding {
  return {
    code: comparison.code,
    severity: comparison.severity,
    category: "cross_slice_value_reconciliation",
    case_id: comparison.case_id,
    rule_key: comparison.rule_key,
    reviewed_fact_context: comparison.reviewed_fact_context,
    value_type: comparison.value_type,
    canonical_semantic_name: comparison.canonical_semantic_name,
    mapping_basis: comparison.mapping_basis,
    dd_field_name: comparison.dd_field_name,
    fallback_name: comparison.fallback_name,
    required_or_nullable_basis: comparison.required_or_nullable_basis,
    normalization_basis: comparison.normalization_basis,
    compared_slices: [comparison.left_slice, comparison.right_slice],
    compared_fields: [comparison.left_field, comparison.right_field],
    compared_values: [comparison.left_value, comparison.right_value],
    normalized_values: [comparison.left_normalized_value, comparison.right_normalized_value],
    source_paths: [comparison.left_source_path, comparison.right_source_path],
    rule_version: comparison.rule_version,
    producing_module: comparison.producing_module,
    message: `Cross-slice value mismatch for ${comparison.canonical_semantic_name}: ${comparison.left_slice}.${comparison.left_field} does not match ${comparison.right_slice}.${comparison.right_field}`,
  };
}

function compareFactEvidence(
  fact: SharedFactDefinition,
  evidence: readonly ReconciliationEvidence[],
  ruleVersion: string,
): ReconciliationComparison[] {
  const factEvidence = evidence.filter((item) => fact.fields_by_slice[item.slice] === item.field).sort(compareEvidence);
  const pairs: ReconciliationComparison[] = [];
  for (let leftIndex = 0; leftIndex < factEvidence.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < factEvidence.length; rightIndex += 1) {
      const left = factEvidence[leftIndex];
      const right = factEvidence[rightIndex];
      if (left.case_id !== right.case_id) continue;
      pairs.push({
        comparison_id: "",
        case_id: left.case_id,
        fact_key: fact.fact_key,
        fact_family: fact.fact_family,
        reviewed_fact_context: fact.reviewed_fact_context,
        canonical_semantic_name: fact.canonical_semantic_name,
        mapping_basis: fact.mapping_basis,
        dd_field_name: fact.dd_field_name,
        fallback_name: fact.fallback_name,
        left_slice: left.slice,
        left_field: left.field,
        left_value: left.value,
        left_source_path: left.source_path,
        right_slice: right.slice,
        right_field: right.field,
        right_value: right.value,
        right_source_path: right.source_path,
        status: classifyComparison(fact, left.value, right.value),
        rule_version: ruleVersion,
        producing_module: CROSS_SLICE_RECONCILIATION_MODULE_NAME,
      });
    }
  }
  return pairs.sort(compareComparisons);
}

function classifyComparison(
  fact: SharedFactDefinition,
  left: string | number | boolean | null,
  right: string | number | boolean | null,
): ReconciliationStatus {
  const leftValue = normalizeReviewedValue(left);
  const rightValue = normalizeReviewedValue(right);
  const unsupportedCodes = new Set((fact.unsupported_branch_codes ?? []).map((code) => code.toUpperCase()));
  if (typeof leftValue === "string" && unsupportedCodes.has(leftValue)) return "unsupported";
  if (typeof rightValue === "string" && unsupportedCodes.has(rightValue)) return "unsupported";
  if ((leftValue === null || rightValue === null) && fact.expected_presence === "optional") return "absent_optional";
  if (leftValue === rightValue) return "accepted";
  if (bothAcceptedFormatVariants(fact, leftValue, rightValue)) return "formatting_only";
  return "drift";
}

function bothAcceptedFormatVariants(
  fact: SharedFactDefinition,
  left: string | number | boolean | null,
  right: string | number | boolean | null,
): boolean {
  const variants = new Set((fact.accepted_format_variants ?? []).map((value) => value.toUpperCase()));
  return typeof left === "string" && typeof right === "string" && variants.has(left) && variants.has(right);
}

function toDriftFinding(comparison: ReconciliationComparison): CrossSliceDriftFinding {
  return {
    code: "CROSS_SLICE_FACT_DRIFT",
    severity: "error",
    category: "cross_slice_reconciliation",
    case_id: comparison.case_id,
    reviewed_fact_context: comparison.reviewed_fact_context,
    canonical_semantic_name: comparison.canonical_semantic_name,
    mapping_basis: comparison.mapping_basis,
    dd_field_name: comparison.dd_field_name,
    fallback_name: comparison.fallback_name,
    compared_slices: [comparison.left_slice, comparison.right_slice],
    compared_fields: [comparison.left_field, comparison.right_field],
    compared_values: [comparison.left_value, comparison.right_value],
    source_paths: [comparison.left_source_path, comparison.right_source_path],
    rule_version: comparison.rule_version,
    producing_module: comparison.producing_module,
    message: `Cross-slice drift for ${comparison.canonical_semantic_name}: ${comparison.left_slice}.${comparison.left_field} does not match ${comparison.right_slice}.${comparison.right_field}`,
  };
}

function compareSharedFacts(left: SharedFactDefinition, right: SharedFactDefinition): number {
  return left.fact_key.localeCompare(right.fact_key);
}

function compareEvidence(left: ReconciliationEvidence, right: ReconciliationEvidence): number {
  return (
    left.case_id.localeCompare(right.case_id) ||
    left.slice.localeCompare(right.slice) ||
    left.field.localeCompare(right.field) ||
    left.source_path.localeCompare(right.source_path)
  );
}

function compareComparisons(left: ReconciliationComparison, right: ReconciliationComparison): number {
  return (
    left.case_id.localeCompare(right.case_id) ||
    left.canonical_semantic_name.localeCompare(right.canonical_semantic_name) ||
    left.left_slice.localeCompare(right.left_slice) ||
    left.right_slice.localeCompare(right.right_slice) ||
    left.left_field.localeCompare(right.left_field) ||
    left.right_field.localeCompare(right.right_field) ||
    left.left_source_path.localeCompare(right.left_source_path) ||
    left.right_source_path.localeCompare(right.right_source_path) ||
    left.status.localeCompare(right.status)
  );
}

function compareFindings(left: CrossSliceDriftFinding, right: CrossSliceDriftFinding): number {
  return (
    left.case_id.localeCompare(right.case_id) ||
    left.canonical_semantic_name.localeCompare(right.canonical_semantic_name) ||
    left.compared_slices.join("|").localeCompare(right.compared_slices.join("|")) ||
    left.compared_fields.join("|").localeCompare(right.compared_fields.join("|")) ||
    left.source_paths.join("|").localeCompare(right.source_paths.join("|")) ||
    left.code.localeCompare(right.code)
  );
}

function compareValueComparisons(left: ValueComparisonRecord, right: ValueComparisonRecord): number {
  return (
    left.case_id.localeCompare(right.case_id) ||
    left.rule_key.localeCompare(right.rule_key) ||
    left.canonical_semantic_name.localeCompare(right.canonical_semantic_name) ||
    left.left_slice.localeCompare(right.left_slice) ||
    left.right_slice.localeCompare(right.right_slice) ||
    left.left_field.localeCompare(right.left_field) ||
    left.right_field.localeCompare(right.right_field) ||
    left.left_source_path.localeCompare(right.left_source_path) ||
    left.right_source_path.localeCompare(right.right_source_path) ||
    left.status.localeCompare(right.status) ||
    left.severity.localeCompare(right.severity) ||
    left.code.localeCompare(right.code)
  );
}

function compareValueFindings(left: ValueReconciliationFinding, right: ValueReconciliationFinding): number {
  return (
    left.case_id.localeCompare(right.case_id) ||
    left.rule_key.localeCompare(right.rule_key) ||
    left.canonical_semantic_name.localeCompare(right.canonical_semantic_name) ||
    left.compared_slices.join("|").localeCompare(right.compared_slices.join("|")) ||
    left.compared_fields.join("|").localeCompare(right.compared_fields.join("|")) ||
    left.source_paths.join("|").localeCompare(right.source_paths.join("|")) ||
    left.severity.localeCompare(right.severity) ||
    left.code.localeCompare(right.code)
  );
}

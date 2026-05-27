import type { BsrsParsedSample, BsrsSampleRow } from "./bsrsSampleParser";
import {
  makeBsrsSemanticFinding,
  type BsrsSemanticValidationFinding,
} from "./semanticValidationTypes";
import { sortSemanticValidationFindings } from "./semanticValidationTrace";

export type BsrsBlockFamily = "statement" | "recalculation" | "optional_form";

export type BsrsBlockSemanticRole = "marker" | "support" | "detail" | "subtotal" | "narrative" | "formatting" | "spacer";

export type BsrsStatementSectionContext =
  | "benefit_summary"
  | "participant_information"
  | "summary_of_benefits"
  | "benefit_calculation";

export type BsrsRecalculationSectionContext = "participant_data";

export type BsrsOptionalFormFamily = "single_life" | "single_and_joint" | "qpsa_qdro";

export type BsrsRecalculationLineCluster =
  | "participant_data"
  | "name"
  | "social_security_number"
  | "sex"
  | "date_of_birth"
  | "date_of_termination"
  | "retirement_date"
  | "normal_retirement_date"
  | "earliest_unreduced_retirement_date"
  | "earliest_retirement_date"
  | "credited_service";

export type BsrsOptionalFormSectionContext =
  | "automatic_unmarried"
  | "automatic_married"
  | "straight_life"
  | "joint_50_survivor"
  | "joint_75_survivor"
  | "joint_100_survivor"
  | "joint_50_popup"
  | "five_year_cc"
  | "ten_year_cc"
  | "fifteen_year_cc"
  | "unknown_optional_form";

export type BsrsOptionalFormLineCluster = BsrsOptionalFormSectionContext;

export type BsrsBlockSectionContext = BsrsStatementSectionContext | BsrsRecalculationSectionContext | BsrsOptionalFormSectionContext;
export type BsrsBlockLineCluster = BsrsStatementSectionContext | BsrsRecalculationLineCluster | BsrsOptionalFormLineCluster;

export type BsrsBlockPatternClassification = {
  block_family: BsrsBlockFamily;
  source_path: string;
  row_index: number;
  column_name: string;
  token: string;
  form_family?: BsrsOptionalFormFamily;
  section_context: BsrsBlockSectionContext;
  line_cluster: BsrsBlockLineCluster;
  semantic_role: BsrsBlockSemanticRole;
};

export type BsrsBlockPatternFinding = BsrsSemanticValidationFinding & {
  block_family: BsrsBlockFamily;
  form_family?: BsrsOptionalFormFamily;
  section_context: BsrsBlockSectionContext;
  line_cluster: BsrsBlockLineCluster;
};

export type BsrsStatementBlockPatternResult = {
  accepted: BsrsBlockPatternClassification[];
  findings: BsrsBlockPatternFinding[];
};

export type BsrsRecalculationBlockPatternResult = {
  accepted: BsrsBlockPatternClassification[];
  findings: BsrsBlockPatternFinding[];
};

export type BsrsOptionalFormBlockPatternResult = {
  accepted: BsrsBlockPatternClassification[];
  findings: BsrsBlockPatternFinding[];
};

type StatementSectionDefinition = {
  context: BsrsStatementSectionContext;
  token: string;
  matches: (row: BsrsSampleRow) => boolean;
};

const STATEMENT_SECTION_DEFINITIONS: readonly StatementSectionDefinition[] = [
  {
    context: "benefit_summary",
    token: "YOUR BENEFIT SUMMARY",
    matches: (row) => normalizedDescription(row).includes("YOUR BENEFIT SUMMARY"),
  },
  {
    context: "participant_information",
    token: "Participant's Information",
    matches: (row) => normalizedDescription(row).includes("Participant's Information"),
  },
  {
    context: "summary_of_benefits",
    token: "*** SUMMMARY OF BENEFITS ***",
    matches: (row) => normalizedDescription(row).includes("*** SUMMMARY OF BENEFITS ***"),
  },
  {
    context: "benefit_calculation",
    token: "YOUR BENEFIT CALCULATION",
    matches: (row) => normalizedDescription(row).includes("YOUR BENEFIT CALCULATION"),
  },
];

type RecalculationClusterDefinition = {
  cluster: BsrsRecalculationLineCluster;
  token: string;
  role: BsrsBlockSemanticRole;
  matches: (row: BsrsSampleRow) => boolean;
};

const RECALCULATION_CLUSTER_DEFINITIONS: readonly RecalculationClusterDefinition[] = [
  {
    cluster: "participant_data",
    token: "Participant Data",
    role: "marker",
    matches: (row) => normalizedDescription(row).includes("Participant Data"),
  },
  {
    cluster: "name",
    token: "Name:",
    role: "detail",
    matches: (row) => normalizedDescription(row).includes("Name:"),
  },
  {
    cluster: "social_security_number",
    token: "Social Security Number:",
    role: "detail",
    matches: (row) => normalizedDescription(row).includes("Social Security Number:"),
  },
  {
    cluster: "sex",
    token: "Sex:",
    role: "detail",
    matches: (row) => normalizedDescription(row).includes("Sex:"),
  },
  {
    cluster: "date_of_birth",
    token: "Date of Birth:",
    role: "detail",
    matches: (row) => normalizedDescription(row).includes("Date of Birth:"),
  },
  {
    cluster: "date_of_termination",
    token: "Date of Termination of Employment:",
    role: "detail",
    matches: (row) => normalizedDescription(row).includes("Date of Termination of Employment:"),
  },
  {
    cluster: "retirement_date",
    token: "Actual Retirement Date:",
    role: "detail",
    matches: (row) => normalizedDescription(row).includes("Actual Retirement Date:") || normalizedDescription(row).includes("Benefit Commencement Date:"),
  },
  {
    cluster: "normal_retirement_date",
    token: "Normal Retirement Date:",
    role: "support",
    matches: (row) => normalizedDescription(row).includes("Normal Retirement Date:"),
  },
  {
    cluster: "earliest_unreduced_retirement_date",
    token: "Earliest Unreduced Retirement Date:",
    role: "support",
    matches: (row) => normalizedDescription(row).includes("Earliest Unreduced Retirement Date:"),
  },
  {
    cluster: "earliest_retirement_date",
    token: "Earliest Retirement Date:",
    role: "support",
    matches: (row) => normalizedDescription(row).includes("Earliest Retirement Date:"),
  },
  {
    cluster: "credited_service",
    token: "Credited Service (CS)",
    role: "support",
    matches: (row) => normalizedDescription(row).includes("Credited Service (CS)"),
  },
];

type OptionalFormSectionDefinition = {
  context: BsrsOptionalFormSectionContext;
  token: string;
  role: BsrsBlockSemanticRole;
  allowsAlternativeRows: boolean;
  matches: (row: BsrsSampleRow) => boolean;
};

const OPTIONAL_FORM_SECTION_DEFINITIONS: Record<BsrsOptionalFormFamily, readonly OptionalFormSectionDefinition[]> = {
  single_life: [
    optionalFormSection("automatic_unmarried", "A:", "Plan's Automatic Form for Unmarried Participant:", false),
    optionalFormSection("automatic_married", "B:", "Plan's Automatic Form for Married Participant:", false),
    optionalFormSection("straight_life", "C:", "Straight Life Annuity", false),
    optionalFormSection("joint_50_survivor", "D:", "Joint-and-50% Survivor Annuity", false),
    optionalFormSection("joint_75_survivor", "E:", "Joint-and-75% Survivor Annuity", false),
    optionalFormSection("joint_100_survivor", "F:", "Joint-and-100% Survivor Annuity", false),
    optionalFormSection("joint_50_popup", "G:", "Joint-and-50% Survivor 'Pop-up' Annuity", false),
    optionalFormSection("five_year_cc", "H:", "5-year Certain-and-Continuous Annuity", true),
    optionalFormSection("ten_year_cc", "I:", "10-year Certain-and-Continuous Annuity", true),
    optionalFormSection("fifteen_year_cc", "J:", "15-year Certain-and-Continuous Annuity", true),
  ],
  single_and_joint: [
    optionalFormSection("automatic_unmarried", "A:", "Plan's Automatic Form for Unmarried Participant:", false),
    optionalFormSection("automatic_married", "B:", "Plan's Automatic Form for Married Participant:", false),
    optionalFormSection("straight_life", "C:", "Straight Life Annuity", false),
    optionalFormSection("joint_50_survivor", "D:", "Joint-and-50% Survivor Annuity", true),
    optionalFormSection("joint_75_survivor", "E:", "Joint-and-75% Survivor Annuity", true),
    optionalFormSection("joint_100_survivor", "F:", "Joint-and-100% Survivor Annuity", true),
    optionalFormSection("joint_50_popup", "G:", "Joint-and-50% Survivor 'Pop-up' Annuity", true),
    optionalFormSection("five_year_cc", "H:", "5-year Certain-and-Continuous Annuity", true),
    optionalFormSection("ten_year_cc", "I:", "10-year Certain-and-Continuous Annuity", true),
    optionalFormSection("fifteen_year_cc", "J:", "15-year Certain-and-Continuous Annuity", true),
  ],
  qpsa_qdro: [
    optionalFormSection("automatic_unmarried", "A:", "Annuity", false),
    optionalFormSection("five_year_cc", "B:", "5-year Certain-and-Continuous Annuity", true),
    optionalFormSection("ten_year_cc", "C:", "10-year Certain-and-Continuous Annuity", true),
    optionalFormSection("fifteen_year_cc", "D:", "15-year Certain-and-Continuous Annuity", true),
    optionalFormSection("straight_life", "E:", "Straight Life Annuity", false),
  ],
};

export function validateStatementBlockPatterns(samples: readonly BsrsParsedSample[]): BsrsStatementBlockPatternResult {
  const accepted = samples.flatMap(classifyStatementRows);
  const findings = samples.flatMap(validateStatementSectionSequence);

  return {
    accepted: sortBlockPatternClassifications(accepted),
    findings: sortSemanticValidationFindings(findings) as BsrsBlockPatternFinding[],
  };
}

export function validateRecalculationBlockPatterns(samples: readonly BsrsParsedSample[]): BsrsRecalculationBlockPatternResult {
  const accepted = samples.flatMap(classifyRecalculationRows);
  const findings = samples.flatMap(validateRecalculationClusterSequence);

  return {
    accepted: sortBlockPatternClassifications(accepted),
    findings: sortSemanticValidationFindings(findings) as BsrsBlockPatternFinding[],
  };
}

export function validateOptionalFormBlockPatterns(samples: readonly BsrsParsedSample[]): BsrsOptionalFormBlockPatternResult {
  const accepted = samples.flatMap(classifyOptionalFormRows);
  const findings = samples.flatMap(validateOptionalFormSectionSequence);

  return {
    accepted: sortBlockPatternClassifications(accepted),
    findings: sortSemanticValidationFindings(findings) as BsrsBlockPatternFinding[],
  };
}

function classifyStatementRows(sample: BsrsParsedSample): BsrsBlockPatternClassification[] {
  if (!isStatementSample(sample)) {
    return [];
  }

  const classifications: BsrsBlockPatternClassification[] = [];

  for (const row of sample.rows) {
    const section = matchingStatementSection(row);
    if (!section) {
      continue;
    }

    classifications.push({
      block_family: "statement",
      source_path: sample.source_path,
      row_index: row.row_index,
      column_name: "Description",
      token: section.token,
      section_context: section.context,
      line_cluster: section.context,
      semantic_role: classifySemanticRole(row),
    });
  }

  for (const row of sample.rows) {
    const role = classifySemanticRole(row);
    if (role === "marker") {
      continue;
    }

    const context = nearestPriorSection(classifications, row.row_index);
    if (!context) {
      continue;
    }

    classifications.push({
      block_family: "statement",
      source_path: sample.source_path,
      row_index: row.row_index,
      column_name: role === "detail" ? "Detail" : "Description",
      token: role === "detail" ? normalizedCell(row, "Detail") : normalizedDescription(row),
      section_context: context,
      line_cluster: context,
      semantic_role: role,
    });
  }

  return classifications;
}

function validateStatementSectionSequence(sample: BsrsParsedSample): BsrsBlockPatternFinding[] {
  if (!isStatementSample(sample)) {
    return [];
  }

  const locatedSections = STATEMENT_SECTION_DEFINITIONS.map((definition, expectedIndex) => ({
    definition,
    expectedIndex,
    row: sample.rows.find((row) => definition.matches(row)),
  }));

  const findings: BsrsBlockPatternFinding[] = [];
  let lastExpectedIndex = -1;
  let reportedOutOfOrder = false;

  for (const locatedSection of locatedSections.filter((section) => section.row).sort((left, right) => left.row!.row_index - right.row!.row_index)) {
    if (!reportedOutOfOrder && (locatedSection.expectedIndex < lastExpectedIndex || locatedSection.expectedIndex !== lastExpectedIndex + 1)) {
      findings.push(makeBlockPatternFinding({
        block_family: "statement",
        code: "BSRS_STATEMENT_SECTION_OUT_OF_ORDER",
        severity: "error",
        source_path: sample.source_path,
        row_index: locatedSection.row!.row_index,
        token: locatedSection.definition.token,
        section_context: locatedSection.definition.context,
        line_cluster: locatedSection.definition.context,
        message: `Statement block section ${locatedSection.definition.context} is not in the approved sequence.`,
      }));
      reportedOutOfOrder = true;
    }
    lastExpectedIndex = Math.max(lastExpectedIndex, locatedSection.expectedIndex);
  }

  const lastRowIndex = sample.rows.at(-1)?.row_index ?? 1;
  for (const locatedSection of locatedSections) {
    if (!locatedSection.row) {
      findings.push(makeBlockPatternFinding({
        block_family: "statement",
        code: "BSRS_STATEMENT_SECTION_MISSING",
        severity: "error",
        source_path: sample.source_path,
        row_index: lastRowIndex + locatedSection.expectedIndex + 1,
        token: locatedSection.definition.token,
        section_context: locatedSection.definition.context,
        line_cluster: locatedSection.definition.context,
        message: `Statement block section ${locatedSection.definition.context} is missing from approved section evidence.`,
      }));
    }
  }

  return findings;
}

function classifyRecalculationRows(sample: BsrsParsedSample): BsrsBlockPatternClassification[] {
  if (!isRecalculationSample(sample)) {
    return [];
  }

  const classifications: BsrsBlockPatternClassification[] = [];

  // First pass: classify rows that match approved cluster definitions
  for (const row of sample.rows) {
    const cluster = matchingRecalculationCluster(row);
    if (!cluster) {
      continue;
    }

    classifications.push({
      block_family: "recalculation",
      source_path: sample.source_path,
      row_index: row.row_index,
      column_name: "Description",
      token: cluster.token,
      section_context: "participant_data",
      line_cluster: cluster.cluster,
      semantic_role: cluster.role,
    });
  }

  // Second pass: classify remaining rows with semantic roles
  const classifiedRowIndexes = new Set(classifications.map((c) => c.row_index));
  for (const row of sample.rows) {
    if (classifiedRowIndexes.has(row.row_index)) {
      continue;
    }

    const role = classifyRecalculationRowRole(row);
    const token = role === "detail" ? normalizedCell(row, "Detail") : normalizedDescription(row) || "(empty)";

    classifications.push({
      block_family: "recalculation",
      source_path: sample.source_path,
      row_index: row.row_index,
      column_name: role === "detail" ? "Detail" : "Description",
      token,
      section_context: "participant_data",
      line_cluster: "participant_data",
      semantic_role: role,
    });
  }

  return classifications;
}

function validateRecalculationClusterSequence(sample: BsrsParsedSample): BsrsBlockPatternFinding[] {
  if (!isRecalculationSample(sample)) {
    return [];
  }

  const locatedClusters = RECALCULATION_CLUSTER_DEFINITIONS.map((definition, expectedIndex) => ({
    definition,
    expectedIndex,
    rows: sample.rows.filter((row) => definition.matches(row)),
  }));

  const findings: BsrsBlockPatternFinding[] = [];
  let lastExpectedIndex = -1;
  let reportedOutOfOrder = false;

  for (const locatedCluster of locatedClusters.flatMap((cluster) => cluster.rows.map((row) => ({ ...cluster, row }))).sort((left, right) => left.row.row_index - right.row.row_index)) {
    if (!reportedOutOfOrder && locatedCluster.expectedIndex < lastExpectedIndex) {
      findings.push(makeBlockPatternFinding({
        block_family: "recalculation",
        code: "BSRS_RECALCULATION_CLUSTER_OUT_OF_ORDER",
        severity: "error",
        source_path: sample.source_path,
        row_index: locatedCluster.row.row_index,
        token: locatedCluster.definition.token,
        section_context: "participant_data",
        line_cluster: locatedCluster.definition.cluster,
        message: `Recalculation line cluster ${locatedCluster.definition.cluster} is not in the approved sequence.`,
      }));
      reportedOutOfOrder = true;
    }
    lastExpectedIndex = Math.max(lastExpectedIndex, locatedCluster.expectedIndex);
  }

  const lastRowIndex = sample.rows.at(-1)?.row_index ?? 1;
  for (const locatedCluster of locatedClusters) {
    if (locatedCluster.rows.length === 0) {
      findings.push(makeBlockPatternFinding({
        block_family: "recalculation",
        code: "BSRS_RECALCULATION_CLUSTER_MISSING",
        severity: "error",
        source_path: sample.source_path,
        row_index: lastRowIndex + locatedCluster.expectedIndex + 1,
        token: locatedCluster.definition.token,
        section_context: "participant_data",
        line_cluster: locatedCluster.definition.cluster,
        message: `Recalculation line cluster ${locatedCluster.definition.cluster} is missing from approved section evidence.`,
      }));
    }

    for (const duplicateRow of locatedCluster.rows.slice(1)) {
      findings.push(makeBlockPatternFinding({
        block_family: "recalculation",
        code: "BSRS_RECALCULATION_CLUSTER_DUPLICATED",
        severity: "error",
        source_path: sample.source_path,
        row_index: duplicateRow.row_index,
        token: locatedCluster.definition.token,
        section_context: "participant_data",
        line_cluster: locatedCluster.definition.cluster,
        message: `Recalculation line cluster ${locatedCluster.definition.cluster} appears more than once.`,
      }));
    }
  }

  // Detect suspicious rows: rows with label-like patterns not matching any approved cluster
  const suspiciousRowIndexes = new Set<number>();
  for (const row of sample.rows) {
    const label = recalculationRowLabel(row);
    if (!label || matchingRecalculationCluster(row)) {
      continue;
    }

    suspiciousRowIndexes.add(row.row_index);
    findings.push(makeBlockPatternFinding({
      block_family: "recalculation",
      code: "BSRS_RECALCULATION_CLUSTER_SUSPICIOUS",
      severity: "warning",
      source_path: sample.source_path,
      row_index: row.row_index,
      token: label,
      section_context: "participant_data",
      line_cluster: "participant_data",
      message: `Recalculation row label "${label}" is not part of the approved cluster sequence.`,
    }));
  }

  // Detect orphan rows: rows with semantic content that don't match any cluster
  // and are not formatting/spacer artifacts or already flagged as suspicious
  const matchedRowIndexes = new Set(
    locatedClusters.flatMap((cluster) => cluster.rows.map((row) => row.row_index)),
  );
  for (const row of sample.rows) {
    if (matchedRowIndexes.has(row.row_index) || suspiciousRowIndexes.has(row.row_index)) {
      continue;
    }

    const role = classifyRecalculationRowRole(row);
    // Skip formatting and spacer rows — they are not orphan semantic evidence
    if (role === "formatting" || role === "spacer") {
      continue;
    }

    const description = normalizedDescription(row);
    const detail = normalizedCell(row, "Detail");
    if (description || detail) {
      findings.push(makeBlockPatternFinding({
        block_family: "recalculation",
        code: "BSRS_RECALCULATION_ROW_ORPHAN",
        severity: "warning",
        source_path: sample.source_path,
        row_index: row.row_index,
        token: description || detail,
        section_context: "participant_data",
        line_cluster: "participant_data",
        message: `Recalculation row at index ${row.row_index} has no recognized section context or approved cluster.`,
      }));
    }
  }

  return findings;
}

function classifyOptionalFormRows(sample: BsrsParsedSample): BsrsBlockPatternClassification[] {
  const family = optionalFormFamily(sample);
  if (!family) {
    return [];
  }

  const classifications: BsrsBlockPatternClassification[] = [];
  for (const row of sample.rows) {
    const section = matchingOptionalFormSection(row, family);
    if (!section) {
      continue;
    }

    classifications.push({
      block_family: "optional_form",
      form_family: family,
      source_path: sample.source_path,
      row_index: row.row_index,
      column_name: "Description",
      token: section.token,
      section_context: section.context,
      line_cluster: section.context,
      semantic_role: section.role,
    });
  }

  return classifications;
}

function validateOptionalFormSectionSequence(sample: BsrsParsedSample): BsrsBlockPatternFinding[] {
  const family = optionalFormFamily(sample);
  if (!family) {
    return [];
  }

  const definitions = OPTIONAL_FORM_SECTION_DEFINITIONS[family];
  const locatedSections = definitions.map((definition, expectedIndex) => ({
    definition,
    expectedIndex,
    rows: sample.rows.filter((row) => definition.matches(row)),
  }));

  const findings: BsrsBlockPatternFinding[] = [];
  let lastExpectedIndex = -1;
  let reportedOutOfOrder = false;

  for (const locatedSection of locatedSections.flatMap((section) => section.rows.map((row) => ({ ...section, row }))).sort((left, right) => left.row.row_index - right.row.row_index)) {
    if (!reportedOutOfOrder && locatedSection.expectedIndex < lastExpectedIndex) {
      findings.push(makeBlockPatternFinding({
        block_family: "optional_form",
        form_family: family,
        code: "BSRS_OPTIONAL_FORM_SECTION_OUT_OF_ORDER",
        severity: "error",
        source_path: sample.source_path,
        row_index: locatedSection.row.row_index,
        token: locatedSection.definition.token,
        section_context: locatedSection.definition.context,
        line_cluster: locatedSection.definition.context,
        message: `Optional-form section ${locatedSection.definition.context} is not in the approved sequence for ${family}.`,
      }));
      reportedOutOfOrder = true;
    }
    lastExpectedIndex = Math.max(lastExpectedIndex, locatedSection.expectedIndex);
  }

  const lastRowIndex = sample.rows.at(-1)?.row_index ?? 1;
  for (const locatedSection of locatedSections) {
    if (locatedSection.rows.length === 0) {
      findings.push(makeBlockPatternFinding({
        block_family: "optional_form",
        form_family: family,
        code: "BSRS_OPTIONAL_FORM_SECTION_MISSING",
        severity: "error",
        source_path: sample.source_path,
        row_index: lastRowIndex + locatedSection.expectedIndex + 1,
        token: locatedSection.definition.token,
        section_context: locatedSection.definition.context,
        line_cluster: locatedSection.definition.context,
        message: `Optional-form section ${locatedSection.definition.context} is missing from approved section evidence for ${family}.`,
      }));
    }

    if (!locatedSection.definition.allowsAlternativeRows) {
      for (const duplicateRow of locatedSection.rows.slice(1)) {
        findings.push(makeBlockPatternFinding({
          block_family: "optional_form",
          form_family: family,
          code: "BSRS_OPTIONAL_FORM_SECTION_DUPLICATED",
          severity: "error",
          source_path: sample.source_path,
          row_index: duplicateRow.row_index,
          token: locatedSection.definition.token,
          section_context: locatedSection.definition.context,
          line_cluster: locatedSection.definition.context,
          message: `Optional-form section ${locatedSection.definition.context} appears more than once for ${family}.`,
        }));
      }
    }
  }

  for (const row of sample.rows) {
    const label = optionalFormLabel(row);
    if (!label || matchingOptionalFormSection(row, family)) {
      continue;
    }

    findings.push(makeBlockPatternFinding({
      block_family: "optional_form",
      form_family: family,
      code: "BSRS_OPTIONAL_FORM_SECTION_SUSPICIOUS",
      severity: "warning",
      source_path: sample.source_path,
      row_index: row.row_index,
      token: label,
      section_context: "unknown_optional_form",
      line_cluster: "unknown_optional_form",
      message: `Optional-form label ${label} is not part of the approved section sequence for ${family}.`,
    }));
  }

  return findings;
}

function makeBlockPatternFinding(input: {
  block_family: BsrsBlockFamily;
  form_family?: BsrsOptionalFormFamily;
  code: string;
  severity: "warning" | "error";
  source_path: string;
  row_index: number;
  token: string;
  section_context: BsrsBlockSectionContext;
  line_cluster: BsrsBlockLineCluster;
  message: string;
}): BsrsBlockPatternFinding {
  return {
    ...makeBsrsSemanticFinding({
      category: "block_pattern",
      code: input.code,
      column_name: "Description",
      message: input.message,
      row_index: input.row_index,
      severity: input.severity,
      source_path: input.source_path,
      token: input.token,
    }),
    block_family: input.block_family,
    form_family: input.form_family,
    section_context: input.section_context,
    line_cluster: input.line_cluster,
  };
}

function matchingStatementSection(row: BsrsSampleRow): StatementSectionDefinition | undefined {
  return STATEMENT_SECTION_DEFINITIONS.find((definition) => definition.matches(row));
}

function matchingRecalculationCluster(row: BsrsSampleRow): RecalculationClusterDefinition | undefined {
  return RECALCULATION_CLUSTER_DEFINITIONS.find((definition) => definition.matches(row));
}

function classifyRecalculationRowRole(row: BsrsSampleRow): BsrsBlockSemanticRole {
  const description = normalizedDescription(row);
  const detail = normalizedCell(row, "Detail");
  const descFormat = normalizedCell(row, "DescFormat");
  const detailFormat = normalizedCell(row, "DtlFormat");

  // Rows with format codes but no content are formatting artifacts
  if (!description && !detail && (descFormat || detailFormat)) {
    return "formatting";
  }
  // Completely empty rows are spacers
  if (!description && !detail) {
    return "spacer";
  }
  // Rows with detail values are detail rows
  if (detail) {
    return "detail";
  }
  // Divider lines (dashes, equals, etc.) are formatting
  if (/^[-=*_#]{3,}$/.test(description)) {
    return "formatting";
  }
  // Long descriptions are narrative
  if (description.length > 40) {
    return "narrative";
  }
  return "detail";
}

function recalculationRowLabel(row: BsrsSampleRow): string | undefined {
  const description = normalizedDescription(row);
  // Match label patterns like "Something:" or "Some Label:" at word boundaries
  const match = description.match(/^[A-Z][A-Za-z ]+:$/);
  return match?.[0] ?? undefined;
}

function matchingOptionalFormSection(row: BsrsSampleRow, family: BsrsOptionalFormFamily): OptionalFormSectionDefinition | undefined {
  return OPTIONAL_FORM_SECTION_DEFINITIONS[family].find((definition) => definition.matches(row));
}

function nearestPriorSection(
  classifications: readonly BsrsBlockPatternClassification[],
  rowIndex: number,
): BsrsStatementSectionContext | undefined {
  return classifications
    .filter((classification) => classification.semantic_role === "marker" && classification.row_index <= rowIndex)
    .sort((left, right) => right.row_index - left.row_index)[0]?.section_context as BsrsStatementSectionContext | undefined;
}

function classifySemanticRole(row: BsrsSampleRow): BsrsBlockSemanticRole {
  const description = normalizedDescription(row);
  const detail = normalizedCell(row, "Detail");
  const descFormat = normalizedCell(row, "DescFormat");
  const detailFormat = normalizedCell(row, "DtlFormat");

  if (matchingStatementSection(row) || description.includes("***")) {
    return "marker";
  }
  if (!description && !detail && (descFormat || detailFormat)) {
    return "formatting";
  }
  if (!description && !detail) {
    return "spacer";
  }
  if (detail) {
    return "detail";
  }
  return description.length > 40 ? "narrative" : "detail";
}

function isStatementSample(sample: BsrsParsedSample): boolean {
  return sample.source_path.includes("/statements/") || sample.source_path.includes("statement");
}

function isRecalculationSample(sample: BsrsParsedSample): boolean {
  return sample.source_path.includes("/recalculations/") || sample.source_path.includes("recalculation");
}

function optionalFormFamily(sample: BsrsParsedSample): BsrsOptionalFormFamily | undefined {
  if (!isOptionalFormSample(sample)) {
    return undefined;
  }
  if (sample.source_path.includes("single-and-joint") || sample.source_path.includes("SingleAndJoint")) {
    return "single_and_joint";
  }
  if (sample.source_path.includes("qpsa-qdro") || sample.source_path.includes("QPSA-QDRO")) {
    return "qpsa_qdro";
  }
  return "single_life";
}

function isOptionalFormSample(sample: BsrsParsedSample): boolean {
  return sample.source_path.includes("/optional-forms/") || sample.source_path.includes("optional-form");
}

function optionalFormSection(
  context: BsrsOptionalFormSectionContext,
  label: string,
  text: string,
  allowsAlternativeRows: boolean,
): OptionalFormSectionDefinition {
  return {
    context,
    token: `${label} ${text}`,
    role: "marker",
    allowsAlternativeRows,
    matches: (row) => {
      const description = normalizedDescription(row);
      return description.includes(label) && description.includes(text);
    },
  };
}

function optionalFormLabel(row: BsrsSampleRow): string | undefined {
  const description = normalizedDescription(row);
  const match = description.match(/([A-Z]:)/);
  return match?.[1];
}

function normalizedDescription(row: BsrsSampleRow): string {
  return normalizedCell(row, "Description");
}

function normalizedCell(row: BsrsSampleRow, columnName: string): string {
  return (row.values[columnName] ?? "").replaceAll('"""', '"').replace(/^"|"$/g, "").trim();
}

function sortBlockPatternClassifications(
  classifications: readonly BsrsBlockPatternClassification[],
): BsrsBlockPatternClassification[] {
  return [...classifications].sort(
    (left, right) =>
      left.source_path.localeCompare(right.source_path) ||
      left.row_index - right.row_index ||
      left.section_context.localeCompare(right.section_context) ||
      left.semantic_role.localeCompare(right.semantic_role) ||
      left.token.localeCompare(right.token),
  );
}

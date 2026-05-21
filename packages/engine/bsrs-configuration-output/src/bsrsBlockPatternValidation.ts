import type { BsrsParsedSample, BsrsSampleRow } from "./bsrsSampleParser";
import {
  makeBsrsSemanticFinding,
  type BsrsSemanticValidationFinding,
} from "./semanticValidationTypes";
import { sortSemanticValidationFindings } from "./semanticValidationTrace";

export type BsrsBlockFamily = "statement";

export type BsrsBlockSemanticRole = "marker" | "detail" | "narrative" | "formatting" | "spacer";

export type BsrsStatementSectionContext =
  | "benefit_summary"
  | "participant_information"
  | "summary_of_benefits"
  | "benefit_calculation";

export type BsrsBlockPatternClassification = {
  block_family: BsrsBlockFamily;
  source_path: string;
  row_index: number;
  column_name: string;
  token: string;
  section_context: BsrsStatementSectionContext;
  line_cluster: BsrsStatementSectionContext;
  semantic_role: BsrsBlockSemanticRole;
};

export type BsrsBlockPatternFinding = BsrsSemanticValidationFinding & {
  block_family: BsrsBlockFamily;
  section_context: BsrsStatementSectionContext;
  line_cluster: BsrsStatementSectionContext;
};

export type BsrsStatementBlockPatternResult = {
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

export function validateStatementBlockPatterns(samples: readonly BsrsParsedSample[]): BsrsStatementBlockPatternResult {
  const accepted = samples.flatMap(classifyStatementRows);
  const findings = samples.flatMap(validateStatementSectionSequence);

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

function makeBlockPatternFinding(input: {
  code: string;
  severity: "warning" | "error";
  source_path: string;
  row_index: number;
  token: string;
  section_context: BsrsStatementSectionContext;
  line_cluster: BsrsStatementSectionContext;
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
    block_family: "statement",
    section_context: input.section_context,
    line_cluster: input.line_cluster,
  };
}

function matchingStatementSection(row: BsrsSampleRow): StatementSectionDefinition | undefined {
  return STATEMENT_SECTION_DEFINITIONS.find((definition) => definition.matches(row));
}

function nearestPriorSection(
  classifications: readonly BsrsBlockPatternClassification[],
  rowIndex: number,
): BsrsStatementSectionContext | undefined {
  return classifications
    .filter((classification) => classification.semantic_role === "marker" && classification.row_index <= rowIndex)
    .sort((left, right) => right.row_index - left.row_index)[0]?.section_context;
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

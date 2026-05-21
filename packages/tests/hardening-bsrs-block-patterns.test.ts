import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import {
  parseBsrsSample,
  serializeSemanticValidationFindings,
  validateBsrsSemanticBlockPatterns,
  validateRecalculationBlockPatterns,
  validateStatementBlockPatterns,
} from "@pbgc/bsrs-configuration-output";
import { describe, expect, it } from "vitest";

const REPO_ROOT = process.cwd();
const STATEMENT_SAMPLE_PATH = join(
  REPO_ROOT,
  "artifacts/reference/approved-samples/bsrs-config/statements/sample-bsrs-statement-config.txt",
);
const RECALCULATION_SAMPLE_PATH = join(
  REPO_ROOT,
  "artifacts/reference/approved-samples/bsrs-config/recalculations/sample-bsrs-recalculation-config.txt",
);

function approvedStatementSample() {
  return parseBsrsSample({
    source_path: relative(REPO_ROOT, STATEMENT_SAMPLE_PATH),
    text: readFileSync(STATEMENT_SAMPLE_PATH, "utf8"),
  });
}

function approvedRecalculationSample() {
  return parseBsrsSample({
    source_path: relative(REPO_ROOT, RECALCULATION_SAMPLE_PATH),
    text: readFileSync(RECALCULATION_SAMPLE_PATH, "utf8"),
  });
}

describe("BSRS statement block-pattern hardening", () => {
  it("accepts approved statement section sequencing and line clusters", () => {
    const result = validateStatementBlockPatterns([approvedStatementSample()]);

    expect(result.findings).toEqual([]);
    expect(result.accepted.map((classification) => classification.section_context)).toEqual(
      expect.arrayContaining(["benefit_summary", "participant_information", "summary_of_benefits", "benefit_calculation"]),
    );
    expect(result.accepted.some((classification) => classification.semantic_role === "formatting")).toBe(true);
    expect(result.accepted.some((classification) => classification.semantic_role === "detail")).toBe(true);
    expect(result.accepted.some((classification) => classification.semantic_role === "narrative")).toBe(true);
  });

  it("emits structured findings for missing and out-of-order statement sections", () => {
    const malformedSample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/statements/synthetic-malformed-statement.txt",
      text: [
        "PrintCriteria\tLie\tDescription\tDetail\tDescFormat\tDtlFormat",
        "1\t\t\"\"\"YOUR BENEFIT SUMMARY\"\" 'BOLD\"\t\tTC\tTH",
        "1\t\t\"\"\"YOUR BENEFIT CALCULATION\"\" 'BOLD\"\t\tTC\tTH",
        "1\t\t\"\"\"Participant's Information\"\" 'BU\"\t\tTL\tTL",
      ].join("\n"),
    });

    const result = validateStatementBlockPatterns([malformedSample]);

    expect(result.findings).toEqual([
      expect.objectContaining({
        block_family: "statement",
        category: "block_pattern",
        code: "BSRS_STATEMENT_SECTION_OUT_OF_ORDER",
        column_name: "Description",
        line_cluster: "benefit_calculation",
        row_index: 3,
        section_context: "benefit_calculation",
        severity: "error",
        source_path: malformedSample.source_path,
      }),
      expect.objectContaining({
        block_family: "statement",
        category: "block_pattern",
        code: "BSRS_STATEMENT_SECTION_MISSING",
        column_name: "Description",
        line_cluster: "summary_of_benefits",
        section_context: "summary_of_benefits",
        severity: "error",
        source_path: malformedSample.source_path,
      }),
    ]);
  });

  it("keeps statement block-pattern findings stable across repeated runs", () => {
    const input = {
      sources: [
        {
          source_path: relative(REPO_ROOT, STATEMENT_SAMPLE_PATH),
          text: readFileSync(STATEMENT_SAMPLE_PATH, "utf8"),
        },
      ],
    };

    const first = serializeSemanticValidationFindings(validateBsrsSemanticBlockPatterns(input));
    const second = serializeSemanticValidationFindings(validateBsrsSemanticBlockPatterns(input));

    expect(second).toBe(first);
    expect(first).toBe("[]");
  });
});

describe("BSRS recalculation block-pattern hardening", () => {
  it("accepts approved recalculation section sequencing and line clusters", () => {
    const result = validateRecalculationBlockPatterns([approvedRecalculationSample()]);

    expect(result.findings).toEqual([]);
    expect(result.accepted.map((classification) => classification.section_context)).toEqual(
      expect.arrayContaining(["participant_data"]),
    );
    expect(result.accepted.map((classification) => classification.line_cluster)).toEqual(
      expect.arrayContaining(["participant_data", "name", "social_security_number", "date_of_birth", "credited_service"]),
    );
    expect(result.accepted.every((classification) => classification.block_family === "recalculation")).toBe(true);
  });

  it("emits structured findings for malformed recalculation section evidence", () => {
    const malformedSample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/recalculations/synthetic-malformed-recalculation.txt",
      text: [
        "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat",
        "1\t\t\"\"\"Participant Data\"\"\"\t\tTL\tTL",
        "1\t\t\"\"\"Social Security Number:\"\"\"\tSSN\tTL\tTL",
        "1\t\t\"\"\"Name:\"\"\"\tFNAME\tTL\tTL",
        "1\t\t\"\"\"Name:\"\"\"\tLNAME\tTL\tTL",
        "1\t\t\"\"\"Credited Service (CS)\"\"\"\tCS\tTL\tF4",
      ].join("\n"),
    });

    const result = validateRecalculationBlockPatterns([malformedSample]);

    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          block_family: "recalculation",
          category: "block_pattern",
          code: "BSRS_RECALCULATION_CLUSTER_OUT_OF_ORDER",
          column_name: "Description",
          line_cluster: "name",
          row_index: 4,
          section_context: "participant_data",
          severity: "error",
          source_path: malformedSample.source_path,
        }),
        expect.objectContaining({
          block_family: "recalculation",
          category: "block_pattern",
          code: "BSRS_RECALCULATION_CLUSTER_DUPLICATED",
          column_name: "Description",
          line_cluster: "name",
          row_index: 5,
          section_context: "participant_data",
          severity: "error",
          source_path: malformedSample.source_path,
        }),
        expect.objectContaining({
          block_family: "recalculation",
          category: "block_pattern",
          code: "BSRS_RECALCULATION_CLUSTER_MISSING",
          column_name: "Description",
          line_cluster: "date_of_birth",
          section_context: "participant_data",
          severity: "error",
          source_path: malformedSample.source_path,
        }),
      ]),
    );
  });

  it("keeps recalculation block-pattern findings stable across repeated runs", () => {
    const input = {
      sources: [
        {
          source_path: relative(REPO_ROOT, RECALCULATION_SAMPLE_PATH),
          text: readFileSync(RECALCULATION_SAMPLE_PATH, "utf8"),
        },
      ],
    };

    const first = serializeSemanticValidationFindings(validateBsrsSemanticBlockPatterns(input));
    const second = serializeSemanticValidationFindings(validateBsrsSemanticBlockPatterns(input));
    const firstAccepted = JSON.stringify(validateRecalculationBlockPatterns([approvedRecalculationSample()]).accepted);
    const secondAccepted = JSON.stringify(validateRecalculationBlockPatterns([approvedRecalculationSample()]).accepted);

    expect(second).toBe(first);
    expect(secondAccepted).toBe(firstAccepted);
    expect(first).toBe("[]");
  });
});

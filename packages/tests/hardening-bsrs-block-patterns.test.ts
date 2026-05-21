import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import {
  parseBsrsSample,
  serializeSemanticValidationFindings,
  validateBsrsSemanticBlockPatterns,
  validateStatementBlockPatterns,
} from "@pbgc/bsrs-configuration-output";
import { describe, expect, it } from "vitest";

const REPO_ROOT = process.cwd();
const STATEMENT_SAMPLE_PATH = join(
  REPO_ROOT,
  "artifacts/reference/approved-samples/bsrs-config/statements/sample-bsrs-statement-config.txt",
);

function approvedStatementSample() {
  return parseBsrsSample({
    source_path: relative(REPO_ROOT, STATEMENT_SAMPLE_PATH),
    text: readFileSync(STATEMENT_SAMPLE_PATH, "utf8"),
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

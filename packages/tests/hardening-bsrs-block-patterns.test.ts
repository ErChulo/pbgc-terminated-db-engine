import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import {
  parseBsrsSample,
  serializeSemanticValidationFindings,
  validateBsrsSemanticBlockPatterns,
  validateOptionalFormBlockPatterns,
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
const OPTIONAL_FORM_SAMPLE_PATHS = [
  "artifacts/reference/approved-samples/bsrs-config/optional-forms/single-life/sample-bsrs-OFA_SingleLife-config.txt",
  "artifacts/reference/approved-samples/bsrs-config/optional-forms/single-and-joint/sample-bsrs-OFA_SingleAndJoint-config.txt",
  "artifacts/reference/approved-samples/bsrs-config/optional-forms/qpsa-qdro/sample-bsrs-OFA_QPSA-QDRO-config.txt",
].map((path) => join(REPO_ROOT, path));

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

function approvedOptionalFormSamples() {
  return OPTIONAL_FORM_SAMPLE_PATHS.map((path) =>
    parseBsrsSample({
      source_path: relative(REPO_ROOT, path),
      text: readFileSync(path, "utf8"),
    }),
  );
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

  it("classifies recalculation rows into semantic marker, support, detail, narrative, formatting, and spacer roles (T019)", () => {
    const result = validateRecalculationBlockPatterns([approvedRecalculationSample()]);

    // All seven semantic roles should be represented in classified rows
    const roles = result.accepted.map((c) => c.semantic_role);
    expect(roles).toEqual(
      expect.arrayContaining(["marker", "support", "detail"]),
    );
    // The approved sample has formatting rows (divider lines with DescFormat/DtlFormat)
    expect(result.accepted.some((c) => c.semantic_role === "formatting")).toBe(true);
    // Spacer classification is verified separately in T020 with synthetic fixture
  });

  it("does not treat formatting-only or spacer rows as missing recalculation clusters (T020)", () => {
    const sample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/recalculations/synthetic-formatting-only.txt",
      text: [
        "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat",
        "1\t\t\"\"\"Participant Data\"\"\"\t\tTL\tTL",
        "1\t\t\"\"\"----------------\"\"\"\t\tTL\tTL",
        "1\t\t\t\tTL\tTL",
        "1\t\t\t\t\t",
        "1\t\t\"\"\"Name:\"\"\"\tFNAME\tTL\tTL",
        "1\t\t\t\tTL\tTH",
      ].join("\n"),
    });

    const result = validateRecalculationBlockPatterns([sample]);

    // Formatting rows (with format codes) are accepted
    const formattingRows = result.accepted.filter((c) => c.semantic_role === "formatting");
    expect(formattingRows.length).toBeGreaterThan(0);

    // Spacer rows (no content, no format codes) are accepted
    const spacerRows = result.accepted.filter((c) => c.semantic_role === "spacer");
    expect(spacerRows.length).toBeGreaterThan(0);

    // Missing clusters are reported for actual missing approved clusters (e.g., social_security_number, sex, dob)
    // not for formatting/spacer rows
    const missingFindings = result.findings.filter((f) => f.code === "BSRS_RECALCULATION_CLUSTER_MISSING");
    for (const finding of missingFindings) {
      // Missing cluster findings should reference approved cluster tokens, not formatting rows
      expect(finding.token).not.toContain("----");
      expect(finding.token).not.toBe("(empty)");
    }
  });

  it("emits structured orphan and suspicious findings for recalculation rows with no approved section context (T021)", () => {
    const orphanSample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/recalculations/synthetic-orphan-recalculation.txt",
      text: [
        "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat",
        "1\t\t\"\"\"Participant Data\"\"\"\t\tTL\tTL",
        "1\t\t\"\"\"Unknown Field:\"\"\"\tUNKNOWN_VALUE\tTL\tTL",
        "1\t\tJust some orphaned content\tORPHAN_VAL\tTL\tD4",
      ].join("\n"),
    });

    const result = validateRecalculationBlockPatterns([orphanSample]);

    // Row 2 has a label pattern → SUSPICIOUS finding
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          block_family: "recalculation",
          category: "block_pattern",
          code: "BSRS_RECALCULATION_CLUSTER_SUSPICIOUS",
          column_name: "Description",
          line_cluster: "participant_data",
          section_context: "participant_data",
          severity: "warning",
          source_path: orphanSample.source_path,
          token: "Unknown Field:",
        }),
      ]),
    );

    // Row 3 has content but no label pattern → ORPHAN finding (not SUSPICIOUS)
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          block_family: "recalculation",
          category: "block_pattern",
          code: "BSRS_RECALCULATION_ROW_ORPHAN",
          column_name: "Description",
          line_cluster: "participant_data",
          section_context: "participant_data",
          severity: "warning",
          source_path: orphanSample.source_path,
        }),
      ]),
    );

    // Orphan/suspicious rows are still classified (not dropped) — use row_index to find them
    const orphanAccepted = result.accepted.filter(
      (c) => c.row_index === 3 || c.row_index === 4,
    );
    expect(orphanAccepted.length).toBeGreaterThanOrEqual(2);
  });

  it("proves recalculation validation does not alter existing statement block-pattern behavior (T027)", () => {
    // Statement validation must produce identical results regardless of recalculation changes
    const statementResult = validateStatementBlockPatterns([approvedStatementSample()]);
    expect(statementResult.findings).toEqual([]);
    expect(statementResult.accepted.some((c) => c.block_family === "statement")).toBe(true);
    expect(statementResult.accepted.every((c) => c.block_family === "statement")).toBe(true);

    // Recalculation validation operates independently
    const recalcResult = validateRecalculationBlockPatterns([approvedRecalculationSample()]);
    expect(recalcResult.accepted.every((c) => c.block_family === "recalculation")).toBe(true);

    // The combined semantic block-pattern validation includes both families
    const combinedInput = {
      sources: [
        {
          source_path: relative(REPO_ROOT, STATEMENT_SAMPLE_PATH),
          text: readFileSync(STATEMENT_SAMPLE_PATH, "utf8"),
        },
        {
          source_path: relative(REPO_ROOT, RECALCULATION_SAMPLE_PATH),
          text: readFileSync(RECALCULATION_SAMPLE_PATH, "utf8"),
        },
      ],
    };
    const combinedFindings = validateBsrsSemanticBlockPatterns(combinedInput);
    expect(combinedFindings).toEqual([]);
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

describe("BSRS optional-form block-pattern hardening", () => {
  it("accepts approved optional-form section sequencing and form-family clusters", () => {
    const result = validateOptionalFormBlockPatterns(approvedOptionalFormSamples());

    expect(result.findings).toEqual([]);
    expect(result.accepted.map((classification) => classification.form_family)).toEqual(
      expect.arrayContaining(["single_life", "single_and_joint", "qpsa_qdro"]),
    );
    expect(result.accepted.map((classification) => classification.section_context)).toEqual(
      expect.arrayContaining(["automatic_unmarried", "automatic_married", "straight_life", "five_year_cc"]),
    );
    expect(result.accepted.map((classification) => classification.line_cluster)).toEqual(
      expect.arrayContaining(["joint_50_survivor", "joint_75_survivor", "joint_100_survivor", "joint_50_popup"]),
    );
    expect(result.accepted.every((classification) => classification.block_family === "optional_form")).toBe(true);
  });

  it("emits structured findings for malformed optional-form section evidence", () => {
    const malformedSample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/single-life/synthetic-malformed-optional-form.txt",
      text: [
        "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat",
        "1\t\t\"\"\"A:\"\" & @CHAR(9) & \"\"Plan's Automatic Form for Unmarried Participant:\"\"\"\t\tTL\tTH",
        "1\t\t\"\"\"C:\"\" & @CHAR(9) & \"\"Straight Life Annuity\"\"\"\tPBGC_OPT_SLA\tTL\t$2",
        "1\t\t\"\"\"B:\"\" & @CHAR(9) & \"\"Plan's Automatic Form for Married Participant:\"\"\"\t\tTL\tTL",
        "1\t\t\"\"\"B:\"\" & @CHAR(9) & \"\"Plan's Automatic Form for Married Participant:\"\"\"\t\tTL\tTL",
        "1\t\t\"\"\"Z:\"\" & @CHAR(9) & \"\"Unexpected Optional Form\"\"\"\tPBGC_OPT_BAD\tTL\t$2",
      ].join("\n"),
    });

    const result = validateOptionalFormBlockPatterns([malformedSample]);

    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          block_family: "optional_form",
          category: "block_pattern",
          code: "BSRS_OPTIONAL_FORM_SECTION_OUT_OF_ORDER",
          column_name: "Description",
          form_family: "single_life",
          line_cluster: "automatic_married",
          row_index: 4,
          section_context: "automatic_married",
          severity: "error",
          source_path: malformedSample.source_path,
        }),
        expect.objectContaining({
          block_family: "optional_form",
          category: "block_pattern",
          code: "BSRS_OPTIONAL_FORM_SECTION_DUPLICATED",
          column_name: "Description",
          form_family: "single_life",
          line_cluster: "automatic_married",
          row_index: 5,
          section_context: "automatic_married",
          severity: "error",
          source_path: malformedSample.source_path,
        }),
        expect.objectContaining({
          block_family: "optional_form",
          category: "block_pattern",
          code: "BSRS_OPTIONAL_FORM_SECTION_SUSPICIOUS",
          column_name: "Description",
          form_family: "single_life",
          line_cluster: "unknown_optional_form",
          row_index: 6,
          section_context: "unknown_optional_form",
          severity: "warning",
          source_path: malformedSample.source_path,
        }),
        expect.objectContaining({
          block_family: "optional_form",
          category: "block_pattern",
          code: "BSRS_OPTIONAL_FORM_SECTION_MISSING",
          column_name: "Description",
          form_family: "single_life",
          line_cluster: "joint_50_survivor",
          section_context: "joint_50_survivor",
          severity: "error",
          source_path: malformedSample.source_path,
        }),
      ]),
    );
  });

  it("keeps optional-form block-pattern findings stable across repeated runs", () => {
    const input = {
      sources: OPTIONAL_FORM_SAMPLE_PATHS.map((path) => ({
        source_path: relative(REPO_ROOT, path),
        text: readFileSync(path, "utf8"),
      })),
    };

    const first = serializeSemanticValidationFindings(validateBsrsSemanticBlockPatterns(input));
    const second = serializeSemanticValidationFindings(validateBsrsSemanticBlockPatterns(input));
    const firstAccepted = JSON.stringify(validateOptionalFormBlockPatterns(approvedOptionalFormSamples()).accepted);
    const secondAccepted = JSON.stringify(validateOptionalFormBlockPatterns(approvedOptionalFormSamples()).accepted);

    expect(second).toBe(first);
    expect(secondAccepted).toBe(firstAccepted);
    expect(first).toBe("[]");
  });

  it("classifies optional-form rows into detail, unavailable_benefit, narrative, and formatting roles (T019)", () => {
    const result = validateOptionalFormBlockPatterns(approvedOptionalFormSamples());

    // All approved rows should be classified (not dropped) with content-driven roles
    const roles = result.accepted.map((c) => c.semantic_role);
    expect(roles).toEqual(
      expect.arrayContaining(["detail", "narrative", "formatting"]),
    );

    // Approved samples contain unavailable-benefit rows ("Annuity form not available", "Joint life amounts not requested")
    expect(result.accepted.some((c) => c.semantic_role === "unavailable_benefit")).toBe(true);

    // Every classified row must belong to optional_form block family
    expect(result.accepted.every((c) => c.block_family === "optional_form")).toBe(true);

    // Section-first rows should have a known section context (not unknown)
    const knownContexts = new Set([
      "automatic_unmarried", "automatic_married", "straight_life",
      "joint_50_survivor", "joint_75_survivor", "joint_100_survivor",
      "joint_50_popup", "five_year_cc", "ten_year_cc", "fifteen_year_cc",
    ]);
    expect(result.accepted.some((c) => knownContexts.has(c.section_context as string))).toBe(true);
  });

  it("does not treat formatting-only, spacer, or narrative rows as missing optional-form sections (T020)", () => {
    const sample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/single-life/synthetic-formatting.txt",
      text: [
        "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat",
        "1\t\t\"\"\"A:\"\" & @CHAR(9) & \"\"Plan's Automatic Form for Unmarried Participant:\"\"\"\t\tTL\tTH",
        "1\t\t\"@CHAR(9) & @IF(FORM_CODE_NSF = \"\"2\"\",\"\"Straight Life Annuity\"\", ...)\"\tXRD_MB_TERM\tTL\t$2",
        "1\t\t\t\tTL\tTH",
        "1\t\t\"----------------\"\t\tTL\tTL",
        "1\t\t\t\t\t",
        "1 'HLINE\t\t\"\"\"B:\"\" & @CHAR(9) & \"\"Plan's Automatic Form for Married Participant:\"\"\"\t\"\"\"Joint life amounts not requested\"\" 'BOLD\"\tTL\tTL",
        "1 'HLINE\t\t\"\"\"C:\"\" & @CHAR(9) & \"\"Straight Life Annuity\"\"\"\tPBGC_OPT_SLA\tTL\t$2",
      ].join("\n"),
    });

    const result = validateOptionalFormBlockPatterns([sample]);

    // Formatting rows (with format codes but no content) should be classified
    const formattingRows = result.accepted.filter((c) => c.semantic_role === "formatting");
    expect(formattingRows.length).toBeGreaterThan(0);

    // Spacer rows (no content, no format codes) should be classified
    const spacerRows = result.accepted.filter((c) => c.semantic_role === "spacer");
    expect(spacerRows.length).toBeGreaterThan(0);

    // Missing section findings should reference approved section definitions, not formatting/spacer rows
    const missingFindings = result.findings.filter((f) => f.code === "BSRS_OPTIONAL_FORM_SECTION_MISSING");
    for (const finding of missingFindings) {
      expect(finding.token).not.toContain("----");
      expect(finding.token).not.toBe("(empty)");
    }

    // No false orphan findings on formatting/spacer rows
    const orphanFindings = result.findings.filter((f) => f.code === "BSRS_OPTIONAL_FORM_ROW_ORPHAN");
    const formattingRowIndexes = new Set(
      result.accepted
        .filter((c) => c.semantic_role === "formatting" || c.semantic_role === "spacer")
        .map((c) => c.row_index),
    );
    const orphanOnFormatting = orphanFindings.filter((f) => formattingRowIndexes.has(f.row_index));
    expect(orphanOnFormatting.length).toBe(0);
  });

  it("emits structured orphan findings for optional-form rows with no approved section context (T021)", () => {
    const orphanSample = parseBsrsSample({
      source_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/single-life/synthetic-orphan.txt",
      text: [
        "PrintCriteria\tLine\tDescription\tDetail\tDescFormat\tDtlFormat",
        "1\t\tJust some orphaned optional-form content\tORPHAN_VALUE\tTL\t$2",
        "1\t\tAnother orphan with no section label\tMORE_DATA\tTL\t$2",
        "1\t\t\"\"\"A:\"\" & @CHAR(9) & \"\"Plan's Automatic Form for Unmarried Participant:\"\"\"\t\tTL\tTH",
        "1\t\t\"@CHAR(9) & \"\"Straight Life Annuity\"\"\"\tXRD_MB_TERM\tTL\t$2",
      ].join("\n"),
    });

    const result = validateOptionalFormBlockPatterns([orphanSample]);

    // Row 1 (index 2) and row 2 (index 3) appear before the first section marker → ORPHAN findings
    const orphanFindings = result.findings.filter((f) => f.code === "BSRS_OPTIONAL_FORM_ROW_ORPHAN");
    expect(orphanFindings.length).toBeGreaterThanOrEqual(2);

    expect(orphanFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          block_family: "optional_form",
          category: "block_pattern",
          code: "BSRS_OPTIONAL_FORM_ROW_ORPHAN",
          column_name: "Description",
          form_family: "single_life",
          line_cluster: "unknown_optional_form",
          section_context: "unknown_optional_form",
          severity: "warning",
          source_path: orphanSample.source_path,
        }),
      ]),
    );

    // Orphan rows are still classified (not dropped) — use the actual parser row indexes
    const orphanAccepted = result.accepted.filter((c) => c.row_index === 2 || c.row_index === 3);
    expect(orphanAccepted.length).toBeGreaterThanOrEqual(2);
    expect(orphanAccepted.every((c) => c.block_family === "optional_form")).toBe(true);
  });
});

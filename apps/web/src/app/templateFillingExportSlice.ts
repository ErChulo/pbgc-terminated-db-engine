import { buildReviewedInputApproval, type ReviewedInputApprovalInput, type ReviewedInputMessage } from "./reviewedInputApprovalSlice";

export type FilledArtifactStatus = "ready" | "blocked";

export type FilledArtifactPreview = {
  artifact_id: string;
  file_name: string;
  template_id: string;
  template_basis: string;
  export_status: FilledArtifactStatus;
  content: string;
  source_record_ids: string[];
  warnings: ReviewedInputMessage[];
  errors: ReviewedInputMessage[];
  trace_basis: {
    producing_module: "template_filling_export";
    rule_version: "0.1.0";
    template_id: string;
    source_record_ids: string[];
  };
};

export type TemplateExportControl = {
  copy_label: string;
  download_label: string;
  download_name: string;
  enabled: boolean;
};

export type TemplateFillingExportState = {
  artifact: FilledArtifactPreview;
  export_control: TemplateExportControl;
  boundary_notice: string;
  no_real_person_data_notice: string;
};

export type TemplateFillingExportInput = ReviewedInputApprovalInput;

const TEMPLATE_ID = "source_assertion_import_template";
const TEMPLATE_BASIS = "artifacts/templates/source_assertion_import_template_v0.1.0.csv";
const MODULE_NAME = "template_filling_export" as const;
const RULE_VERSION = "0.1.0" as const;

export function buildTemplateFillingExport(input: TemplateFillingExportInput = {}): TemplateFillingExportState {
  const decisions = input.decisions === undefined ? { "ASSERTION-MOCK-001": "approved" as const } : input.decisions;
  const approval = buildReviewedInputApproval({ reviewed_json_text: input.reviewed_json_text, decisions });
  const approvedRows = approval.rows.filter((row) => row.eligibility === "eligible").sort((left, right) => left.reviewed_record_id.localeCompare(right.reviewed_record_id));
  const sourceRecordIds = approvedRows.map((row) => row.reviewed_record_id);
  const fileName = sourceRecordIds.length > 0 ? `${approvedRows[0]?.case_id ?? "CASE-MOCK"}-source-assertion-import.csv` : "blocked-source-assertion-import.csv";
  const errors: ReviewedInputMessage[] =
    sourceRecordIds.length === 0 ? [{ code: "NO_APPROVED_RECORDS", severity: "error", message: "No approved mocked reviewed records are available for template filling." }] : [];
  const warnings: ReviewedInputMessage[] =
    approval.rows.length > approvedRows.length
      ? [{ code: "UNAPPROVED_RECORDS_EXCLUDED", severity: "warning", message: "Pending, rejected, or invalid reviewed records are excluded from the filled artifact." }]
      : [];
  const content = sourceRecordIds.length > 0 ? buildCsvContent(approvedRows) : "";
  const artifact: FilledArtifactPreview = {
    artifact_id: "filled-source-assertion-import-template",
    file_name: fileName,
    template_id: TEMPLATE_ID,
    template_basis: TEMPLATE_BASIS,
    export_status: sourceRecordIds.length > 0 ? "ready" : "blocked",
    content,
    source_record_ids: sourceRecordIds,
    warnings,
    errors,
    trace_basis: {
      producing_module: MODULE_NAME,
      rule_version: RULE_VERSION,
      template_id: TEMPLATE_ID,
      source_record_ids: sourceRecordIds,
    },
  };

  return {
    artifact,
    export_control: {
      copy_label: "Copy artifact content",
      download_label: "Download artifact",
      download_name: fileName,
      enabled: artifact.export_status === "ready",
    },
    boundary_notice:
      "Browser-local template filling only. Approved mocked records are mapped into a reviewed-input artifact without persistence or adapter writes.",
    no_real_person_data_notice:
      "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is used on this export page.",
  };
}

function buildCsvContent(rows: ReturnType<typeof buildReviewedInputApproval>["rows"]): string {
  const header = ["case_id", "reviewed_record_id", "source_layer", "stage"];
  const body = rows.map((row) => [row.case_id, row.reviewed_record_id, row.source_layer, "upload_import"].map(csvCell).join(","));
  return [header.join(","), ...body].join("\n");
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, "\"\"")}"` : value;
}

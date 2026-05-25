import { buildReviewedInputApproval, type ReviewedInputMessage } from "./reviewedInputApprovalSlice";
import { buildTemplateFillingExport } from "./templateFillingExportSlice";
import { buildUploadImportPipeline } from "./uploadImportPipelineSlice";

export type IssueSeverity = "info" | "warning" | "error";

export type IssueQueueItem = {
  issue_id: string;
  ordering_key: string;
  source_stage: string;
  severity: IssueSeverity;
  status: "open" | "blocked";
  code: string;
  message: string;
  trace_basis: {
    producing_module: string;
    rule_version: string;
    source_id: string;
  };
};

export type UnresolvedIssuesQueueState = {
  items: IssueQueueItem[];
  summary: {
    total_count: number;
    error_count: number;
    warning_count: number;
    info_count: number;
  };
  boundary_notice: string;
  no_real_person_data_notice: string;
};

export function buildUnresolvedIssuesQueue(): UnresolvedIssuesQueueState {
  const upload = buildUploadImportPipeline();
  const approval = buildReviewedInputApproval();
  const template = buildTemplateFillingExport({ decisions: {} });
  const items = [
    ...messagesToItems("upload_import", "reviewed_json_preview", upload.reviewed_json_preview.trace_basis.producing_module, upload.reviewed_json_preview.trace_basis.rule_version, [
      ...upload.reviewed_json_preview.warnings,
      ...upload.reviewed_json_preview.errors,
    ]),
    ...approval.rows.flatMap((row) =>
      messagesToItems("reviewed_input_approval", row.reviewed_record_id, row.trace_basis.producing_module, row.trace_basis.rule_version, [...row.warnings, ...row.errors]),
    ),
    ...messagesToItems("template_filling_export", template.artifact.artifact_id, template.artifact.trace_basis.producing_module, template.artifact.trace_basis.rule_version, [
      ...template.artifact.warnings,
      ...template.artifact.errors,
    ]),
  ].sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));

  return {
    items,
    summary: {
      total_count: items.length,
      error_count: items.filter((item) => item.severity === "error").length,
      warning_count: items.filter((item) => item.severity === "warning").length,
      info_count: items.filter((item) => item.severity === "info").length,
    },
    boundary_notice:
      "Browser-local issue queue only. Existing warnings, errors, and blocked states are displayed without persistence or adapter writes.",
    no_real_person_data_notice:
      "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is used on this issue queue.",
  };
}

function messagesToItems(
  sourceStage: string,
  sourceId: string,
  producingModule: string,
  ruleVersion: string,
  messages: ReviewedInputMessage[],
): IssueQueueItem[] {
  return messages.map((message, index) => ({
    issue_id: `${sourceStage}|${sourceId}|${message.code}`,
    ordering_key: `${severityOrder(message.severity)}|${sourceStage}|${sourceId}|${String(index + 1).padStart(6, "0")}|${message.code}`,
    source_stage: sourceStage,
    severity: message.severity,
    status: message.severity === "error" ? "blocked" : "open",
    code: message.code,
    message: message.message,
    trace_basis: {
      producing_module: producingModule,
      rule_version: ruleVersion,
      source_id: sourceId,
    },
  }));
}

function severityOrder(severity: IssueSeverity): string {
  if (severity === "error") return "000001";
  if (severity === "warning") return "000002";
  return "000003";
}

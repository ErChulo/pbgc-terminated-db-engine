export type PbgcTemplateCategory = "official_pbgc" | "reviewed_input_import";
export type TemplateReadinessStatus = "browse_ready" | "input_ready" | "planned_for_filling";

export type PbgcTemplateEntry = {
  template_id: string;
  title: string;
  category: PbgcTemplateCategory;
  format: "csv" | "docx";
  repository_path: string;
  stage_key: string;
  basis: string;
  ordering_key: string;
};

export type TemplateReadinessPreview = {
  selected_template_id: string;
  status: TemplateReadinessStatus;
  status_label: string;
  dependencies: string[];
  warnings: string[];
  basis: string;
};

export type PbgcTemplateLibraryState = {
  templates: PbgcTemplateEntry[];
  selected_template: PbgcTemplateEntry;
  readiness: TemplateReadinessPreview;
  boundary_notice: string;
};

const TEMPLATE_BOUNDARY_NOTICE =
  "PBGC Template Library boundary: metadata and readiness preview only. No OCR, in-app scraping, server calls, sql.js writes, output-adapter writes, template filling, or artifact export occurs here.";

const TEMPLATES = [
  ["source_assertion_import_template", "Source Assertion Import Template", "reviewed_input_import", "csv", "artifacts/templates/source_assertion_import_template_v0.1.0.csv", "upload_import"],
  ["resolved_fact_import_template", "Resolved Fact Import Template", "reviewed_input_import", "csv", "artifacts/templates/resolved_fact_import_template_v0.1.0.csv", "reviewed_input_approval"],
  ["resolved_plan_provision_import_template", "Resolved Plan Provision Import Template", "reviewed_input_import", "csv", "artifacts/templates/resolved_plan_provision_import_template_v0.1.0.csv", "reviewed_input_approval"],
  ["plan_summary_shell", "Plan Summary Shell", "official_pbgc", "docx", "artifacts/templates/pbgc-official/plan-summary/Plan Summary Shell.docx", "template_filling_export"],
  ["actuarial_case_memo", "Actuarial Case Memo", "official_pbgc", "docx", "artifacts/templates/pbgc-official/actuarial-case-memo/Actuarial Case Memo Sample Language_12032025.docx", "template_filling_export"],
  ["436_evaluation", "436 Evaluation", "official_pbgc", "docx", "artifacts/templates/pbgc-official/436-evaluation/436 Evaluation (ASTD Updates Nov 2025).docx", "template_filling_export"],
  ["estimated_benefit_administration_analysis", "Estimated Benefit Administration Analysis", "official_pbgc", "docx", "artifacts/templates/pbgc-official/estimated-benefit-administration-analysis/Estimated Benefits Administration Analysis Memo.docx", "template_filling_export"],
  ["estimated_benefit_adjustment_analysis", "Estimated Benefit Adjustment Analysis", "official_pbgc", "docx", "artifacts/templates/pbgc-official/estimated-benefit-adjustment-analysis/Estimated Benefits Adjustment Analysis Memo - Updates 2024.docx", "template_filling_export"],
] as const;

export function buildPbgcTemplateLibrary(
  options: {
    selected_template_id?: string;
  } = {},
): PbgcTemplateLibraryState {
  const templates = TEMPLATES.map(([templateId, title, category, format, repositoryPath, stageKey], index) => ({
    template_id: templateId,
    title,
    category,
    format,
    repository_path: repositoryPath,
    stage_key: stageKey,
    basis: "committed PBGC template artifact",
    ordering_key: `${String(index + 1).padStart(6, "0")}|${templateId}`,
  }));
  const selectedTemplate = templates.find((template) => template.template_id === options.selected_template_id) ?? templates[0];
  return {
    templates,
    selected_template: selectedTemplate,
    readiness: buildReadiness(selectedTemplate),
    boundary_notice: TEMPLATE_BOUNDARY_NOTICE,
  };
}

function buildReadiness(template: PbgcTemplateEntry): TemplateReadinessPreview {
  if (template.category === "reviewed_input_import") {
    return {
      selected_template_id: template.template_id,
      status: "input_ready",
      status_label: "Ready for local reviewed-input preparation",
      dependencies: ["external LLM work outside the app", "human review before engine use"],
      warnings: ["This import template is not an output artifact."],
      basis: "browser-local template readiness display",
    };
  }
  return {
    selected_template_id: template.template_id,
    status: "planned_for_filling",
    status_label: "Planned for future filling",
    dependencies: ["reviewed-input approval", "template filling/export feature"],
    warnings: ["Template filling and artifact export are not implemented in this slice."],
    basis: "browser-local template readiness display",
  };
}

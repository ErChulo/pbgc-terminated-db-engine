import { buildApprovedSampleReconciliationWorkbench } from "./reconciliationWorkbenchSlice";

export type CaseDashboardStageStatus = "current" | "available" | "planned" | "unavailable";

export type CaseDashboardSummary = {
  workspace_id: string;
  workspace_label: string;
  sample_id: string;
  sample_label: string;
  artifact_basis: string;
  mock_case_label: string;
  mock_population_label: string;
  no_real_person_data_notice: string;
  primary_action_label: string;
  primary_action_target: string;
};

export type CaseDashboardStage = {
  stage_key: string;
  label: string;
  status: CaseDashboardStageStatus;
  status_label: string;
  detail: string;
  basis: string;
  ordering_key: string;
  target: string | null;
};

export type CaseNavigationDashboardState = {
  summary: CaseDashboardSummary;
  stages: CaseDashboardStage[];
  active_stage_key: string;
  generated_at: string;
};

const WORKSPACE_ID = "mock-workspace-approved-samples";
const WORKSPACE_LABEL = "Mock approved-sample case workspace";
const WORKBENCH_TARGET = "#reconciliation-workbench";

const STAGE_DEFINITIONS = [
  {
    stage_key: "case_workspace",
    label: "Case Workspace",
    status: "current",
    status_label: "Current mocked workspace",
    detail: "Mocked approved-sample workspace is available for alpha navigation.",
    target: "#case-dashboard",
  },
  {
    stage_key: "reconciliation_workbench",
    label: "Reconciliation Workbench",
    status: "available",
    status_label: "Available",
    detail: "Existing workbench is available with approved sample outputs, shared facts, shared values, trace expansion, and filters.",
    target: WORKBENCH_TARGET,
  },
  {
    stage_key: "prompt_library",
    label: "Prompt Library",
    status: "planned",
    status_label: "Planned",
    detail: "Stage-specific scraping prompts will be managed in a later slice.",
    target: null,
  },
  {
    stage_key: "schema_library",
    label: "Schema Library",
    status: "planned",
    status_label: "Planned",
    detail: "Reviewed-input schemas and validator surfaces will be managed in a later slice.",
    target: null,
  },
  {
    stage_key: "pbgc_template_library",
    label: "PBGC Template Library",
    status: "planned",
    status_label: "Planned",
    detail: "PBGC template viewing and selection will be managed in a later slice.",
    target: null,
  },
  {
    stage_key: "upload_import",
    label: "Upload / Import",
    status: "planned",
    status_label: "Planned",
    detail: "External-LLM artifacts and reviewed structured inputs will be imported in a later slice.",
    target: null,
  },
  {
    stage_key: "reviewed_input_approval",
    label: "Reviewed Input Approval",
    status: "planned",
    status_label: "Planned",
    detail: "Normalization and approval steps will be managed in a later slice.",
    target: null,
  },
  {
    stage_key: "template_filling_export",
    label: "Template Filling / Export",
    status: "planned",
    status_label: "Planned",
    detail: "Template filling and artifact export will be managed in a later slice.",
    target: null,
  },
  {
    stage_key: "unresolved_issues",
    label: "Unresolved Issues",
    status: "planned",
    status_label: "Planned",
    detail: "Missing fields, validation issues, and unresolved mappings will be queued in a later slice.",
    target: null,
  },
  {
    stage_key: "sample_mock_packs",
    label: "Sample / Mock Packs",
    status: "planned",
    status_label: "Planned",
    detail: "Approved sample and mock data pack management will be added in a later slice.",
    target: null,
  },
] as const;

export function buildCaseNavigationDashboard(
  options: {
    sample_id?: string;
    active_stage_key?: string;
  } = {},
): CaseNavigationDashboardState {
  const workbench = buildApprovedSampleReconciliationWorkbench({ sample_id: options.sample_id });
  const stages = STAGE_DEFINITIONS.map((stage, index) => ({
    ...stage,
    ordering_key: `${String(index + 1).padStart(6, "0")}|${stage.stage_key}`,
    basis:
      stage.stage_key === "reconciliation_workbench" || stage.stage_key === "case_workspace"
        ? workbench.generated_at
        : "planned-alpha-stage-display-only",
  })).sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));
  return {
    summary: {
      workspace_id: WORKSPACE_ID,
      workspace_label: WORKSPACE_LABEL,
      sample_id: workbench.sample_id,
      sample_label: workbench.sample_label,
      artifact_basis: workbench.sample_context.artifact_basis,
      mock_case_label: workbench.sample_context.mock_case_label,
      mock_population_label: workbench.sample_context.mock_population_label,
      no_real_person_data_notice: workbench.sample_context.no_real_person_data_notice,
      primary_action_label: "Open reconciliation workbench",
      primary_action_target: WORKBENCH_TARGET,
    },
    stages,
    active_stage_key: options.active_stage_key ?? "case_workspace",
    generated_at: workbench.generated_at,
  };
}

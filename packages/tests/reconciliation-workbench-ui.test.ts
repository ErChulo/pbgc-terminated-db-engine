import { describe, expect, it } from "vitest";
import { buildCaseNavigationDashboard } from "../../apps/web/src/app/caseNavigationDashboardSlice";
import { buildUploadImportPipeline } from "../../apps/web/src/app/uploadImportPipelineSlice";
import { buildPromptLibrary } from "../../apps/web/src/app/promptLibrarySlice";
import { buildPbgcTemplateLibrary } from "../../apps/web/src/app/pbgcTemplateLibrarySlice";
import { buildApprovedSampleReconciliationWorkbench } from "../../apps/web/src/app/reconciliationWorkbenchSlice";
import { buildReviewedInputApproval } from "../../apps/web/src/app/reviewedInputApprovalSlice";
import { buildSampleMockPackManagement } from "../../apps/web/src/app/sampleMockPackManagementSlice";
import { buildSchemaLibrary } from "../../apps/web/src/app/schemaLibrarySlice";
import { buildTemplateFillingExport } from "../../apps/web/src/app/templateFillingExportSlice";
import { buildUnresolvedIssuesQueue } from "../../apps/web/src/app/unresolvedIssuesQueueSlice";
import { buildCaseNavigationDashboardMarkup } from "../../apps/web/src/pages/CaseNavigationDashboardPage";
import { buildPbgcTemplateLibraryMarkup } from "../../apps/web/src/pages/PbgcTemplateLibraryPage";
import { buildPromptLibraryMarkup } from "../../apps/web/src/pages/PromptLibraryPage";
import { buildReconciliationWorkbenchMarkup } from "../../apps/web/src/pages/ReconciliationWorkbenchPage";
import { buildReviewedInputApprovalMarkup } from "../../apps/web/src/pages/ReviewedInputApprovalPage";
import { buildSampleMockPackManagementMarkup } from "../../apps/web/src/pages/SampleMockPackManagementPage";
import { buildSchemaLibraryMarkup } from "../../apps/web/src/pages/SchemaLibraryPage";
import { buildTemplateFillingExportMarkup } from "../../apps/web/src/pages/TemplateFillingExportPage";
import { buildUnresolvedIssuesQueueMarkup } from "../../apps/web/src/pages/UnresolvedIssuesQueuePage";
import { buildUploadImportPipelineMarkup } from "../../apps/web/src/pages/UploadImportPipelinePage";

describe("reconciliation workbench UI", () => {
  it("builds deterministic case navigation dashboard state from the approved mocked workspace", () => {
    const state = buildCaseNavigationDashboard();
    const repeated = buildCaseNavigationDashboard();

    expect(state.summary).toMatchObject({
      workspace_id: "mock-workspace-approved-samples",
      workspace_label: "Mock approved-sample case workspace",
      sample_id: "BSRS001",
      sample_label: "Deferred vested BSRS configuration packet",
      artifact_basis: "source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001",
      mock_case_label: "Mock case context: simulated PBGC terminated DB case",
      mock_population_label: "Mock population context: simulated participant cohort",
    });
    expect(state.summary.no_real_person_data_notice).toContain("No real participant");
    expect(state.generated_at).toBe("source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001");
    expect(repeated).toEqual(state);
  });

  it("exposes required alpha case stages in stable order with no unavailable stages", () => {
    const state = buildCaseNavigationDashboard();

    expect(state.stages.map((stage) => stage.stage_key)).toEqual([
      "case_workspace",
      "reconciliation_workbench",
      "prompt_library",
      "schema_library",
      "pbgc_template_library",
      "upload_import",
      "reviewed_input_approval",
      "template_filling_export",
      "unresolved_issues",
      "sample_mock_packs",
    ]);
    expect(state.stages.map((stage) => stage.ordering_key)).toEqual([...state.stages.map((stage) => stage.ordering_key)].sort());
    expect(state.stages.find((stage) => stage.stage_key === "reconciliation_workbench")).toMatchObject({
      status: "available",
      target: "#reconciliation-workbench",
    });
    expect(state.stages.filter((stage) => stage.status === "planned")).toEqual([]);
    expect(state.stages.filter((stage) => stage.status === "unavailable")).toEqual([]);
  });

  it("renders dashboard summary, stage navigation, and workbench action without real-person data", () => {
    const markup = buildCaseNavigationDashboardMarkup(buildCaseNavigationDashboard());

    expect(markup).toContain("PBGC Case Dashboard");
    expect(markup).toContain("Mock approved-sample case workspace");
    expect(markup).toContain("Deferred vested BSRS configuration packet");
    expect(markup).toContain("Open reconciliation workbench");
    expect(markup).toContain("href=\"#reconciliation-workbench\"");
    expect(markup).toContain("Prompt Library");
    expect(markup).toContain("Schema Library");
    expect(markup).toContain("PBGC Template Library");
    expect(markup).toContain("No real participant, beneficiary");
    expect(markup).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("keeps dashboard renders deterministic and free of server, raw, OCR, upload execution, sql.js write, and adapter-write paths", () => {
    const first = buildCaseNavigationDashboardMarkup(buildCaseNavigationDashboard({ sample_id: "BSRS002" }));
    const second = buildCaseNavigationDashboardMarkup(buildCaseNavigationDashboard({ sample_id: "BSRS002" }));

    expect(second).toBe(first);
    expect(first).toContain("BSRS002");
    expect(first).not.toMatch(/\b(https?:\/\/|server call|telemetry|raw OCR|raw source document|type="file"|insert into|sql\.js write|output-adapter write)\b/i);
    expect(first).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("preserves existing workbench output and workspace session when dashboard state is built", () => {
    const workbench = buildApprovedSampleReconciliationWorkbench({
      sample_id: "BSRS002",
      theme: "dark",
      status_filter: "agreement",
      severity_filter: "info",
      workspace_session_status: "saved",
    });
    const dashboard = buildCaseNavigationDashboard({ sample_id: "BSRS002" });
    const repeatedWorkbench = buildApprovedSampleReconciliationWorkbench({
      sample_id: "BSRS002",
      theme: "dark",
      status_filter: "agreement",
      severity_filter: "info",
      workspace_session_status: "saved",
    });

    expect(dashboard.summary.sample_id).toBe("BSRS002");
    expect(repeatedWorkbench.output_panels).toEqual(workbench.output_panels);
    expect(repeatedWorkbench.filtered_reconciliation_rows).toEqual(workbench.filtered_reconciliation_rows);
    expect(repeatedWorkbench.workspace_session).toEqual(workbench.workspace_session);
  });

  it("renders responsive dashboard landmarks with stable labels and required controls", () => {
    const markup = buildCaseNavigationDashboardMarkup(buildCaseNavigationDashboard());

    expect(markup).toContain("case-dashboard-page");
    expect(markup).toContain("case-dashboard-summary");
    expect(markup).toContain("case-stage-list");
    expect(markup).toContain("data-case-dashboard-workbench-link");
    expect(markup).toContain("Current mocked workspace");
    expect(markup).toContain("Stage status");
  });

  it("builds deterministic stage prompt entries with external LLM boundary notices", () => {
    const state = buildPromptLibrary();
    const repeated = buildPromptLibrary();

    expect(state.prompts.map((prompt) => prompt.stage_key)).toEqual([
      "case_workspace",
      "reconciliation_workbench",
      "prompt_library",
      "schema_library",
      "pbgc_template_library",
      "upload_import",
      "reviewed_input_approval",
      "template_filling_export",
      "unresolved_issues",
      "sample_mock_packs",
    ]);
    expect(state.prompts.map((prompt) => prompt.ordering_key)).toEqual([...state.prompts.map((prompt) => prompt.ordering_key)].sort());
    expect(state.selected_prompt.title).toBe("Case Workspace Prompt");
    expect(state.boundary_notice).toContain("external LLM outside this app");
    expect(repeated).toEqual(state);
  });

  it("renders prompt library with selected prompt, dashboard return, and no OCR or scraping execution", () => {
    const markup = buildPromptLibraryMarkup(buildPromptLibrary({ selected_prompt_id: "prompt-reconciliation-workbench" }));

    expect(markup).toContain("PBGC Prompt Library");
    expect(markup).toContain("Reconciliation Workbench Prompt");
    expect(markup).toContain("External LLM boundary");
    expect(markup).toContain("href=\"#case-dashboard\"");
    expect(markup).toContain("data-prompt-draft-editor");
    expect(markup).toContain("data-prompt-import-payload");
    expect(markup).not.toMatch(/\b(run scraping|run OCR|server call|telemetry|insert into|output-adapter write)\b/i);
    expect(markup).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("links the case dashboard prompt stage to the prompt library route", () => {
    const dashboard = buildCaseNavigationDashboard();
    const markup = buildCaseNavigationDashboardMarkup(dashboard);

    expect(dashboard.stages.find((stage) => stage.stage_key === "prompt_library")).toMatchObject({
      status: "available",
      target: "#prompt-library",
    });
    expect(markup).toContain("href=\"#prompt-library\"");
    expect(markup).toContain("Prompt Library");
  });

  it("builds browser-local edited prompt drafts without changing the approved baseline prompt", () => {
    const baseline = buildPromptLibrary({ selected_prompt_id: "prompt-schema-library" });
    const edited = buildPromptLibrary({
      selected_prompt_id: "prompt-schema-library",
      draft_text: "Browser-local draft: inspect reviewed schema gaps for the mocked case only.",
    });

    expect(edited.draft).toMatchObject({
      status: "edited",
      validation_message: "Browser-local draft is not approved baseline prompt text.",
      basis: "browser-local prompt draft display state",
    });
    expect(edited.selected_prompt.body).toEqual(baseline.selected_prompt.body);
    expect(edited.draft.draft_text).toContain("Browser-local draft");
  });

  it("accepts local prompt text or JSON import and rejects unsupported oversized import display-only", () => {
    const acceptedText = buildPromptLibrary({ import_payload: "Use only mocked case context and summarize schema questions." });
    const acceptedJson = buildPromptLibrary({
      import_payload: JSON.stringify({ stage_key: "schema_library", prompt_text: "Review schema fields for mocked approved samples only." }),
    });
    const rejected = buildPromptLibrary({ import_payload: "x".repeat(5001) });

    expect(acceptedText.draft).toMatchObject({ status: "imported", validation_message: "Local prompt import accepted as browser-local draft." });
    expect(acceptedJson.selected_prompt.stage_key).toBe("schema_library");
    expect(acceptedJson.draft.draft_text).toContain("Review schema fields");
    expect(rejected.draft).toMatchObject({ status: "invalid", validation_message: "Prompt import exceeds the alpha size limit." });
  });

  it("keeps prompt library markup deterministic and free of real-person, server, OCR, scraping execution, sql.js, and adapter-write paths", () => {
    const first = buildPromptLibraryMarkup(buildPromptLibrary({ import_payload: "External LLM prompt draft for mocked data only." }));
    const second = buildPromptLibraryMarkup(buildPromptLibrary({ import_payload: "External LLM prompt draft for mocked data only." }));

    expect(second).toBe(first);
    expect(first).toContain("Browser-local draft");
    expect(first).not.toMatch(/\b(https?:\/\/|server call|telemetry|raw OCR|raw source document|run scraping|run OCR|insert into|sql\.js write|output-adapter write)\b/i);
    expect(first).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("builds deterministic committed schema library entries with repository basis", () => {
    const state = buildSchemaLibrary();
    const repeated = buildSchemaLibrary();

    expect(state.schemas.map((schema) => schema.schema_id)).toEqual([
      "source_assertion_schema",
      "resolved_fact_schema",
      "resolved_plan_provision_schema",
      "sqlite_schema_blueprint",
    ]);
    expect(state.schemas.map((schema) => schema.ordering_key)).toEqual([...state.schemas.map((schema) => schema.ordering_key)].sort());
    expect(state.selected_schema.repository_path).toBe("artifacts/schemas/source_assertion_schema_v0.1.0.md");
    expect(state.selected_schema.required_fields).toContain("case_id");
    expect(state.boundary_notice).toContain("local reviewed JSON preview");
    expect(repeated).toEqual(state);
  });

  it("renders schema library details and links from the dashboard schema stage", () => {
    const dashboard = buildCaseNavigationDashboard();
    const dashboardMarkup = buildCaseNavigationDashboardMarkup(dashboard);
    const markup = buildSchemaLibraryMarkup(buildSchemaLibrary({ selected_schema_id: "resolved_fact_schema" }));

    expect(dashboard.stages.find((stage) => stage.stage_key === "schema_library")).toMatchObject({
      status: "available",
      target: "#schema-library",
    });
    expect(dashboardMarkup).toContain("href=\"#schema-library\"");
    expect(markup).toContain("PBGC Schema Library");
    expect(markup).toContain("Resolved Fact Schema");
    expect(markup).toContain("artifacts/schemas/resolved_fact_schema_v0.1.0.md");
    expect(markup).toContain("data-schema-json-preview");
    expect(markup).toContain("Local validation preview");
  });

  it("previews accepted, missing-field, malformed, and oversized reviewed JSON deterministically", () => {
    const accepted = buildSchemaLibrary({ json_text: JSON.stringify({ case_id: "CASE-MOCK", assertion_id: "ASSERTION-MOCK", source_layer: "source_assertion" }) });
    const invalid = buildSchemaLibrary({ json_text: JSON.stringify({ case_id: "CASE-MOCK" }) });
    const malformed = buildSchemaLibrary({ json_text: "{not-json" });
    const oversized = buildSchemaLibrary({ json_text: "x".repeat(8001) });

    expect(accepted.validation).toMatchObject({ status: "accepted", errors: [] });
    expect(accepted.validation.checked_fields).toEqual(["case_id", "assertion_id", "source_layer"]);
    expect(invalid.validation.status).toBe("invalid");
    expect(invalid.validation.errors).toContain("Missing required field: assertion_id");
    expect(malformed.validation).toMatchObject({ status: "malformed", errors: ["JSON text could not be parsed."] });
    expect(oversized.validation).toMatchObject({ status: "oversized", errors: ["JSON preview exceeds the alpha size limit."] });
  });

  it("keeps schema library markup deterministic and free of server, OCR, scraping, raw, sql.js, adapter-write, and real-person paths", () => {
    const first = buildSchemaLibraryMarkup(buildSchemaLibrary({ json_text: JSON.stringify({ case_id: "CASE-MOCK", assertion_id: "ASSERTION-MOCK", source_layer: "source_assertion" }) }));
    const second = buildSchemaLibraryMarkup(buildSchemaLibrary({ json_text: JSON.stringify({ case_id: "CASE-MOCK", assertion_id: "ASSERTION-MOCK", source_layer: "source_assertion" }) }));

    expect(second).toBe(first);
    expect(first).toContain("Accepted");
    expect(first).not.toMatch(/\b(https?:\/\/|server call|telemetry|raw OCR|raw source document|run scraping|run OCR|insert into|sql\.js write|output-adapter write)\b/i);
    expect(first).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("builds deterministic PBGC template library entries with committed repository paths", () => {
    const state = buildPbgcTemplateLibrary();
    const repeated = buildPbgcTemplateLibrary();

    expect(state.templates.map((template) => template.template_id)).toEqual([
      "source_assertion_import_template",
      "resolved_fact_import_template",
      "resolved_plan_provision_import_template",
      "plan_summary_shell",
      "actuarial_case_memo",
      "436_evaluation",
      "estimated_benefit_administration_analysis",
      "estimated_benefit_adjustment_analysis",
    ]);
    expect(state.templates.map((template) => template.ordering_key)).toEqual([...state.templates.map((template) => template.ordering_key)].sort());
    expect(state.selected_template.repository_path).toBe("artifacts/templates/source_assertion_import_template_v0.1.0.csv");
    expect(state.boundary_notice).toContain("metadata and readiness preview only");
    expect(repeated).toEqual(state);
  });

  it("renders template library metadata and links from the dashboard template stage", () => {
    const dashboard = buildCaseNavigationDashboard();
    const dashboardMarkup = buildCaseNavigationDashboardMarkup(dashboard);
    const markup = buildPbgcTemplateLibraryMarkup(buildPbgcTemplateLibrary({ selected_template_id: "plan_summary_shell" }));

    expect(dashboard.stages.find((stage) => stage.stage_key === "pbgc_template_library")).toMatchObject({
      status: "available",
      target: "#template-library",
    });
    expect(dashboardMarkup).toContain("href=\"#template-library\"");
    expect(markup).toContain("PBGC Template Library");
    expect(markup).toContain("Plan Summary Shell");
    expect(markup).toContain("artifacts/templates/pbgc-official/plan-summary/Plan Summary Shell.docx");
    expect(markup).toContain("Official PBGC template");
    expect(markup).toContain("Template readiness");
  });

  it("links the case dashboard upload/import stage to the upload/import route", () => {
    const dashboard = buildCaseNavigationDashboard({ active_stage_key: "upload_import" });
    const markup = buildCaseNavigationDashboardMarkup(dashboard);

    expect(dashboard.stages.find((stage) => stage.stage_key === "upload_import")).toMatchObject({
      status: "available",
      target: "#upload-import",
    });
    expect(markup).toContain("href=\"#upload-import\"");
    expect(markup).toContain("Upload / Import");
  });

  it("builds deterministic upload/import preview sources and accepted reviewed JSON", () => {
    const input = {
      reviewed_json_text: JSON.stringify({
        case_id: "CASE-MOCK-001",
        assertion_id: "ASSERTION-MOCK-001",
        source_layer: "source_assertion",
        stage: "upload_import",
      }),
      external_artifact_text: "External LLM artifact for CASE-MOCK-001 prepared outside the app. Mocked review notes only.",
    };
    const state = buildUploadImportPipeline(input);
    const repeated = buildUploadImportPipeline(input);

    expect(state.sources.map((source) => source.source_id)).toEqual(["reviewed_structured_json", "external_llm_artifact"]);
    expect(state.reviewed_json_preview).toMatchObject({
      status: "accepted",
      status_label: "Accepted",
      errors: [],
    });
    expect(state.reviewed_json_preview.accepted_fields).toEqual(["assertion_id", "case_id", "source_layer", "stage"]);
    expect(state.external_artifact_preview).toMatchObject({
      status: "accepted",
      status_label: "Accepted as inert review text",
      accepted_fields: [],
    });
    expect(state.external_artifact_preview.warnings[0]).toMatchObject({
      code: "INERT_EXTERNAL_ARTIFACT",
      severity: "info",
    });
    expect(repeated).toEqual(state);
  });

  it("reports malformed, invalid, empty, and oversized upload/import previews deterministically", () => {
    const malformed = buildUploadImportPipeline({ reviewed_json_text: "{not-json" });
    const invalid = buildUploadImportPipeline({ reviewed_json_text: JSON.stringify({ case_id: "CASE-MOCK-001" }) });
    const empty = buildUploadImportPipeline();
    const oversized = buildUploadImportPipeline({ reviewed_json_text: "x".repeat(8001), external_artifact_text: "x".repeat(8001) });

    expect(malformed.reviewed_json_preview).toMatchObject({
      status: "malformed",
      errors: [{ code: "REVIEWED_JSON_MALFORMED", severity: "error" }],
    });
    expect(invalid.reviewed_json_preview.status).toBe("invalid");
    expect(invalid.reviewed_json_preview.errors.map((error) => error.code)).toEqual(["REVIEWED_RECORD_ID_MISSING"]);
    expect(empty.reviewed_json_preview.status).toBe("empty");
    expect(empty.external_artifact_preview.status).toBe("empty");
    expect(oversized.reviewed_json_preview.status).toBe("oversized");
    expect(oversized.external_artifact_preview.status).toBe("oversized");
    expect(buildUploadImportPipeline({ reviewed_json_text: "{not-json" }).reviewed_json_preview).toEqual(malformed.reviewed_json_preview);
  });

  it("renders upload/import page with boundary notice, preview panels, and no prohibited runtime paths", () => {
    const markup = buildUploadImportPipelineMarkup(
      buildUploadImportPipeline({
        reviewed_json_text: JSON.stringify({ case_id: "CASE-MOCK-001", fact_id: "FACT-MOCK-001", source_layer: "resolved_fact" }),
        external_artifact_text: "External LLM artifact for CASE-MOCK-001 prepared outside the app. Mocked review notes only.",
      }),
    );

    expect(markup).toContain("PBGC Upload / Import");
    expect(markup).toContain("Return to case dashboard");
    expect(markup).toContain("data-upload-reviewed-json");
    expect(markup).toContain("data-upload-external-artifact");
    expect(markup).toContain("Accepted");
    expect(markup).toContain("Accepted as inert review text");
    expect(markup).toContain("No real participant, beneficiary");
    expect(markup).not.toMatch(/\b(type="file"|https?:\/\/|server call|telemetry|raw OCR|raw source document|run scraping|run OCR|insert into|sql\.js write|output-adapter write)\b/i);
    expect(markup).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("links the case dashboard reviewed-input approval stage to the approval route", () => {
    const dashboard = buildCaseNavigationDashboard({ active_stage_key: "reviewed_input_approval" });
    const markup = buildCaseNavigationDashboardMarkup(dashboard);

    expect(dashboard.stages.find((stage) => stage.stage_key === "reviewed_input_approval")).toMatchObject({
      status: "available",
      target: "#reviewed-input-approval",
    });
    expect(markup).toContain("href=\"#reviewed-input-approval\"");
    expect(markup).toContain("Reviewed Input Approval");
  });

  it("normalizes mocked reviewed records into deterministic approval rows", () => {
    const state = buildReviewedInputApproval();
    const repeated = buildReviewedInputApproval();

    expect(state.rows.map((row) => row.reviewed_record_id)).toEqual(["ASSERTION-MOCK-001", "FACT-MOCK-001"]);
    expect(state.rows.map((row) => row.ordering_key)).toEqual([...state.rows.map((row) => row.ordering_key)].sort());
    expect(state.rows[0]).toMatchObject({
      case_id: "CASE-MOCK-001",
      reviewed_record_id: "ASSERTION-MOCK-001",
      source_layer: "source_assertion",
      decision: "pending",
      eligibility: "blocked",
    });
    expect(state.rows[0].warnings.map((warning) => warning.code)).toEqual(["APPROVAL_DECISION_PENDING"]);
    expect(state.approved_packet_preview).toMatchObject({
      approved_count: 0,
      blocked_count: 2,
      basis: "browser-local reviewed input approval preview",
    });
    expect(repeated).toEqual(state);
  });

  it("applies display-only approve and reject decisions while blocking rejected rows", () => {
    const state = buildReviewedInputApproval({
      decisions: {
        "ASSERTION-MOCK-001": "approved",
        "FACT-MOCK-001": "rejected",
      },
    });

    expect(state.rows.map((row) => [row.reviewed_record_id, row.decision, row.eligibility])).toEqual([
      ["ASSERTION-MOCK-001", "approved", "eligible"],
      ["FACT-MOCK-001", "rejected", "blocked"],
    ]);
    expect(state.approved_packet_preview.approved_count).toBe(1);
    expect(state.approved_packet_preview.blocked_count).toBe(1);
    expect(state.approved_packet_preview.approved_fields).toEqual(["assertion_id", "case_id", "source_layer", "stage"]);
    expect(state.rows[1].errors.map((error) => error.code)).toEqual(["APPROVAL_DECISION_REJECTED"]);
  });

  it("blocks malformed, invalid, and empty reviewed-input approval queues deterministically", () => {
    const malformed = buildReviewedInputApproval({ reviewed_json_text: "{not-json" });
    const invalid = buildReviewedInputApproval({ reviewed_json_text: JSON.stringify({ case_id: "CASE-MOCK-001" }) });
    const empty = buildReviewedInputApproval({ reviewed_json_text: "" });

    expect(malformed.queue_status).toBe("malformed");
    expect(malformed.errors.map((error) => error.code)).toEqual(["APPROVAL_JSON_MALFORMED"]);
    expect(invalid.rows[0]).toMatchObject({
      decision: "blocked",
      eligibility: "blocked",
    });
    expect(invalid.rows[0].errors.map((error) => error.code)).toEqual(["REVIEWED_RECORD_ID_MISSING"]);
    expect(empty.queue_status).toBe("empty");
    expect(empty.rows).toEqual([]);
    expect(buildReviewedInputApproval({ reviewed_json_text: "{not-json" })).toEqual(malformed);
  });

  it("renders reviewed-input approval page with normalized rows, packet preview, and no prohibited runtime paths", () => {
    const markup = buildReviewedInputApprovalMarkup(
      buildReviewedInputApproval({
        decisions: {
          "ASSERTION-MOCK-001": "approved",
          "FACT-MOCK-001": "rejected",
        },
      }),
    );

    expect(markup).toContain("PBGC Reviewed Input Approval");
    expect(markup).toContain("Return to case dashboard");
    expect(markup).toContain("data-reviewed-input-approval-table");
    expect(markup).toContain("ASSERTION-MOCK-001");
    expect(markup).toContain("Approved packet preview");
    expect(markup).toContain("Blocked records: 1");
    expect(markup).toContain("No real participant, beneficiary");
    expect(markup).not.toMatch(/\b(type="file"|https?:\/\/|server call|telemetry|raw OCR|raw source document|run scraping|run OCR|insert into|sql\.js write|output-adapter write|filled artifact|exported artifact)\b/i);
    expect(markup).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("links the case dashboard template filling/export stage to the export route", () => {
    const dashboard = buildCaseNavigationDashboard({ active_stage_key: "template_filling_export" });
    const markup = buildCaseNavigationDashboardMarkup(dashboard);

    expect(dashboard.stages.find((stage) => stage.stage_key === "template_filling_export")).toMatchObject({
      status: "available",
      target: "#template-filling-export",
    });
    expect(markup).toContain("href=\"#template-filling-export\"");
    expect(markup).toContain("Template Filling / Export");
  });

  it("fills one deterministic PBGC-style reviewed-input artifact from approved mocked records", () => {
    const state = buildTemplateFillingExport();
    const repeated = buildTemplateFillingExport();

    expect(state.artifact).toMatchObject({
      artifact_id: "filled-source-assertion-import-template",
      file_name: "CASE-MOCK-001-source-assertion-import.csv",
      template_id: "source_assertion_import_template",
      export_status: "ready",
      errors: [],
    });
    expect(state.artifact.source_record_ids).toEqual(["ASSERTION-MOCK-001"]);
    expect(state.artifact.content).toContain("case_id,reviewed_record_id,source_layer,stage");
    expect(state.artifact.content).toContain("CASE-MOCK-001,ASSERTION-MOCK-001,source_assertion,upload_import");
    expect(state.export_control).toMatchObject({
      enabled: true,
      download_name: "CASE-MOCK-001-source-assertion-import.csv",
    });
    expect(repeated).toEqual(state);
  });

  it("blocks template export when no approved mocked reviewed records exist", () => {
    const blocked = buildTemplateFillingExport({ decisions: {} });

    expect(blocked.artifact.export_status).toBe("blocked");
    expect(blocked.artifact.source_record_ids).toEqual([]);
    expect(blocked.artifact.content).toBe("");
    expect(blocked.artifact.errors.map((error) => error.code)).toEqual(["NO_APPROVED_RECORDS"]);
    expect(blocked.export_control.enabled).toBe(false);
  });

  it("renders template filling/export page with browser-local controls and no prohibited runtime paths", () => {
    const markup = buildTemplateFillingExportMarkup(buildTemplateFillingExport());

    expect(markup).toContain("PBGC Template Filling / Export");
    expect(markup).toContain("Return to case dashboard");
    expect(markup).toContain("data-filled-artifact-preview");
    expect(markup).toContain("CASE-MOCK-001-source-assertion-import.csv");
    expect(markup).toContain("Copy artifact content");
    expect(markup).toContain("Download artifact");
    expect(markup).toContain("No real participant, beneficiary");
    expect(markup).not.toMatch(/\b(type="file"|https?:\/\/|server call|telemetry|raw OCR|raw source document|run scraping|run OCR|insert into|sql\.js write|output-adapter write)\b/i);
    expect(markup).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("links the case dashboard unresolved issues stage to the issue queue route", () => {
    const dashboard = buildCaseNavigationDashboard({ active_stage_key: "unresolved_issues" });
    const markup = buildCaseNavigationDashboardMarkup(dashboard);

    expect(dashboard.stages.find((stage) => stage.stage_key === "unresolved_issues")).toMatchObject({
      status: "available",
      target: "#unresolved-issues",
    });
    expect(markup).toContain("href=\"#unresolved-issues\"");
    expect(markup).toContain("Unresolved Issues");
  });

  it("builds deterministic unresolved issue queue rows and severity counts", () => {
    const state = buildUnresolvedIssuesQueue();
    const repeated = buildUnresolvedIssuesQueue();

    expect(state.items.length).toBeGreaterThan(0);
    expect(state.items.map((item) => item.ordering_key)).toEqual([...state.items.map((item) => item.ordering_key)].sort());
    expect(state.items.some((item) => item.code === "NO_APPROVED_RECORDS")).toBe(true);
    expect(state.items.some((item) => item.code === "APPROVAL_DECISION_PENDING")).toBe(true);
    expect(state.summary.total_count).toBe(state.items.length);
    expect(state.summary.error_count).toBeGreaterThan(0);
    expect(state.summary.warning_count).toBeGreaterThan(0);
    expect(repeated).toEqual(state);
  });

  it("renders unresolved issue queue with trace basis and no prohibited runtime paths", () => {
    const markup = buildUnresolvedIssuesQueueMarkup(buildUnresolvedIssuesQueue());

    expect(markup).toContain("PBGC Unresolved Issues");
    expect(markup).toContain("Return to case dashboard");
    expect(markup).toContain("data-unresolved-issues-table");
    expect(markup).toContain("NO_APPROVED_RECORDS");
    expect(markup).toContain("APPROVAL_DECISION_PENDING");
    expect(markup).toContain("No real participant, beneficiary");
    expect(markup).not.toMatch(/\b(type="file"|https?:\/\/|server call|telemetry|raw OCR|raw source document|run scraping|run OCR|insert into|sql\.js write|output-adapter write)\b/i);
    expect(markup).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("links the case dashboard sample/mock packs stage to the pack route", () => {
    const dashboard = buildCaseNavigationDashboard({ active_stage_key: "sample_mock_packs" });
    const markup = buildCaseNavigationDashboardMarkup(dashboard);

    expect(dashboard.stages.find((stage) => stage.stage_key === "sample_mock_packs")).toMatchObject({
      status: "available",
      target: "#sample-mock-packs",
    });
    expect(markup).toContain("href=\"#sample-mock-packs\"");
    expect(markup).toContain("Sample / Mock Packs");
  });

  it("builds deterministic approved sample and mock pack metadata", () => {
    const state = buildSampleMockPackManagement();
    const repeated = buildSampleMockPackManagement();

    expect(state.packs.map((pack) => pack.pack_id)).toEqual([
      "approved-bsrs-samples",
      "alpha-mock-case-pack",
      "v1-workbook-samples",
      "single-life-joint-scenarios",
      "qpsa-statement-scenarios",
    ]);
    expect(state.packs.map((pack) => pack.ordering_key)).toEqual([...state.packs.map((pack) => pack.ordering_key)].sort());
    expect(state.selected_pack).toMatchObject({
      pack_id: "approved-bsrs-samples",
      kind: "approved_sample",
      readiness: "ready",
    });
    expect(state.selected_pack.included_stages).toContain("reconciliation_workbench");
    expect(state.selected_pack.mocked_only_notice).toContain("No real participant");
    expect(state.selected_pack.description).toContain("primary deterministic engine output fixtures");
    expect(state.selected_pack.approved_sample_refs.length).toBeGreaterThan(0);
    expect(state.selected_pack.template_refs.length).toBeGreaterThan(0);
    expect(state.selected_pack.stage_coverage.length).toBeGreaterThan(0);
    expect(repeated).toEqual(state);
  });

  it("builds deterministic richer pack details with template refs and stage coverage", () => {
    const state = buildSampleMockPackManagement({ selected_pack_id: "v1-workbook-samples" });
    const repeated = buildSampleMockPackManagement({ selected_pack_id: "v1-workbook-samples" });

    expect(state.selected_pack.pack_id).toBe("v1-workbook-samples");
    expect(state.selected_pack.template_refs.some((ref) => ref.template_id === "436_evaluation")).toBe(true);
    expect(state.selected_pack.stage_coverage.some((cov) => cov.stage_key === "v1_ve_output" && cov.coverage === "full")).toBe(true);
    expect(state.selected_pack.approved_sample_refs.some((ref) => ref.file_name.includes("sample-1-v1"))).toBe(true);
    expect(repeated).toEqual(state);
  });

  it("selects alternative packs deterministically", () => {
    const singleLife = buildSampleMockPackManagement({ selected_pack_id: "single-life-joint-scenarios" });
    const qpsa = buildSampleMockPackManagement({ selected_pack_id: "qpsa-statement-scenarios" });

    expect(singleLife.selected_pack.pack_id).toBe("single-life-joint-scenarios");
    expect(singleLife.selected_pack.kind).toBe("approved_sample");
    expect(singleLife.selected_pack.included_stages).toContain("form_resolution");
    expect(qpsa.selected_pack.pack_id).toBe("qpsa-statement-scenarios");
    expect(qpsa.selected_pack.included_stages).toContain("valuation_listings_output");
  });

  it("renders sample/mock pack page with selected readiness and no prohibited runtime paths", () => {
    const markup = buildSampleMockPackManagementMarkup(buildSampleMockPackManagement({ selected_pack_id: "alpha-mock-case-pack" }));

    expect(markup).toContain("PBGC Sample / Mock Packs");
    expect(markup).toContain("Return to case dashboard");
    expect(markup).toContain("data-sample-mock-pack-list");
    expect(markup).toContain("Alpha Mock Case Pack");
    expect(markup).toContain("sample_mock_packs");
    expect(markup).toContain("No real participant, beneficiary");
    expect(markup).not.toMatch(/\b(type="file"|https?:\/\/|server call|telemetry|raw OCR|raw source document|run scraping|run OCR|insert into|sql\.js write|output-adapter write)\b/i);
    expect(markup).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("distinguishes official PBGC template readiness from reviewed-input import templates", () => {
    const official = buildPbgcTemplateLibrary({ selected_template_id: "actuarial_case_memo" });
    const importTemplate = buildPbgcTemplateLibrary({ selected_template_id: "resolved_fact_import_template" });

    expect(official.readiness).toMatchObject({
      status: "planned_for_filling",
      status_label: "Planned for future filling",
    });
    expect(official.readiness.dependencies).toContain("reviewed-input approval");
    expect(importTemplate.selected_template.category).toBe("reviewed_input_import");
    expect(importTemplate.readiness).toMatchObject({
      status: "input_ready",
      status_label: "Ready for local reviewed-input preparation",
    });
  });

  it("keeps template library markup deterministic and free of server, OCR, scraping, raw, sql.js, adapter-write, filling, export, and real-person paths", () => {
    const first = buildPbgcTemplateLibraryMarkup(buildPbgcTemplateLibrary({ selected_template_id: "436_evaluation" }));
    const second = buildPbgcTemplateLibraryMarkup(buildPbgcTemplateLibrary({ selected_template_id: "436_evaluation" }));

    expect(second).toBe(first);
    expect(first).toContain("436 Evaluation");
    expect(first).not.toMatch(/\b(https?:\/\/|server call|telemetry|raw OCR|raw source document|run scraping|run OCR|insert into|sql\.js write|output-adapter write|filled artifact|exported artifact)\b/i);
    expect(first).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("builds one approved sample workbench with sample identity and exactly three output slice panels", () => {
    const state = buildApprovedSampleReconciliationWorkbench();

    expect(state.sample_id).toBe("BSRS001");
    expect(state.sample_label).toBe("Deferred vested BSRS configuration packet");
    expect(state.case_id).toBe("CASE-PLACEHOLDER");
    expect(state.plan_id).toBe("PLAN-PLACEHOLDER");
    expect(state.generated_at).toBe("source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001");
    expect(state.selected_sample.sample_id).toBe("BSRS001");
    expect(state.sample_options.map((sample) => sample.sample_id)).toEqual(["BSRS001", "BSRS002"]);
    expect(state.sample_context).toMatchObject({
      sample_id: "BSRS001",
      sample_label: "Deferred vested BSRS configuration packet",
      fixed_sample_label: "Selected approved sample: BSRS001",
      selector_label: "BSRS001 - Deferred vested BSRS configuration packet",
      artifact_basis: "source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001",
      mock_case_label: "Mock case context: simulated PBGC terminated DB case",
      mock_population_label: "Mock population context: simulated participant cohort",
      no_real_person_data_notice:
        "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is used on this workbench.",
      generated_at: "source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001",
    });
    expect(state.output_panels.map((panel) => panel.slice_name)).toEqual([
      "bsrs_configuration_output",
      "v1_ve_output",
      "valuation_listings_output",
    ]);
  });

  it("exposes approved sample options with stable local artifact basis and deterministic ordering", () => {
    const state = buildApprovedSampleReconciliationWorkbench();

    expect(state.sample_options).toEqual([
      {
        sample_id: "BSRS001",
        sample_label: "Deferred vested BSRS configuration packet",
        selector_label: "BSRS001 - Deferred vested BSRS configuration packet",
        artifact_basis: "source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001",
        mock_case_label: "Mock case context: simulated PBGC terminated DB case",
        mock_population_label: "Mock population context: simulated participant cohort",
        ordering_key: "000001|BSRS001",
        is_default: true,
      },
      {
        sample_id: "BSRS002",
        sample_label: "In-pay survivor BSRS configuration packet",
        selector_label: "BSRS002 - In-pay survivor BSRS configuration packet",
        artifact_basis: "source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS002",
        mock_case_label: "Mock case context: simulated PBGC terminated DB case",
        mock_population_label: "Mock population context: simulated participant cohort",
        ordering_key: "000002|BSRS002",
        is_default: false,
      },
    ]);
  });

  it("resolves selected approved sample state deterministically", () => {
    const selected = buildApprovedSampleReconciliationWorkbench({ sample_id: "BSRS002" });
    const repeated = buildApprovedSampleReconciliationWorkbench({ sample_id: "BSRS002" });

    expect(selected.sample_id).toBe("BSRS002");
    expect(selected.sample_label).toBe("In-pay survivor BSRS configuration packet");
    expect(selected.selected_sample.sample_id).toBe("BSRS002");
    expect(selected.generated_at).toBe("source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS002");
    expect(selected.sample_context.fixed_sample_label).toBe("Selected approved sample: BSRS002");
    expect(selected.output_panels.map((panel) => panel.slice_name)).toEqual([
      "bsrs_configuration_output",
      "v1_ve_output",
      "valuation_listings_output",
    ]);
    expect(selected.shared_fact_rows.length).toBeGreaterThan(0);
    expect(selected.shared_value_rows.length).toBeGreaterThan(0);
    expect(selected.reconciliation_rows.length).toBeGreaterThan(0);
    expect(repeated).toEqual(selected);
  });

  it("includes reconciliation rows with agreement-versus-drift status labels", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const statuses = new Set(state.reconciliation_rows.map((row) => row.status));

    expect(state.reconciliation_rows.length).toBeGreaterThan(0);
    expect(statuses.has("agreement") || statuses.has("drift")).toBe(true);
    expect(state.reconciliation_rows.some((row) => row.canonical_semantic_name === "ID" && row.status === "agreement")).toBe(true);
  });

  it("derives deterministic status filter options from existing row statuses with an unfiltered choice", () => {
    const state = buildApprovedSampleReconciliationWorkbench();

    expect(state.status_filter.value).toBe("all");
    expect(state.status_filter_options[0]).toMatchObject({
      value: "all",
      label: "All statuses",
      kind: "status",
      ordering_key: "000000|all",
    });
    expect(state.status_filter_options.map((option) => option.value)).toEqual(["all", "agreement", "nullable"]);
    expect(state.status_filter_options).toEqual(buildApprovedSampleReconciliationWorkbench().status_filter_options);
  });

  it("derives deterministic severity filter options from existing row severities with an unfiltered choice", () => {
    const state = buildApprovedSampleReconciliationWorkbench();

    expect(state.severity_filter.value).toBe("all");
    expect(state.severity_filter_options[0]).toMatchObject({
      value: "all",
      label: "All severities",
      kind: "severity",
      ordering_key: "000000|all",
    });
    expect(state.severity_filter_options.map((option) => option.value)).toEqual(["all", "info", "none"]);
    expect(state.severity_filter_options).toEqual(buildApprovedSampleReconciliationWorkbench().severity_filter_options);
  });

  it("derives deterministic default theme and progress display state", () => {
    const state = buildApprovedSampleReconciliationWorkbench();

    expect(state.theme).toEqual({ value: "light", label: "Light", source: "default" });
    expect(state.theme_options).toEqual([
      { value: "light", label: "Light", ordering_key: "000001|light" },
      { value: "dark", label: "Dark", ordering_key: "000002|dark" },
    ]);
    expect(state.progress).toEqual({
      status: "idle",
      label: "Idle",
      message: "",
      detail: null,
      busy: false,
    });
    expect(buildApprovedSampleReconciliationWorkbench().theme).toEqual(state.theme);
    expect(buildApprovedSampleReconciliationWorkbench().progress).toEqual(state.progress);
  });

  it("derives deterministic default work guard state with supported work-unit evidence", () => {
    const state = buildApprovedSampleReconciliationWorkbench();

    expect(state.work_guard).toEqual({
      status: "idle",
      label: "Idle",
      message: "",
      detail: null,
      cancellable: false,
      started_at: null,
      evidence: {
        supported_work_units: 250,
        attempted_work_units: 37,
        unit_label: "display rows",
        basis: "approved-sample workbench display rows",
      },
    });
    expect(buildApprovedSampleReconciliationWorkbench().work_guard).toEqual(state.work_guard);
  });

  it("derives deterministic default workspace session state", () => {
    const state = buildApprovedSampleReconciliationWorkbench();

    expect(state.workspace_session).toEqual({
      status: "unsaved",
      label: "Unsaved",
      message: "Mock workspace session has not been saved.",
      snapshot: null,
    });
    expect(buildApprovedSampleReconciliationWorkbench().workspace_session).toEqual(state.workspace_session);
  });

  it("filters reconciliation rows, Shared Facts rows, and Shared Values rows by selected status", () => {
    const state = buildApprovedSampleReconciliationWorkbench({ status_filter: "nullable" });

    expect(state.status_filter).toMatchObject({ value: "nullable", label: "Nullable" });
    expect(state.filtered_reconciliation_rows.length).toBeGreaterThan(0);
    expect(state.filtered_shared_fact_rows).toEqual([]);
    expect(state.filtered_shared_value_rows.length).toBeGreaterThan(0);
    expect(state.filtered_reconciliation_rows.every((row) => row.status === "nullable")).toBe(true);
    expect(state.filtered_shared_fact_rows.every((row) => row.status === "nullable")).toBe(true);
    expect(state.filtered_shared_value_rows.every((row) => row.status === "nullable")).toBe(true);
  });

  it("filters reconciliation rows, Shared Facts rows, and Shared Values rows by selected severity", () => {
    const state = buildApprovedSampleReconciliationWorkbench({ severity_filter: "info" });

    expect(state.severity_filter).toMatchObject({ value: "info", label: "Info" });
    expect(state.filtered_reconciliation_rows.length).toBeGreaterThan(0);
    expect(state.filtered_shared_fact_rows).toEqual([]);
    expect(state.filtered_shared_value_rows.length).toBeGreaterThan(0);
    expect(state.filtered_reconciliation_rows.every((row) => row.severity === "info")).toBe(true);
    expect(state.filtered_shared_value_rows.every((row) => row.severity === "info")).toBe(true);
  });

  it("uses the Shared Facts none/error convention for severity filtering", () => {
    const state = buildApprovedSampleReconciliationWorkbench({ severity_filter: "none" });

    expect(state.severity_filter).toMatchObject({ value: "none", label: "None" });
    expect(state.filtered_shared_fact_rows.length).toBeGreaterThan(0);
    expect(state.filtered_reconciliation_rows).toEqual([]);
    expect(state.filtered_shared_value_rows).toEqual([]);
    expect(state.filtered_shared_fact_rows.every((row) => row.severity_label === "None")).toBe(true);
  });

  it("preserves sample, filters, output panels, visible rows, and traces when theme changes", () => {
    const base = buildApprovedSampleReconciliationWorkbench({
      sample_id: "BSRS002",
      status_filter: "agreement",
      severity_filter: "info",
    });
    const themed = buildApprovedSampleReconciliationWorkbench({
      sample_id: "BSRS002",
      status_filter: "agreement",
      severity_filter: "info",
      theme: "dark",
    });

    expect(themed.theme).toMatchObject({ value: "dark", label: "Dark" });
    expect(themed.selected_sample).toEqual(base.selected_sample);
    expect(themed.status_filter).toEqual(base.status_filter);
    expect(themed.severity_filter).toEqual(base.severity_filter);
    expect(themed.output_panels).toEqual(base.output_panels);
    expect(themed.filtered_reconciliation_rows.map((row) => row.comparison_id)).toEqual(
      base.filtered_reconciliation_rows.map((row) => row.comparison_id),
    );
    expect(themed.filtered_shared_fact_rows.map((row) => row.ordering_key)).toEqual(
      base.filtered_shared_fact_rows.map((row) => row.ordering_key),
    );
    expect(themed.filtered_shared_value_rows.map((row) => row.ordering_key)).toEqual(
      base.filtered_shared_value_rows.map((row) => row.ordering_key),
    );
    expect(themed.filtered_reconciliation_rows[0]?.trace_detail).toEqual(base.filtered_reconciliation_rows[0]?.trace_detail);
  });

  it("renders running work guard state with visible cancel control while preserving stable content", () => {
    const state = buildApprovedSampleReconciliationWorkbench({ work_guard_status: "running" });
    const markup = buildReconciliationWorkbenchMarkup(state);

    expect(state.work_guard).toMatchObject({
      status: "running",
      label: "Running",
      cancellable: true,
      started_at: "stable:work-guard-start",
    });
    expect(markup).toContain("data-workbench-work-guard");
    expect(markup).toContain("Guarded work is running");
    expect(markup).toContain("data-workbench-cancel-work");
    expect(markup).toContain("Cancel work");
    expect(markup).toContain("BSRS Configuration");
    expect(markup).toContain("Shared Facts");
    expect(markup).toContain("Trace details for ID");
  });

  it("renders cancelled work guard state and preserves sample, theme, filters, rows, and traces", () => {
    const base = buildApprovedSampleReconciliationWorkbench({ theme: "dark", status_filter: "agreement", severity_filter: "info" });
    const cancelled = buildApprovedSampleReconciliationWorkbench({
      theme: "dark",
      status_filter: "agreement",
      severity_filter: "info",
      work_guard_status: "cancelled",
    });

    expect(cancelled.work_guard).toMatchObject({ status: "cancelled", label: "Cancelled", cancellable: false });
    expect(cancelled.theme).toEqual(base.theme);
    expect(cancelled.status_filter).toEqual(base.status_filter);
    expect(cancelled.severity_filter).toEqual(base.severity_filter);
    expect(cancelled.output_panels).toEqual(base.output_panels);
    expect(cancelled.filtered_reconciliation_rows.map((row) => row.comparison_id)).toEqual(
      base.filtered_reconciliation_rows.map((row) => row.comparison_id),
    );
    expect(cancelled.filtered_shared_value_rows.map((row) => row.ordering_key)).toEqual(
      base.filtered_shared_value_rows.map((row) => row.ordering_key),
    );
  });

  it("builds a saved mocked workspace session snapshot without changing workbench output", () => {
    const base = buildApprovedSampleReconciliationWorkbench({
      sample_id: "BSRS002",
      theme: "dark",
      status_filter: "agreement",
      severity_filter: "info",
    });
    const saved = buildApprovedSampleReconciliationWorkbench({
      sample_id: "BSRS002",
      theme: "dark",
      status_filter: "agreement",
      severity_filter: "info",
      workspace_session_status: "saved",
    });

    expect(saved.workspace_session).toMatchObject({
      status: "saved",
      label: "Saved",
      snapshot: {
        workspace_id: "mock-workspace-approved-samples",
        workspace_label: "Mock approved-sample workspace",
        sample_id: "BSRS002",
        theme: "dark",
        status_filter: "agreement",
        severity_filter: "info",
        saved_at: "source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS002",
        basis: "local mocked workspace display state",
      },
    });
    expect(saved.output_panels).toEqual(base.output_panels);
    expect(saved.filtered_reconciliation_rows.map((row) => row.comparison_id)).toEqual(
      base.filtered_reconciliation_rows.map((row) => row.comparison_id),
    );
  });

  it("restores selected sample, theme, status filter, and severity filter from a valid session snapshot", () => {
    const saved = buildApprovedSampleReconciliationWorkbench({
      sample_id: "BSRS002",
      theme: "dark",
      status_filter: "agreement",
      severity_filter: "info",
      workspace_session_status: "saved",
    });
    const restored = buildApprovedSampleReconciliationWorkbench({
      session_snapshot: saved.workspace_session.snapshot ?? undefined,
      workspace_session_status: "restored",
    });

    expect(restored.workspace_session.status).toBe("restored");
    expect(restored.sample_id).toBe("BSRS002");
    expect(restored.theme.value).toBe("dark");
    expect(restored.status_filter.value).toBe("agreement");
    expect(restored.severity_filter.value).toBe("info");
    expect(restored.output_panels).toEqual(saved.output_panels);
  });

  it("clears status filtering by restoring original row counts and ordering", () => {
    const unfiltered = buildApprovedSampleReconciliationWorkbench();
    const cleared = buildApprovedSampleReconciliationWorkbench({ status_filter: "all" });

    expect(cleared.status_filter.value).toBe("all");
    expect(cleared.filtered_reconciliation_rows.map((row) => row.comparison_id)).toEqual(
      unfiltered.reconciliation_rows.map((row) => row.comparison_id),
    );
    expect(cleared.filtered_shared_fact_rows.map((row) => row.ordering_key)).toEqual(
      unfiltered.shared_fact_rows.map((row) => row.ordering_key),
    );
    expect(cleared.filtered_shared_value_rows.map((row) => row.ordering_key)).toEqual(
      unfiltered.shared_value_rows.map((row) => row.ordering_key),
    );
  });

  it("clears severity filtering by restoring original row counts and ordering", () => {
    const unfiltered = buildApprovedSampleReconciliationWorkbench();
    const cleared = buildApprovedSampleReconciliationWorkbench({ severity_filter: "all" });

    expect(cleared.severity_filter.value).toBe("all");
    expect(cleared.filtered_reconciliation_rows.map((row) => row.comparison_id)).toEqual(
      unfiltered.reconciliation_rows.map((row) => row.comparison_id),
    );
    expect(cleared.filtered_shared_fact_rows.map((row) => row.ordering_key)).toEqual(
      unfiltered.shared_fact_rows.map((row) => row.ordering_key),
    );
    expect(cleared.filtered_shared_value_rows.map((row) => row.ordering_key)).toEqual(
      unfiltered.shared_value_rows.map((row) => row.ordering_key),
    );
  });

  it("emits deterministic row-group empty states when a selected status has no matches", () => {
    const state = buildApprovedSampleReconciliationWorkbench({ status_filter: "nullable" });

    expect(state.status_filter.value).toBe("nullable");
    expect(state.filtered_shared_fact_rows).toEqual([]);
    expect(state.filtered_row_groups.shared_facts.empty_state).toBe("No Shared Facts rows match status Nullable.");
    expect(state.filtered_row_groups.shared_facts.rows).toEqual([]);
    expect(buildApprovedSampleReconciliationWorkbench({ status_filter: "nullable" }).filtered_row_groups).toEqual(state.filtered_row_groups);
  });

  it("emits deterministic row-group empty states when a selected severity has no matches", () => {
    const state = buildApprovedSampleReconciliationWorkbench({ severity_filter: "info" });

    expect(state.severity_filter.value).toBe("info");
    expect(state.filtered_shared_fact_rows).toEqual([]);
    expect(state.filtered_row_groups.shared_facts.empty_state).toBe("No Shared Facts rows match severity Info.");
    expect(state.filtered_row_groups.shared_facts.rows).toEqual([]);
    expect(buildApprovedSampleReconciliationWorkbench({ severity_filter: "info" }).filtered_row_groups).toEqual(state.filtered_row_groups);
  });

  it("includes shared-fact table rows with compared sources, fields, values, status, severity, mapping basis, and ordering key", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const row = state.shared_fact_rows.find((candidate) => candidate.fact_label === "ID");

    expect(state.shared_fact_rows.length).toBeGreaterThan(0);
    expect(row).toMatchObject({
      fact_label: "ID",
      left_source: "bsrs_configuration_output",
      left_field: "id",
      left_value: "VL001",
      right_source: "v1_ve_output",
      right_field: "id",
      right_value: "VL001",
      status: "agreement",
      severity_label: "None",
      mapping_basis: "dd",
    });
    expect(row?.ordering_key).toMatch(/^participant_identifier\.id\|comparison-\d{6}$/);
    expect(row?.trace.left_source_path).toBe("packages/tests/bsrs-configuration-output-fixtures.ts");
    expect(row?.trace.rule_version).toBe("0.1.0");
    expect(row?.trace.producing_module).toBe("cross_slice_reconciliation");
  });

  it("keeps shared-fact rows sorted by stable ordering key across repeated builds", () => {
    const first = buildApprovedSampleReconciliationWorkbench().shared_fact_rows;
    const second = buildApprovedSampleReconciliationWorkbench().shared_fact_rows;
    const orderingKeys = first.map((row) => row.ordering_key);

    expect(orderingKeys).toEqual([...orderingKeys].sort());
    expect(second.map((row) => row.ordering_key)).toEqual(orderingKeys);
  });

  it("includes shared-value rows with compared sources, fields, raw values, normalized values, status, severity, and trace cue", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const row = state.shared_value_rows.find((candidate) => candidate.value_label === "ID");

    expect(state.shared_value_rows.length).toBeGreaterThan(0);
    expect(row).toMatchObject({
      value_label: "ID",
      left_source: "bsrs_configuration_output",
      left_field: "id",
      left_value: "VL001",
      left_normalized_value: "VL001",
      right_source: "v1_ve_output",
      right_field: "id",
      right_value: "VL001",
      right_normalized_value: "VL001",
      status: "agreement",
      severity: "info",
      severity_label: "Info",
      mapping_basis: "dd",
    });
    expect(row?.ordering_key).toMatch(/^participant_identifier\.id\|value-comparison-\d{6}$/);
    expect(row?.trace.left_source_path).toBe("packages/tests/bsrs-configuration-output-fixtures.ts");
    expect(row?.trace.rule_version).toBe("0.1.0");
    expect(row?.trace.producing_module).toBe("cross_slice_reconciliation");
  });

  it("keeps shared-value rows sorted by stable ordering key across repeated builds", () => {
    const first = buildApprovedSampleReconciliationWorkbench().shared_value_rows;
    const second = buildApprovedSampleReconciliationWorkbench().shared_value_rows;
    const orderingKeys = first.map((row) => row.ordering_key);

    expect(orderingKeys).toEqual([...orderingKeys].sort());
    expect(second.map((row) => row.ordering_key)).toEqual(orderingKeys);
    expect(second).toEqual(first);
  });

  it("includes reconciliation row trace details with compared sources, fields, values, mapping basis, and trace identifiers", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const row = state.reconciliation_rows.find((candidate) => candidate.canonical_semantic_name === "ID");

    expect(row?.trace_detail).toMatchObject({
      control_id: row ? `trace-reconciliation-${row.comparison_id}` : "",
      row_kind: "reconciliation",
      row_label: "ID",
      collapsed_label: "Trace details for ID",
      compared_sources: ["bsrs_configuration_output", "v1_ve_output"],
      compared_fields: ["id", "id"],
      raw_values: ["VL001", "VL001"],
      normalized_values: ["VL001", "VL001"],
      status: "agreement",
      severity_label: "Info",
      mapping_basis: "dd",
      rule_version: "0.1.0",
      producing_module: "cross_slice_reconciliation",
      stable_evidence_basis: "participant_identifier.id",
    });
  });

  it("includes Shared Facts row trace details with raw values, mapping basis, source paths, and trace identifiers", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const row = state.shared_fact_rows.find((candidate) => candidate.fact_label === "ID");

    expect(row?.trace_detail).toMatchObject({
      control_id: row ? `trace-shared_fact-${row.comparison_id}` : "",
      row_kind: "shared_fact",
      row_label: "ID",
      compared_sources: ["bsrs_configuration_output", "v1_ve_output"],
      compared_fields: ["id", "id"],
      raw_values: ["VL001", "VL001"],
      normalized_values: ["Not applicable", "Not applicable"],
      status: "agreement",
      severity_label: "None",
      mapping_basis: "dd",
      source_paths: ["packages/tests/bsrs-configuration-output-fixtures.ts", "packages/tests/v1-ve-output-fixtures.ts"],
      rule_version: "0.1.0",
      producing_module: "cross_slice_reconciliation",
    });
  });

  it("includes Shared Values row trace details with raw and normalized value context", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const row = state.shared_value_rows.find((candidate) => candidate.value_label === "ID");

    expect(row?.trace_detail).toMatchObject({
      control_id: row ? `trace-shared_value-${row.comparison_id}` : "",
      row_kind: "shared_value",
      row_label: "ID",
      compared_sources: ["bsrs_configuration_output", "v1_ve_output"],
      compared_fields: ["id", "id"],
      raw_values: ["VL001", "VL001"],
      normalized_values: ["VL001", "VL001"],
      status: "agreement",
      severity_label: "Info",
      mapping_basis: "dd",
      source_paths: ["packages/tests/bsrs-configuration-output-fixtures.ts", "packages/tests/v1-ve-output-fixtures.ts"],
      rule_version: "0.1.0",
      producing_module: "cross_slice_reconciliation",
    });
  });

  it("keeps trace details derived from approved local evidence without raw, hosted, or real-person inputs", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const details = [
      ...state.reconciliation_rows.map((row) => row.trace_detail),
      ...state.shared_fact_rows.map((row) => row.trace_detail),
      ...state.shared_value_rows.map((row) => row.trace_detail),
    ];
    const detailText = JSON.stringify(details);

    expect(details.length).toBeGreaterThan(0);
    expect(detailText).toContain("packages/tests/");
    expect(detailText).not.toMatch(/https?:\/\//);
    expect(detailText).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
    expect(detailText).not.toMatch(/\b(raw OCR|raw source document|unreviewed extraction)\b/i);
  });

  it("renders the workbench markup with BSRS, V1/VE, valuation listings, and reconciliation sections", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());

    expect(markup).toContain("PBGC Reconciliation Workbench");
    expect(markup).toContain("BSRS Configuration");
    expect(markup).toContain("V1/VE Output");
    expect(markup).toContain("Valuation Listings");
    expect(markup).toContain("Cross-Slice Reconciliation");
    expect(markup).toContain("Generated from stable evidence");
  });

  it("renders a visible Shared Facts table with compared sources, fields, values, status, and severity marker", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());
    const sharedFactsMarkup = markup.slice(markup.indexOf("Shared Facts"), markup.indexOf("</table>", markup.indexOf("Shared Facts")));

    expect(sharedFactsMarkup).toContain("Shared Facts");
    expect(sharedFactsMarkup).toContain("Fact");
    expect(sharedFactsMarkup).toContain("Left Source");
    expect(sharedFactsMarkup).toContain("Right Source");
    expect(sharedFactsMarkup).toContain("bsrs_configuration_output.id");
    expect(sharedFactsMarkup).toContain("v1_ve_output.id");
    expect(sharedFactsMarkup).toContain("VL001");
    expect(sharedFactsMarkup).toContain("agreement");
    expect(sharedFactsMarkup).toContain("None");
    expect(sharedFactsMarkup).toContain("dd");
  });

  it("renders a visible Shared Values table with compared sources, fields, raw values, normalized values, status, and severity marker", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());
    const sharedValuesMarkup = markup.slice(markup.indexOf("Shared Values"), markup.indexOf("</table>", markup.indexOf("Shared Values")));

    expect(sharedValuesMarkup).toContain("Shared Values");
    expect(sharedValuesMarkup).toContain("Value");
    expect(sharedValuesMarkup).toContain("Left Source");
    expect(sharedValuesMarkup).toContain("Right Source");
    expect(sharedValuesMarkup).toContain("bsrs_configuration_output.id");
    expect(sharedValuesMarkup).toContain("v1_ve_output.id");
    expect(sharedValuesMarkup).toContain("raw VL001");
    expect(sharedValuesMarkup).toContain("normalized VL001");
    expect(sharedValuesMarkup).toContain("agreement");
    expect(sharedValuesMarkup).toContain("Info");
    expect(sharedValuesMarkup).toContain("dd");
    expect(sharedValuesMarkup).toContain("trace 0.1.0");
    expect(sharedValuesMarkup).toContain("cross_slice_reconciliation");
  });

  it("renders native click or activation controls for trace expansion details", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const markup = buildReconciliationWorkbenchMarkup(state);
    const reconciliationRow = state.reconciliation_rows.find((row) => row.canonical_semantic_name === "ID");
    const sharedFactRow = state.shared_fact_rows.find((row) => row.fact_label === "ID");
    const sharedValueRow = state.shared_value_rows.find((row) => row.value_label === "ID");

    expect(markup).toContain(`<details class="trace-detail" id="${reconciliationRow?.trace_detail.control_id}">`);
    expect(markup).toContain(`<details class="trace-detail" id="${sharedFactRow?.trace_detail.control_id}">`);
    expect(markup).toContain(`<details class="trace-detail" id="${sharedValueRow?.trace_detail.control_id}">`);
    expect(markup).toContain("<summary>Trace details for ID</summary>");
    expect(markup).toContain("<dt>Compared sources</dt>");
    expect(markup).toContain("<dt>Source fields</dt>");
    expect(markup).toContain("<dt>Raw values</dt>");
    expect(markup).toContain("<dt>Normalized values</dt>");
    expect(markup).toContain("<dt>Mapping basis</dt>");
    expect(markup).toContain("<dt>Trace</dt>");
    expect(markup).toContain("<dt>Stable evidence</dt>");
  });

  it("renders approved sample context and no-real-person-data notice in the first visible header area", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());
    const headerMarkup = markup.slice(markup.indexOf("<header"), markup.indexOf("</header>"));

    expect(headerMarkup).toContain("Deferred vested BSRS configuration packet");
    expect(headerMarkup).toContain("Selected approved sample: BSRS001");
    expect(headerMarkup).toContain("Approved artifact: source:packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001");
    expect(headerMarkup).toContain("Mock case context: simulated PBGC terminated DB case");
    expect(headerMarkup).toContain("Mock population context: simulated participant cohort");
    expect(headerMarkup).toContain("No real participant, beneficiary, alternate payee, survivor, or other natural-person data");
  });

  it("renders a visible approved-only sample selector with selected sample label", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ sample_id: "BSRS002" }));

    expect(markup).toContain("data-workbench-sample-selector");
    expect(markup).toContain("Approved sample");
    expect(markup).toContain("BSRS001 - Deferred vested BSRS configuration packet");
    expect(markup).toContain("BSRS002 - In-pay survivor BSRS configuration packet");
    expect(markup).toContain("<option value=\"BSRS002\" selected>");
    expect(markup).not.toMatch(/\b(type="file"|http:\/\/|https:\/\/|upload|raw OCR|raw source document)\b/i);
  });

  it("renders visible status filter controls, active status labels, and filtered row empty states", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ status_filter: "nullable" }));

    expect(markup).toContain("data-workbench-status-filter");
    expect(markup).toContain("Status filter");
    expect(markup).toContain("<option value=\"all\">All statuses");
    expect(markup).toContain("<option value=\"nullable\" selected>Nullable");
    expect(markup).toContain("Active status: Nullable");
    expect(markup).toContain("No Shared Facts rows match status Nullable.");
    expect(markup).toContain("BSRS Configuration");
    expect(markup).toContain("V1/VE Output");
    expect(markup).toContain("Valuation Listings");
  });

  it("renders visible severity filter controls, active severity labels, and filtered row empty states", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ severity_filter: "info" }));

    expect(markup).toContain("data-workbench-severity-filter");
    expect(markup).toContain("Severity filter");
    expect(markup).toContain("<option value=\"all\">All severities");
    expect(markup).toContain("<option value=\"info\" selected>Info");
    expect(markup).toContain("Active severity: Info");
    expect(markup).toContain("No Shared Facts rows match severity Info.");
    expect(markup).toContain("data-workbench-status-filter");
    expect(markup).toContain("BSRS Configuration");
    expect(markup).toContain("V1/VE Output");
    expect(markup).toContain("Valuation Listings");
  });

  it("renders visible theme controls, active theme labels, and themed workbench markup", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ theme: "dark" }));

    expect(markup).toContain("data-workbench-theme=\"dark\"");
    expect(markup).toContain("data-workbench-theme-toggle");
    expect(markup).toContain("Switch to Light");
    expect(markup).toContain("Active theme: Dark");
    expect(markup).toContain("data-workbench-status-filter");
    expect(markup).toContain("data-workbench-severity-filter");
    expect(markup).toContain("Trace details for ID");
  });

  it("keeps dark-theme markup deterministic across repeated builds", () => {
    const first = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ theme: "dark" }));
    const second = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ theme: "dark" }));

    expect(second).toBe(first);
  });

  it("renders loading progress without hiding stable workbench content", () => {
    const state = buildApprovedSampleReconciliationWorkbench({ progress_status: "loading" });
    const markup = buildReconciliationWorkbenchMarkup(state);

    expect(state.progress).toMatchObject({
      status: "loading",
      label: "Loading",
      busy: true,
    });
    expect(markup).toContain("data-workbench-progress");
    expect(markup).toContain("aria-busy=\"true\"");
    expect(markup).toContain("Loading workbench");
    expect(markup).toContain("BSRS Configuration");
    expect(markup).toContain("Shared Facts");
    expect(markup).toContain("Trace details for ID");
  });

  it("renders failed and unsupported progress states as display-only messages", () => {
    const failed = buildApprovedSampleReconciliationWorkbench({ progress_status: "failed" });
    const unsupported = buildApprovedSampleReconciliationWorkbench({ progress_status: "unsupported" });
    const failedMarkup = buildReconciliationWorkbenchMarkup(failed);
    const unsupportedMarkup = buildReconciliationWorkbenchMarkup(unsupported);

    expect(failed.progress).toMatchObject({ status: "failed", busy: false });
    expect(unsupported.progress).toMatchObject({ status: "unsupported", busy: false });
    expect(failedMarkup).toContain("Workbench refresh failed");
    expect(unsupportedMarkup).toContain("Unsupported local sample load");
    expect(failedMarkup).toContain("BSRS Configuration");
    expect(unsupportedMarkup).toContain("Valuation Listings");
    expect(`${failedMarkup} ${unsupportedMarkup}`).not.toMatch(/\b(insert into|output-adapter write|persisted progress)\b/i);
  });

  it("keeps progress states deterministic and free of raw, hosted, upload, server, and real-person paths", () => {
    const first = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ theme: "dark", progress_status: "loading" }));
    const second = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ theme: "dark", progress_status: "loading" }));

    expect(second).toBe(first);
    expect(first).toContain("data-workbench-progress");
    expect(first).not.toMatch(/\b(type="file"|https?:\/\/|upload|raw OCR|raw source document|server call|telemetry)\b/i);
    expect(first).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("renders responsive theme and progress controls with stable labels", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ theme: "dark", progress_status: "loading" }));

    expect(markup).toContain("workbench-action-bar");
    expect(markup).toContain("workbench-progress-banner");
    expect(markup).toContain("Theme");
    expect(markup).toContain("Refresh sample");
    expect(markup).toContain("Loading workbench");
    expect(markup).toContain("Approved sample");
    expect(markup).toContain("Status filter");
    expect(markup).toContain("Severity filter");
  });

  it("renders fail-fast unsupported work guard state with deterministic unit evidence", () => {
    const state = buildApprovedSampleReconciliationWorkbench({ attempted_work_units: 999 });
    const markup = buildReconciliationWorkbenchMarkup(state);

    expect(state.work_guard).toMatchObject({
      status: "unsupported",
      label: "Unsupported",
      cancellable: false,
      evidence: {
        supported_work_units: 250,
        attempted_work_units: 999,
      },
    });
    expect(markup).toContain("Unsupported work size");
    expect(markup).toContain("Supported work units: 250");
    expect(markup).toContain("Attempted work units: 999");
    expect(markup).toContain("data-workbench-oversized-work");
    expect(markup).toContain("Valuation Listings");
  });

  it("keeps work guard states deterministic and free of raw, hosted, server, persistence, and real-person paths", () => {
    const first = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ work_guard_status: "running" }));
    const second = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ work_guard_status: "running" }));

    expect(second).toBe(first);
    expect(first).toContain("data-workbench-work-guard");
    expect(first).not.toMatch(/\b(type="file"|https?:\/\/|upload|raw OCR|raw source document|server call|telemetry|insert into|persisted progress)\b/i);
    expect(first).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("renders responsive work guard controls with stable labels", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ work_guard_status: "running" }));

    expect(markup).toContain("workbench-guard-controls");
    expect(markup).toContain("Start guarded work");
    expect(markup).toContain("Cancel work");
    expect(markup).toContain("Oversized work check");
    expect(markup).toContain("Supported work units");
    expect(markup).toContain("Attempted work units");
    expect(markup).toContain("Approved sample");
    expect(markup).toContain("Status filter");
    expect(markup).toContain("Severity filter");
  });

  it("renders visible workspace session controls and saved/restored/unavailable labels", () => {
    const saved = buildApprovedSampleReconciliationWorkbench({ workspace_session_status: "saved" });
    const savedMarkup = buildReconciliationWorkbenchMarkup(saved);
    const restoredMarkup = buildReconciliationWorkbenchMarkup(
      buildApprovedSampleReconciliationWorkbench({
        session_snapshot: saved.workspace_session.snapshot ?? undefined,
        workspace_session_status: "restored",
      }),
    );
    const unavailableMarkup = buildReconciliationWorkbenchMarkup(
      buildApprovedSampleReconciliationWorkbench({ workspace_session_status: "unavailable" }),
    );

    expect(savedMarkup).toContain("data-workbench-save-session");
    expect(savedMarkup).toContain("data-workbench-restore-session");
    expect(savedMarkup).toContain("Workspace session: Saved");
    expect(restoredMarkup).toContain("Workspace session: Restored");
    expect(unavailableMarkup).toContain("Workspace session unavailable");
    expect(unavailableMarkup).toContain("BSRS Configuration");
  });

  it("keeps workspace session markup deterministic and free of raw, hosted, server, persistence, and real-person paths", () => {
    const first = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ workspace_session_status: "saved" }));
    const second = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench({ workspace_session_status: "saved" }));

    expect(second).toBe(first);
    expect(first).toContain("Mock approved-sample workspace");
    expect(first).not.toMatch(/\b(type="file"|https?:\/\/|upload|raw OCR|raw source document|server call|telemetry|insert into|sql.js write)\b/i);
    expect(first).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("keeps person-level context explicitly mocked and free of natural-person names", () => {
    const state = buildApprovedSampleReconciliationWorkbench();
    const markup = buildReconciliationWorkbenchMarkup(state);
    const personContext = [
      state.sample_context.mock_case_label,
      state.sample_context.mock_population_label,
      state.sample_context.no_real_person_data_notice,
    ].join(" ");

    expect(personContext).toContain("Mock");
    expect(personContext).toContain("No real");
    expect(markup).toContain("no-real-person-data-notice");
    expect(personContext).not.toMatch(/\b(John|Jane|Smith|Doe)\b/);
  });

  it("keeps generated_at deterministic across repeated builds", () => {
    const first = buildApprovedSampleReconciliationWorkbench();
    const second = buildApprovedSampleReconciliationWorkbench();

    expect(second.generated_at).toBe(first.generated_at);
    expect(second.reconciliation_rows).toEqual(first.reconciliation_rows);
  });

  it("keeps rendered workbench markup deterministic across repeated builds", () => {
    const first = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());
    const second = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());

    expect(second).toBe(first);
  });
});

import { describe, expect, it } from "vitest";
import { buildCaseNavigationDashboard } from "../../apps/web/src/app/caseNavigationDashboardSlice";
import { buildApprovedSampleReconciliationWorkbench } from "../../apps/web/src/app/reconciliationWorkbenchSlice";
import { buildCaseNavigationDashboardMarkup } from "../../apps/web/src/pages/CaseNavigationDashboardPage";
import { buildReconciliationWorkbenchMarkup } from "../../apps/web/src/pages/ReconciliationWorkbenchPage";

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

  it("exposes required alpha case stages in stable order with display-only planned stages", () => {
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
    expect(state.stages.filter((stage) => stage.status === "planned").length).toBeGreaterThan(0);
    expect(JSON.stringify(state.stages.filter((stage) => stage.status === "planned"))).not.toMatch(/\b(executed|started|completed|uploaded)\b/i);
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

import { describe, expect, it } from "vitest";
import { buildApprovedSampleReconciliationWorkbench } from "../../apps/web/src/app/reconciliationWorkbenchSlice";
import { buildReconciliationWorkbenchMarkup } from "../../apps/web/src/pages/ReconciliationWorkbenchPage";

describe("reconciliation workbench UI", () => {
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

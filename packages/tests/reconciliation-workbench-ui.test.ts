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
    expect(state.sample_context).toMatchObject({
      sample_id: "BSRS001",
      sample_label: "Deferred vested BSRS configuration packet",
      fixed_sample_label: "Fixed approved sample: BSRS001",
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

  it("renders approved sample context and no-real-person-data notice in the first visible header area", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());
    const headerMarkup = markup.slice(markup.indexOf("<header"), markup.indexOf("</header>"));

    expect(headerMarkup).toContain("Deferred vested BSRS configuration packet");
    expect(headerMarkup).toContain("Fixed approved sample: BSRS001");
    expect(headerMarkup).toContain("Mock case context: simulated PBGC terminated DB case");
    expect(headerMarkup).toContain("Mock population context: simulated participant cohort");
    expect(headerMarkup).toContain("No real participant, beneficiary, alternate payee, survivor, or other natural-person data");
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

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

  it("renders the workbench markup with BSRS, V1/VE, valuation listings, and reconciliation sections", () => {
    const markup = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());

    expect(markup).toContain("PBGC Reconciliation Workbench");
    expect(markup).toContain("BSRS Configuration");
    expect(markup).toContain("V1/VE Output");
    expect(markup).toContain("Valuation Listings");
    expect(markup).toContain("Cross-Slice Reconciliation");
    expect(markup).toContain("Generated from stable evidence");
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

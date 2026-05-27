import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderFormResolutionPage } from "./FormResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";
import { renderV1VeOutputPage } from "./V1VeOutputPage";
import { renderReconciliationWorkbenchPage } from "./ReconciliationWorkbenchPage";
import { runFixtureValuationListingsOutputResolution } from "../app/valuationListingsOutputSlice";

export function renderValuationListingsOutputPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell valuation-listings-output-page">
      <header>
        <div>
          <h1>PBGC Valuation Listings</h1>
          <p class="subtle">Reviewed fixture packets only. No server calls. DD.csv first where fields match.</p>
        </div>
        <nav>
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-service-resolution" type="button" class="secondary">Service</button>
          <button id="show-compensation-resolution" type="button" class="secondary">Compensation</button>
          <button id="show-form-resolution" type="button" class="secondary">Form</button>
          <button id="show-benefit-kernel" type="button" class="secondary">Benefit</button>
          <button id="show-v1-ve-output" type="button" class="secondary">V1/VE</button>
          <button id="show-reconciliation-workbench" type="button" class="secondary">Workbench</button>
          <button id="run-valuation-listings-output" type="button">Run valuation fixtures</button>
        </nav>
      </header>
      <div id="valuation-listings-alerts"></div>
      <div id="valuation-listings-traces"></div>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Row Type</th>
            <th>Sort Key</th>
            <th>Term MB</th>
            <th>PVMB</th>
            <th>Warnings</th>
            <th>Errors</th>
            <th>Trace</th>
          </tr>
        </thead>
        <tbody id="valuation-listings-output-results"></tbody>
      </table>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-form-resolution")?.addEventListener("click", () => renderFormResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-benefit-kernel")?.addEventListener("click", () => renderBenefitKernelPage(root));
  root.querySelector<HTMLButtonElement>("#show-v1-ve-output")?.addEventListener("click", () => renderV1VeOutputPage(root));
  root.querySelector<HTMLButtonElement>("#show-reconciliation-workbench")?.addEventListener("click", () => renderReconciliationWorkbenchPage(root));
  root.querySelector<HTMLButtonElement>("#run-valuation-listings-output")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#valuation-listings-output-results");
    const alertsDiv = root.querySelector<HTMLDivElement>("#valuation-listings-alerts");
    const tracesDiv = root.querySelector<HTMLDivElement>("#valuation-listings-traces");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="9">Running</td></tr>`;
    const state = await runFixtureValuationListingsOutputResolution();

    if (alertsDiv) {
      alertsDiv.innerHTML = state.results
        .filter((r) => r.errors.length > 0)
        .map((r) => `
          <div class="alert alert-error">
            <strong>${r.calculation_run_id}</strong> failed with ${r.error_count} error(s):
            <ul>${r.errors.map((e) => `<li><code>${e.code}</code>: ${e.message}</li>`).join("")}</ul>
          </div>
        `).join("");
    }

    const allTracesByRun = new Map<string, Array<Record<string, unknown>>>();
    for (const r of state.results) {
      if (r.traces.length > 0) {
        allTracesByRun.set(r.calculation_run_id, r.traces.map((t) => {
          let inputFieldsParsed: unknown = [];
          let intermediateParsed: Record<string, unknown> = {};
          try { inputFieldsParsed = JSON.parse(t.input_fields_used_json); } catch { /* keep default */ }
          try { intermediateParsed = JSON.parse(t.intermediate_values_json); } catch { /* keep default */ }
          return {
            module_trace_id: t.module_trace_id,
            field_name: t.field_name,
            rule_applied: t.rule_applied,
            dd_field_name: intermediateParsed.dd_field_name ?? "",
            output_value: t.output_value,
            warning_note: t.warning_note ?? "",
            source_fields: Array.isArray(inputFieldsParsed) ? inputFieldsParsed.join(", ") : String(inputFieldsParsed),
          };
        }));
      }
    }

    tbody.innerHTML = state.results.map((result) => {
      const hasTraces = allTracesByRun.has(result.calculation_run_id);
      return `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.metadata.listing_row_type ?? ""}</td>
        <td>${result.output?.metadata.listing_sort_key ?? ""}</td>
        <td>${result.output?.row.term_mb_nrd_nsf ?? ""}</td>
        <td>${result.output?.row.pvmb_term ?? ""}</td>
        <td>${result.warning_count}${result.warnings.length > 0 ? ` <span class="warning-tag" title="${result.warnings.map((w) => w.code + ": " + w.message).join("; ")}">⚠</span>` : ""}</td>
        <td>${result.error_count}</td>
        <td>${hasTraces ? `<button type="button" class="toggle-trace" data-run-id="${result.calculation_run_id}">Show</button>` : "-"}</td>
      </tr>
    `}).join("");

    root.querySelectorAll<HTMLButtonElement>(".toggle-trace").forEach((btn) => {
      btn.addEventListener("click", () => {
        const runId = btn.dataset.runId ?? "";
        const traces = allTracesByRun.get(runId);
        if (!traces || !tracesDiv) return;
        if (btn.textContent === "Hide") {
          btn.textContent = "Show";
          tracesDiv.innerHTML = "";
          return;
        }
        root.querySelectorAll(".toggle-trace").forEach((b) => { b.textContent = "Show"; });
        btn.textContent = "Hide";
        tracesDiv.innerHTML = `
          <div class="trace-panel">
            <h3>Trace Detail — ${runId}</h3>
            <table class="trace-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>DD Field</th>
                  <th>Source</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                ${traces.map((t) => `
                  <tr>
                    <td><code>${t.field_name}</code></td>
                    <td><code>${t.dd_field_name}</code></td>
                    <td>${t.source_fields}</td>
                    <td>${t.output_value}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
      });
    });
  });
}

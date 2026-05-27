import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderFormResolutionPage } from "./FormResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";
import { renderReconciliationWorkbenchPage } from "./ReconciliationWorkbenchPage";
import { runFixtureV1VeOutputResolution } from "../app/v1VeOutputSlice";
import type { V1VeOutputResult } from "@pbgc/v1-ve-output";

export function renderV1VeOutputPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell v1-ve-output-page">
      <header>
        <div>
          <h1>PBGC V1/VE Output</h1>
          <p class="subtle">Reviewed fixture packets only. No server calls.</p>
        </div>
        <nav>
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-service-resolution" type="button" class="secondary">Service</button>
          <button id="show-compensation-resolution" type="button" class="secondary">Compensation</button>
          <button id="show-form-resolution" type="button" class="secondary">Form</button>
          <button id="show-benefit-kernel" type="button" class="secondary">Benefit</button>
          <button id="show-reconciliation-workbench" type="button" class="secondary">Workbench</button>
          <button id="run-v1-ve-output" type="button">Run V1/VE fixtures</button>
        </nav>
      </header>
      <div id="v1-ve-output-alerts"></div>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Term MB</th>
            <th>XRD MB</th>
            <th>PVMB</th>
            <th>Warnings</th>
            <th>Errors</th>
            <th>Trace</th>
          </tr>
        </thead>
        <tbody id="v1-ve-output-results"></tbody>
      </table>
      <div id="v1-ve-output-trace-panel"></div>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-form-resolution")?.addEventListener("click", () => renderFormResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-benefit-kernel")?.addEventListener("click", () => renderBenefitKernelPage(root));
  root.querySelector<HTMLButtonElement>("#show-reconciliation-workbench")?.addEventListener("click", () => renderReconciliationWorkbenchPage(root));
  root.querySelector<HTMLButtonElement>("#run-v1-ve-output")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#v1-ve-output-results");
    const alertsDiv = root.querySelector<HTMLDivElement>("#v1-ve-output-alerts");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="8">Running</td></tr>`;
    const state = await runFixtureV1VeOutputResolution();

    renderAlerts(alertsDiv, state.results);
    renderResultsTable(tbody, state.results);
    bindTraceToggles(root, state.results);
  });
}

function renderAlerts(container: HTMLElement | null, results: V1VeOutputResult[]): void {
  if (!container) return;
  const errorResults = results.filter((r) => r.run_status === "failed");
  const warningResults = results.filter((r) => r.warning_count > 0);

  container.innerHTML = [
    ...errorResults.map((r) => `
      <div class="alert alert-error">
        <strong>Run ${r.calculation_run_id}:</strong> ${r.errors.map((e) => `${e.code}: ${e.message}`).join("; ")}
      </div>
    `),
    ...warningResults.map((r) => `
      <div class="alert alert-warning">
        <strong>Run ${r.calculation_run_id}:</strong> ${r.warnings.map((w) => w.message).join("; ")}
      </div>
    `),
  ].join("");
}

function renderResultsTable(tbody: HTMLTableSectionElement, results: V1VeOutputResult[]): void {
  tbody.innerHTML = results.map((result, i) => `
    <tr>
      <td>${result.calculation_run_id}</td>
      <td>${result.run_status}</td>
      <td>${result.output?.row.term_mb_nrd_nsf ?? ""}</td>
      <td>${result.output?.row.xrd_mb_term ?? ""}</td>
      <td>${result.output?.row.pvmb_term ?? ""}</td>
      <td>${result.warning_count}</td>
      <td>${result.error_count}</td>
      <td><button type="button" class="secondary trace-toggle" data-run-id="${result.calculation_run_id}" data-run-index="${i}">Show traces (${result.traces.length})</button></td>
    </tr>
  `).join("");
}

function bindTraceToggles(root: HTMLElement, results: V1VeOutputResult[]): void {
  const panel = root.querySelector<HTMLDivElement>("#v1-ve-output-trace-panel");
  if (!panel) return;

  const tracesByRun = new Map(results.map((r, i) => [r.calculation_run_id, { index: i, result: r }]));

  root.querySelectorAll<HTMLButtonElement>(".trace-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const runId = btn.dataset.runId;
      const entry = runId ? tracesByRun.get(runId) : undefined;
      if (!entry) return;

      const { result } = entry;
      panel.innerHTML = `
        <div class="trace-panel">
          <h3>Trace details for ${result.calculation_run_id} (${result.traces.length} traces)</h3>
          ${result.traces.length === 0
            ? "<p>No traces available.</p>"
            : `<table><thead><tr><th>Field</th><th>Value</th><th>Rule</th><th>DD Field</th><th>Branch</th></tr></thead><tbody>
              ${result.traces.map((t) => {
                const inputFields = tryParseJson(t.input_fields_used_json);
                const intermediate = tryParseJson(t.intermediate_values_json);
                return `
                  <tr>
                    <td>${t.field_name}</td>
                    <td>${t.output_value}</td>
                    <td>${t.rule_applied}</td>
                    <td>${intermediate?.dd_field_name ?? ""}</td>
                    <td>${intermediate?.branch ?? ""}</td>
                  </tr>
                  ${t.warning_note ? `<tr><td colspan="5" class="warning-note">Warning: ${t.warning_note}</td></tr>` : ""}
                `;
              }).join("")}
              </tbody></table>`
          }
        </div>
      `;
    });
  });
}

function tryParseJson(value: string): Record<string, unknown> | null {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

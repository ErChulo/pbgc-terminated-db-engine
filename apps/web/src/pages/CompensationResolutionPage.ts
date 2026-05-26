import { runFixtureCompensationResolution } from "../app/compensationResolutionSlice";
import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderFormResolutionPage } from "./FormResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";

export function renderCompensationResolutionPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell">
      <header>
        <div>
          <h1>PBGC Compensation Resolution</h1>
          <p class="subtle">Reviewed fixture packets only. No server calls.</p>
        </div>
        <nav>
          <button id="show-benefit-kernel" type="button" class="secondary">Benefit</button>
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-service-resolution" type="button" class="secondary">Service</button>
          <button id="show-form-resolution" type="button" class="secondary">Form</button>
          <button id="run-compensation-resolution" type="button">Run compensation fixtures</button>
        </nav>
      </header>
      <div id="compensation-resolution-errors"></div>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Errors</th>
            <th>Compensation</th>
            <th>Average</th>
            <th>Covered</th>
            <th>Warnings</th>
            <th>Trace</th>
          </tr>
        </thead>
        <tbody id="compensation-resolution-results"></tbody>
      </table>
      <div id="compensation-resolution-trace-detail" class="trace-panel"></div>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-benefit-kernel")?.addEventListener("click", () => renderBenefitKernelPage(root));
  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-form-resolution")?.addEventListener("click", () => renderFormResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#run-compensation-resolution")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#compensation-resolution-results");
    const errorDiv = root.querySelector<HTMLDivElement>("#compensation-resolution-errors");
    const traceDetail = root.querySelector<HTMLDivElement>("#compensation-resolution-trace-detail");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="8">Running</td></tr>`;
    if (errorDiv) errorDiv.innerHTML = "";
    if (traceDetail) traceDetail.innerHTML = "";
    const state = await runFixtureCompensationResolution();
    const failedRuns = state.results.filter((r) => r.run_status === "failed");
    if (failedRuns.length > 0 && errorDiv) {
      errorDiv.innerHTML = `<div class="alert alert-error">
        <strong>${failedRuns.length} run(s) failed with blocking errors:</strong>
        <ul>${failedRuns.map((r) => r.errors.map((e) => `<li><code>${e.code}</code> — ${e.message}</li>`).join("")).join("")}</ul>
      </div>`;
    }

    const tracesByRun = new Map(state.results.map((r) => [r.calculation_run_id, r.traces]));

    tbody.innerHTML = state.results
      .map(
        (result) => `
      <tr class="${result.run_status === "failed" ? "row-failed" : ""}">
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.error_count}</td>
        <td>${result.output?.compensation_resolved ?? ""}</td>
        <td>${result.output?.average_compensation_resolved ?? ""}</td>
        <td>${result.output?.covered_compensation_resolved ?? ""}</td>
        <td>${result.warning_count}</td>
        <td>${result.traces.length > 0 ? `<button class="show-trace-btn secondary" data-run-id="${result.calculation_run_id}">View (${result.traces.length})</button>` : "—"}</td>
      </tr>
    `,
      )
      .join("");

    tbody.querySelectorAll<HTMLButtonElement>(".show-trace-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const runId = btn.dataset.runId;
        if (!runId || !traceDetail) return;
        const traces = tracesByRun.get(runId) ?? [];
        traceDetail.innerHTML = `
          <h3>Trace details for ${runId}</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Rule Applied</th>
                <th>Output Value</th>
                <th>Warning</th>
                <th>Inputs</th>
                <th>Intermediate</th>
              </tr>
            </thead>
            <tbody>
              ${traces
                .map(
                  (trace) => `
                <tr>
                  <td>${trace.field_name}</td>
                  <td><code>${trace.rule_applied}</code></td>
                  <td>${trace.output_value ?? ""}</td>
                  <td>${trace.warning_note ?? ""}</td>
                  <td><pre>${trace.input_fields_used_json ?? "[]"}</pre></td>
                  <td><pre>${trace.intermediate_values_json ?? "{}"}</pre></td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `;
      });
    });
  });
}

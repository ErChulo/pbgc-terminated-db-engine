import { runFixtureFormResolution } from "../app/formResolutionSlice";
import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";

export function renderFormResolutionPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell">
      <header>
        <div>
          <h1>PBGC Form Resolution</h1>
          <p class="subtle">Reviewed fixture packets only. No server calls.</p>
        </div>
        <nav>
          <button id="show-benefit-kernel" type="button" class="secondary">Benefit</button>
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-service-resolution" type="button" class="secondary">Service</button>
          <button id="show-compensation-resolution" type="button" class="secondary">Compensation</button>
          <button id="run-form-resolution" type="button">Run form fixtures</button>
        </nav>
      </header>
      <div id="form-error-alerts"></div>
      <div id="form-warning-alerts"></div>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Ret Type</th>
            <th>NSF</th>
            <th>NMF</th>
            <th>Death</th>
            <th>LS</th>
            <th>Warnings</th>
            <th>Traces</th>
          </tr>
        </thead>
        <tbody id="form-resolution-results"></tbody>
      </table>
      <div id="form-trace-details" style="margin-top: 1rem;"></div>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-benefit-kernel")?.addEventListener("click", () => renderBenefitKernelPage(root));
  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#run-form-resolution")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#form-resolution-results");
    const errorAlerts = root.querySelector<HTMLDivElement>("#form-error-alerts");
    const warningAlerts = root.querySelector<HTMLDivElement>("#form-warning-alerts");
    const traceDetails = root.querySelector<HTMLDivElement>("#form-trace-details");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="9">Running</td></tr>`;
    if (errorAlerts) errorAlerts.innerHTML = "";
    if (warningAlerts) warningAlerts.innerHTML = "";
    if (traceDetails) traceDetails.innerHTML = "";

    const state = await runFixtureFormResolution();

    const allErrors = state.results.filter((r) => r.run_status === "failed");
    if (errorAlerts && allErrors.length > 0) {
      errorAlerts.innerHTML = allErrors
        .map(
          (result) => `
        <div class="alert alert-error">
          <strong>Failed:</strong> ${result.calculation_run_id}
          <ul>${result.errors.map((e) => `<li>${e.code}: ${e.message}</li>`).join("")}</ul>
        </div>`,
        )
        .join("");
    }

    const allWarnings = state.results.filter((r) => r.warning_count > 0);
    if (warningAlerts && allWarnings.length > 0) {
      warningAlerts.innerHTML = allWarnings
        .map(
          (result) => `
        <div class="alert alert-warning">
          <strong>Warnings:</strong> ${result.calculation_run_id}
          <ul>${result.warnings.map((w) => `<li>${w.code}: ${w.message}</li>`).join("")}</ul>
        </div>`,
        )
        .join("");
    }

    tbody.innerHTML = state.results
      .map(
        (result) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.rettyp ?? ""}</td>
        <td>${result.output?.form_code_nsf ?? ""}</td>
        <td>${result.output?.form_code_nmf ?? ""}</td>
        <td>${result.output?.form_code_death ?? ""}</td>
        <td>${result.output?.lsoption ?? ""}</td>
        <td>${result.warning_count}</td>
        <td>${
          result.traces.length > 0
            ? `<button type="button" class="secondary trace-toggle" data-run-id="${result.calculation_run_id}">${result.traces.length} traces</button>`
            : ""
        }</td>
      </tr>`,
      )
      .join("");

    tbody.querySelectorAll<HTMLButtonElement>(".trace-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const runId = btn.dataset.runId;
        const result = state.results.find((r) => r.calculation_run_id === runId);
        if (traceDetails && result) {
          traceDetails.innerHTML = `
            <h3>Trace Details — ${runId}</h3>
            <table>
              <thead>
                <tr><th>Field</th><th>Value</th><th>Rule</th><th>Branch</th><th>Warning</th></tr>
              </thead>
              <tbody>
                ${result.traces
                  .map(
                    (t) => `
                  <tr>
                    <td>${t.field_name}</td>
                    <td>${t.output_value}</td>
                    <td>${t.rule_applied}</td>
                    <td><pre style="font-size:0.75rem;max-width:300px;overflow:auto;">${t.intermediate_values_json}</pre></td>
                    <td>${t.warning_note ?? ""}</td>
                  </tr>`,
                  )
                  .join("")}
              </tbody>
            </table>`;
        }
      });
    });
  });
}

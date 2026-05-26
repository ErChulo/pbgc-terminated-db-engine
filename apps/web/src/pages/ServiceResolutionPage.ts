import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { runFixtureServiceResolution } from "../app/serviceResolutionSlice";

export function renderServiceResolutionPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell">
      <header>
        <div>
          <h1>PBGC Service Resolution</h1>
          <p class="subtle">Reviewed fixture packets only. No server calls.</p>
        </div>
        <nav>
          <button id="show-benefit-kernel" type="button" class="secondary">Benefit</button>
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-compensation-resolution" type="button" class="secondary">Compensation</button>
          <button id="run-service-resolution" type="button">Run service fixtures</button>
        </nav>
      </header>
      <div id="service-resolution-errors" style="display:none"></div>
      <div id="service-resolution-warnings" style="display:none"></div>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Eligibility</th>
            <th>Vesting</th>
            <th>Benefit</th>
            <th>Accrual</th>
            <th>Warnings</th>
            <th>Errors</th>
            <th>Trace</th>
          </tr>
        </thead>
        <tbody id="service-resolution-results"></tbody>
      </table>
      <div id="service-resolution-trace-detail" style="display:none"></div>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-benefit-kernel")?.addEventListener("click", () => renderBenefitKernelPage(root));
  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#run-service-resolution")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#service-resolution-results");
    const errorDiv = root.querySelector<HTMLDivElement>("#service-resolution-errors");
    const warningDiv = root.querySelector<HTMLDivElement>("#service-resolution-warnings");
    const traceDiv = root.querySelector<HTMLDivElement>("#service-resolution-trace-detail");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="9">Running</td></tr>`;
    if (errorDiv) errorDiv.style.display = "none";
    if (warningDiv) warningDiv.style.display = "none";
    if (traceDiv) traceDiv.style.display = "none";
    const state = await runFixtureServiceResolution();

    const failedRuns = state.results.filter((r) => r.run_status === "failed");
    if (failedRuns.length > 0 && errorDiv) {
      errorDiv.style.display = "block";
      errorDiv.innerHTML = failedRuns
        .map(
          (r) => `
        <div class="alert alert-error">
          <strong>${r.calculation_run_id}</strong> — ${r.error_count} blocking error(s):
          <ul>${r.errors.map((e) => `<li><code>${e.code}</code>: ${e.message}</li>`).join("")}</ul>
        </div>`,
        )
        .join("");
    }

    const warnedRuns = state.results.filter((r) => r.warning_count > 0);
    if (warnedRuns.length > 0 && warningDiv) {
      warningDiv.style.display = "block";
      warningDiv.innerHTML = warnedRuns
        .map(
          (r) => `
        <div class="alert alert-warning">
          <strong>${r.calculation_run_id}</strong> — ${r.warning_count} warning(s):
          <ul>${r.warnings.map((w) => `<li><code>${w.code}</code>: ${w.message}</li>`).join("")}</ul>
        </div>`,
        )
        .join("");
    }

    tbody.innerHTML = state.results
      .map(
        (result, idx) => `
      <tr class="${result.run_status === "failed" ? "row-failed" : ""}">
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.eligibility_service_resolved ?? ""}</td>
        <td>${result.output?.vesting_service_resolved ?? ""}</td>
        <td>${result.output?.benefit_service_resolved ?? ""}</td>
        <td>${result.output?.accrual_service_resolved ?? ""}</td>
        <td>${result.warning_count}</td>
        <td>${result.error_count}</td>
        <td>${result.traces.length > 0 ? `<button type="button" class="secondary trace-btn" data-idx="${idx}">View (${result.traces.length})</button>` : ""}</td>
      </tr>
    `,
      )
      .join("");

    // Trace detail buttons
    tbody.querySelectorAll<HTMLButtonElement>(".trace-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        const result = state.results[idx];
        if (!result || !traceDiv) return;
        traceDiv.style.display = "block";
        traceDiv.innerHTML = `
          <h3>Trace: ${result.calculation_run_id}</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Rule Applied</th>
                <th>Value</th>
                <th>Warning</th>
              </tr>
            </thead>
            <tbody>
              ${result.traces
                .map(
                  (t) => `
                <tr>
                  <td>${t.field_name}</td>
                  <td><code>${t.rule_applied}</code></td>
                  <td>${t.output_value ?? ""}</td>
                  <td>${t.warning_note ?? ""}</td>
                </tr>`,
                )
                .join("")}
            </tbody>
          </table>
          <details>
            <summary>Input Fields &amp; Intermediates</summary>
            ${result.traces
              .map(
                (t) => `
              <div style="margin:8px 0">
                <strong>${t.field_name}</strong>
                <pre style="font-size:11px;background:var(--surface);padding:4px">Inputs: ${t.input_fields_used_json}\n\nIntermediates: ${t.intermediate_values_json}</pre>
              </div>`,
              )
              .join("")}
          </details>
          <button type="button" class="secondary" id="close-trace-detail">Close</button>
        `;
        traceDiv.querySelector<HTMLButtonElement>("#close-trace-detail")?.addEventListener("click", () => {
          if (traceDiv) traceDiv.style.display = "none";
        });
      });
    });
  });
}

import { runFixtureDateResolution } from "../app/dateResolutionSlice";
import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";

export function renderDateResolutionPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell">
      <header>
        <h1>PBGC Date Resolution</h1>
        <nav>
          <button id="show-benefit-kernel" type="button" class="secondary">Benefit</button>
          <button id="show-service-resolution" type="button" class="secondary">Service</button>
          <button id="show-compensation-resolution" type="button" class="secondary">Compensation</button>
          <button id="run-date-resolution" type="button">Run fixtures</button>
        </nav>
      </header>
      <div id="date-resolution-errors" class="error-list"></div>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>NRD</th>
            <th>ERD</th>
            <th>RBD</th>
            <th>XRA</th>
            <th>XRD</th>
            <th>Warnings</th>
            <th>Errors</th>
            <th>Traces</th>
          </tr>
        </thead>
        <tbody id="date-resolution-results"></tbody>
      </table>
      <details id="date-resolution-trace-details" class="trace-panel" style="margin-top: 1rem;">
        <summary>Trace details</summary>
        <div id="trace-content"></div>
      </details>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-benefit-kernel")?.addEventListener("click", () => renderBenefitKernelPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#run-date-resolution")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#date-resolution-results");
    const errorDiv = root.querySelector<HTMLDivElement>("#date-resolution-errors");
    const traceContent = root.querySelector<HTMLDivElement>("#trace-content");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="10">Running</td></tr>`;
    if (errorDiv) errorDiv.innerHTML = "";
    if (traceContent) traceContent.innerHTML = "";
    const state = await runFixtureDateResolution();
    const failedRuns = state.results.filter((r) => r.run_status === "failed");
    const allErrors = failedRuns.flatMap((r) => r.errors);
    const allWarnings = state.results.flatMap((r) => r.warnings);

    if (errorDiv) {
      const parts: string[] = [];
      if (allErrors.length > 0) {
        parts.push(`
          <div class="alert alert-error">
            <strong>Blocking Errors (${allErrors.length})</strong>
            <ul>${allErrors.map((e) => `<li><code>${e.code}</code> &mdash; ${e.message}</li>`).join("")}</ul>
          </div>
        `);
      }
      if (allWarnings.length > 0) {
        parts.push(`
          <div class="alert alert-warning">
            <strong>Warnings (${allWarnings.length})</strong>
            <ul>${allWarnings.map((w) => `<li><code>${w.code}</code> &mdash; ${w.message} ${w.field_name ? `[${w.field_name}]` : ""}</li>`).join("")}</ul>
          </div>
        `);
      }
      errorDiv.innerHTML = parts.join("");
    }

    tbody.innerHTML = state.results.map((result, idx) => `
      <tr class="${result.run_status === "failed" ? "row-failed" : "row-completed"}">
        <td><code>${result.calculation_run_id}</code></td>
        <td><span class="badge badge-${result.run_status}">${result.run_status}</span></td>
        <td>${result.output?.nrd ?? ""}</td>
        <td>${result.output?.erd ?? ""}</td>
        <td>${result.output?.rbd ?? ""}</td>
        <td>${result.output?.xra ?? ""}</td>
        <td>${result.output?.xrd ?? ""}</td>
        <td>${result.warning_count}</td>
        <td>${result.error_count}</td>
        <td><button type="button" class="secondary trace-btn" data-run-idx="${idx}">${result.traces.length} rows</button></td>
      </tr>
    `).join("");

    if (traceContent) {
      root.querySelectorAll<HTMLButtonElement>(".trace-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const runIdx = Number(btn.dataset.runIdx);
          const result = state.results[runIdx];
          if (!result || !traceContent) return;
          traceContent.innerHTML = `
            <h3>Trace for ${result.calculation_run_id}</h3>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                  <th>Rule</th>
                  <th>Warning</th>
                  <th>Inputs</th>
                </tr>
              </thead>
              <tbody>
                ${result.traces.map((t) => `
                  <tr>
                    <td><strong>${t.field_name}</strong></td>
                    <td><code>${t.output_value ?? "null"}</code></td>
                    <td><code>${t.rule_applied}</code></td>
                    <td>${t.warning_note ? `<span class="badge badge-warning">${t.warning_note}</span>` : ""}</td>
                    <td><code>${t.input_fields_used_json.substring(0, 80)}${t.input_fields_used_json.length > 80 ? "..." : ""}</code></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `;
        });
      });
    }
  });
}

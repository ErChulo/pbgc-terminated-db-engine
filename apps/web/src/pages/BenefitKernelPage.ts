import { runFixtureBenefitKernelResolution } from "../app/benefitKernelSlice";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderFormResolutionPage } from "./FormResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";
import { renderV1VeOutputPage } from "./V1VeOutputPage";

export function renderBenefitKernelPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell">
      <header>
        <div>
          <h1>PBGC Benefit Kernel</h1>
          <p class="subtle">Reviewed fixture packets only. No server calls.</p>
        </div>
        <nav>
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-service-resolution" type="button" class="secondary">Service</button>
          <button id="show-compensation-resolution" type="button" class="secondary">Compensation</button>
          <button id="show-form-resolution" type="button" class="secondary">Form</button>
          <button id="show-v1-ve-output" type="button" class="secondary">V1/VE</button>
          <button id="run-benefit-kernel" type="button">Run benefit fixtures</button>
        </nav>
      </header>
      <div id="benefit-kernel-errors"></div>
      <div id="benefit-kernel-warnings"></div>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Term MB</th>
            <th>XRD MB</th>
            <th>PVMB</th>
            <th>Warnings</th>
            <th>Trace</th>
          </tr>
        </thead>
        <tbody id="benefit-kernel-results"></tbody>
      </table>
      <div id="benefit-kernel-trace-detail" style="margin-top:1rem;"></div>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-form-resolution")?.addEventListener("click", () => renderFormResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-v1-ve-output")?.addEventListener("click", () => renderV1VeOutputPage(root));
  root.querySelector<HTMLButtonElement>("#run-benefit-kernel")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#benefit-kernel-results");
    const errorDiv = root.querySelector<HTMLDivElement>("#benefit-kernel-errors");
    const warningDiv = root.querySelector<HTMLDivElement>("#benefit-kernel-warnings");
    const traceDiv = root.querySelector<HTMLDivElement>("#benefit-kernel-trace-detail");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="7">Running</td></tr>`;
    if (errorDiv) errorDiv.innerHTML = "";
    if (warningDiv) warningDiv.innerHTML = "";
    if (traceDiv) traceDiv.innerHTML = "";

    const state = await runFixtureBenefitKernelResolution();

    // Display blocking errors
    const allErrors = state.results.filter((r) => r.error_count > 0);
    if (errorDiv && allErrors.length > 0) {
      errorDiv.innerHTML = allErrors.map((r) => `
        <div class="error-alert">
          <strong>Run ${r.calculation_run_id} failed (${r.error_count} errors)</strong>
          <ul>${r.errors.map((e) => `<li>[${e.code}] ${e.message}${e.field_name ? ` (${e.input_group ?? ""}.${e.field_name})` : ""}</li>`).join("")}</ul>
        </div>
      `).join("");
    }

    // Display warnings
    const allWarnings = state.results.filter((r) => r.warning_count > 0);
    if (warningDiv && allWarnings.length > 0) {
      warningDiv.innerHTML = allWarnings.map((r) => `
        <div class="warning-alert">
          <strong>Run ${r.calculation_run_id} completed with ${r.warning_count} warnings</strong>
          <ul>${r.warnings.map((w) => `<li>[${w.code}] ${w.message}</li>`).join("")}</ul>
        </div>
      `).join("");
    }

    tbody.innerHTML = state.results.map((result, i) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.term_mb_nrd_nsf ?? ""}</td>
        <td>${result.output?.xrd_mb_term ?? ""}</td>
        <td>${result.output?.pvmb_term ?? ""}</td>
        <td>${result.warning_count}</td>
        <td>${result.traces.length > 0 ? `<button type="button" class="trace-toggle" data-index="${i}">View (${result.traces.length})</button>` : ""}</td>
      </tr>
    `).join("");

    // Trace detail panel toggle
    root.querySelectorAll<HTMLButtonElement>(".trace-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index") ?? "0", 10);
        const result = state.results[index];
        if (!result || !traceDiv) return;
        traceDiv.innerHTML = `
          <h3>Trace Details — Run ${result.calculation_run_id}</h3>
          ${result.traces.map((t) => `
            <details style="margin-bottom:0.5rem;">
              <summary>${t.field_name} = ${t.output_value}</summary>
              <pre>rule_applied: ${t.rule_applied}
input_fields: ${t.input_fields_used_json}
intermediate_values: ${t.intermediate_values_json}${t.warning_note ? `\nwarning: ${t.warning_note}` : ""}</pre>
            </details>
          `).join("")}
        `;
      });
    });
  });
}

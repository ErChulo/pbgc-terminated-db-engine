import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderFormResolutionPage } from "./FormResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";
import { renderV1VeOutputPage } from "./V1VeOutputPage";
import { renderValuationListingsOutputPage } from "./ValuationListingsOutputPage";
import { renderReconciliationWorkbenchPage } from "./ReconciliationWorkbenchPage";
import { runFixtureBsrsConfigurationOutputResolution } from "../app/bsrsConfigurationOutputSlice";

function renderErrors(errors: Array<{ code: string; message: string; field_name?: string; input_group?: string }>): string {
  if (!errors.length) return "";
  return `
    <div class="error-alert">
      <strong>${errors.length} validation error${errors.length !== 1 ? "s" : ""}</strong>
      <ul>${errors.map((e) => `<li><code>${e.code}</code> ${e.message}${e.field_name ? ` (${e.input_group ?? ""}.${e.field_name})` : ""}</li>`).join("")}</ul>
    </div>
  `;
}

function renderWarnings(warnings: Array<{ message: string }>): string {
  if (!warnings.length) return "";
  return `
    <div class="warning-alert">
      <strong>${warnings.length} warning${warnings.length !== 1 ? "s" : ""}</strong>
      <ul>${warnings.map((w) => `<li>${w.message}</li>`).join("")}</ul>
    </div>
  `;
}

function renderTracePanel(runId: string, traces: Array<{ field_name: string; rule_applied: string; input_fields_used_json: string; intermediate_values_json: string; output_value: string | null }>): string {
  if (!traces.length) return "";
  return `
    <details class="trace-panel">
      <summary>Trace details (${traces.length} fields)</summary>
      <table class="trace-table">
        <thead>
          <tr><th>Field</th><th>DD Field</th><th>Rule</th><th>Sources</th><th>Value</th></tr>
        </thead>
        <tbody>${traces.map((t) => {
          const parsed = (() => { try { return JSON.parse(t.intermediate_values_json) as Record<string, string>; } catch { return {}; } })();
          const inputs = (() => { try { return JSON.parse(t.input_fields_used_json) as string[]; } catch { return []; } })();
          return `
            <tr>
              <td>${t.field_name}</td>
              <td>${parsed.dd_field_name ?? ""}</td>
              <td>${t.rule_applied}</td>
              <td>${inputs.join(", ")}</td>
              <td>${t.output_value}</td>
            </tr>
          `;
        }).join("")}</tbody>
      </table>
    </details>
  `;
}

export function renderBsrsConfigurationPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell bsrs-configuration-output-page">
      <header>
        <div>
          <h1>PBGC BSRS Configuration</h1>
          <p class="subtle">Reviewed fixture packets only. No server calls. DD.csv first where fields match.</p>
        </div>
        <nav>
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-service-resolution" type="button" class="secondary">Service</button>
          <button id="show-compensation-resolution" type="button" class="secondary">Compensation</button>
          <button id="show-form-resolution" type="button" class="secondary">Form</button>
          <button id="show-benefit-kernel" type="button" class="secondary">Benefit</button>
          <button id="show-v1-ve-output" type="button" class="secondary">V1/VE</button>
          <button id="show-valuation-listings-output" type="button" class="secondary">Listings</button>
          <button id="show-reconciliation-workbench" type="button" class="secondary">Workbench</button>
          <button id="run-bsrs-configuration-output" type="button">Run BSRS fixtures</button>
        </nav>
      </header>
      <div id="bsrs-configuration-output-alerts"></div>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Row Type</th>
            <th>Sort Key</th>
            <th>Monthly</th>
            <th>Warnings</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody id="bsrs-configuration-output-results"></tbody>
      </table>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-form-resolution")?.addEventListener("click", () => renderFormResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-benefit-kernel")?.addEventListener("click", () => renderBenefitKernelPage(root));
  root.querySelector<HTMLButtonElement>("#show-v1-ve-output")?.addEventListener("click", () => renderV1VeOutputPage(root));
  root.querySelector<HTMLButtonElement>("#show-valuation-listings-output")?.addEventListener("click", () => renderValuationListingsOutputPage(root));
  root.querySelector<HTMLButtonElement>("#show-reconciliation-workbench")?.addEventListener("click", () => renderReconciliationWorkbenchPage(root));
  root.querySelector<HTMLButtonElement>("#run-bsrs-configuration-output")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#bsrs-configuration-output-results");
    const alertsEl = root.querySelector<HTMLDivElement>("#bsrs-configuration-output-alerts");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7">Running</td></tr>`;
    const state = await runFixtureBsrsConfigurationOutputResolution();

    let allErrorsHtml = "";
    let allWarningsHtml = "";
    let rowsHtml = "";

    for (const result of state.results) {
      if (result.errors.length > 0) {
        allErrorsHtml += renderErrors(result.errors);
      }
      if (result.warnings.length > 0) {
        allWarningsHtml += renderWarnings(result.warnings);
      }
      rowsHtml += `
        <tr class="${result.run_status === "failed" ? "row-failed" : ""}">
          <td>${result.calculation_run_id}</td>
          <td><span class="status-badge ${result.run_status}">${result.run_status}</span></td>
          <td>${result.output?.metadata.statement_row_type ?? ""}</td>
          <td>${result.output?.metadata.statement_sort_key ?? ""}</td>
          <td>${result.output?.row.current_payment_amount ?? ""}</td>
          <td>${result.warning_count > 0 ? `<span class="warning-count">${result.warning_count}</span>` : "0"}</td>
          <td>${result.error_count > 0 ? `<span class="error-count">${result.error_count}</span>` : "0"}</td>
        </tr>
        ${result.traces.length > 0 ? `<tr><td colspan="7">${renderTracePanel(result.calculation_run_id, result.traces)}</td></tr>` : ""}
      `;
    }

    if (alertsEl) {
      alertsEl.innerHTML = allErrorsHtml + allWarningsHtml;
    }
    tbody.innerHTML = rowsHtml;
  });
}

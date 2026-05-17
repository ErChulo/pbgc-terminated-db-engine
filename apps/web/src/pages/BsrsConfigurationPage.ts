import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderFormResolutionPage } from "./FormResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";
import { renderV1VeOutputPage } from "./V1VeOutputPage";
import { renderValuationListingsOutputPage } from "./ValuationListingsOutputPage";
import { runFixtureBsrsConfigurationOutputResolution } from "../app/bsrsConfigurationOutputSlice";

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
          <button id="run-bsrs-configuration-output" type="button">Run BSRS fixtures</button>
        </nav>
      </header>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Row Type</th>
            <th>Sort Key</th>
            <th>Monthly</th>
            <th>Warnings</th>
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
  root.querySelector<HTMLButtonElement>("#run-bsrs-configuration-output")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#bsrs-configuration-output-results");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6">Running</td></tr>`;
    const state = await runFixtureBsrsConfigurationOutputResolution();
    tbody.innerHTML = state.results.map((result) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.metadata.statement_row_type ?? ""}</td>
        <td>${result.output?.metadata.statement_sort_key ?? ""}</td>
        <td>${result.output?.row.current_payment_amount ?? ""}</td>
        <td>${result.warning_count}</td>
      </tr>
    `).join("");
  });
}

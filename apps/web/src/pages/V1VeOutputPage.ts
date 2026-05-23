import { renderBenefitKernelPage } from "./BenefitKernelPage";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderFormResolutionPage } from "./FormResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";
import { renderReconciliationWorkbenchPage } from "./ReconciliationWorkbenchPage";
import { runFixtureV1VeOutputResolution } from "../app/v1VeOutputSlice";

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
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Term MB</th>
            <th>XRD MB</th>
            <th>PVMB</th>
            <th>Warnings</th>
          </tr>
        </thead>
        <tbody id="v1-ve-output-results"></tbody>
      </table>
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
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6">Running</td></tr>`;
    const state = await runFixtureV1VeOutputResolution();
    tbody.innerHTML = state.results.map((result) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.row.term_mb_nrd_nsf ?? ""}</td>
        <td>${result.output?.row.xrd_mb_term ?? ""}</td>
        <td>${result.output?.row.pvmb_term ?? ""}</td>
        <td>${result.warning_count}</td>
      </tr>
    `).join("");
  });
}

import { runFixtureBenefitKernelResolution } from "../app/benefitKernelSlice";
import { renderCompensationResolutionPage } from "./CompensationResolutionPage";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderFormResolutionPage } from "./FormResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";

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
          <button id="run-benefit-kernel" type="button">Run benefit fixtures</button>
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
        <tbody id="benefit-kernel-results"></tbody>
      </table>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-form-resolution")?.addEventListener("click", () => renderFormResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#run-benefit-kernel")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#benefit-kernel-results");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6">Running</td></tr>`;
    const state = await runFixtureBenefitKernelResolution();
    tbody.innerHTML = state.results.map((result) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.term_mb_nrd_nsf ?? ""}</td>
        <td>${result.output?.xrd_mb_term ?? ""}</td>
        <td>${result.output?.pvmb_term ?? ""}</td>
        <td>${result.warning_count}</td>
      </tr>
    `).join("");
  });
}

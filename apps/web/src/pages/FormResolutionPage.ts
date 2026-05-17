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
          </tr>
        </thead>
        <tbody id="form-resolution-results"></tbody>
      </table>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-benefit-kernel")?.addEventListener("click", () => renderBenefitKernelPage(root));
  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#run-form-resolution")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#form-resolution-results");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="8">Running</td></tr>`;
    const state = await runFixtureFormResolution();
    tbody.innerHTML = state.results.map((result) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.rettyp ?? ""}</td>
        <td>${result.output?.form_code_nsf ?? ""}</td>
        <td>${result.output?.form_code_nmf ?? ""}</td>
        <td>${result.output?.form_code_death ?? ""}</td>
        <td>${result.output?.lsoption ?? ""}</td>
        <td>${result.warning_count}</td>
      </tr>
    `).join("");
  });
}

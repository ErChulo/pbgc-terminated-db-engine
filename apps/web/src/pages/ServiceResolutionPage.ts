import { renderDateResolutionPage } from "./DateResolutionPage";
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
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-compensation-resolution" type="button" class="secondary">Compensation</button>
          <button id="run-service-resolution" type="button">Run service fixtures</button>
        </nav>
      </header>
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
          </tr>
        </thead>
        <tbody id="service-resolution-results"></tbody>
      </table>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-compensation-resolution")?.addEventListener("click", () => renderCompensationResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#run-service-resolution")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#service-resolution-results");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7">Running</td></tr>`;
    const state = await runFixtureServiceResolution();
    tbody.innerHTML = state.results.map((result) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.eligibility_service_resolved ?? ""}</td>
        <td>${result.output?.vesting_service_resolved ?? ""}</td>
        <td>${result.output?.benefit_service_resolved ?? ""}</td>
        <td>${result.output?.accrual_service_resolved ?? ""}</td>
        <td>${result.warning_count}</td>
      </tr>
    `).join("");
  });
}

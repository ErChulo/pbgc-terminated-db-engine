import { runFixtureCompensationResolution } from "../app/compensationResolutionSlice";
import { renderDateResolutionPage } from "./DateResolutionPage";
import { renderServiceResolutionPage } from "./ServiceResolutionPage";

export function renderCompensationResolutionPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell">
      <header>
        <div>
          <h1>PBGC Compensation Resolution</h1>
          <p class="subtle">Reviewed fixture packets only. No server calls.</p>
        </div>
        <nav>
          <button id="show-date-resolution" type="button" class="secondary">Date</button>
          <button id="show-service-resolution" type="button" class="secondary">Service</button>
          <button id="run-compensation-resolution" type="button">Run compensation fixtures</button>
        </nav>
      </header>
      <table>
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Compensation</th>
            <th>Average</th>
            <th>Covered</th>
            <th>Warnings</th>
          </tr>
        </thead>
        <tbody id="compensation-resolution-results"></tbody>
      </table>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#show-date-resolution")?.addEventListener("click", () => renderDateResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#show-service-resolution")?.addEventListener("click", () => renderServiceResolutionPage(root));
  root.querySelector<HTMLButtonElement>("#run-compensation-resolution")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#compensation-resolution-results");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6">Running</td></tr>`;
    const state = await runFixtureCompensationResolution();
    tbody.innerHTML = state.results.map((result) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.compensation_resolved ?? ""}</td>
        <td>${result.output?.average_compensation_resolved ?? ""}</td>
        <td>${result.output?.covered_compensation_resolved ?? ""}</td>
        <td>${result.warning_count}</td>
      </tr>
    `).join("");
  });
}

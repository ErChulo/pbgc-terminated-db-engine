import { runFixtureDateResolution } from "../app/dateResolutionSlice";

export function renderDateResolutionPage(root: HTMLElement): void {
  root.innerHTML = `
    <section class="page-shell">
      <header>
        <h1>PBGC Date Resolution</h1>
        <button id="run-date-resolution" type="button">Run fixtures</button>
      </header>
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
          </tr>
        </thead>
        <tbody id="date-resolution-results"></tbody>
      </table>
    </section>
  `;

  root.querySelector<HTMLButtonElement>("#run-date-resolution")?.addEventListener("click", async () => {
    const tbody = root.querySelector<HTMLTableSectionElement>("#date-resolution-results");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7">Running</td></tr>`;
    const state = await runFixtureDateResolution();
    tbody.innerHTML = state.results.map((result) => `
      <tr>
        <td>${result.calculation_run_id}</td>
        <td>${result.run_status}</td>
        <td>${result.output?.nrd ?? ""}</td>
        <td>${result.output?.erd ?? ""}</td>
        <td>${result.output?.rbd ?? ""}</td>
        <td>${result.output?.xra ?? ""}</td>
        <td>${result.output?.xrd ?? ""}</td>
      </tr>
    `).join("");
  });
}

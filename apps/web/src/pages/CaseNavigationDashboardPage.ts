import { buildCaseNavigationDashboard, type CaseNavigationDashboardState } from "../app/caseNavigationDashboardSlice";

export function renderCaseNavigationDashboardPage(root: HTMLElement): void {
  root.innerHTML = buildCaseNavigationDashboardMarkup(buildCaseNavigationDashboard());
}

export function buildCaseNavigationDashboardMarkup(state: CaseNavigationDashboardState): string {
  return `
    <section class="page-shell case-dashboard-page" id="case-dashboard" aria-label="Case navigation dashboard">
      <header class="case-dashboard-header">
        <div class="case-dashboard-title">
          <h1>PBGC Case Dashboard</h1>
          <p class="subtle">${escapeHtml(state.summary.workspace_label)} · ${escapeHtml(state.summary.sample_id)}</p>
          <p class="subtle">Generated from stable evidence: ${escapeHtml(state.generated_at)}</p>
          <a class="primary-link case-dashboard-workbench-link" href="${escapeHtml(state.summary.primary_action_target)}" data-case-dashboard-workbench-link>
            ${escapeHtml(state.summary.primary_action_label)}
          </a>
        </div>
        <div class="case-dashboard-summary" aria-label="Current mocked workspace">
          <strong>Current mocked workspace</strong>
          <span>${escapeHtml(state.summary.sample_label)}</span>
          <span>Approved artifact: ${escapeHtml(state.summary.artifact_basis)}</span>
          <span>${escapeHtml(state.summary.mock_case_label)}</span>
          <span>${escapeHtml(state.summary.mock_population_label)}</span>
          <span class="no-real-person-data-notice">${escapeHtml(state.summary.no_real_person_data_notice)}</span>
        </div>
      </header>
      <main class="case-dashboard-grid">
        <section class="case-dashboard-panel" aria-label="Stage status">
          <div class="case-dashboard-panel-heading">
            <h2>Stage status</h2>
            <span class="subtle">Approved-sample alpha navigation</span>
          </div>
          <ol class="case-stage-list">
            ${state.stages.map((stage) => `
              <li class="case-stage-item stage-${escapeHtml(stage.status)}" data-case-stage-key="${escapeHtml(stage.stage_key)}">
                <div>
                  <strong>${escapeHtml(stage.label)}</strong>
                  <span>${escapeHtml(stage.detail)}</span>
                  <span class="comparison-source">Basis: ${escapeHtml(stage.basis)}</span>
                </div>
                <div class="case-stage-status">
                  <span>${escapeHtml(stage.status_label)}</span>
                  ${stage.target ? `<a href="${escapeHtml(stage.target)}">Open</a>` : `<span>Display only</span>`}
                </div>
              </li>
            `).join("")}
          </ol>
        </section>
      </main>
    </section>
  `;
}

function escapeHtml(value: string | number | boolean | null | undefined): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\"":
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

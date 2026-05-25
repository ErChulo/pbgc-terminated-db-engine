import { buildUnresolvedIssuesQueue, type IssueQueueItem, type UnresolvedIssuesQueueState } from "../app/unresolvedIssuesQueueSlice";

export function renderUnresolvedIssuesQueuePage(root: HTMLElement): void {
  root.innerHTML = buildUnresolvedIssuesQueueMarkup(buildUnresolvedIssuesQueue());
}

export function buildUnresolvedIssuesQueueMarkup(state: UnresolvedIssuesQueueState): string {
  return `
    <section class="page-shell unresolved-issues-page" id="unresolved-issues" aria-label="PBGC unresolved issues">
      <header class="issues-header">
        <div class="issues-title">
          <h1>PBGC Unresolved Issues</h1>
          <p class="subtle">Browser-local queue of existing blocked states, warnings, and errors</p>
          <a class="primary-link" href="#case-dashboard">Return to case dashboard</a>
        </div>
        <div class="issues-boundary-notice" aria-label="Unresolved issues boundary">
          <strong>Issue queue boundary</strong>
          <span>${escapeHtml(state.boundary_notice)}</span>
          <span class="no-real-person-data-notice">${escapeHtml(state.no_real_person_data_notice)}</span>
        </div>
      </header>
      <main class="issues-grid">
        <section class="issues-summary-panel" aria-label="Issue summary">
          <h2>Issue summary</h2>
          <dl class="issues-summary-list">
            <div><dt>Total</dt><dd>${escapeHtml(state.summary.total_count)}</dd></div>
            <div><dt>Errors</dt><dd>${escapeHtml(state.summary.error_count)}</dd></div>
            <div><dt>Warnings</dt><dd>${escapeHtml(state.summary.warning_count)}</dd></div>
            <div><dt>Info</dt><dd>${escapeHtml(state.summary.info_count)}</dd></div>
          </dl>
        </section>
        <section class="issues-table-panel" aria-label="Issue queue">
          <h2>Issue queue</h2>
          <table class="issues-table" data-unresolved-issues-table>
            <thead>
              <tr><th>Severity</th><th>Source</th><th>Code</th><th>Message</th><th>Trace</th></tr>
            </thead>
            <tbody>
              ${state.items.length === 0 ? `<tr><td colspan="5">No unresolved issues.</td></tr>` : state.items.map(buildIssueRow).join("")}
            </tbody>
          </table>
        </section>
      </main>
    </section>
  `;
}

function buildIssueRow(item: IssueQueueItem): string {
  return `
    <tr class="issue-row severity-${escapeHtml(item.severity)}">
      <td>${escapeHtml(item.severity)}</td>
      <td>${escapeHtml(item.source_stage)}<span class="comparison-source">${escapeHtml(item.status)}</span></td>
      <td>${escapeHtml(item.code)}</td>
      <td>${escapeHtml(item.message)}</td>
      <td><span class="comparison-source">${escapeHtml(item.trace_basis.producing_module)} ${escapeHtml(item.trace_basis.rule_version)}</span><span class="comparison-source">${escapeHtml(item.trace_basis.source_id)}</span></td>
    </tr>
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

import { buildApprovedSampleReconciliationWorkbench, type ReconciliationWorkbenchState } from "../app/reconciliationWorkbenchSlice";

export function renderReconciliationWorkbenchPage(root: HTMLElement): void {
  root.innerHTML = buildReconciliationWorkbenchMarkup(buildApprovedSampleReconciliationWorkbench());
}

export function buildReconciliationWorkbenchMarkup(state: ReconciliationWorkbenchState): string {
  return `
    <section class="page-shell reconciliation-workbench-page">
      <header class="workbench-header">
        <div class="workbench-title">
          <h1>PBGC Reconciliation Workbench</h1>
          <p class="subtle">${escapeHtml(state.sample_context.sample_label)} · ${escapeHtml(state.case_id)} · ${escapeHtml(state.plan_id)}</p>
          <p class="subtle">Generated from stable evidence: ${escapeHtml(state.generated_at)}</p>
        </div>
        <div class="workbench-sample-context" aria-label="Approved sample context">
          <strong>${escapeHtml(state.sample_context.fixed_sample_label)}</strong>
          <span>${escapeHtml(state.sample_context.mock_case_label)}</span>
          <span>${escapeHtml(state.sample_context.mock_population_label)}</span>
          <span class="no-real-person-data-notice">${escapeHtml(state.sample_context.no_real_person_data_notice)}</span>
        </div>
      </header>
      <main class="workbench-grid">
        <section class="workbench-panel output-panels" aria-label="Output panels">
          ${state.output_panels.map(renderOutputPanel).join("")}
        </section>
        <section class="workbench-panel reconciliation-panel" aria-label="Cross-slice reconciliation">
          <h2>Cross-Slice Reconciliation</h2>
          <table>
            <thead>
              <tr>
                <th>Fact</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Compared Values</th>
              </tr>
            </thead>
            <tbody>
              ${state.reconciliation_rows.map(renderReconciliationRow).join("")}
            </tbody>
          </table>
        </section>
      </main>
    </section>
  `;
}

function renderOutputPanel(panel: ReconciliationWorkbenchState["output_panels"][number]): string {
  return `
    <article class="slice-panel" data-slice="${escapeHtml(panel.slice_name)}">
      <h2>${escapeHtml(panel.panel_label)}</h2>
      <p class="subtle">Row ${escapeHtml(panel.row_identity)}</p>
      <dl>
        ${panel.fields.map((field) => `
          <div>
            <dt>${escapeHtml(field.display_label)}</dt>
            <dd class="${field.is_null ? "is-null" : ""}">${escapeHtml(field.value)}</dd>
          </div>
        `).join("")}
      </dl>
    </article>
  `;
}

function renderReconciliationRow(row: ReconciliationWorkbenchState["reconciliation_rows"][number]): string {
  const comparedValues = `${row.compared_slices[0]}.${row.compared_fields[0]}=${row.compared_values[0]} | ${row.compared_slices[1]}.${row.compared_fields[1]}=${row.compared_values[1]}`;
  return `
    <tr class="reconciliation-row status-${escapeHtml(row.status)}">
      <td>${escapeHtml(row.canonical_semantic_name)}</td>
      <td>${escapeHtml(row.status)}</td>
      <td>${escapeHtml(row.severity)}</td>
      <td>${escapeHtml(comparedValues)}</td>
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

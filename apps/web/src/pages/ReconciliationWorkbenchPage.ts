import {
  buildApprovedSampleReconciliationWorkbench,
  type ReconciliationWorkbenchState,
  type WorkbenchProgressStatus,
  type WorkbenchSeverityFilterValue,
  type WorkbenchStatusFilterValue,
  type WorkbenchTheme,
} from "../app/reconciliationWorkbenchSlice";

export function renderReconciliationWorkbenchPage(root: HTMLElement): void {
  renderWorkbench(root, buildApprovedSampleReconciliationWorkbench({ theme: readStoredTheme(), theme_source: readStoredTheme() ? "session" : "default" }));
}

export function buildReconciliationWorkbenchMarkup(state: ReconciliationWorkbenchState): string {
  return `
    <section class="page-shell reconciliation-workbench-page theme-${escapeHtml(state.theme.value)}" data-workbench-theme="${escapeHtml(state.theme.value)}">
      <header class="workbench-header">
        <div class="workbench-title">
          <h1>PBGC Reconciliation Workbench</h1>
          <p class="subtle">${escapeHtml(state.sample_context.sample_label)} · ${escapeHtml(state.case_id)} · ${escapeHtml(state.plan_id)}</p>
          <p class="subtle">Generated from stable evidence: ${escapeHtml(state.generated_at)}</p>
          ${renderActionBar(state)}
        </div>
        <div class="workbench-sample-context" aria-label="Approved sample context">
          <strong>${escapeHtml(state.sample_context.fixed_sample_label)}</strong>
          ${renderSampleSelector(state)}
          <span>Approved artifact: ${escapeHtml(state.sample_context.artifact_basis)}</span>
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
          ${renderFilterBar(state)}
          <section class="comparison-table-section" aria-label="Shared Facts">
            <h3>Shared Facts</h3>
            <table class="comparison-table shared-facts-table">
              <thead>
                <tr>
                  <th>Fact</th>
                  <th>Left Source</th>
                  <th>Right Source</th>
                  <th>Status</th>
                  <th>Severity</th>
                  <th>Basis</th>
                </tr>
              </thead>
              <tbody>
                ${state.filtered_shared_fact_rows.map(renderSharedFactRow).join("")}
                ${renderEmptyStateRow(state.filtered_row_groups.shared_facts.empty_state, 6)}
              </tbody>
            </table>
          </section>
          <section class="comparison-table-section" aria-label="Shared Values">
            <h3>Shared Values</h3>
            <table class="comparison-table shared-values-table">
              <thead>
                <tr>
                  <th>Value</th>
                  <th>Left Source</th>
                  <th>Right Source</th>
                  <th>Status</th>
                  <th>Severity</th>
                  <th>Basis</th>
                </tr>
              </thead>
              <tbody>
                ${state.filtered_shared_value_rows.map(renderSharedValueRow).join("")}
                ${renderEmptyStateRow(state.filtered_row_groups.shared_values.empty_state, 6)}
              </tbody>
            </table>
          </section>
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
              ${state.filtered_reconciliation_rows.map(renderReconciliationRow).join("")}
              ${renderEmptyStateRow(state.filtered_row_groups.reconciliation.empty_state, 4)}
            </tbody>
          </table>
        </section>
      </main>
    </section>
  `;
}

function renderWorkbench(root: HTMLElement, state: ReconciliationWorkbenchState): void {
  root.innerHTML = buildReconciliationWorkbenchMarkup(state);
  const selector = root.querySelector<HTMLSelectElement>("[data-workbench-sample-selector]");
  selector?.addEventListener("change", () => {
    renderWorkbench(
      root,
      buildApprovedSampleReconciliationWorkbench({
        sample_id: selector.value,
        status_filter: state.status_filter.value,
        severity_filter: state.severity_filter.value,
        theme: state.theme.value,
        theme_source: state.theme.source,
        progress_status: state.progress.status,
      }),
    );
  });
  const statusFilter = root.querySelector<HTMLSelectElement>("[data-workbench-status-filter]");
  statusFilter?.addEventListener("change", () => {
    renderWorkbench(
      root,
      buildApprovedSampleReconciliationWorkbench({
        sample_id: state.sample_id,
        status_filter: statusFilter.value as WorkbenchStatusFilterValue,
        severity_filter: state.severity_filter.value,
        theme: state.theme.value,
        theme_source: state.theme.source,
        progress_status: state.progress.status,
      }),
    );
  });
  const severityFilter = root.querySelector<HTMLSelectElement>("[data-workbench-severity-filter]");
  severityFilter?.addEventListener("change", () => {
    renderWorkbench(
      root,
      buildApprovedSampleReconciliationWorkbench({
        sample_id: state.sample_id,
        status_filter: state.status_filter.value,
        severity_filter: severityFilter.value as WorkbenchSeverityFilterValue,
        theme: state.theme.value,
        theme_source: state.theme.source,
        progress_status: state.progress.status,
      }),
    );
  });
  const themeToggle = root.querySelector<HTMLButtonElement>("[data-workbench-theme-toggle]");
  themeToggle?.addEventListener("click", () => {
    const nextTheme = themeToggle.dataset.nextTheme === "dark" ? "dark" : "light";
    writeStoredTheme(nextTheme);
    renderWorkbench(
      root,
      buildApprovedSampleReconciliationWorkbench({
        sample_id: state.sample_id,
        status_filter: state.status_filter.value,
        severity_filter: state.severity_filter.value,
        theme: nextTheme,
        theme_source: "explicit",
        progress_status: state.progress.status,
      }),
    );
  });
  const refresh = root.querySelector<HTMLButtonElement>("[data-workbench-refresh]");
  refresh?.addEventListener("click", () => {
    renderWorkbench(
      root,
      buildApprovedSampleReconciliationWorkbench({
        sample_id: state.sample_id,
        status_filter: state.status_filter.value,
        severity_filter: state.severity_filter.value,
        theme: state.theme.value,
        theme_source: state.theme.source,
        progress_status: "loading",
      }),
    );
    window.setTimeout(() => {
      renderWorkbench(
        root,
        buildApprovedSampleReconciliationWorkbench({
          sample_id: state.sample_id,
          status_filter: state.status_filter.value,
          severity_filter: state.severity_filter.value,
          theme: state.theme.value,
          theme_source: state.theme.source,
          progress_status: "complete",
        }),
      );
    }, 16);
  });
}

function renderActionBar(state: ReconciliationWorkbenchState): string {
  const nextTheme: WorkbenchTheme = state.theme.value === "dark" ? "light" : "dark";
  const nextThemeLabel = nextTheme === "dark" ? "Dark" : "Light";
  return `
    <div class="workbench-action-bar" aria-label="Workbench display controls">
      <span class="theme-control-label">Theme</span>
      <button type="button" class="secondary theme-toggle" data-workbench-theme-toggle data-next-theme="${nextTheme}">
        Switch to ${nextThemeLabel}
      </button>
      <span class="active-filter-label">Active theme: ${escapeHtml(state.theme.label)}</span>
      <button type="button" class="secondary workbench-refresh" data-workbench-refresh>
        Refresh sample
      </button>
    </div>
    ${renderProgressBanner(state.progress)}
  `;
}

function renderProgressBanner(progress: ReconciliationWorkbenchState["progress"]): string {
  if (progress.status === "idle") return "";
  return `
    <div class="workbench-progress-banner progress-${escapeHtml(progress.status)}" data-workbench-progress role="status" aria-busy="${progress.busy ? "true" : "false"}">
      <span class="progress-spinner" aria-hidden="true"></span>
      <span class="progress-message">${escapeHtml(progress.message)}</span>
      ${progress.detail ? `<span class="progress-detail">${escapeHtml(progress.detail)}</span>` : ""}
    </div>
  `;
}

function renderSampleSelector(state: ReconciliationWorkbenchState): string {
  const isFixed = state.sample_options.length === 1;
  return `
    <label class="sample-selector">
      <span>Approved sample</span>
      <select data-workbench-sample-selector ${isFixed ? "disabled" : ""} aria-label="Approved sample">
        ${state.sample_options.map((sample) => `
          <option value="${escapeHtml(sample.sample_id)}" ${sample.sample_id === state.selected_sample.sample_id ? "selected" : ""}>
            ${escapeHtml(sample.selector_label)}
          </option>
        `).join("")}
      </select>
    </label>
  `;
}

function renderFilterBar(state: ReconciliationWorkbenchState): string {
  return `
    <div class="workbench-filter-bar" aria-label="Workbench filters">
      <label class="status-filter">
        <span>Status filter</span>
        <select data-workbench-status-filter aria-label="Status filter">
          ${state.status_filter_options.map((option) => `
            <option value="${escapeHtml(option.value)}"${option.value === state.status_filter.value ? " selected" : ""}>${escapeHtml(option.label)} (${option.row_count})</option>
          `).join("")}
        </select>
      </label>
      <label class="severity-filter">
        <span>Severity filter</span>
        <select data-workbench-severity-filter aria-label="Severity filter">
          ${state.severity_filter_options.map((option) => `
            <option value="${escapeHtml(option.value)}"${option.value === state.severity_filter.value ? " selected" : ""}>${escapeHtml(option.label)} (${option.row_count})</option>
          `).join("")}
        </select>
      </label>
      <span class="active-filter-label">Active status: ${escapeHtml(state.status_filter.label)}</span>
      <span class="active-filter-label">Active severity: ${escapeHtml(state.severity_filter.label)}</span>
    </div>
  `;
}

function renderEmptyStateRow(message: string | null, colspan: number): string {
  if (!message) return "";
  return `
    <tr class="filter-empty-state">
      <td colspan="${colspan}">${escapeHtml(message)}</td>
    </tr>
  `;
}

function renderSharedValueRow(row: ReconciliationWorkbenchState["shared_value_rows"][number]): string {
  return `
    <tr class="reconciliation-row status-${escapeHtml(row.status)}">
      <td>${escapeHtml(row.value_label)}</td>
      <td>
        <span class="comparison-source">${escapeHtml(row.left_source)}.${escapeHtml(row.left_field)}</span>
        <span class="comparison-value">raw ${escapeHtml(row.left_value)}</span>
        <span class="comparison-value">normalized ${escapeHtml(row.left_normalized_value)}</span>
      </td>
      <td>
        <span class="comparison-source">${escapeHtml(row.right_source)}.${escapeHtml(row.right_field)}</span>
        <span class="comparison-value">raw ${escapeHtml(row.right_value)}</span>
        <span class="comparison-value">normalized ${escapeHtml(row.right_normalized_value)}</span>
      </td>
      <td>${escapeHtml(row.status)}</td>
      <td>${escapeHtml(row.severity_label)}</td>
      <td>
        <span class="comparison-source">${escapeHtml(row.mapping_basis)}</span>
        <span class="comparison-value">${escapeHtml(row.normalization_basis)}</span>
        <span class="comparison-value">trace ${escapeHtml(row.trace.rule_version)} · ${escapeHtml(row.trace.producing_module)}</span>
        ${renderTraceDetail(row.trace_detail)}
      </td>
    </tr>
  `;
}

function renderSharedFactRow(row: ReconciliationWorkbenchState["shared_fact_rows"][number]): string {
  return `
    <tr class="reconciliation-row status-${escapeHtml(row.status)}">
      <td>${escapeHtml(row.fact_label)}</td>
      <td>
        <span class="comparison-source">${escapeHtml(row.left_source)}.${escapeHtml(row.left_field)}</span>
        <span class="comparison-value">${escapeHtml(row.left_value)}</span>
      </td>
      <td>
        <span class="comparison-source">${escapeHtml(row.right_source)}.${escapeHtml(row.right_field)}</span>
        <span class="comparison-value">${escapeHtml(row.right_value)}</span>
      </td>
      <td>${escapeHtml(row.status)}</td>
      <td>${escapeHtml(row.severity_label)}</td>
      <td>
        <span class="comparison-source">${escapeHtml(row.mapping_basis)}</span>
        <span class="comparison-value">trace ${escapeHtml(row.trace.rule_version)} · ${escapeHtml(row.trace.producing_module)}</span>
        ${renderTraceDetail(row.trace_detail)}
      </td>
    </tr>
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
      <td>
        <span class="comparison-value">${escapeHtml(comparedValues)}</span>
        ${renderTraceDetail(row.trace_detail)}
      </td>
    </tr>
  `;
}

function renderTraceDetail(detail: ReconciliationWorkbenchState["reconciliation_rows"][number]["trace_detail"]): string {
  return `
    <details class="trace-detail" id="${escapeHtml(detail.control_id)}">
      <summary>${escapeHtml(detail.collapsed_label)}</summary>
      <dl class="trace-detail-grid">
        <div>
          <dt>Compared sources</dt>
          <dd>${escapeHtml(detail.compared_sources[0])} | ${escapeHtml(detail.compared_sources[1])}</dd>
        </div>
        <div>
          <dt>Source fields</dt>
          <dd>${escapeHtml(detail.compared_fields[0])} | ${escapeHtml(detail.compared_fields[1])}</dd>
        </div>
        <div>
          <dt>Raw values</dt>
          <dd>${escapeHtml(detail.raw_values[0])} | ${escapeHtml(detail.raw_values[1])}</dd>
        </div>
        <div>
          <dt>Normalized values</dt>
          <dd>${escapeHtml(detail.normalized_values[0])} | ${escapeHtml(detail.normalized_values[1])}</dd>
        </div>
        <div>
          <dt>Mapping basis</dt>
          <dd>${escapeHtml(detail.mapping_basis)}</dd>
        </div>
        <div>
          <dt>Trace</dt>
          <dd>${escapeHtml(detail.rule_version)} | ${escapeHtml(detail.producing_module)}</dd>
        </div>
        <div>
          <dt>Source paths</dt>
          <dd>${escapeHtml(detail.source_paths[0])} | ${escapeHtml(detail.source_paths[1])}</dd>
        </div>
        <div>
          <dt>Stable evidence</dt>
          <dd>${escapeHtml(detail.stable_evidence_basis)}</dd>
        </div>
      </dl>
    </details>
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

function readStoredTheme(): WorkbenchTheme | undefined {
  try {
    const stored = window.localStorage.getItem("pbgc-workbench-theme");
    return stored === "dark" || stored === "light" ? stored : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredTheme(theme: WorkbenchTheme): void {
  try {
    window.localStorage.setItem("pbgc-workbench-theme", theme);
  } catch {
    // Theme switching still works for the current render when storage is unavailable.
  }
}

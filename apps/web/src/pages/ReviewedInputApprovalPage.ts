import { buildReviewedInputApproval, type NormalizedReviewRow, type ReviewedInputApprovalState } from "../app/reviewedInputApprovalSlice";

export function renderReviewedInputApprovalPage(root: HTMLElement): void {
  renderReviewedInputApproval(root, buildReviewedInputApproval());
}

export function buildReviewedInputApprovalMarkup(state: ReviewedInputApprovalState): string {
  return `
    <section class="page-shell reviewed-input-approval-page" id="reviewed-input-approval" aria-label="PBGC reviewed input approval">
      <header class="approval-header">
        <div class="approval-title">
          <h1>PBGC Reviewed Input Approval</h1>
          <p class="subtle">Normalize mocked reviewed records and apply display-only approval decisions</p>
          <a class="primary-link" href="#case-dashboard">Return to case dashboard</a>
        </div>
        <div class="approval-boundary-notice" aria-label="Reviewed input approval boundary">
          <strong>Reviewed-input gate</strong>
          <span>${escapeHtml(state.boundary_notice)}</span>
          <span class="no-real-person-data-notice">${escapeHtml(state.no_real_person_data_notice)}</span>
        </div>
      </header>
      <main class="approval-grid">
        <section class="approval-input-panel" aria-label="Mocked reviewed JSON">
          <h2>Mocked reviewed JSON</h2>
          <form class="approval-form" data-reviewed-input-approval-form>
            <label class="approval-textarea-field">
              <span>Reviewed JSON for approval</span>
              <textarea name="reviewed_json_text" spellcheck="false">${escapeHtml(state.reviewed_json_text)}</textarea>
            </label>
            <button type="submit">Review local records</button>
          </form>
          <div class="approval-packet-preview" data-approved-packet-preview>
            <strong>Approved packet preview</strong>
            <span>Approved records: ${escapeHtml(state.approved_packet_preview.approved_count)}</span>
            <span>Blocked records: ${escapeHtml(state.approved_packet_preview.blocked_count)}</span>
            <span>Approved fields: ${escapeHtml(state.approved_packet_preview.approved_fields.join(", ") || "None")}</span>
            <span>Basis: ${escapeHtml(state.approved_packet_preview.basis)}</span>
          </div>
        </section>
        <section class="approval-table-panel" aria-label="Normalized reviewed records">
          <h2>Normalized reviewed records</h2>
          <table class="approval-table" data-reviewed-input-approval-table>
            <thead>
              <tr>
                <th>Record</th>
                <th>Source layer</th>
                <th>Decision</th>
                <th>Eligibility</th>
                <th>Trace</th>
              </tr>
            </thead>
            <tbody>
              ${state.rows.length === 0 ? `<tr><td colspan="5">No reviewed records available for approval.</td></tr>` : state.rows.map(buildRowMarkup).join("")}
            </tbody>
          </table>
          <div class="approval-status-summary status-${escapeHtml(state.queue_status)}">
            <strong>Queue status: ${escapeHtml(state.queue_status)}</strong>
            <span>Warnings: ${escapeHtml(state.warnings.map((warning) => warning.code).join(" | ") || "None")}</span>
            <span>Errors: ${escapeHtml(state.errors.map((error) => error.code).join(" | ") || "None")}</span>
          </div>
        </section>
      </main>
    </section>
  `;
}

function renderReviewedInputApproval(root: HTMLElement, state: ReviewedInputApprovalState): void {
  root.innerHTML = buildReviewedInputApprovalMarkup(state);
  const form = root.querySelector<HTMLFormElement>("[data-reviewed-input-approval-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    renderReviewedInputApproval(root, buildReviewedInputApproval({ reviewed_json_text: String(formData.get("reviewed_json_text") ?? "") }));
  });
}

function buildRowMarkup(row: NormalizedReviewRow): string {
  return `
    <tr class="approval-row decision-${escapeHtml(row.decision)}">
      <td>
        <strong>${escapeHtml(row.reviewed_record_id)}</strong>
        <span class="comparison-source">${escapeHtml(row.case_id)}</span>
      </td>
      <td>${escapeHtml(row.source_layer)}</td>
      <td>
        <span>${escapeHtml(row.decision_label)}</span>
        <span class="comparison-source">Warnings: ${escapeHtml(row.warnings.map((warning) => warning.code).join(" | ") || "None")}</span>
        <span class="comparison-source">Errors: ${escapeHtml(row.errors.map((error) => error.code).join(" | ") || "None")}</span>
      </td>
      <td>${escapeHtml(row.status_label)}</td>
      <td>
        <span class="comparison-source">${escapeHtml(row.trace_basis.producing_module)} ${escapeHtml(row.trace_basis.rule_version)}</span>
        <span class="comparison-source">${escapeHtml(row.trace_basis.import_source)} · ${escapeHtml(row.trace_basis.source_layer)}</span>
      </td>
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

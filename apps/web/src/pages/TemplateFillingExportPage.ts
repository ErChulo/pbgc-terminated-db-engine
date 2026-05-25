import { buildTemplateFillingExport, type TemplateFillingExportState } from "../app/templateFillingExportSlice";

export function renderTemplateFillingExportPage(root: HTMLElement): void {
  renderTemplateFillingExport(root, buildTemplateFillingExport());
}

export function buildTemplateFillingExportMarkup(state: TemplateFillingExportState): string {
  const downloadHref = state.export_control.enabled ? `data:text/csv;charset=utf-8,${encodeURIComponent(state.artifact.content)}` : "#template-filling-export";
  return `
    <section class="page-shell template-filling-export-page" id="template-filling-export" aria-label="PBGC template filling export">
      <header class="template-filling-header">
        <div class="template-filling-title">
          <h1>PBGC Template Filling / Export</h1>
          <p class="subtle">Browser-local filled artifact from approved mocked reviewed records</p>
          <a class="primary-link" href="#case-dashboard">Return to case dashboard</a>
        </div>
        <div class="template-filling-boundary-notice" aria-label="Template filling boundary">
          <strong>Template filling boundary</strong>
          <span>${escapeHtml(state.boundary_notice)}</span>
          <span class="no-real-person-data-notice">${escapeHtml(state.no_real_person_data_notice)}</span>
        </div>
      </header>
      <main class="template-filling-grid">
        <section class="filled-artifact-panel" aria-label="Filled artifact preview" data-filled-artifact-preview>
          <h2>Filled artifact preview</h2>
          <dl class="filled-artifact-metadata">
            <div><dt>Artifact</dt><dd>${escapeHtml(state.artifact.file_name)}</dd></div>
            <div><dt>Template</dt><dd>${escapeHtml(state.artifact.template_id)}</dd></div>
            <div><dt>Basis</dt><dd>${escapeHtml(state.artifact.template_basis)}</dd></div>
            <div><dt>Status</dt><dd>${escapeHtml(state.artifact.export_status)}</dd></div>
            <div><dt>Source records</dt><dd>${escapeHtml(state.artifact.source_record_ids.join(", ") || "None")}</dd></div>
            <div><dt>Trace</dt><dd>${escapeHtml(state.artifact.trace_basis.producing_module)} ${escapeHtml(state.artifact.trace_basis.rule_version)}</dd></div>
          </dl>
          <pre class="filled-artifact-content">${escapeHtml(state.artifact.content || "Export blocked until at least one mocked reviewed record is approved.")}</pre>
        </section>
        <section class="export-control-panel" aria-label="Browser-local export controls">
          <h2>Export readiness</h2>
          <div class="export-readiness status-${escapeHtml(state.artifact.export_status)}">
            <strong>${state.export_control.enabled ? "Ready for browser-local export" : "Export blocked"}</strong>
            <span>Warnings: ${escapeHtml(state.artifact.warnings.map((warning) => warning.code).join(" | ") || "None")}</span>
            <span>Errors: ${escapeHtml(state.artifact.errors.map((error) => error.code).join(" | ") || "None")}</span>
          </div>
          <div class="export-actions">
            <button type="button" data-copy-filled-artifact ${state.export_control.enabled ? "" : "disabled"}>${escapeHtml(state.export_control.copy_label)}</button>
            <a class="primary-link ${state.export_control.enabled ? "" : "is-disabled"}" href="${escapeHtml(downloadHref)}" download="${escapeHtml(state.export_control.download_name)}">${escapeHtml(state.export_control.download_label)}</a>
          </div>
        </section>
      </main>
    </section>
  `;
}

function renderTemplateFillingExport(root: HTMLElement, state: TemplateFillingExportState): void {
  root.innerHTML = buildTemplateFillingExportMarkup(state);
  const copyButton = root.querySelector<HTMLButtonElement>("[data-copy-filled-artifact]");
  copyButton?.addEventListener("click", () => {
    void navigator.clipboard?.writeText(state.artifact.content);
  });
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

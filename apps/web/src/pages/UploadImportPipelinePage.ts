import { buildUploadImportPipeline, type UploadImportPipelineState, type UploadImportPreview } from "../app/uploadImportPipelineSlice";

export function renderUploadImportPipelinePage(root: HTMLElement): void {
  renderUploadImportPipeline(root, buildUploadImportPipeline());
}

export function buildUploadImportPipelineMarkup(state: UploadImportPipelineState): string {
  return `
    <section class="page-shell upload-import-page" id="upload-import" aria-label="PBGC upload import">
      <header class="upload-import-header">
        <div class="upload-import-title">
          <h1>PBGC Upload / Import</h1>
          <p class="subtle">Browser-local reviewed JSON and external-LLM artifact preview</p>
          <a class="primary-link" href="#case-dashboard">Return to case dashboard</a>
        </div>
        <div class="upload-boundary-notice" aria-label="Upload import boundary">
          <strong>Import boundary</strong>
          <span>${escapeHtml(state.boundary_notice)}</span>
          <span class="no-real-person-data-notice">${escapeHtml(state.no_real_person_data_notice)}</span>
        </div>
      </header>
      <main class="upload-import-grid">
        <section class="upload-source-panel" aria-label="Import sources">
          <h2>Import sources</h2>
          <ol class="upload-source-list">
            ${state.sources.map((source) => `
              <li class="upload-source-item">
                <strong>${escapeHtml(source.label)}</strong>
                <span>${escapeHtml(source.boundary_basis)}</span>
                <span class="comparison-source">Stage: ${escapeHtml(source.stage_key)}</span>
              </li>
            `).join("")}
          </ol>
        </section>
        <section class="upload-input-panel" aria-label="Local import preview">
          <h2>Local import preview</h2>
          <form class="upload-import-form" data-upload-import-form>
            <label class="upload-textarea-field" data-upload-reviewed-json>
              <span>Reviewed structured JSON</span>
              <textarea name="reviewed_json_text" spellcheck="false">${escapeHtml(state.reviewed_json_text)}</textarea>
            </label>
            ${buildPreviewMarkup("Reviewed JSON preview", state.reviewed_json_preview)}
            <label class="upload-textarea-field" data-upload-external-artifact>
              <span>External LLM artifact text</span>
              <textarea name="external_artifact_text" spellcheck="false">${escapeHtml(state.external_artifact_text)}</textarea>
            </label>
            ${buildPreviewMarkup("External artifact preview", state.external_artifact_preview)}
            <button class="upload-validate-button" type="submit">Validate local import</button>
          </form>
        </section>
      </main>
    </section>
  `;
}

function renderUploadImportPipeline(root: HTMLElement, state: UploadImportPipelineState): void {
  root.innerHTML = buildUploadImportPipelineMarkup(state);
  const form = root.querySelector<HTMLFormElement>("[data-upload-import-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    renderUploadImportPipeline(
      root,
      buildUploadImportPipeline({
        reviewed_json_text: String(formData.get("reviewed_json_text") ?? ""),
        external_artifact_text: String(formData.get("external_artifact_text") ?? ""),
      }),
    );
  });
}

function buildPreviewMarkup(title: string, preview: UploadImportPreview): string {
  return `
    <div class="upload-preview preview-${escapeHtml(preview.status)}" data-upload-import-preview>
      <strong>${escapeHtml(title)}: ${escapeHtml(preview.status_label)}</strong>
      <span>Input size: ${escapeHtml(preview.input_size)} characters</span>
      <span>Accepted fields: ${escapeHtml(preview.accepted_fields.join(", ") || "None")}</span>
      <span>Warnings: ${escapeHtml(preview.warnings.map((warning) => `${warning.code}:${warning.severity}`).join(" | ") || "None")}</span>
      <span>Errors: ${escapeHtml(preview.errors.map((error) => `${error.code}:${error.severity}`).join(" | ") || "None")}</span>
      <span>Trace: ${escapeHtml(preview.trace_basis.producing_module)} ${escapeHtml(preview.trace_basis.rule_version)} ${escapeHtml(preview.trace_basis.source_kind)}</span>
    </div>
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

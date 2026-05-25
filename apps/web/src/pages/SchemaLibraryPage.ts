import { buildSchemaLibrary, type SchemaLibraryState } from "../app/schemaLibrarySlice";

export function renderSchemaLibraryPage(root: HTMLElement): void {
  renderSchemaLibrary(root, buildSchemaLibrary());
}

export function buildSchemaLibraryMarkup(state: SchemaLibraryState): string {
  return `
    <section class="page-shell schema-library-page" id="schema-library" aria-label="Schema library">
      <header class="schema-library-header">
        <div class="schema-library-title">
          <h1>PBGC Schema Library</h1>
          <p class="subtle">Reviewed-input schema browsing and Local validation preview</p>
          <a class="primary-link" href="#case-dashboard">Return to case dashboard</a>
        </div>
        <div class="schema-boundary-notice" aria-label="Schema library boundary">
          <strong>Local validation preview</strong>
          <span>${escapeHtml(state.boundary_notice)}</span>
        </div>
      </header>
      <main class="schema-library-grid">
        <section class="schema-list-panel" aria-label="Schema entries">
          <h2>Schema entries</h2>
          <ol class="schema-entry-list">
            ${state.schemas.map((schema) => `
              <li class="schema-entry-item ${schema.schema_id === state.selected_schema.schema_id ? "is-selected" : ""}">
                <a href="#schema-library" data-schema-id="${escapeHtml(schema.schema_id)}">${escapeHtml(schema.title)}</a>
                <span>${escapeHtml(schema.repository_path)}</span>
              </li>
            `).join("")}
          </ol>
        </section>
        <section class="schema-detail-panel" aria-label="Selected schema">
          <h2>${escapeHtml(state.selected_schema.title)}</h2>
          <p class="subtle">Basis: ${escapeHtml(state.selected_schema.basis)}</p>
          <dl class="schema-detail-list">
            <div>
              <dt>Repository path</dt>
              <dd>${escapeHtml(state.selected_schema.repository_path)}</dd>
            </div>
            <div>
              <dt>Stage</dt>
              <dd>${escapeHtml(state.selected_schema.stage_key)}</dd>
            </div>
            <div>
              <dt>Required fields</dt>
              <dd>${escapeHtml(state.selected_schema.required_fields.join(", "))}</dd>
            </div>
            <div>
              <dt>Optional fields</dt>
              <dd>${escapeHtml(state.selected_schema.optional_fields.join(", "))}</dd>
            </div>
          </dl>
          <label class="schema-json-preview">
            <span>Reviewed structured JSON preview</span>
            <textarea data-schema-json-preview aria-label="Reviewed structured JSON preview"></textarea>
          </label>
          <button type="button" class="secondary schema-validate-button" data-schema-validate-button>Preview validation</button>
          ${renderValidationPreview(state)}
        </section>
      </main>
    </section>
  `;
}

function renderSchemaLibrary(root: HTMLElement, state: SchemaLibraryState): void {
  root.innerHTML = buildSchemaLibraryMarkup(state);
  root.querySelectorAll<HTMLAnchorElement>("[data-schema-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      renderSchemaLibrary(root, buildSchemaLibrary({ selected_schema_id: link.dataset.schemaId }));
    });
  });
  const jsonPreview = root.querySelector<HTMLTextAreaElement>("[data-schema-json-preview]");
  const validateButton = root.querySelector<HTMLButtonElement>("[data-schema-validate-button]");
  validateButton?.addEventListener("click", () => {
    renderSchemaLibrary(root, buildSchemaLibrary({ selected_schema_id: state.selected_schema.schema_id, json_text: jsonPreview?.value ?? "" }));
  });
}

function renderValidationPreview(state: SchemaLibraryState): string {
  const validation = state.validation;
  return `
    <div class="schema-validation-preview validation-${escapeHtml(validation.status)}" data-schema-validation-preview>
      <strong>${escapeHtml(formatValidationStatus(validation.status))}</strong>
      <span>Input size: ${validation.input_size}</span>
      <span>Basis: ${escapeHtml(validation.basis)}</span>
      <span>Checked fields: ${escapeHtml(validation.checked_fields.join(", ") || "None")}</span>
      <span>Warnings: ${escapeHtml(validation.warnings.join(" | ") || "None")}</span>
      <span>Errors: ${escapeHtml(validation.errors.join(" | ") || "None")}</span>
    </div>
  `;
}

function formatValidationStatus(status: SchemaLibraryState["validation"]["status"]): string {
  if (status === "accepted") return "Accepted";
  if (status === "invalid") return "Invalid";
  if (status === "malformed") return "Malformed";
  if (status === "oversized") return "Oversized";
  return "Empty";
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

import { buildPbgcTemplateLibrary, type PbgcTemplateLibraryState } from "../app/pbgcTemplateLibrarySlice";

export function renderPbgcTemplateLibraryPage(root: HTMLElement): void {
  renderPbgcTemplateLibrary(root, buildPbgcTemplateLibrary());
}

export function buildPbgcTemplateLibraryMarkup(state: PbgcTemplateLibraryState): string {
  return `
    <section class="page-shell template-library-page" id="template-library" aria-label="PBGC template library">
      <header class="template-library-header">
        <div class="template-library-title">
          <h1>PBGC Template Library</h1>
          <p class="subtle">Committed official PBGC templates and reviewed-input import templates</p>
          <a class="primary-link" href="#case-dashboard">Return to case dashboard</a>
        </div>
        <div class="template-boundary-notice" aria-label="Template library boundary">
          <strong>Template readiness</strong>
          <span>${escapeHtml(state.boundary_notice)}</span>
        </div>
      </header>
      <main class="template-library-grid">
        <section class="template-list-panel" aria-label="Template entries">
          <h2>Template entries</h2>
          <ol class="template-entry-list">
            ${state.templates.map((template) => `
              <li class="template-entry-item ${template.template_id === state.selected_template.template_id ? "is-selected" : ""}">
                <a href="#template-library" data-template-id="${escapeHtml(template.template_id)}">${escapeHtml(template.title)}</a>
                <span>${escapeHtml(formatCategory(template.category))} · ${escapeHtml(template.format)}</span>
              </li>
            `).join("")}
          </ol>
        </section>
        <section class="template-detail-panel" aria-label="Selected template">
          <h2>${escapeHtml(state.selected_template.title)}</h2>
          <p class="subtle">Basis: ${escapeHtml(state.selected_template.basis)}</p>
          <dl class="template-detail-list">
            <div>
              <dt>Repository path</dt>
              <dd>${escapeHtml(state.selected_template.repository_path)}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>${escapeHtml(formatCategory(state.selected_template.category))}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>${escapeHtml(state.selected_template.format)}</dd>
            </div>
            <div>
              <dt>Stage</dt>
              <dd>${escapeHtml(state.selected_template.stage_key)}</dd>
            </div>
          </dl>
          <div class="template-readiness-preview readiness-${escapeHtml(state.readiness.status)}" data-template-readiness-preview>
            <strong>${escapeHtml(state.readiness.status_label)}</strong>
            <span>Dependencies: ${escapeHtml(state.readiness.dependencies.join(", "))}</span>
            <span>Warnings: ${escapeHtml(state.readiness.warnings.join(" | ") || "None")}</span>
            <span>Basis: ${escapeHtml(state.readiness.basis)}</span>
          </div>
          <div class="template-placeholder-status" aria-label="Local-only template controls">
            <strong>Local-only placeholder</strong>
            <span>Upload/import, template filling, and artifact export are planned future stages and do not run here.</span>
          </div>
        </section>
      </main>
    </section>
  `;
}

function renderPbgcTemplateLibrary(root: HTMLElement, state: PbgcTemplateLibraryState): void {
  root.innerHTML = buildPbgcTemplateLibraryMarkup(state);
  root.querySelectorAll<HTMLAnchorElement>("[data-template-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      renderPbgcTemplateLibrary(root, buildPbgcTemplateLibrary({ selected_template_id: link.dataset.templateId }));
    });
  });
}

function formatCategory(category: PbgcTemplateLibraryState["selected_template"]["category"]): string {
  return category === "official_pbgc" ? "Official PBGC template" : "Reviewed-input import template";
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

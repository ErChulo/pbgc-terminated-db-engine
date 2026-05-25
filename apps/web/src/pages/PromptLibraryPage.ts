import { buildPromptLibrary, type PromptLibraryState } from "../app/promptLibrarySlice";

export function renderPromptLibraryPage(root: HTMLElement): void {
  renderPromptLibrary(root, buildPromptLibrary());
}

export function buildPromptLibraryMarkup(state: PromptLibraryState): string {
  return `
    <section class="page-shell prompt-library-page" id="prompt-library" aria-label="Prompt library">
      <header class="prompt-library-header">
        <div class="prompt-library-title">
          <h1>PBGC Prompt Library</h1>
          <p class="subtle">Stage-specific prompts for external LLM casework preparation</p>
          <a class="primary-link" href="#case-dashboard">Return to case dashboard</a>
        </div>
        <div class="prompt-boundary-notice" aria-label="External LLM boundary">
          <strong>External LLM boundary</strong>
          <span>${escapeHtml(state.boundary_notice)}</span>
        </div>
      </header>
      <main class="prompt-library-grid">
        <section class="prompt-list-panel" aria-label="Prompt stages">
          <h2>Prompt stages</h2>
          <ol class="prompt-stage-list">
            ${state.prompts.map((prompt) => `
              <li class="prompt-stage-item ${prompt.prompt_id === state.selected_prompt.prompt_id ? "is-selected" : ""}">
                <a href="#prompt-library" data-prompt-id="${escapeHtml(prompt.prompt_id)}">${escapeHtml(prompt.title)}</a>
                <span>${escapeHtml(prompt.stage_key)}</span>
              </li>
            `).join("")}
          </ol>
        </section>
        <section class="prompt-detail-panel" aria-label="Selected prompt">
          <h2>${escapeHtml(state.selected_prompt.title)}</h2>
          <p class="subtle">Basis: ${escapeHtml(state.selected_prompt.basis)}</p>
          <div class="prompt-baseline">
            <h3>Approved baseline</h3>
            <pre>${escapeHtml(state.selected_prompt.body)}</pre>
          </div>
          <label class="prompt-draft-editor">
            <span>Browser-local draft</span>
            <textarea data-prompt-draft-editor>${escapeHtml(state.draft.draft_text)}</textarea>
          </label>
          <div class="prompt-draft-status status-${escapeHtml(state.draft.status)}" data-prompt-draft-status>
            <strong>${escapeHtml(formatDraftStatus(state.draft.status))}</strong>
            <span>${escapeHtml(state.draft.validation_message)}</span>
            <span>${escapeHtml(state.draft.basis)}</span>
          </div>
          <label class="prompt-import-editor">
            <span>Local prompt text or JSON import</span>
            <textarea data-prompt-import-payload aria-label="Local prompt text or JSON import"></textarea>
          </label>
          <button type="button" class="secondary prompt-import-button" data-prompt-import-button>Validate local import</button>
        </section>
      </main>
    </section>
  `;
}

function renderPromptLibrary(root: HTMLElement, state: PromptLibraryState): void {
  root.innerHTML = buildPromptLibraryMarkup(state);
  const promptLinks = root.querySelectorAll<HTMLAnchorElement>("[data-prompt-id]");
  promptLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      renderPromptLibrary(root, buildPromptLibrary({ selected_prompt_id: link.dataset.promptId }));
    });
  });
  const draftEditor = root.querySelector<HTMLTextAreaElement>("[data-prompt-draft-editor]");
  draftEditor?.addEventListener("input", () => {
    renderPromptLibrary(root, buildPromptLibrary({ selected_prompt_id: state.selected_prompt.prompt_id, draft_text: draftEditor.value }));
  });
  const importEditor = root.querySelector<HTMLTextAreaElement>("[data-prompt-import-payload]");
  const importButton = root.querySelector<HTMLButtonElement>("[data-prompt-import-button]");
  importButton?.addEventListener("click", () => {
    renderPromptLibrary(root, buildPromptLibrary({ selected_prompt_id: state.selected_prompt.prompt_id, import_payload: importEditor?.value ?? "" }));
  });
}

function formatDraftStatus(status: PromptLibraryState["draft"]["status"]): string {
  if (status === "edited") return "Browser-local draft";
  if (status === "imported") return "Browser-local draft imported";
  if (status === "invalid") return "Prompt import invalid";
  return "Approved baseline";
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

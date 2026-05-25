import { buildSampleMockPackManagement, type SampleMockPack, type SampleMockPackManagementState } from "../app/sampleMockPackManagementSlice";

export function renderSampleMockPackManagementPage(root: HTMLElement): void {
  renderSampleMockPackManagement(root, buildSampleMockPackManagement());
}

export function buildSampleMockPackManagementMarkup(state: SampleMockPackManagementState): string {
  return `
    <section class="page-shell sample-pack-page" id="sample-mock-packs" aria-label="PBGC sample mock packs">
      <header class="sample-pack-header">
        <div class="sample-pack-title">
          <h1>PBGC Sample / Mock Packs</h1>
          <p class="subtle">Committed approved samples and mocked alpha-path pack metadata</p>
          <a class="primary-link" href="#case-dashboard">Return to case dashboard</a>
        </div>
        <div class="sample-pack-boundary-notice" aria-label="Sample mock pack boundary">
          <strong>Pack boundary</strong>
          <span>${escapeHtml(state.boundary_notice)}</span>
          <span class="no-real-person-data-notice">${escapeHtml(state.selected_pack.mocked_only_notice)}</span>
        </div>
      </header>
      <main class="sample-pack-grid">
        <section class="sample-pack-list-panel" aria-label="Sample and mock packs">
          <h2>Pack list</h2>
          <ol class="sample-pack-list" data-sample-mock-pack-list>
            ${state.packs.map((pack) => `
              <li class="sample-pack-item ${pack.pack_id === state.selected_pack.pack_id ? "is-selected" : ""}">
                <a href="#sample-mock-packs" data-sample-pack-id="${escapeHtml(pack.pack_id)}">${escapeHtml(pack.label)}</a>
                <span>${escapeHtml(pack.kind)} · ${escapeHtml(pack.readiness)}</span>
              </li>
            `).join("")}
          </ol>
        </section>
        <section class="sample-pack-detail-panel" aria-label="Selected pack">
          <h2>${escapeHtml(state.selected_pack.label)}</h2>
          ${buildPackDetails(state.selected_pack)}
        </section>
      </main>
    </section>
  `;
}

function renderSampleMockPackManagement(root: HTMLElement, state: SampleMockPackManagementState): void {
  root.innerHTML = buildSampleMockPackManagementMarkup(state);
  root.querySelectorAll<HTMLAnchorElement>("[data-sample-pack-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      renderSampleMockPackManagement(root, buildSampleMockPackManagement({ selected_pack_id: link.dataset.samplePackId }));
    });
  });
}

function buildPackDetails(pack: SampleMockPack): string {
  return `
    <dl class="sample-pack-detail-list">
      <div><dt>Pack id</dt><dd>${escapeHtml(pack.pack_id)}</dd></div>
      <div><dt>Kind</dt><dd>${escapeHtml(pack.kind)}</dd></div>
      <div><dt>Readiness</dt><dd>${escapeHtml(pack.readiness)}</dd></div>
      <div><dt>Artifact basis</dt><dd>${escapeHtml(pack.artifact_basis)}</dd></div>
      <div><dt>Included stages</dt><dd>${escapeHtml(pack.included_stages.join(", "))}</dd></div>
      <div><dt>Trace</dt><dd>${escapeHtml(pack.trace_basis.producing_module)} ${escapeHtml(pack.trace_basis.rule_version)}</dd></div>
    </dl>
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

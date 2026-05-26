import { buildSampleMockPackManagement, type SampleMockPack, type SampleMockPackManagementState, type SampleMockPackStageCoverage, type SampleMockPackTemplateRef, type SampleMockPackApprovedSampleRef } from "../app/sampleMockPackManagementSlice";

export function renderSampleMockPackManagementPage(root: HTMLElement): void {
  renderSampleMockPackManagement(root, buildSampleMockPackManagement());
}

export function buildSampleMockPackManagementMarkup(state: SampleMockPackManagementState): string {
  return `
    <section class="page-shell sample-pack-page" id="sample-mock-packs" aria-label="PBGC sample mock packs">
      <header class="sample-pack-header">
        <div class="sample-pack-title">
          <h1>PBGC Sample / Mock Packs</h1>
          <p class="subtle">Committed approved samples and mocked alpha-path pack metadata with template mappings</p>
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
          <h2>Pack list <span class="pack-count">${state.packs.length} packs</span></h2>
          <ol class="sample-pack-list" data-sample-mock-pack-list>
            ${state.packs.map((pack) => `
              <li class="sample-pack-item ${pack.pack_id === state.selected_pack.pack_id ? "is-selected" : ""}">
                <a href="#sample-mock-packs" data-sample-pack-id="${escapeHtml(pack.pack_id)}">${escapeHtml(pack.label)}</a>
                <span>${escapeHtml(pack.kind.replace("_", " "))} · ${escapeHtml(pack.readiness)} · ${pack.included_stages.length} stages</span>
              </li>
            `).join("")}
          </ol>
        </section>
        <section class="sample-pack-detail-panel" aria-label="Selected pack">
          <h2>${escapeHtml(state.selected_pack.label)}</h2>
          <p class="pack-description subtle">${escapeHtml(state.selected_pack.description)}</p>
          ${buildPackDetails(state.selected_pack)}
          ${buildStageCoverage(state.selected_pack.stage_coverage)}
          ${buildApprovedSampleRefs(state.selected_pack.approved_sample_refs)}
          ${buildTemplateRefs(state.selected_pack.template_refs)}
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
    <dl class="sample-pack-detail-list pack-meta-details">
      <div><dt>Pack id</dt><dd>${escapeHtml(pack.pack_id)}</dd></div>
      <div><dt>Kind</dt><dd>${escapeHtml(pack.kind.replace("_", " "))}</dd></div>
      <div><dt>Readiness</dt><dd><span class="readiness-badge readiness-${escapeHtml(pack.readiness)}">${escapeHtml(pack.readiness)}</span></dd></div>
      <div><dt>Artifact basis</dt><dd>${escapeHtml(pack.artifact_basis)}</dd></div>
      <div><dt>Included stages (${pack.included_stages.length})</dt><dd>${escapeHtml(pack.included_stages.join(", "))}</dd></div>
      <div><dt>Trace</dt><dd>${escapeHtml(pack.trace_basis.producing_module)} v${escapeHtml(pack.trace_basis.rule_version)}</dd></div>
    </dl>
  `;
}

function buildStageCoverage(coverage: SampleMockPackStageCoverage[]): string {
  if (!coverage || coverage.length === 0) return "";
  return `
    <div class="pack-section pack-stage-coverage">
      <h3>Stage Coverage</h3>
      <div class="stage-coverage-grid">
        ${coverage.map((stage) => `
          <div class="stage-coverage-item coverage-${escapeHtml(stage.coverage)}">
            <strong class="stage-coverage-label">${escapeHtml(stage.label)}</strong>
            <span class="stage-coverage-badge">${escapeHtml(stage.coverage)}</span>
            <span class="stage-coverage-note">${escapeHtml(stage.note)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function buildApprovedSampleRefs(refs: SampleMockPackApprovedSampleRef[]): string {
  if (!refs || refs.length === 0) return "";
  return `
    <div class="pack-section pack-sample-refs">
      <h3>Approved Sample References</h3>
      <ul class="sample-ref-list">
        ${refs.map((ref) => `
          <li class="sample-ref-item">
            <strong>${escapeHtml(ref.file_name)}</strong>
            <span>${escapeHtml(ref.label)}</span>
            <span class="sample-ref-path">${escapeHtml(ref.repository_path)}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

function buildTemplateRefs(refs: SampleMockPackTemplateRef[]): string {
  if (!refs || refs.length === 0) return "";
  return `
    <div class="pack-section pack-template-mappings">
      <h3>Template Mappings <a class="template-library-link" href="#template-library">Open template library</a></h3>
      <table class="template-ref-table">
        <thead>
          <tr>
            <th>Template</th>
            <th>Stage</th>
            <th>Relevance</th>
          </tr>
        </thead>
        <tbody>
          ${refs.map((ref) => `
            <tr class="relevance-${escapeHtml(ref.relevance)}">
              <td><a href="#template-library" data-template-id="${escapeHtml(ref.template_id)}">${escapeHtml(ref.title)}</a></td>
              <td>${escapeHtml(formatStageKeyLabel(ref.stage_key))}</td>
              <td><span class="relevance-badge relevance-${escapeHtml(ref.relevance)}">${escapeHtml(ref.relevance)}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function formatStageKeyLabel(stageKey: string): string {
  return stageKey
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

# Feature Specification: Prompt Library By Stage

**Feature Branch**: `031-prompt-library-by-stage`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build a prompt-library-by-stage increment for the PBGC terminated defined-benefit engine. Scope this slice to the existing browser app only, using approved sample artifacts and mocked or simulated case/population context only. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or output adapters. The app must host and manage stage-specific scraping prompts for work performed outside the app by an external LLM chosen by the user. No OCR in the app and no scraping execution in the app. Focus on a prompt library surface reachable from the case dashboard that lets the user view stage-specific prompts, edit a browser-local draft prompt, and import/upload prompt text or JSON locally without server calls, while preserving browser-only deterministic behavior, existing workbench behavior, and responsive UI behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Stage Prompts (Priority: P1)

An analyst opens the case dashboard and navigates to a prompt library where stage-specific external-LLM prompts are visible with clear labels and boundaries.

**Why this priority**: The first usable alpha needs prompt access before schema/template/upload/review workflows can be productive.

**Independent Test**: Render the prompt library and confirm it shows deterministic stage prompt entries, selected prompt content, external-LLM/no-OCR/no-scraping notices, and a return path to the dashboard.

**Acceptance Scenarios**:

1. **Given** the dashboard is visible, **When** the analyst opens the prompt library stage, **Then** the app shows stage prompt entries and the selected prompt content.
2. **Given** the prompt library is visible, **When** the analyst reads a prompt, **Then** the app clearly states that scraping is performed outside the app by a user-selected external LLM and no OCR/scraping runs in the app.

---

### User Story 2 - Edit Draft Prompt Locally (Priority: P2)

An analyst can edit a browser-local draft of a stage prompt without changing the committed approved prompt baseline or deterministic engine behavior.

**Why this priority**: Prompt customization is needed for real casework preparation, but drafts must remain clearly separated from approved baseline prompts.

**Independent Test**: Build/render an edited prompt draft and confirm the baseline prompt, draft text, draft status, and local-only warning are deterministic and display-only.

**Acceptance Scenarios**:

1. **Given** an approved prompt is selected, **When** the analyst edits a draft, **Then** the draft is labeled browser-local and the approved baseline remains visible.
2. **Given** an edited draft exists, **When** the prompt library is rendered repeatedly with the same draft input, **Then** the visible prompt state is stable.

---

### User Story 3 - Import Prompt Text Or JSON Locally (Priority: P3)

An analyst can import prompt text or a simple prompt JSON payload locally for a selected stage without server calls or execution.

**Why this priority**: This creates the pattern for future library upload surfaces while keeping imported content inert and reviewable.

**Independent Test**: Build/render an imported prompt payload and confirm the selected stage, imported draft text, validation status, and display-only warnings are stable and no network/server/OCR/scraping path exists.

**Acceptance Scenarios**:

1. **Given** a supported prompt text or JSON payload, **When** the analyst imports it locally, **Then** the prompt library shows the imported draft for the selected stage.
2. **Given** an unsupported prompt payload, **When** the analyst imports it locally, **Then** the app shows a display-only validation error and preserves the existing prompt list.

### Edge Cases

- Unsupported or oversized prompt text must fail fast with a display-only validation error.
- Prompt imports must not execute scraping, OCR, external LLM calls, server calls, or template filling.
- Prompt drafts must not contain real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- Opening or editing the prompt library must not change existing workbench outputs, filters, theme, trace expansion, or session state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a prompt library surface reachable from the case dashboard.
- **FR-002**: System MUST show deterministic stage-specific prompt entries for alpha stages and one selected prompt body.
- **FR-003**: System MUST clearly label prompts as instructions for external LLM scraping performed outside the app.
- **FR-004**: System MUST provide browser-local draft editing for a selected prompt without changing approved prompt baselines.
- **FR-005**: System MUST accept local prompt text or JSON import for a selected stage and show display-only validation status.
- **FR-006**: System MUST reject unsupported or oversized prompt payloads before delayed work begins.
- **FR-007**: System MUST preserve existing dashboard and reconciliation workbench behavior.
- **FR-008**: System MUST avoid server calls, OCR, in-app scraping execution, raw source reads, sql.js writes, output-adapter writes, and real natural-person data.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Existing approved sample metadata, existing mocked dashboard/workbench context, committed default prompt entries, and browser-local prompt draft/import text.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, real person-level data, hosted prompt libraries, network-loaded prompts, in-app scraping results, and unreviewed extraction output.
- **Source Layer Reads**: Display-only prompt definitions, approved local sample metadata, and mocked UI context.
- **Source Layer Writes**: Browser-local display draft/import state and committed static bundle output. No sql.js writes, source-layer writes, engine output writes, or output-adapter writes.
- **Traceability Required**: Each prompt entry must identify its stage, baseline basis, and draft/import status; no actuarial output trace is introduced.

### Key Entities *(include if feature involves data)*

- **Stage Prompt Entry**: Stable prompt id, stage key, title, prompt body, basis, ordering key, and boundary notice.
- **Prompt Draft State**: Selected prompt id, draft text, status, validation message, and local-only basis.
- **Prompt Import Result**: Supported/unsupported status, parsed stage key, imported text, validation message, and display-only warning.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From the dashboard, an analyst can identify and open the prompt library within 10 seconds at desktop `1440x900`.
- **SC-002**: At mobile `390x844`, the analyst can identify the selected prompt and edit/import controls within 10 seconds.
- **SC-003**: Prompt entries and selected prompt content render in stable deterministic order across repeated loads.
- **SC-004**: An edited or imported prompt draft is visibly labeled browser-local and does not alter the approved baseline prompt.
- **SC-005**: Prompt library markup and state contain no server/OCR/raw-source/scraping-execution/sql.js/output-adapter write path and no real natural-person sample data.

## Assumptions

- Prompt content in this MVP is committed static guidance, not generated from source documents.
- Browser-local prompt drafts are display state only and are not durable case evidence.
- The MVP may use text-area based local import; file-based import can be added later if needed.
- Prompt library navigation can use the existing hash-based app rendering pattern.

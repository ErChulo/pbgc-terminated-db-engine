# Feature Specification: PBGC Template Library

**Feature Branch**: `033-pbgc-template-library`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build a PBGC template library increment for the PBGC terminated defined-benefit engine. Scope this slice to the existing browser app only, using committed PBGC official templates, existing import templates, approved sample artifacts, and mocked or simulated case/population context only. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or output adapters. Focus on a template library surface reachable from the case dashboard that lets the user browse and select PBGC templates, view template metadata, see stage applicability and local-only upload/import placeholder status, and preview deterministic template readiness without server calls, sql.js writes, OCR, scraping execution, raw-source parsing, or template filling. Preserve existing dashboard, prompt library, schema library, workbench behavior, browser-only deterministic behavior, and responsive UI behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse PBGC Templates (Priority: P1)

An analyst opens the PBGC template library from the case dashboard and browses committed official PBGC templates and import templates with deterministic metadata.

**Why this priority**: The alpha needs template visibility before upload, review, template filling, and export can become usable.

**Independent Test**: Render the template library and confirm committed template entries, selected template metadata, dashboard return path, and no-real-person-data boundary are visible.

**Acceptance Scenarios**:

1. **Given** the case dashboard is visible, **When** the analyst opens PBGC Template Library, **Then** the app shows committed template entries in stable order.
2. **Given** a template entry is selected, **When** the analyst views details, **Then** repository path, stage applicability, format, and template status are visible.

---

### User Story 2 - Preview Template Readiness (Priority: P2)

An analyst can see whether a selected template is ready for browsing only, ready for future filling, or blocked pending future reviewed-input approval.

**Why this priority**: Readiness preview makes it clear what the template library can and cannot do before the template-filling feature exists.

**Independent Test**: Build/render readiness states and confirm display-only status, missing dependencies, and no template filling/export execution.

**Acceptance Scenarios**:

1. **Given** an official PBGC template is selected, **When** readiness is shown, **Then** the app labels it available for browsing and planned for future filling.
2. **Given** an import template is selected, **When** readiness is shown, **Then** the app labels it available for local reviewed-input preparation and not an output artifact.

---

### User Story 3 - Preserve Local Boundaries And Responsiveness (Priority: P3)

An analyst can use the template library on desktop and mobile while all template handling remains browser-local and display-only.

**Why this priority**: Official templates are large and product surfaces must stay responsive while avoiding unsupported filling/export work.

**Independent Test**: Verify desktop/mobile evidence for `1440x900` and `390x844`, deterministic repeated renders, and no server/OCR/raw/scraping/sql.js/output-adapter/template-filling/real-person paths.

**Acceptance Scenarios**:

1. **Given** repeated renders with the same selected template, **When** the library renders, **Then** template metadata and readiness output are stable.
2. **Given** the template library is visible, **When** the analyst views upload/import placeholder status, **Then** it is clearly local-only and does not imply template filling or export has run.

### Edge Cases

- Unknown template selection must fall back to the default committed template.
- Upload/import placeholder controls must remain display-only in this slice.
- Template metadata must not include real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- Opening template library must not change existing dashboard, prompt, schema, or workbench state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a PBGC template library surface reachable from the case dashboard.
- **FR-002**: System MUST show committed template entries with stable ordering, repository path, format, category, stage applicability, and basis.
- **FR-003**: System MUST show selected template metadata and readiness status.
- **FR-004**: System MUST label upload/import and template filling/export capabilities as planned or display-only when not implemented.
- **FR-005**: System MUST distinguish official PBGC output templates from reviewed-input import templates.
- **FR-006**: System MUST preserve existing dashboard, prompt library, schema library, and reconciliation workbench behavior.
- **FR-007**: System MUST avoid server calls, OCR, in-app scraping execution, raw source reads, hosted templates, sql.js writes, output-adapter writes, template filling, artifact export, and real natural-person data.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Committed template metadata, approved sample metadata, mocked UI context, and existing local schema/prompt/dashboard state.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, hosted templates, real person-level data, in-app scraping results, and unreviewed extraction output.
- **Source Layer Reads**: Display-only template metadata from committed repository paths, approved local sample metadata, and mocked UI context.
- **Source Layer Writes**: Browser-local template selection/readiness display state and committed static bundle output. No sql.js writes, source-layer writes, engine output writes, output-adapter writes, template filling, or export writes.
- **Traceability Required**: Each template entry must identify repository basis and stage applicability. No actuarial output trace is introduced.

### Key Entities *(include if feature involves data)*

- **Template Library Entry**: Stable template id, title, category, format, repository path, stage applicability, basis, and ordering key.
- **Template Readiness Preview**: Selected template id, readiness status, dependencies, warnings, and display-only basis.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From the dashboard, an analyst can identify and open PBGC Template Library within 10 seconds at desktop `1440x900`.
- **SC-002**: At mobile `390x844`, the analyst can identify selected template metadata and readiness status within 10 seconds.
- **SC-003**: Template entries and selected template details render in stable deterministic order across repeated loads.
- **SC-004**: Official PBGC templates and reviewed-input import templates are visibly distinguishable.
- **SC-005**: Template library markup and state contain no server/OCR/raw-source/scraping-execution/sql.js/output-adapter/template-filling/export path and no real natural-person sample data.

## Assumptions

- The MVP uses committed template metadata derived from `artifacts/templates/**`.
- Template viewing is metadata-only; binary document rendering is not required for this slice.
- Template filling and artifact export are intentionally deferred to the later template-filling/export feature.
- Browser-local upload/import placeholders are display-only and do not accept files in this MVP.

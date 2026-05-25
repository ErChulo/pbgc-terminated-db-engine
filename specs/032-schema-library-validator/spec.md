# Feature Specification: Schema Library And Validator Surfaces

**Feature Branch**: `032-schema-library-validator`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build a schema-library-and-validator-surfaces increment for the PBGC terminated defined-benefit engine. Scope this slice to the existing browser app only, using committed schemas, approved sample artifacts, and mocked or simulated case/population context only. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or output adapters. Focus on a schema library surface reachable from the case dashboard that lets the user browse and select stage-specific reviewed-input JSON schemas, view schema details, locally paste or import reviewed structured JSON for validation preview, and see deterministic validation results and warnings without server calls, sql.js writes, OCR, scraping execution, or raw-source parsing. Preserve existing dashboard, prompt library, workbench behavior, browser-only deterministic behavior, and responsive UI behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Reviewed-Input Schemas (Priority: P1)

An analyst opens the schema library from the case dashboard and browses committed reviewed-input schema references with clear stage labels and deterministic ordering.

**Why this priority**: The alpha needs schema visibility before imports and reviewed-input approval can be useful.

**Independent Test**: Render the schema library and confirm committed schema entries, selected schema details, dashboard return path, and no-real-person-data boundary are visible.

**Acceptance Scenarios**:

1. **Given** the case dashboard is visible, **When** the analyst opens Schema Library, **Then** the app shows committed reviewed-input schema entries.
2. **Given** a schema entry is selected, **When** the analyst views details, **Then** schema basis, stage, required fields, and validation summary are visible.

---

### User Story 2 - Preview Reviewed JSON Validation (Priority: P2)

An analyst can paste reviewed structured JSON locally and see deterministic validation results without writing persistence rows or running engine calculations.

**Why this priority**: Local validation preview creates the bridge from external-LLM reviewed artifacts to later import and approval features.

**Independent Test**: Build/render valid and invalid validation preview states and confirm structured status, warnings/errors, and stable repeated-run output.

**Acceptance Scenarios**:

1. **Given** reviewed structured JSON with required fields, **When** the analyst validates locally, **Then** accepted validation status and checked field evidence are shown.
2. **Given** malformed or missing-field JSON, **When** validation is previewed, **Then** a deterministic display-only error is shown and existing schema entries remain visible.

---

### User Story 3 - Preserve Local Boundaries And Responsiveness (Priority: P3)

An analyst can use the schema library on desktop and mobile while all validation remains browser-local and inert.

**Why this priority**: Validation surfaces must stay responsive and cannot start unsupported large work or hidden persistence.

**Independent Test**: Verify desktop/mobile display evidence for `1440x900` and `390x844`, fail-fast oversized input behavior, and no server/OCR/raw/scraping/sql.js/output-adapter/real-person paths.

**Acceptance Scenarios**:

1. **Given** an oversized JSON payload, **When** the analyst previews validation, **Then** the app fails fast with a display-only unsupported status.
2. **Given** repeated renders with the same schema and payload, **When** the library renders, **Then** schema and validation output are stable.

### Edge Cases

- Empty JSON input must show a neutral display-only validation state.
- Malformed JSON must show a deterministic parse error and must not clear schema details.
- Oversized JSON must fail fast before validation work begins.
- The schema library must not read raw OCR, raw source documents, hosted schemas, or real natural-person data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a schema library surface reachable from the case dashboard.
- **FR-002**: System MUST show committed reviewed-input schema entries with stable ordering, stage labels, required fields, and repository basis.
- **FR-003**: System MUST show selected schema details and local-only validation guidance.
- **FR-004**: System MUST accept pasted or locally imported reviewed structured JSON text for validation preview only.
- **FR-005**: System MUST emit deterministic validation preview statuses for empty, accepted, invalid, malformed, and oversized inputs.
- **FR-006**: System MUST preserve existing dashboard, prompt library, and reconciliation workbench behavior.
- **FR-007**: System MUST avoid server calls, OCR, in-app scraping execution, raw source reads, hosted schemas, sql.js writes, output-adapter writes, and real natural-person data.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Committed schema metadata, approved sample metadata, mocked UI context, and browser-local reviewed JSON preview text.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, hosted schemas, real person-level data, scraping outputs executed in the app, and unreviewed extraction output.
- **Source Layer Reads**: Display-only schema definitions, approved local sample metadata, and mocked UI context.
- **Source Layer Writes**: Browser-local validation preview state and committed static bundle output. No sql.js writes, source-layer writes, engine output writes, or output-adapter writes.
- **Traceability Required**: Each schema entry must identify repository basis; validation preview must list checked fields and messages. No actuarial output trace is introduced.

### Key Entities *(include if feature involves data)*

- **Schema Library Entry**: Stable schema id, stage key, title, repository path, required fields, optional fields, basis, and ordering key.
- **Schema Validation Preview**: Selected schema id, status, checked fields, warnings/errors, input size, and display-only basis.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From the dashboard, an analyst can identify and open Schema Library within 10 seconds at desktop `1440x900`.
- **SC-002**: At mobile `390x844`, the analyst can identify selected schema details and validation preview controls within 10 seconds.
- **SC-003**: Schema entries and selected schema details render in stable deterministic order across repeated loads.
- **SC-004**: Valid, missing-field, malformed, and oversized JSON preview states produce deterministic statuses and messages.
- **SC-005**: Schema library markup and state contain no server/OCR/raw-source/scraping-execution/sql.js/output-adapter write path and no real natural-person sample data.

## Assumptions

- The MVP uses committed schema metadata derived from `artifacts/schemas/*_v0.1.0.md`.
- Validation preview is structural and local; it does not approve inputs or run deterministic engine modules.
- Browser-local pasted JSON is not durable case evidence in this slice.
- File upload controls can be deferred; a textarea import surface satisfies the MVP local import requirement.

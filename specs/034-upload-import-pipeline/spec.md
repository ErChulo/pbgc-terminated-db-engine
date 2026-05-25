# Feature Specification: Upload Import Pipeline

**Feature Branch**: `034-upload-import-pipeline`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build an upload/import pipeline increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser app only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case or population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on browser-only upload/import surfaces for reviewed structured JSON and raw external-LLM artifact text, with deterministic validation previews, boundary notices, oversized-load fail-fast handling, and no OCR, no in-app scraping, no network calls, no sql.js persistence writes, and no output-adapter writes. Preserve existing contracts, browser-only sql.js boundaries, existing workbench behavior, dashboard navigation, prompt/schema/template libraries, responsiveness, theme, progress, status/severity filtering, and trace expansion."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preview Local Imports (Priority: P1)

An analyst opens the existing case dashboard, chooses the upload/import stage, pastes reviewed structured JSON and external-LLM artifact text, and receives deterministic browser-only validation previews before any later review or approval flow.

**Why this priority**: The alpha path needs a place to bring externally prepared case materials into the browser app while preserving the reviewed-input boundary.

**Independent Test**: Can be tested by opening the upload/import page, submitting mocked reviewed JSON and mocked external-LLM artifact text, and verifying deterministic accepted, malformed, oversized, and inert-artifact preview states without persistence or adapter writes.

**Acceptance Scenarios**:

1. **Given** the case dashboard is visible, **When** the analyst selects Upload / Import, **Then** the app shows a browser-only import surface with a boundary notice and no real-person sample data.
2. **Given** reviewed JSON with required mocked identifiers, **When** the analyst validates it, **Then** the app shows an accepted preview with stable field inventory, warning/error arrays, and trace basis.
3. **Given** external-LLM artifact text, **When** the analyst previews it, **Then** the app treats it as inert local text and does not parse, scrape, OCR, persist, or route it to any output adapter.
4. **Given** malformed or oversized input, **When** the analyst validates it, **Then** the app reports deterministic display-only errors before any later normalization or approval work.

### Edge Cases

- Empty reviewed JSON and empty external-LLM artifact text show display-only empty states.
- Malformed JSON shows a structured validation error and no accepted field inventory.
- Oversized JSON or artifact text fails fast with a structured display-only error.
- Unsupported JSON shapes are rejected without silent fallback.
- Approved sample labels and mocked identifiers remain explicit so no real natural-person data is implied.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose Upload / Import from the existing dashboard as an available browser page.
- **FR-002**: System MUST accept reviewed structured JSON text and external-LLM artifact text as local browser input for preview only.
- **FR-003**: System MUST validate reviewed JSON deterministically and show accepted, empty, malformed, invalid, and oversized states.
- **FR-004**: System MUST treat external-LLM artifact text as inert local review material and show size/status metadata without OCR, scraping, parsing for facts, persistence, or adapter writes.
- **FR-005**: System MUST show clear boundary notices that the app receives externally prepared materials and does not perform terminated-plan-case scraping.
- **FR-006**: System MUST preserve existing workbench, prompt library, schema library, template library, theme, progress, status/severity filtering, and trace expansion behavior.
- **FR-007**: System MUST use only mocked or simulated case/person/population labels in examples, tests, and UI defaults.
- **FR-008**: System MUST keep import preview outputs in deterministic order and with stable warning/error payload shapes across repeated runs.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Mocked reviewed structured JSON pasted or imported by the analyst for local preview.
- **Disallowed Inputs**: Real participant, beneficiary, or other natural-person data; OCR streams; in-app scraping; live network retrieval; direct source-evidence interpretation by deterministic engine modules.
- **Source Layer Reads**: Existing approved sample metadata, existing stage navigation metadata, and analyst-provided local preview text.
- **Source Layer Writes**: Display-only local import preview state; no lower source-layer writes, no sql.js persistence writes, and no output adapter writes.
- **Traceability Required**: Preview status, source kind, selected stage, input size, accepted field inventory, warnings, errors, and module name.
- **Expected Warnings/Errors**: Display-only empty, malformed, invalid, oversized, and inert-artifact notices using existing structured warning/error conventions.
- **Affected Output Adapters**: Existing BSRS, V1/VE, and valuation listings display sources remain read-only and unchanged.

### Key Entities *(include if feature involves data)*

- **Import Source**: Approved local input kind, label, selected stage, boundary basis, and deterministic order key.
- **Reviewed JSON Preview**: Parsed status, accepted fields, warnings, errors, source kind, input size, and trace basis.
- **External Artifact Preview**: Inert text status, input size, warnings, errors, source kind, and trace basis.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At desktop 1440x900 and mobile 390x844, an analyst can identify the Upload / Import stage and validate mocked reviewed JSON within 10 seconds.
- **SC-002**: Repeated validation of the same mocked inputs produces identical statuses, warning/error shapes, field ordering, and trace basis.
- **SC-003**: Malformed, invalid, empty, and oversized inputs are rejected or flagged before any later normalization, approval, persistence, or output work begins.
- **SC-004**: Existing dashboard, workbench, prompt library, schema library, and template library focused regression tests continue to pass.

## Assumptions

- This slice provides local browser preview only; normalization, approval, persistence, and template filling are separate later features.
- External LLM scraping is performed outside the app by a user-chosen tool; this feature only hosts local text prepared elsewhere.
- Textarea-based local input is sufficient for the MVP; richer file picking can be added later without changing the deterministic boundary.
- Existing approved sample and mocked case labels are acceptable for all examples and tests.

# Feature Specification: Template Filling Export

**Feature Branch**: `036-template-filling-export`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build a template-filling and artifact-export increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser app only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case or population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on filling at least one PBGC-style reviewed-input template from browser-local approved mocked reviewed records, showing deterministic filled artifact content, export-ready artifact metadata, copy/download controls where browser-local, and blocking export when approved reviewed inputs are missing or rejected. Preserve existing contracts, browser-only sql.js boundaries, upload/import behavior, reviewed-input approval behavior, dashboard navigation, prompt/schema/template libraries, workbench behavior, responsiveness, theme, progress, status/severity filtering, and trace expansion."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fill and Export One Approved Artifact (Priority: P1)

An analyst opens Template Filling / Export, sees approved mocked reviewed inputs mapped into one PBGC-style reviewed-input template, and can copy or locally download the deterministic artifact content.

**Why this priority**: This completes the first alpha path from approved local input to a browser-local output artifact.

**Independent Test**: Can be tested by approving one mocked reviewed record, filling the source assertion import template, verifying deterministic artifact content/metadata, and confirming export is blocked when no approved inputs exist.

**Acceptance Scenarios**:

1. **Given** the dashboard is visible, **When** the analyst opens Template Filling / Export, **Then** a browser-local filled artifact preview is visible.
2. **Given** at least one approved mocked reviewed record, **When** the artifact is generated, **Then** the content includes only approved mocked fields in stable order.
3. **Given** no approved records, **When** the artifact is evaluated, **Then** export is blocked with structured display-only errors.
4. **Given** the same approved records, **When** the page is rebuilt, **Then** artifact metadata and content are identical.

### Edge Cases

- Pending or rejected records do not appear in the filled artifact.
- Missing approved records block copy/download readiness.
- Filled content uses mocked identifiers only.
- Export controls are browser-local and do not introduce server calls, OCR, scraping, sql.js writes, or output-adapter writes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose Template Filling / Export from the existing dashboard as an available browser page.
- **FR-002**: System MUST fill at least one PBGC-style reviewed-input template from approved mocked reviewed records.
- **FR-003**: System MUST show deterministic artifact content, artifact name, template basis, source record count, warnings, errors, and trace basis.
- **FR-004**: System MUST block export readiness when there are no approved records.
- **FR-005**: System MUST exclude pending, rejected, malformed, or invalid records from filled artifact content.
- **FR-006**: System MUST provide browser-local copy/download controls without network runtime or new output adapters.
- **FR-007**: System MUST preserve existing upload/import, reviewed-input approval, dashboard, workbench, prompt/schema/template libraries, and filters.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Approved mocked reviewed records from the browser-local reviewed-input approval flow.
- **Disallowed Inputs**: Real natural-person data, OCR, in-app scraping, live network retrieval, and unapproved records for artifact generation.
- **Source Layer Reads**: Existing template metadata and approved mocked reviewed records.
- **Source Layer Writes**: Display-only filled artifact preview and browser-local export metadata; no lower source-layer writes, no sql.js persistence writes, and no output adapter writes.
- **Traceability Required**: Template id/path, approved record ids, artifact name, content hash basis, module name, rule version, warnings, and errors.
- **Expected Warnings/Errors**: Display-only no-approved-records block and unapproved-record exclusion notice.
- **Affected Output Adapters**: None. Existing BSRS, V1/VE, and valuation listings outputs remain unchanged.

### Key Entities *(include if feature involves data)*

- **Filled Artifact Preview**: Artifact id, file name, template basis, content, warnings, errors, and trace basis.
- **Export Readiness**: Ready or blocked status with deterministic reason text.
- **Artifact Source Record**: Approved mocked reviewed row included in the filled content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At desktop 1440x900 and mobile 390x844, an analyst can identify Template Filling / Export and see export readiness within 10 seconds.
- **SC-002**: Repeated fills with the same approved mocked records produce identical content, file name, metadata, warning/error shapes, and trace basis.
- **SC-003**: Export is visibly blocked when no approved mocked records exist.
- **SC-004**: Existing focused UI regression tests continue to pass.

## Assumptions

- The MVP fills a committed reviewed-input import template, not a new output adapter.
- Export is browser-local content readiness plus copy/download controls.
- Durable storage and richer document formats can be added later.

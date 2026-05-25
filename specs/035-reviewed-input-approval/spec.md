# Feature Specification: Reviewed Input Approval

**Feature Branch**: `035-reviewed-input-approval`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build a reviewed-input normalization and approval flow increment for the PBGC terminated defined-benefit engine. Scope this slice to improving the existing browser app only, using already implemented slices, approved sample artifacts already in the repository, and simulated or mocked person-level case or population data where needed. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or new output adapters. Focus on normalizing imported reviewed structured JSON from the browser-only upload/import pipeline into a deterministic review table, surfacing validation warnings and errors, allowing display-only approve or reject decisions for mocked reviewed records, and blocking unapproved records from template filling or engine use. Preserve existing contracts, browser-only sql.js boundaries, upload/import behavior, dashboard navigation, prompt/schema/template libraries, workbench behavior, responsiveness, theme, progress, status/severity filtering, and trace expansion."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Normalize and Decide Reviewed Records (Priority: P1)

An analyst opens Reviewed Input Approval from the dashboard, inspects mocked imported reviewed JSON normalized into stable record rows, sees warnings/errors, and applies display-only approve or reject decisions before later template filling.

**Why this priority**: The alpha path needs a review gate between local import and any deterministic engine or template-filling use.

**Independent Test**: Can be tested by opening the approval page with mocked reviewed records and verifying deterministic normalized rows, approval/rejection status, blocking of unapproved records, and stable warning/error payloads.

**Acceptance Scenarios**:

1. **Given** the dashboard is visible, **When** the analyst opens Reviewed Input Approval, **Then** the app shows normalized mocked reviewed records and the reviewed-input boundary notice.
2. **Given** a valid mocked imported record, **When** the analyst selects approve, **Then** the display-only approved packet count increases and the record remains traceable to its import source.
3. **Given** an invalid or rejected record, **When** the analyst reviews the page, **Then** it remains blocked from later template filling or engine use.
4. **Given** the same mocked input and decision set, **When** the page is rebuilt, **Then** normalized row order, warnings, errors, and decisions are identical.

### Edge Cases

- Empty imported JSON shows an empty approval queue.
- Malformed imported JSON blocks all approval decisions.
- Missing reviewed identifiers produce structured errors and blocked rows.
- Rejected records remain visible with deterministic reason text.
- No real natural-person names or identifiers are present in examples or defaults.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose Reviewed Input Approval from the existing dashboard as an available browser page.
- **FR-002**: System MUST normalize mocked reviewed JSON into stable review rows with source layer, record identifier, case identifier, approval status, and trace basis.
- **FR-003**: System MUST support display-only approve and reject decisions for mocked reviewed records.
- **FR-004**: System MUST block malformed, invalid, rejected, and pending records from later template filling or deterministic engine use.
- **FR-005**: System MUST emit stable display-only warnings and errors for empty, malformed, invalid, pending, rejected, and blocked records.
- **FR-006**: System MUST preserve existing upload/import, dashboard, workbench, prompt library, schema library, template library, and filter behavior.
- **FR-007**: System MUST use only simulated or mocked case/person/population labels.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Mocked reviewed structured JSON that has already crossed the upload/import preview boundary.
- **Disallowed Inputs**: Real natural-person data, OCR, in-app scraping, live network retrieval, and unreviewed records for deterministic output use.
- **Source Layer Reads**: Existing approved sample metadata and browser-local mocked reviewed JSON.
- **Source Layer Writes**: Display-only normalized review rows and display-only approval decisions; no lower source-layer writes, no sql.js persistence writes, and no output adapter writes.
- **Traceability Required**: Import source, source layer, case identifier, reviewed record identifier, decision status, warnings, errors, module name, and rule version.
- **Expected Warnings/Errors**: Display-only empty queue, malformed input, missing identifiers, pending decision, rejected decision, and blocked-record notices.
- **Affected Output Adapters**: None. Existing BSRS, V1/VE, and valuation listings outputs remain unchanged.

### Key Entities *(include if feature involves data)*

- **Normalized Review Row**: Stable row for one mocked reviewed record with identifiers, source layer, decision, validation status, and trace basis.
- **Approval Decision**: Display-only approve or reject status plus deterministic reason text.
- **Approved Packet Preview**: Count and field inventory for approved rows only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At desktop 1440x900 and mobile 390x844, an analyst can identify Reviewed Input Approval and approve or reject a mocked record within 10 seconds.
- **SC-002**: Repeated builds with the same mocked records and decisions produce identical normalized rows, warnings, errors, blocked counts, and approved packet previews.
- **SC-003**: Pending, rejected, malformed, and invalid records are visibly blocked before later template filling or deterministic engine use.
- **SC-004**: Existing focused UI regression tests continue to pass.

## Assumptions

- Approval decisions are display-only local state in this MVP.
- Template filling/export and durable persistence are later features.
- The default records are simulated and derived from mocked approved sample context only.

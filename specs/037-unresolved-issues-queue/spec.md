# Feature Specification: Unresolved Issues Queue

**Feature Branch**: `037-unresolved-issues-queue`

**Created**: 2026-05-25

**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inspect Existing Issues (Priority: P1)

An analyst opens Unresolved Issues from the dashboard and sees a deterministic browser-local queue of existing blocked records, validation errors, warnings, and export readiness issues from already implemented slices.

**Why this priority**: Alpha users need one place to see why a case is not ready.

**Independent Test**: Can be tested by rendering the queue and verifying stable issue ordering, source links, severities, statuses, and no new persistence or adapter writes.

**Acceptance Scenarios**:

1. **Given** the dashboard is visible, **When** the analyst opens Unresolved Issues, **Then** existing warnings/errors appear in one queue.
2. **Given** blocked approved-input or template export states exist, **When** the queue is built, **Then** those issues are visible with source stage and trace basis.
3. **Given** repeated builds, **When** the same mocked data is used, **Then** issue ordering and payload shape are identical.

### Edge Cases

- Empty source issue sets show a deterministic empty state.
- Info, warning, and error severities are sorted in stable order.
- No real natural-person data is displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose Unresolved Issues from the dashboard as an available page.
- **FR-002**: System MUST aggregate existing display-only warnings/errors from upload/import, reviewed-input approval, template filling/export, and reconciliation/workbench state.
- **FR-003**: System MUST show source stage, severity, status, issue code, message, and trace basis for each issue.
- **FR-004**: System MUST keep stable deterministic issue ordering across repeated runs.
- **FR-005**: System MUST not add new output adapters, persistence writes, OCR, scraping, network runtime, or real natural-person data.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Existing mocked reviewed records and display-only preview state.
- **Disallowed Inputs**: Real natural-person data, OCR, in-app scraping, live network retrieval, and new source parsing.
- **Source Layer Reads**: Existing display-only state from implemented browser slices.
- **Source Layer Writes**: Display-only issue queue only; no lower source-layer writes, no sql.js persistence writes, and no output adapter writes.
- **Traceability Required**: Source slice, issue code, severity, status, source record or artifact id where available, module name, and rule version.

### Key Entities

- **Issue Queue Item**: Stable issue id, source stage, severity, status, code, message, and trace basis.
- **Issue Queue Summary**: Counts by severity and total unresolved issue count.

## Success Criteria *(mandatory)*

- **SC-001**: At desktop 1440x900 and mobile 390x844, an analyst can identify Unresolved Issues and see issue counts within 10 seconds.
- **SC-002**: Repeated builds produce identical issue rows and counts.
- **SC-003**: Existing focused UI tests continue to pass.

## Assumptions

- This MVP aggregates existing display-only issue states and does not introduce assignment, comments, or durable resolution workflow.

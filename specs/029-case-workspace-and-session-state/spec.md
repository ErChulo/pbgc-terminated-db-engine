# Feature Specification: Case Workspace and Session State

**Feature Branch**: `029-name-case-workspace`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Add saved workspace/session state and restore current case/workbench state. Preserve browser-only behavior, existing sql.js boundaries, mocked/no-real-person-data constraints, and current reconciliation workbench behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Save Current Workspace State (Priority: P1)

An analyst can save the current mocked case workspace state from the reconciliation workbench, including selected approved sample, theme, status filter, and severity filter, without changing deterministic output data.

**Why this priority**: First usable alpha needs a workspace concept before stage navigation, prompt libraries, imports, and template filling.

**Independent Test**: Select a sample and filters, save the workspace state, and verify a deterministic local session snapshot is produced with mocked context only.

**Acceptance Scenarios**:

1. **Given** the workbench has a selected approved sample and filters, **When** the analyst saves workspace state, **Then** a local session snapshot records the selected sample, theme, status filter, and severity filter.
2. **Given** workspace state is saved, **When** the workbench is rendered, **Then** a visible session status confirms the saved mocked workspace state.

---

### User Story 2 - Restore Current Workspace State (Priority: P2)

An analyst can restore a previously saved mocked workspace state and return to the same selected sample, theme, status filter, and severity filter.

**Why this priority**: Restore behavior lets the alpha carry analyst context across reloads before real case navigation exists.

**Independent Test**: Restore from a saved local session snapshot and verify sample, theme, filters, output panels, tables, and trace controls match the saved state.

**Acceptance Scenarios**:

1. **Given** a valid saved mocked workspace snapshot exists, **When** the analyst restores it, **Then** the workbench returns to the saved sample, theme, status filter, and severity filter.
2. **Given** no valid saved snapshot exists, **When** the analyst attempts restore, **Then** the current stable workbench content remains visible and a display-only unavailable state appears.

---

### User Story 3 - Preserve Session Boundaries (Priority: P3)

An analyst can see that workspace/session state is mocked, local, and browser-only, with no real-person data, raw source reads, server calls, or output-adapter writes.

**Why this priority**: Session state will become the bridge to later case dashboard and import flows, so boundaries must be explicit.

**Independent Test**: Render saved, restored, and unavailable session states repeatedly and verify deterministic labels, local-only messaging, no raw/real-person paths, and unchanged output data.

**Acceptance Scenarios**:

1. **Given** any session state, **When** the workbench is rendered twice with the same inputs, **Then** session labels and workbench row ordering are identical.
2. **Given** session state is visible, **When** an analyst reviews it, **Then** it clearly names mocked local state and does not expose real-person or raw-source data.

### Edge Cases

- If browser storage is unavailable, saving must fail gracefully with a display-only unavailable state.
- If a saved snapshot has an unsupported sample or filter value, restore must fall back to the current stable workbench state.
- Saving or restoring must not reset theme, status filter, severity filter, trace controls, progress state, or work guard state except where a valid snapshot explicitly restores those display values.
- Session state must not contain real participant, beneficiary, or natural-person data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST expose visible save and restore controls for mocked workspace/session state.
- **FR-002**: Saved session snapshots MUST include selected approved sample, theme, status filter, severity filter, deterministic workspace id, and mocked context label.
- **FR-003**: Restoring a valid session snapshot MUST restore selected approved sample, theme, status filter, and severity filter.
- **FR-004**: Invalid or unavailable session snapshots MUST fail gracefully without hiding or mutating stable workbench content.
- **FR-005**: Session save/restore MUST preserve output panels, comparison tables, trace controls, deterministic row ordering, DD-backed mappings, warnings, and errors.
- **FR-006**: Session state MUST NOT write source assertions, resolved facts, resolved provisions, engine input packets, deterministic outputs, output-adapter rows, or persistence records.
- **FR-007**: Session behavior MUST NOT add server calls, hosted assets, telemetry, OCR, raw source parsing, real natural-person data, new business domains, or new output adapters.
- **FR-008**: Session controls and status messages MUST remain identifiable on desktop `1440x900` and mobile `390x844`.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Existing approved sample artifacts and mocked workbench context already used by the reconciliation workbench.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, uploaded raw participant data, hosted prompts, hosted templates, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Existing deterministic engine outputs and output-adapter display rows surfaced by the current workbench; browser-local session snapshot only for display state.
- **Source Layer Writes**: Browser-local display session state only; no source-layer, deterministic output, or output-adapter writes are added.
- **Traceability Required**: Existing trace details, rule versions, source paths, status labels, severity labels, mapping bases, theme/progress/guard display state, and session snapshot metadata must remain visible and deterministic.

### Key Entities *(include if feature involves data)*

- **Workspace Session Snapshot**: Local display-state snapshot for a mocked workspace.
- **Workspace Session Status**: Display-only state: unsaved, saved, restored, or unavailable.
- **Workbench View State**: Existing selected sample, theme, status filter, severity filter, progress, work guard, output panels, rows, and trace controls preserved across save/restore.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An analyst can identify and save mocked workspace state within 10 seconds on desktop `1440x900` and mobile `390x844`.
- **SC-002**: Restoring a valid session snapshot returns the workbench to the saved sample, theme, status filter, severity filter, and visible row counts.
- **SC-003**: Invalid or unavailable restore attempts display a stable message without changing deterministic workbench data.
- **SC-004**: Repeated renders of the same saved/restored session state produce identical session labels and visible row ordering.
- **SC-005**: Regression checks confirm no server calls, OCR path, raw source reads, real natural-person data, new output adapters, or deterministic persistence writes are introduced.

## Assumptions

- The MVP applies workspace/session state to the existing reconciliation workbench page first.
- Session snapshots are local browser display state, not deterministic engine inputs.
- Workspace and population labels remain mocked and explicitly marked as simulated.
- This feature does not require new schemas, migrations, output adapters, actuarial modules, or PBGC deliverable artifacts.

# Feature Specification: Responsiveness and Work Guards

**Feature Branch**: `028-name-responsiveness-and`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Add timing/progress/cancel/fail-fast guards, chunk or defer expensive work, prevent long blocking interactions. Preserve browser-only behavior, existing sql.js boundaries, existing slices, mocked/no-real-person-data constraints, and current reconciliation workbench behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guard Delayed Workbench Refresh (Priority: P1)

An analyst can start a guarded local workbench refresh, see that guarded work is running, and cancel the display operation before it replaces stable content.

**Why this priority**: The alpha path needs explicit safeguards against apparently frozen UI before larger workspace/import flows introduce heavier local work.

**Independent Test**: Start a guarded workbench refresh and verify visible running/cancel controls appear; cancel the operation and verify stable workbench content, filters, output panels, and trace controls remain visible.

**Acceptance Scenarios**:

1. **Given** the workbench is showing an approved sample, **When** the analyst starts guarded refresh, **Then** a visible running state and cancel control appear without hiding stable content.
2. **Given** guarded work is running, **When** the analyst cancels it, **Then** the page shows a cancelled state and preserves selected sample, filters, tables, output panels, and trace controls.

---

### User Story 2 - Fail Fast on Unsupported Oversized Work (Priority: P2)

An analyst receives an immediate display-only unsupported message when requested local work exceeds the MVP's supported work size, instead of the app attempting a long blocking operation.

**Why this priority**: The current app must not assume infinite performance and must reject oversized local work before expensive processing begins.

**Independent Test**: Trigger an oversized local-work request and verify the workbench shows a fail-fast unsupported state with no output-adapter writes, lower source-layer writes, raw-source reads, server calls, or content loss.

**Acceptance Scenarios**:

1. **Given** a local request declares work larger than the supported limit, **When** the analyst starts it, **Then** the page immediately shows an unsupported/fail-fast message.
2. **Given** fail-fast occurs, **When** the message is displayed, **Then** existing stable workbench content remains visible and deterministic output data is unchanged.

---

### User Story 3 - Preserve Responsive Work State Evidence (Priority: P3)

An analyst can see stable timing and guard evidence for local work states, including supported unit limits and deterministic guard status, without exposing raw or real-person data.

**Why this priority**: Guard evidence must be auditable and usable as the app grows into import, normalization, and template-filling flows.

**Independent Test**: Render idle, running, cancelled, complete, and unsupported guard states repeatedly and verify labels, supported limits, status messages, and workbench data remain deterministic and browser-only.

**Acceptance Scenarios**:

1. **Given** any supported guard state, **When** the workbench is rendered twice with the same inputs, **Then** guard labels, progress messages, and visible row ordering are identical.
2. **Given** guard evidence is visible, **When** an analyst reviews it, **Then** it names only mocked approved-sample context and local work-unit limits, not real-person or raw-source data.

### Edge Cases

- If cancellation is requested when no guarded work is running, the workbench must remain stable and show idle guard state.
- If unsupported oversized work is requested while a theme or filter is active, the active theme and filters must remain unchanged.
- If a delayed work operation completes after cancellation, the cancelled state must not be overwritten by stale delayed completion.
- If browser storage is unavailable, guards still operate for the current session without persistence.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST expose a visible guarded local-work control for refresh-like delayed work.
- **FR-002**: Running guarded work MUST show visible progress/guard status and a cancel control before replacing visible content.
- **FR-003**: Cancelling guarded work MUST preserve selected sample, theme, status filter, severity filter, output panels, comparison tables, and trace controls.
- **FR-004**: Unsupported oversized work MUST fail fast with a display-only message before expensive work begins.
- **FR-005**: Guard state MUST include deterministic supported-limit and attempted-work-unit evidence.
- **FR-006**: Guard state MUST NOT write source assertions, resolved facts, resolved provisions, engine input packets, deterministic outputs, output-adapter rows, or persistence records.
- **FR-007**: Guard behavior MUST NOT add server calls, hosted assets, telemetry, OCR, raw source parsing, real natural-person data, new business domains, or new output adapters.
- **FR-008**: Guard transitions MUST preserve existing deterministic output values, DD-backed mappings, row ordering, warnings, errors, and traceability details.
- **FR-009**: Guard controls and messages MUST remain identifiable on desktop `1440x900` and mobile `390x844`.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Existing approved sample artifacts and mocked workbench context already used by the reconciliation workbench.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, uploaded raw participant data, hosted prompts, hosted templates, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Existing deterministic engine outputs and output-adapter display rows surfaced by the current workbench; no lower source-layer reads are added.
- **Source Layer Writes**: Display-only guard state and transient progress state only; no source-layer or output-adapter writes are added.
- **Traceability Required**: Existing workbench trace details, rule versions, source paths, status labels, severity labels, mapping bases, and guard evidence must remain visible and deterministic.

### Key Entities *(include if feature involves data)*

- **Work Guard State**: Display-only state for local work: idle, running, cancelled, complete, or unsupported.
- **Work Guard Evidence**: Deterministic supported-limit and attempted-work-unit metadata shown to analysts.
- **Workbench View State**: Existing selected sample, theme, status filter, severity filter, progress state, output panels, rows, and trace controls preserved across guard transitions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An analyst can identify and start guarded local work within 10 seconds on desktop `1440x900` and mobile `390x844`.
- **SC-002**: A running guard state displays a cancel control and preserves stable workbench content before completion.
- **SC-003**: Cancelling guarded work preserves selected sample, active theme, active filters, and visible row counts.
- **SC-004**: Unsupported oversized work displays a fail-fast message without changing deterministic output data or starting delayed work.
- **SC-005**: Regression checks confirm no server calls, OCR path, raw source reads, real natural-person data, new output adapters, or persistence writes are introduced.

## Assumptions

- The MVP applies work guards to the existing reconciliation workbench page first.
- Work-unit counts are deterministic display metadata for the current approved sample and do not represent real participant counts.
- Later import/template features may reuse the guard pattern for larger browser-only workflows.
- This feature is display-only and does not require new schemas, migrations, output adapters, actuarial modules, or PBGC deliverable artifacts.

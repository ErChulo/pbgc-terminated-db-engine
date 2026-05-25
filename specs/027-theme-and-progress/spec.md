# Feature Specification: Theme and Progress

**Feature Branch**: `027-name-theme-and-progress`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Start the next alpha-product feature: theme-and-progress. Add dark/light theme toggle and visible progress/spinner/loading states for delayed processes. Preserve responsiveness and non-blocking UI behavior. Do not use real natural-person data. Preserve browser-only behavior and existing sql.js boundaries."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Workbench Theme (Priority: P1)

An analyst using the reconciliation workbench can switch between light and dark display modes and keep the current approved sample, filters, output panels, tables, and trace expansion controls visible and usable.

**Why this priority**: A usable alpha needs a visible app-level control that immediately improves analyst comfort without changing casework results or adding new business scope.

**Independent Test**: Load the current workbench, switch themes, and verify the page updates the visual mode while preserving the selected approved sample, status filter, severity filter, output panels, Shared Facts, Shared Values, and reconciliation rows.

**Acceptance Scenarios**:

1. **Given** the workbench is showing the default approved sample, **When** the analyst switches from light to dark mode, **Then** the page displays the dark mode while keeping all workbench data and controls unchanged.
2. **Given** the analyst has selected a sample and active filters, **When** the analyst switches theme, **Then** the selected sample, filter state, table rows, and trace controls remain present.

---

### User Story 2 - See Progress for Delayed Work (Priority: P2)

An analyst receives a visible progress or loading indication when a workbench action is delayed, so the page does not appear frozen while deterministic browser work completes.

**Why this priority**: The alpha must be responsive and understandable during delayed local work before larger case-workspace features add more expensive operations.

**Independent Test**: Trigger a delayed workbench refresh and verify a visible progress state appears, returns to idle when complete, and preserves the resulting workbench state.

**Acceptance Scenarios**:

1. **Given** a workbench refresh takes longer than a short interaction threshold, **When** the delayed refresh starts, **Then** the analyst sees a visible loading/progress state before completion.
2. **Given** a delayed refresh completes, **When** the page returns to idle, **Then** the final output panels, comparison tables, filters, and trace expansion controls are rendered deterministically.

---

### User Story 3 - Preserve Responsive UI Behavior (Priority: P3)

An analyst can use theme and progress controls on desktop and mobile viewport sizes without text overlap, hidden controls, real-person data, raw source reads, server calls, or long blocking interactions.

**Why this priority**: The feature is a productizing layer and must not weaken existing browser-only, reviewed-input, and responsive-workbench constraints.

**Independent Test**: Review the themed workbench and delayed progress state at desktop and mobile viewport targets and verify controls remain identifiable, table content remains readable, and unsupported oversized or raw-source work is not introduced.

**Acceptance Scenarios**:

1. **Given** the desktop viewport is `1440x900`, **When** the analyst views light mode, dark mode, and the loading state, **Then** theme and progress controls are identifiable without overlapping workbench content.
2. **Given** the mobile viewport is `390x844`, **When** the analyst views light mode, dark mode, and the loading state, **Then** theme and progress controls remain reachable and the page preserves readable table and trace controls.

### Edge Cases

- If a delayed workbench action fails, the progress state must clear and an existing-style structured display message must identify the failure without hiding the current stable workbench content.
- If a user toggles theme while a delayed refresh is pending, the chosen theme must remain visible and the refresh result must not reset unrelated workbench controls.
- If a user requests work that exceeds the MVP's supported local sample scope, the page must fail fast with a display-only message rather than starting a long blocking task.
- If the browser cannot store a theme preference, the page must still allow theme switching for the current session.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workbench MUST provide a visible light/dark theme control available on the existing page.
- **FR-002**: The theme control MUST preserve selected approved sample, status filter, severity filter, output panels, comparison tables, and trace expansion controls when toggled.
- **FR-003**: The workbench MUST expose an idle/loading/progress display state for delayed local workbench actions.
- **FR-004**: The progress state MUST be visible before any delayed result replaces visible workbench content and MUST return to idle after completion or failure.
- **FR-005**: Delayed work MUST preserve browser responsiveness by avoiding intentional long blocking interactions in the user-facing flow.
- **FR-006**: Failure or unsupported-load messages MUST use existing display-only warning/error conventions and MUST NOT write output-adapter rows or lower source-layer records.
- **FR-007**: Theme and progress behavior MUST NOT change deterministic output values, DD-backed mappings, shared-fact/shared-value classifications, row ordering, warnings, errors, or traceability details.
- **FR-008**: The feature MUST NOT add server calls, hosted assets, telemetry, OCR, raw source parsing, real natural-person data, new business domains, or new output adapters.
- **FR-009**: The themed and loading workbench views MUST remain usable at desktop `1440x900` and mobile `390x844` viewport targets.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Existing approved sample artifacts and mocked case/population context already used by the reconciliation workbench.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, uploaded raw participant data, hosted prompts, hosted templates, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Deterministic engine outputs and output-adapter display rows already surfaced by the current workbench; no lower source-layer reads are added.
- **Source Layer Writes**: Display-only UI preference and transient progress state only; no source assertions, resolved facts, resolved plan provisions, engine input packets, deterministic outputs, or output-adapter rows are written.
- **Traceability Required**: Existing workbench trace details, rule versions, source paths, status labels, severity labels, and mapping bases must remain unchanged when theme or progress state changes.

### Key Entities *(include if feature involves data)*

- **Theme Preference**: Display-only choice of light or dark mode; may be held for the current browser session without becoming a deterministic engine input.
- **Progress State**: Display-only state describing whether local workbench UI work is idle, pending, complete, failed, or unsupported.
- **Workbench View State**: Existing selected sample, status filter, severity filter, visible rows, output panels, and trace expansion controls preserved across theme and progress changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An analyst can identify and toggle light/dark theme within 10 seconds on desktop `1440x900` and mobile `390x844`.
- **SC-002**: Theme toggling preserves selected sample, active status filter, active severity filter, and visible row counts across at least two repeated toggles.
- **SC-003**: A delayed workbench action shows a visible progress or loading state before completion and returns to idle without changing deterministic workbench output data.
- **SC-004**: The themed workbench and progress state render at desktop `1440x900` and mobile `390x844` without overlapping the theme control, progress indicator, sample selector, filter controls, or table headings.
- **SC-005**: Regression checks confirm no server calls, OCR path, raw source reads, real natural-person data, new output adapters, or persistence writes are introduced by this feature.

## Assumptions

- The MVP applies theme and progress behavior to the existing reconciliation workbench page first, because it is the current alpha product surface.
- Progress indicators may be driven by simulated delayed local work in tests so responsiveness behavior can be verified without adding new business processing.
- The feature is display-only and does not require new schemas, migrations, output adapters, actuarial modules, or PBGC deliverable artifacts.
- Person-level and population-level labels remain mocked and explicitly marked as simulated.

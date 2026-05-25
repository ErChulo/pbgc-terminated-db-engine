# Feature Specification: Case Navigation Dashboard

**Feature Branch**: `030-case-navigation-dashboard`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build a case navigation dashboard increment for the PBGC terminated defined-benefit engine. Scope this slice to the existing browser app only, using already implemented slices, approved sample artifacts, and mocked or simulated case/population data only. Do not use any real participant, beneficiary, or other natural-person data. Do not add new business domains or output adapters. Focus on a top-level dashboard/navigation surface for alpha case stages that lets a user open the current mocked case workspace, see stage status, and navigate to the reconciliation workbench while preserving browser-only deterministic behavior, existing workbench session state, responsive UI behavior, and no server/OCR/raw-source paths."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open Case Workspace From Dashboard (Priority: P1)

An analyst opens the app and sees a top-level mocked case dashboard with the current approved-sample case workspace and an obvious path into the reconciliation workbench.

**Why this priority**: A first usable alpha needs a clear entry point before adding prompt, schema, template, upload, and review stages.

**Independent Test**: Render the dashboard and confirm it shows the mocked case workspace, alpha stage navigation, no-real-person-data notice, and a deterministic link/action to the existing reconciliation workbench.

**Acceptance Scenarios**:

1. **Given** the browser app loads with approved local artifacts, **When** the analyst views the dashboard, **Then** the current mocked case workspace, approved-sample basis, and no-real-person-data notice are visible.
2. **Given** the dashboard is visible, **When** the analyst chooses the reconciliation workbench action, **Then** the app navigates to or renders the existing reconciliation workbench without changing the workbench session state contract.

---

### User Story 2 - Inspect Stage Status (Priority: P2)

An analyst can see the alpha case stages and understand which stages are available now, pending future slices, or represented by existing workbench evidence.

**Why this priority**: Stage visibility prevents the alpha surface from feeling like a single isolated workbench and creates the structure for upcoming prompt, schema, template, upload, review, and export features.

**Independent Test**: Render the dashboard and confirm the stage list has deterministic ordering, stable labels, status markers, and no unsupported writes or server/OCR/raw-source paths.

**Acceptance Scenarios**:

1. **Given** the mocked workspace is selected, **When** the analyst inspects stages, **Then** the dashboard shows deterministic stage statuses for workspace, reconciliation, prompts, schemas, templates, imports, review, filling/export, issues, and sample packs.
2. **Given** a not-yet-implemented stage is shown, **When** the analyst views its status, **Then** it is labeled as planned or unavailable without implying the stage has run.

---

### User Story 3 - Preserve Responsive Navigation (Priority: P3)

An analyst can use the dashboard on desktop and mobile without losing access to the current workbench entry point, stage status, mocked data notice, or responsive behavior.

**Why this priority**: The app must stay usable as product surfaces accumulate and must avoid long blocking interactions.

**Independent Test**: Verify dashboard markup and documented desktop/mobile review evidence for `1440x900` and `390x844`, including no overlap of stage cards, navigation controls, and no-real-person-data notice.

**Acceptance Scenarios**:

1. **Given** desktop viewport `1440x900`, **When** the dashboard renders, **Then** the current case summary, stage status list, and workbench navigation are identifiable within 10 seconds.
2. **Given** mobile viewport `390x844`, **When** the dashboard renders, **Then** the same controls remain reachable and readable without horizontal-only navigation.

### Edge Cases

- If the dashboard cannot resolve a supported approved sample, it must show a stable display-only unavailable state and keep navigation to the existing workbench safe.
- Planned stages must not start unsupported work, upload flows, OCR, scraping, template filling, or adapter writes in this slice.
- Existing workbench theme, filters, sample selection, trace expansion, and browser-local session behavior must remain unchanged by opening the dashboard.
- Dashboard labels and mocked context must not include real participant, beneficiary, alternate payee, survivor, or other natural-person data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a top-level case navigation dashboard in the existing browser app using only approved sample artifacts and mocked or simulated case/population context.
- **FR-002**: System MUST provide an obvious deterministic action or route that opens the existing reconciliation workbench.
- **FR-003**: System MUST show the current mocked case workspace identity, approved-sample basis, and no-real-person-data notice on the dashboard.
- **FR-004**: System MUST show a deterministic, stable-ordered alpha stage list with status labels for workspace, reconciliation, prompt library, schema library, PBGC template library, upload/import, reviewed-input approval, template filling/export, unresolved issues, and sample/mock pack management.
- **FR-005**: System MUST label planned or unavailable stages as display-only and MUST NOT imply that unsupported stages have executed.
- **FR-006**: System MUST preserve existing reconciliation workbench behavior, including selected sample, filters, theme, trace expansion, progress/guard controls, and browser-local session state.
- **FR-007**: System MUST preserve responsive desktop and mobile readability for the dashboard and navigation controls.
- **FR-008**: System MUST avoid server calls, OCR, raw source reads, hosted runtime dependencies, telemetry, sql.js writes, output-adapter writes, or new business-domain calculations in this slice.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Existing approved sample artifacts, existing workbench display state, existing mocked case/population labels, and existing deterministic output evidence already committed in the repository.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, real person-level data, hosted sample data, network-loaded business logic, and unreviewed extraction output.
- **Source Layer Reads**: Deterministic outputs and output-adapter display evidence from existing slices; approved local sample metadata; mocked UI context.
- **Source Layer Writes**: Display-only browser UI state and committed static bundle output. No lower source-layer writes, sql.js writes, engine output writes, or output-adapter writes.
- **Traceability Required**: Dashboard stage entries must name their basis from existing approved sample/workbench evidence or planned-stage status; no new computed actuarial output trace is introduced.

### Key Entities *(include if feature involves data)*

- **Case Dashboard Summary**: Mocked current case/workspace label, approved sample identifier, approved artifact basis, and no-real-person-data notice.
- **Case Stage Navigation Item**: Stable stage key, label, status, status detail, ordering key, availability, and navigation target when supported.
- **Dashboard Navigation Contract**: Display-only contract linking the dashboard to the existing reconciliation workbench without changing workbench state or output adapter behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At desktop `1440x900`, an analyst can identify the current mocked case workspace and open the reconciliation workbench from the dashboard within 10 seconds.
- **SC-002**: At mobile `390x844`, an analyst can identify the same workspace and workbench action within 10 seconds without horizontal-only navigation.
- **SC-003**: The dashboard stage list renders in the same deterministic order across repeated loads for the same approved sample.
- **SC-004**: Repeated dashboard renders do not change existing reconciliation workbench output panels, rows, filters, theme, or workspace session state.
- **SC-005**: Dashboard markup and display state contain no server/OCR/raw-source/upload execution path, no output-adapter write wording, and no real natural-person sample data.

## Assumptions

- The current alpha dashboard uses the existing approved-sample workbench as the only supported executable stage.
- Planned stages may be visible as status/navigation placeholders but are not implemented in this slice.
- Person-level and population-level context remains mocked or simulated and explicitly labeled.
- Browser-local navigation may use the existing app route/rendering pattern; no router dependency is required unless already present.
- No new contracts, schemas, migrations, seeds, sql.js tables, or output adapters are required for the MVP.

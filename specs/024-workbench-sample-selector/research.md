# Research: Reconciliation Workbench Sample Selector

## Decision: Treat the selector as approved-sample display state

**Rationale**: The feature is scoped to the existing reconciliation workbench page. The selector should choose among approved repository-backed sample definitions or approved mocked contexts and then rebuild the existing workbench display state from already implemented slices. This preserves the deterministic boundary and avoids creating a new import, persistence, or output-adapter path.

**Alternatives considered**:

- Add file upload or local file browsing: rejected because it would permit raw, unreviewed, or ad hoc sample inputs.
- Add URL-based sample loading: rejected because the browser-only runtime must not depend on hosted samples or remote data.
- Persist selected sample in a new table: rejected because the selector is navigation/display state and no new persistence responsibility is needed.

## Decision: Keep the default sample stable and support a fixed-sample selector when only one sample is fully supported

**Rationale**: The current workbench is already deterministic for the approved BSRS fixture. The spec allows an MVP where only one fully supported approved sample exists, as long as the control clearly labels the fixed selected sample and does not imply unsupported inputs. The selector model should still be shaped to support additional approved options when their workbench evidence is available.

**Alternatives considered**:

- Block implementation until multiple samples have complete workbench evidence: rejected because the slice can deliver value by making the approved sample boundary explicit now.
- Synthesize additional natural-person-like samples: rejected because the feature prohibits real natural-person data and permits only simulated/mocked context when needed.

## Decision: Preserve existing table and trace-expansion contracts

**Rationale**: Prior slices already added Shared Facts, Shared Values, and row-level trace details. Sample switching must update those rows through the selected workbench state while preserving columns, statuses, severities, ordering, and expansion controls.

**Alternatives considered**:

- Replace the existing workbench markup with a separate selector page: rejected because the feature explicitly improves the existing page only.
- Add a new adapter-specific comparison view: rejected because no new output adapters or business domains are in scope.

## Decision: Test selector boundaries and deterministic repeated selection in the focused workbench test file

**Rationale**: The behavior is page/state-level and should be regression-protected near the existing workbench tests. Tests should verify approved-only options, no raw/hosted/free-form paths, no real-person text, selected-sample header updates, preserved output panels/tables, trace detail continuity, and repeated-build equality.

**Alternatives considered**:

- Broaden tests across every output adapter suite: rejected for MVP planning because adapter behavior is not changing; targeted preservation assertions in the workbench suite are more direct.
- Use browser automation as the primary test: rejected for the MVP because current workbench coverage is deterministic markup/state tests; manual or focused render checks can be added if layout risk increases.

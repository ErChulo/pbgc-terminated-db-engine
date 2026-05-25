# Research: Theme and Progress

## Decision: Add a display-only light/dark theme model

**Rationale**: A two-value theme keeps the alpha surface easy to test and avoids introducing user accounts or case persistence before the session-state feature. The current workbench is a single visible app surface, so an app-level toggle can be applied through page state and root markup/classes.

**Alternatives considered**:

- System-only theme detection: rejected because the user asked for an explicit toggle.
- Multi-theme palette library: rejected as unnecessary scope for the alpha MVP.

## Decision: Model progress as local display state

**Rationale**: The backlog requires progress/spinner/loading states for delayed processes, but this feature should not introduce new business processing or persistence. A display state with idle/loading/complete/failed/unsupported covers delayed local work, failed local work, and fail-fast unsupported paths without changing deterministic engine outputs.

**Alternatives considered**:

- Global job queue: rejected because there are no server jobs and the next feature will cover stronger work guards.
- Persisted progress records: rejected because this feature is display-only and should not write lower source layers.

## Decision: Use deterministic simulated delay for tests

**Rationale**: Tests need to prove progress state behavior without adding expensive work or depending on timers that make results flaky. A deterministic state builder/markup path can expose loading, failed, and unsupported states directly.

**Alternatives considered**:

- Real long-running calculation: rejected because it would violate the responsiveness objective.
- Network-backed progress: rejected by browser-only/no-server constraints.

## Decision: Preserve existing workbench state across UI-only changes

**Rationale**: Theme and progress must not reset the approved sample selector, status filter, severity filter, output panels, comparison tables, trace expansion controls, or deterministic row ordering.

**Alternatives considered**:

- Rebuild from defaults on toggle: rejected because it would lose analyst context.

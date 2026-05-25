# Research: Case Workspace and Session State

## Decision: Store display-state snapshot only

**Rationale**: The first workspace increment should preserve analyst context without turning browser-local state into deterministic case data. Selected sample, theme, status filter, and severity filter are enough for the MVP.

**Alternatives considered**:

- Store full output rows: rejected because outputs are deterministically rebuilt from approved artifacts.
- Store source-layer records: rejected because this feature is display-only.

## Decision: Use deterministic mocked workspace metadata

**Rationale**: Session status must be testable and must not include real-person data or runtime timestamps. A stable workspace id and stable evidence timestamp keep snapshots reproducible.

**Alternatives considered**:

- Current wall-clock saved time: rejected because it would make repeated render tests unstable.

## Decision: Validate restore inputs and fail gracefully

**Rationale**: Browser-local data can be missing or malformed. Restore must not silently apply unsupported values or erase stable content.

**Alternatives considered**:

- Always trust local storage: rejected because no silent fallbacks are allowed.

## Decision: Keep sql.js unchanged

**Rationale**: Workspace persistence through sql.js belongs to a later case-workspace slice. This feature is a local display-state bridge.

**Alternatives considered**:

- Add session tables now: rejected as premature and outside the MVP.

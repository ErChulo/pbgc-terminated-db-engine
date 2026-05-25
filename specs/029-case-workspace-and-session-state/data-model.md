# Data Model: Case Workspace and Session State

## Workspace Session Snapshot

**Purpose**: Browser-local display-state snapshot for a mocked workspace.

**Fields**:

- `workspace_id`
- `workspace_label`
- `sample_id`
- `theme`
- `status_filter`
- `severity_filter`
- `saved_at`
- `basis`

**Validation Rules**:

- `workspace_id`, `workspace_label`, and `basis` must identify mocked/local context only.
- `sample_id`, `theme`, `status_filter`, and `severity_filter` must be valid current workbench values.
- `saved_at` must be stable evidence, not wall-clock time.

## Workspace Session Status

**Purpose**: Display-only session state.

**Fields**:

- `status`: `unsaved`, `saved`, `restored`, or `unavailable`
- `label`
- `message`
- `snapshot`

**Validation Rules**:

- `unavailable` must preserve current stable content.
- `saved` and `restored` must expose deterministic snapshot metadata.
- Session status must not write source-layer or output-adapter records.

## Workbench View State

**Purpose**: Existing workbench state preserved across save/restore.

**Fields**:

- `sample_id`
- `theme`
- `status_filter`
- `severity_filter`
- `progress`
- `work_guard`
- `workspace_session`
- `output_panels`
- `shared_fact_rows`
- `shared_value_rows`
- `reconciliation_rows`

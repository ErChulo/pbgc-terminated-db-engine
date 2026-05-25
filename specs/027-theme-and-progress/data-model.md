# Data Model: Theme and Progress

## Theme Preference

**Purpose**: Display-only workbench visual mode.

**Fields**:

- `value`: `light` or `dark`
- `label`: analyst-readable label
- `source`: `default`, `session`, or `explicit`

**Validation Rules**:

- Unknown values fall back to `light`.
- Theme value is not a deterministic engine input and must not alter output data.

## Progress State

**Purpose**: Display-only state for delayed or unsupported local workbench actions.

**Fields**:

- `status`: `idle`, `loading`, `complete`, `failed`, or `unsupported`
- `label`: analyst-readable status text
- `message`: concise display message
- `detail`: optional deterministic detail for failure/unsupported states
- `busy`: boolean indicating whether the UI should expose a pending state

**Validation Rules**:

- `loading` must be visible before delayed work replaces rendered content.
- `failed` and `unsupported` must clear busy state and keep the last stable workbench content visible.
- Progress state must not write source-layer or output-adapter records.

## Workbench UI State

**Purpose**: Combines existing reconciliation workbench state with display-only theme and progress state.

**Fields**:

- `sample_id`
- `status_filter`
- `severity_filter`
- `theme`
- `progress`
- `output_panels`
- `shared_fact_rows`
- `shared_value_rows`
- `reconciliation_rows`

**State Transitions**:

- `theme toggle`: updates `theme` only and preserves existing workbench data and filters.
- `delayed refresh start`: sets `progress.status` to `loading` while preserving current workbench content.
- `delayed refresh complete`: sets `progress.status` to `complete` or `idle` and displays deterministic refreshed workbench state.
- `delayed refresh failed`: sets `progress.status` to `failed`, clears busy state, and keeps stable content visible.
- `unsupported load`: sets `progress.status` to `unsupported`, clears busy state, and does not start expensive work.

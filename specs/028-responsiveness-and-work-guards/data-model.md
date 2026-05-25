# Data Model: Responsiveness and Work Guards

## Work Guard State

**Purpose**: Display-only state for guarded local workbench operations.

**Fields**:

- `status`: `idle`, `running`, `cancelled`, `complete`, or `unsupported`
- `label`: analyst-readable guard status
- `message`: concise display message
- `detail`: optional deterministic explanation
- `cancellable`: boolean indicating whether a cancel control should be active
- `started_at`: deterministic stable evidence timestamp label

**Validation Rules**:

- `running` must show a visible cancel control.
- `cancelled` must preserve stable content and must not be overwritten by stale delayed completion.
- `unsupported` must appear before delayed work starts.
- Guard state must not write source-layer or output-adapter records.

## Work Guard Evidence

**Purpose**: Deterministic support-limit and attempted-size evidence for local work.

**Fields**:

- `supported_work_units`
- `attempted_work_units`
- `unit_label`
- `basis`

**Validation Rules**:

- Attempted units greater than supported units must produce `unsupported`.
- Unit counts are mocked/sample metadata and must not represent real participant data.

## Workbench View State

**Purpose**: Existing workbench state preserved across guard transitions.

**Fields**:

- `sample_id`
- `theme`
- `status_filter`
- `severity_filter`
- `progress`
- `work_guard`
- `output_panels`
- `shared_fact_rows`
- `shared_value_rows`
- `reconciliation_rows`

**State Transitions**:

- `guarded work start`: sets guard status to `running`, shows cancel control, preserves content.
- `guarded work cancel`: sets guard status to `cancelled`, clears cancellable flag, preserves content.
- `guarded work complete`: sets guard status to `complete`, preserves deterministic refreshed content.
- `unsupported work`: sets guard status to `unsupported`, shows fail-fast explanation, preserves content.

# Contract: Case Workspace and Session State

## Scope

This contract defines browser-local display-state snapshots for the existing reconciliation workbench. It does not define deterministic case-data persistence, a new business domain, an engine module, or an output adapter.

## Inputs

- Existing approved sample identifier.
- Existing theme, status filter, severity filter, progress state, and work guard state.
- Optional saved session snapshot.
- Optional session status request: unsaved, saved, restored, or unavailable.

## Outputs

The rendered workbench display model must include:

- `workspace_session.status`: `unsaved`, `saved`, `restored`, or `unavailable`
- `workspace_session.message`
- `workspace_session.snapshot.workspace_id` when a valid snapshot exists
- Save and restore controls
- Existing output panels, comparison rows, trace details, sample selector, theme control, status filter, severity filter, progress state, and work guard state

## Invariants

- Session state must not change deterministic output values.
- Session state must not write source assertions, resolved facts, resolved provisions, engine input packets, deterministic output rows, output-adapter rows, or sql.js records.
- Invalid or unavailable snapshots must preserve current stable workbench content.
- Existing workbench trace details must remain available when session state changes.
- No raw OCR, raw source document, hosted asset, hosted prompt, uploaded raw participant data, or real natural-person data path may be introduced.

## Focused Regression Expectations

- Repeated builds with the same session inputs produce equal markup.
- Saving exposes a deterministic mocked snapshot.
- Restoring a valid snapshot restores sample, theme, status filter, and severity filter.
- Unavailable restore displays a stable message and preserves current content.

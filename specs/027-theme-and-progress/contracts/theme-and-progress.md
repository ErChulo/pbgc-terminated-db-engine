# Contract: Theme and Progress Workbench State

## Scope

This contract defines display-only state for the existing reconciliation workbench. It does not define a new business domain, deterministic engine module, persistence table, or output adapter.

## Inputs

- Existing approved sample identifier from the workbench sample selector.
- Existing status and severity filter values.
- Theme value: `light` or `dark`.
- Progress state request: idle/default, loading, failed, complete, or unsupported.

## Outputs

The rendered workbench display model must include:

- `theme.value`: `light` or `dark`
- `theme.label`: display label
- `progress.status`: `idle`, `loading`, `complete`, `failed`, or `unsupported`
- `progress.busy`: true only for loading state
- `progress.message`: visible analyst-readable text when not idle
- Existing output panels, comparison rows, trace details, sample selector, status filter, and severity filter

## Invariants

- Theme and progress state must not change deterministic output values.
- Theme and progress state must not write source assertions, resolved facts, resolved provisions, engine input packets, deterministic output rows, or output-adapter rows.
- Existing workbench trace details must remain available when theme or progress state changes.
- Failed and unsupported progress states must be display-only and must keep the current stable workbench content visible.
- No raw OCR, raw source document, hosted asset, hosted prompt, uploaded raw participant data, or real natural-person data path may be introduced.

## Focused Regression Expectations

- Repeated builds with the same theme/progress inputs produce equal markup.
- Theme toggling preserves selected sample, filters, output panels, visible row counts, and trace controls.
- Loading progress renders a visible busy indicator and does not remove current workbench content.
- Failed and unsupported progress render display messages without creating output adapter or persistence writes.

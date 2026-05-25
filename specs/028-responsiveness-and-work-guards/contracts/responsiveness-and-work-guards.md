# Contract: Responsiveness and Work Guards

## Scope

This contract defines display-only local work guard state for the existing reconciliation workbench. It does not define a new business domain, deterministic engine module, persistence table, or output adapter.

## Inputs

- Existing approved sample identifier.
- Existing theme, status filter, severity filter, and progress state.
- Guard status request: idle/default, running, cancelled, complete, or unsupported.
- Attempted local work-unit count.

## Outputs

The rendered workbench display model must include:

- `work_guard.status`: `idle`, `running`, `cancelled`, `complete`, or `unsupported`
- `work_guard.cancellable`: true only for running state
- `work_guard.message`: visible analyst-readable text when not idle
- `work_guard.evidence.supported_work_units`
- `work_guard.evidence.attempted_work_units`
- Existing output panels, comparison rows, trace details, sample selector, theme control, status filter, and severity filter

## Invariants

- Work guard state must not change deterministic output values.
- Work guard state must not write source assertions, resolved facts, resolved provisions, engine input packets, deterministic output rows, output-adapter rows, or persistence records.
- Unsupported oversized work must fail fast before delayed work begins.
- Existing workbench trace details must remain available when guard state changes.
- No raw OCR, raw source document, hosted asset, hosted prompt, uploaded raw participant data, or real natural-person data path may be introduced.

## Focused Regression Expectations

- Repeated builds with the same guard inputs produce equal markup.
- Running state renders a cancel control and stable content.
- Cancelled state renders a cancelled message and stable content.
- Unsupported state renders supported/attempted unit evidence and stable content.
- Guard state preserves theme, selected sample, filters, output panels, visible row counts, and trace controls.

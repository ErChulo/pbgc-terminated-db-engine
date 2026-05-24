# Contract: Reconciliation Workbench Sample Selector

## Scope

This contract defines the display-state behavior for the existing reconciliation workbench sample selector. It is not an output adapter contract and does not create persistence, import, or calculation responsibilities.

## Inputs

The workbench selector may consume:

- Approved sample artifacts already committed in the repository.
- Approved mocked sample context created for the workbench.
- Existing deterministic output display rows from BSRS configuration, V1/VE output, and valuation listings output.
- Existing cross-slice Shared Facts, Shared Values, reconciliation, and trace-detail display state.
- Existing DD-backed mapping metadata where already used by the workbench rows.

The workbench selector must not consume:

- Raw OCR.
- Raw source documents.
- Emails, images, PDFs, or unreviewed extraction output.
- Uploaded samples.
- URL-loaded or hosted samples.
- Free-form analyst-entered sample paths or sample data.
- Real participant, beneficiary, alternate payee, survivor, or other natural-person data.

## Selector Display Contract

The selector must expose a deterministic list of approved options.

Each option must provide:

- Stable sample id.
- Analyst-readable label.
- Approved artifact or approved mocked-context basis.
- Stable ordering key.
- Default-selection indicator where applicable.

If only one fully supported approved sample exists, the selector may render as a fixed-sample selector, but it must still make the approved sample identity and artifact basis visible.

## Selection Behavior

When a supported approved sample is selected:

- The sample header updates to the selected sample.
- The selected-sample label updates deterministically.
- Mocked case/population context updates to the selected sample context.
- BSRS, V1/VE, and valuation listings output panels update from the selected sample display state.
- Shared Facts, Shared Values, reconciliation rows, findings, and trace details update from the selected sample display state.
- Existing row ordering, status vocabulary, severity vocabulary, mapping-basis display, and trace expansion behavior are preserved.

When the active sample is selected again:

- The visible display state remains identical.
- No duplicate rows, panels, selector options, warnings, or trace controls are added.

When an unsupported or unavailable sample is requested:

- The current selected sample remains active.
- No raw-source, upload, URL, or free-form external loading path appears.
- Any warning/error presentation uses existing structured workbench conventions.

## Determinism Requirements

For each supported approved sample, two repeated builds or selections must produce identical:

- Selected sample id and label.
- Stable generated evidence value.
- Output panel count, labels, fields, and ordering.
- Shared Facts rows and ordering.
- Shared Values rows and ordering.
- Reconciliation rows and ordering.
- Status and severity labels.
- Trace-detail identifiers, labels, source fields, mapping basis, raw values, normalized values, rule version, and producing module.

## Boundary Requirements

The selector is display/navigation-only.

It must not:

- Add new business domains.
- Add new output adapters.
- Write to output-adapter persistence tables.
- Write lower source-layer records.
- Recalculate benefits or alter resolved facts.
- Introduce server calls or hosted dependencies.

## Regression Expectations

Tests must prove:

- Approved-only selector options.
- No upload, URL, raw-source, email, OCR, or free-form external loading path.
- No real natural-person data in selector/header/context/panels/tables/traces.
- Header and display state update when a supported approved sample is selected.
- Existing output panels, Shared Facts table, Shared Values table, reconciliation rows, and trace expansion controls remain present after selection.
- Repeated selection/builds are stable for each supported sample.

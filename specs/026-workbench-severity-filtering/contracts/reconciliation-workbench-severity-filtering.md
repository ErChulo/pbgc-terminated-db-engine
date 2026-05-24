# Contract: Reconciliation Workbench Severity Filtering

## Scope

This contract defines display-only severity filtering behavior for the existing reconciliation workbench. It is not an output adapter contract and does not create calculation, import, or persistence responsibilities.

## Inputs

Filtering may consume:

- Selected approved sample identity.
- Existing workbench reconciliation rows.
- Existing Shared Facts rows.
- Existing Shared Values rows.
- Existing row status values.
- Existing row severity values.
- Existing none/not-applicable severity conventions.
- Existing trace-detail display state.

Filtering must not consume:

- Raw OCR.
- Raw source documents.
- Emails, images, PDFs, or unreviewed extraction output.
- Uploaded samples.
- URL-loaded or hosted samples.
- Free-form analyst-entered sample data.
- Real participant, beneficiary, alternate payee, survivor, or other natural-person data.

## Severity Filter Contract

The workbench must expose a visible severity filter where severity applies.

The severity filter must:

- Include an unfiltered option.
- Include only severity or none/not-applicable conventions already emitted by existing rows for the selected approved sample.
- Apply to reconciliation rows, Shared Facts rows, and Shared Values rows where severity applies.
- Preserve Shared Facts none/error conventions.
- Preserve original relative ordering of matching rows.
- Show a deterministic row-group empty state when no rows match.

## Combined Filter Contract

When both status and severity filters are active, the workbench must:

- Preserve the selected approved sample.
- Preserve the existing status filter value and label.
- Show only applicable rows that satisfy both filters.
- Keep rows without applicable severity within the existing none/not-applicable convention.
- Restore status-filtered rows in deterministic order when severity is cleared.
- Restore unfiltered rows in deterministic order when both filters are cleared.

## Preservation Requirements

Filtering must preserve:

- Approved-sample selector and selected sample.
- Sample header and mocked context.
- BSRS, V1/VE, and valuation listings output panels.
- Existing row status and severity vocabularies.
- Existing trace expansion controls and trace-detail content for visible rows.
- Deterministic row ordering within filtered results.
- Existing no-real-person-data boundary.

Filtering must not:

- Add new business domains.
- Add new output adapters.
- Write to output-adapter persistence tables.
- Write lower source-layer records.
- Recalculate benefits.
- Alter resolved facts or row evidence.
- Introduce server calls or hosted dependencies.

## Determinism Requirements

For the same selected approved sample and active filters, two repeated builds must produce identical:

- Active status and severity labels and values.
- Filter option lists and ordering.
- Filtered row counts.
- Filtered row ordering.
- Empty-state messages.
- Trace-detail identifiers and content for visible rows.

## Regression Expectations

Tests must prove:

- Severity filtering limits visible rows where severity applies.
- Shared Facts preserve existing none/error severity conventions.
- Combined status-and-severity filtering applies both filters.
- Clearing severity restores current status-filtered row counts and ordering.
- Empty states appear when no rows match.
- Sample selector, header, output panels, existing status filter, and trace expansion controls remain present.
- No raw, hosted, uploaded, free-form, or real-person data path appears.

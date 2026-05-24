# Contract: Reconciliation Workbench Status Filtering

## Scope

This contract defines display-only filtering behavior for the existing reconciliation workbench. It is not an output adapter contract and does not create calculation, import, or persistence responsibilities.

## Inputs

Filtering may consume:

- Selected approved sample identity.
- Existing workbench reconciliation rows.
- Existing Shared Facts rows.
- Existing Shared Values rows.
- Existing row status values.
- Existing row severity or none/not-applicable conventions.
- Existing trace-detail display state.

Filtering must not consume:

- Raw OCR.
- Raw source documents.
- Emails, images, PDFs, or unreviewed extraction output.
- Uploaded samples.
- URL-loaded or hosted samples.
- Free-form analyst-entered sample data.
- Real participant, beneficiary, alternate payee, survivor, or other natural-person data.

## Status Filter Contract

The workbench must expose a visible status filter.

The status filter must:

- Include an unfiltered option.
- Include only status values already emitted by existing rows for the selected approved sample.
- Apply to reconciliation rows, Shared Facts rows, and Shared Values rows.
- Preserve original relative ordering of matching rows.
- Show a deterministic row-group empty state when no rows match.

## Severity Filter Contract

The workbench must expose a visible severity filter where severity applies.

The severity filter must:

- Include an unfiltered option.
- Include only existing severity or none/not-applicable conventions already emitted by rows for the selected approved sample.
- Apply to rows with applicable severity fields.
- Preserve Shared Facts none/error conventions.
- Combine with status filtering when both filters are active.
- Preserve original relative ordering of matching rows.
- Show a deterministic row-group empty state when no rows match.

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

- Active filter labels and values.
- Filter option lists and ordering.
- Filtered row counts.
- Filtered row ordering.
- Empty-state messages.
- Trace-detail identifiers and content for visible rows.

## Regression Expectations

Tests must prove:

- Status filtering limits visible rows across all row groups.
- Severity filtering limits visible rows where severity applies.
- Combined filtering applies both filters.
- Clearing filters restores original row counts and ordering.
- Empty states appear when no rows match.
- Sample selector, header, output panels, and trace expansion controls remain present.
- No raw, hosted, uploaded, free-form, or real-person data path appears.

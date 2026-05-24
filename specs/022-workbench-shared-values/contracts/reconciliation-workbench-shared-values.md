# Contract: Reconciliation Workbench Shared Values

## Scope

This contract defines the visible behavior for adding an analyst-readable
Shared Values table to the existing browser reconciliation workbench page. It
is not a public API, new output adapter, persistence contract, calculation
contract, import flow, export flow, case-selection workflow, or new business
domain.

## Input Contract

The Shared Values display layer may consume only:

- approved sample artifacts committed in the repository
- existing deterministic BSRS configuration output evidence
- existing deterministic V1/VE output evidence
- existing deterministic valuation-listing output evidence
- existing shared-value reconciliation comparison records and findings
- existing DD/fallback mapping metadata and trace metadata
- mocked or simulated display labels authored in committed repository files

The layer must not consume raw OCR, raw documents, emails, images, PDFs,
unreviewed extraction output, hosted services, runtime network input,
uncommitted external files, or real natural-person data.

## Shared Values Table Contract

The page must show a distinct Shared Values table.

Each displayed row must show:

- value label
- left compared source
- left compared field
- left raw compared value
- left normalized value when available, or an intentional absence marker
- right compared source
- right compared field
- right raw compared value
- right normalized value when available, or an intentional absence marker
- status preserving the existing shared-value classification
- severity when applicable, or an intentional absence marker
- mapping basis
- traceability cue including rule version and producing module

Rows must render in stable deterministic order across repeated loads of the
same fixed approved sample.

## Classification Contract

The displayed status must preserve the existing shared-value reconciliation
classification. The display layer may translate status text into
analyst-readable labels but must not invent new status meanings or recalculate
classification.

Supported displayed classifications are:

- agreement
- drift
- warning
- nullable
- unsupported
- formatting-only

## Boundary Contract

The Shared Values increment must not:

- mutate deterministic output rows
- mutate existing Shared Facts rows
- persist workbench state into engine or output tables
- add output adapter rows
- introduce new migrations, seeds, schemas, or source-layer writes
- recalculate benefits
- change existing BSRS, V1/VE, valuation-listing, Shared Facts, or shared-value
  reconciliation contracts
- call a server or hosted service
- display real participant, beneficiary, alternate payee, survivor, or other
  natural-person data

## Determinism Contract

Repeated loads of the same fixed approved sample must produce identical:

- Shared Values row count
- Shared Values row ordering
- displayed compared sources
- displayed compared fields
- displayed raw values
- displayed normalized values or absence markers
- displayed statuses
- displayed severities or absence markers
- displayed traceability cues

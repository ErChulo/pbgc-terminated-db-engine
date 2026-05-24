# Contract: Reconciliation Workbench Comparison Tables

## Scope

This contract defines the visible behavior for adding analyst-readable
comparison tables to the existing browser reconciliation workbench page. It is
not a public API, new output adapter, persistence contract, calculation
contract, import flow, export flow, case-selection workflow, or new business
domain.

## Input Contract

The comparison-table layer may consume only:

- approved sample artifacts committed in the repository
- existing deterministic BSRS configuration output evidence
- existing deterministic V1/VE output evidence
- existing deterministic valuation-listing output evidence
- existing shared-fact reconciliation comparison records and findings
- existing shared-value reconciliation comparison records and findings
- existing DD/fallback mapping metadata and trace metadata
- mocked or simulated display labels authored in committed repository files

The layer must not consume raw OCR, raw documents, emails, images, PDFs,
unreviewed extraction output, hosted services, runtime network input,
uncommitted external files, or real natural-person data.

## Shared-Facts Table Contract

The page must show a distinct shared-facts table.

Each displayed row must show:

- fact label
- left compared source
- left compared field
- left compared value
- right compared source
- right compared field
- right compared value
- agreement-versus-drift status, preserving nullable, unsupported, warning, and
  formatting-only statuses when those classifications apply
- severity when applicable, or a clear intentional absence marker when not
  applicable

Rows must render in stable deterministic order across repeated loads of the
same fixed approved sample.

## Shared-Values Table Contract

The page must show a distinct shared-values table.

Each displayed row must show:

- value label
- left compared source
- left compared field
- left raw compared value
- left normalized value when available
- right compared source
- right compared field
- right raw compared value
- right normalized value when available
- agreement-versus-drift status, preserving nullable, unsupported, warning, and
  formatting-only statuses when those classifications apply
- severity when applicable, or a clear intentional absence marker when not
  applicable

Rows must render in stable deterministic order across repeated loads of the
same fixed approved sample.

## Boundary Contract

The comparison-table increment must not:

- mutate deterministic output rows
- persist workbench state into engine or output tables
- add output adapter rows
- introduce new migrations, seeds, schemas, or source-layer writes
- recalculate benefits
- change existing BSRS, V1/VE, valuation-listing, shared-fact, or shared-value
  reconciliation contracts
- call a server or hosted service
- display real participant, beneficiary, alternate payee, survivor, or other
  natural-person data

## Determinism Contract

Repeated loads of the same fixed approved sample must produce identical:

- shared-facts row count
- shared-facts row ordering
- shared-facts displayed compared sources, fields, values, statuses, and
  severities
- shared-values row count
- shared-values row ordering
- shared-values displayed compared sources, fields, raw values, normalized
  values, statuses, and severities

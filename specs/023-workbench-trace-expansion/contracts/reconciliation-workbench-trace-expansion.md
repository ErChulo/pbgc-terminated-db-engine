# Contract: Reconciliation Workbench Trace Expansion

## Scope

This contract defines the visible behavior for adding row-level trace-detail
expansion to the existing browser reconciliation workbench page. It is not a
public API, new output adapter, persistence contract, calculation contract,
import flow, export flow, case-selection workflow, or new business domain.

## Input Contract

The trace-expansion display layer may consume only:

- approved sample artifacts committed in the repository
- existing deterministic BSRS configuration output evidence
- existing deterministic V1/VE output evidence
- existing deterministic valuation-listing output evidence
- existing reconciliation row evidence
- existing Shared Facts row evidence
- existing Shared Values row evidence
- existing DD/fallback mapping metadata and trace metadata
- mocked or simulated display labels authored in committed repository files

The layer must not consume raw OCR, raw documents, emails, images, PDFs,
unreviewed extraction output, hosted services, runtime network input,
uncommitted external files, or real natural-person data.

## Expansion Contract

The page must provide a visible trace-detail expansion control for:

- reconciliation rows
- Shared Facts rows
- Shared Values rows

Each expanded detail must show:

- row label
- compared sources
- compared fields
- raw values where available
- normalized values where applicable, or an intentional absence marker
- status preserving the existing classification
- severity when applicable, or an intentional absence marker
- mapping basis when available
- source paths when available, or an intentional absence marker
- rule version
- producing module

Expansion controls and expanded details must render in stable deterministic
order across repeated loads of the same fixed approved sample.

## Classification Contract

Expanded details must preserve existing reconciliation classifications. The
display layer may translate labels into analyst-readable text but must not
invent new status meanings, recalculate classifications, or change existing
severity meaning.

Supported displayed classifications are:

- agreement
- drift
- warning
- nullable
- unsupported
- formatting-only

## Boundary Contract

The trace-expansion increment must not:

- mutate deterministic output rows
- mutate existing reconciliation rows
- mutate existing Shared Facts rows
- mutate existing Shared Values rows
- persist workbench expansion state into engine or output tables
- add output adapter rows
- introduce new migrations, seeds, schemas, or source-layer writes
- recalculate benefits
- change existing BSRS, V1/VE, valuation-listing, Shared Facts, Shared Values,
  or reconciliation contracts
- call a server or hosted service
- display real participant, beneficiary, alternate payee, survivor, or other
  natural-person data

## Determinism Contract

Repeated loads of the same fixed approved sample must produce identical:

- row count
- row ordering
- expansion control labels
- expanded detail labels
- compared sources
- compared fields
- raw values
- normalized values or absence markers
- statuses
- severities or absence markers
- mapping basis
- rule versions
- producing modules

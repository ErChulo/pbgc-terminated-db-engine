# Contract: Reconciliation Workbench UI

## Scope

This contract defines the visible behavior for one browser reconciliation
workbench page over existing approved sample evidence. It is not a public API,
new output adapter, persistence contract, calculation contract, import flow, or
review-note workflow.

## Input Contract

The workbench may consume only:

- approved sample artifacts committed in the repository
- existing deterministic BSRS configuration output rows
- existing deterministic V1/VE output rows
- existing deterministic valuation-listing output rows
- existing cross-slice reconciliation comparison records and findings
- existing DD/fallback mapping metadata and trace metadata

The workbench must not consume raw OCR, raw documents, emails, images, PDFs,
unreviewed extraction output, hosted services, runtime network input, or
uncommitted external workbooks.

## Visible Page Contract

The page must show, in one screen:

- approved sample identity
- BSRS configuration output panel
- V1/VE output panel
- valuation listings output panel
- reconciliation row list with agreement-versus-drift status
- finding severity where findings exist
- trace details for visible comparisons/findings

If the page shows `generated_at`, it must be derived from stable existing
deterministic evidence rather than wall-clock time.

## Reconciliation Status Contract

Displayed rows must use a stable label for each underlying status:

- accepted agreement
- drift or blocking mismatch
- warning mismatch
- accepted nullable or optional absence
- unsupported branch
- formatting-only difference

The page must not collapse drift and warning into the same visual state.

## Trace Detail Contract

Each visible comparison or finding must expose:

- compared slices
- compared fields
- displayed compared values
- normalized values when available
- mapping or fallback basis
- source artifact path when available
- rule version
- producing module

## Behavior Preservation Contract

The workbench must not:

- mutate deterministic output rows
- persist workbench state into engine or output tables
- add output adapter rows
- introduce new migrations, seeds, or schemas
- recalculate benefits
- change existing BSRS, V1/VE, valuation-listing, or reconciliation contracts
- call a server or hosted service

## Layout Contract

Desktop and mobile viewport checks at 1440x900 and 390x844 must confirm:

- the three output panels and reconciliation section remain readable
- long field names, values, statuses, and trace details do not overlap adjacent
  content
- side-by-side presentation may responsively stack when necessary to preserve
  readability

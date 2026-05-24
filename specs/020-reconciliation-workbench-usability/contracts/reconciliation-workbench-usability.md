# Contract: Reconciliation Workbench Usability

## Scope

This contract defines the visible behavior for improving the existing browser
reconciliation workbench page. It is not a public API, new output adapter,
persistence contract, calculation contract, import flow, export flow, or case
selection workflow.

## Input Contract

The workbench usability layer may consume only:

- approved sample artifacts committed in the repository
- existing deterministic BSRS configuration output evidence
- existing deterministic V1/VE output evidence
- existing deterministic valuation-listing output evidence
- existing shared-fact reconciliation comparison records and findings
- existing shared-value reconciliation comparison records and findings
- existing DD/fallback mapping metadata and trace metadata
- mocked or simulated display labels authored in committed repository files

The workbench must not consume raw OCR, raw documents, emails, images, PDFs,
unreviewed extraction output, hosted services, runtime network input,
uncommitted external files, or real natural-person data.

## Header Contract

The first visible header area must show:

- approved sample identity
- fixed-sample or approved-sample selector label
- mocked case or population context
- explicit no-real-person-data notice
- stable generated metadata when shown

## Business Panel Contract

The page must show business-labeled panels for:

- BSRS configuration output
- V1/VE output
- valuation listings output

Panel labels must be understandable without relying only on technical package or
slice names.

## Reconciliation Table Contract

The page must show separate visible sections for:

- shared facts
- shared values

Each displayed row must show status, severity where present, compared slices,
compared fields, and compared values or explicit absence/nullable
classification.

## Trace Expansion Contract

Each expandable row must reveal, when available:

- source artifact
- rule version
- producing module
- mapping or fallback basis
- DD field or approved fallback name
- reviewed fact context
- compared slices
- compared fields
- compared values

Expansion must not navigate away from the workbench or mutate deterministic
outputs.

## Behavior Preservation Contract

The usability increment must not:

- mutate deterministic output rows
- persist workbench state into engine or output tables
- add output adapter rows
- introduce new migrations, seeds, or schemas
- recalculate benefits
- change existing BSRS, V1/VE, valuation-listing, shared-fact, or shared-value
  reconciliation contracts
- call a server or hosted service
- display real natural-person data

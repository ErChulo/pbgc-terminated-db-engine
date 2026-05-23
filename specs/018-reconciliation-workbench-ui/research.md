# Research: Reconciliation Workbench UI

## Decision: Build the workbench as one existing-web-app page

**Rationale**: The feature asks for one visible browser page in the existing
web app. The current app already uses page modules under `apps/web/src/pages/`
and deterministic app slices under `apps/web/src/app/`. Reusing that boundary
keeps the workbench a display surface rather than a new product shell or output
adapter.

**Alternatives considered**:

- Add a separate app or route framework: rejected because the current web app is
  already sufficient for one visible page.
- Build a generated report adapter: rejected because the scope explicitly
  excludes new output adapters.

## Decision: Use approved sample fixture evidence already in the repository

**Rationale**: The workbench must remain inside the reviewed-input boundary.
Existing slice fixtures and approved sample artifacts already feed deterministic
BSRS, V1/VE, valuation-listing, and reconciliation outputs without raw-source
reads.

**Alternatives considered**:

- Load user-selected files: rejected because the first increment is approved
  sample only and must not read raw or unreviewed inputs.
- Fetch sample data at runtime: rejected because browser runtime must not depend
  on server calls or hosted services.

## Decision: Present reconciliation data from existing shared helpers

**Rationale**: Existing cross-slice reconciliation helpers already define
selected shared values, statuses, basis metadata, findings, and deterministic
ordering. The workbench should present those results rather than recomputing or
reclassifying them.

**Alternatives considered**:

- Rebuild comparison logic in the page: rejected because it risks drift from
  existing deterministic helper behavior.
- Add new validation rules for the UI: rejected because that would be a new
  business-domain or calculation increment.

## Decision: Keep the workbench display-only

**Rationale**: The spec forbids new business domains, adapters, source-layer
writes, and persistence mutation. Display-only behavior preserves existing
contracts and allows deterministic repeated rendering over the same approved
sample.

**Alternatives considered**:

- Persist workbench review notes: rejected as a new write surface.
- Add corrective editing controls: rejected because editing reviewed inputs or
  outputs is outside this slice.

## Decision: Verify layout stability on desktop and mobile

**Rationale**: The user-facing requirement includes readable side-by-side
presentation and no overlapping values, labels, or trace details. The plan
therefore needs viewport-oriented UI checks in addition to deterministic data
checks.

**Alternatives considered**:

- Rely only on unit tests: rejected because overlapping UI text is a layout
  failure that data tests do not catch.

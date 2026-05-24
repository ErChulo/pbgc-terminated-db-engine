# Research: Reconciliation Workbench Usability

## Decision: Keep the increment on the existing workbench page

**Rationale**: The approved spec scopes the slice to improving the existing
browser workbench only. Reusing the current page preserves browser-only behavior
and avoids a new workflow or output adapter.

**Alternatives considered**:

- Add a new review dashboard: rejected because it creates a second navigation
  surface and expands scope beyond the existing workbench page.
- Add export/report functionality: rejected because exports are not part of the
  usability increment and could imply a new adapter.

## Decision: Use a fixed approved sample label for the first increment

**Rationale**: The spec permits a fixed-sample label or a selector backed only
by approved artifacts and mocked data. A fixed label is the smallest usable
choice for one approved sample and avoids implying unavailable multi-case
selection.

**Alternatives considered**:

- Multi-sample selector: rejected for this increment because the current
  approved workbench data builder targets one sample.
- Free-form sample input: rejected because it would risk unreviewed or external
  data entry.

## Decision: Mock person-level readability labels explicitly

**Rationale**: Analysts need recognizable case/population context, but the spec
forbids real natural-person data. Mock labels provide readability while keeping
the privacy boundary visible.

**Alternatives considered**:

- Use fixture names as person labels: rejected unless clearly mocked because
  fixture values can look like natural-person data.
- Hide all person-level context: rejected because it weakens analyst usability
  and sample recognition.

## Decision: Show shared facts and shared values as separate visible tables

**Rationale**: Shared-fact reconciliation and value-level reconciliation answer
different review questions. Separate tables let analysts distinguish structural
field agreement from selected value agreement while preserving existing helper
semantics.

**Alternatives considered**:

- Single merged reconciliation table: rejected because it blurs fact and value
  basis metadata.
- Tabs: rejected for the first increment because the spec asks for visible
  tables on one workbench page.

## Decision: Use row-level clickable trace expansion

**Rationale**: Trace details are required, but displaying every trace field by
default would reduce scanability. Row expansion keeps the default view compact
while keeping source artifact, rule version, producer, mapping basis, and
compared evidence available in place.

**Alternatives considered**:

- Modal trace details: rejected because it separates the trace from the row and
  adds unnecessary state.
- Always-expanded traces: rejected because long source paths would dominate the
  workbench.

## Decision: Preserve deterministic display ordering

**Rationale**: The workbench is review evidence. Repeated loads of the same
approved sample must show stable header, panel order, row order, statuses, and
trace content.

**Alternatives considered**:

- Sort by current UI interaction state: rejected because it can obscure
  repeated-run comparison.
- Use runtime timestamps for sample context: rejected because it would violate
  deterministic repeated rendering.

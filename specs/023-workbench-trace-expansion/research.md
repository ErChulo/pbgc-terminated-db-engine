# Research: Reconciliation Workbench Trace Expansion

## Decision: Keep Trace Expansion Presentation-Only

**Rationale**: The approved spec scopes the work to the existing browser
workbench page and requires preserving existing contracts, output adapters,
browser-only sql.js boundaries, and deterministic slice behavior. Expanding
trace details over existing row evidence satisfies analyst needs without
touching calculation modules or persistence.

**Alternatives considered**:

- Persist expanded trace rows in SQLite: rejected because expansion state and
  detail projections are display-only views over existing deterministic
  evidence.
- Add a new trace output adapter: rejected because the feature is a workbench
  display increment and explicitly excludes new output adapters.

## Decision: Use Native Row-Level Disclosure Semantics

**Rationale**: A row-level expandable detail pattern lets analysts inspect trace
details without leaving the current workbench context. It can preserve row
order, row identity, keyboard access, and deterministic markup without adding a
new navigation flow or modal state.

**Alternatives considered**:

- Modal trace dialogs: rejected because they add separate overlay state and
  make side-by-side row review harder.
- Separate trace page: rejected because the increment is scoped to the existing
  workbench page only.

## Decision: Derive Detail Content From Existing Row Evidence

**Rationale**: Existing reconciliation rows, Shared Facts rows, and Shared
Values rows already expose compared sources, fields, values, mapping basis,
rule version, producing module, and value context. The expansion should project
this evidence into detail rows rather than recalculating status or looking up
new source layers.

**Alternatives considered**:

- Recompute trace details in the renderer: rejected because it risks display
  drift and duplicates deterministic helper behavior.
- Read approved sample files directly from the UI at runtime: rejected because
  current workbench state already contains the needed approved evidence.

## Decision: Use Intentional Absence Markers

**Rationale**: Some rows may not have normalized value context, severity, or a
source path. Displaying an explicit absence marker prevents analysts from
mistaking blank cells for rendering defects or missing reviewed evidence.

**Alternatives considered**:

- Leave absent details blank: rejected because blank values are ambiguous in
  review.
- Substitute zero, false, or inferred text: rejected because those values would
  misrepresent evidence.

## Decision: Deterministic Expansion Uses Stable Row Identifiers

**Rationale**: Repeated loads must show identical detail text for the same row.
Existing comparison identifiers and ordering keys provide stable row identity,
so expansion controls and details should be keyed from those values rather than
render timing or user interaction sequence.

**Alternatives considered**:

- Generate expansion IDs from array indexes only: rejected because indexes are
  less meaningful than existing comparison identifiers.
- Persist expansion state: rejected because persistence is outside scope and
  unnecessary for deterministic display.

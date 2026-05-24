# Research: Reconciliation Workbench Comparison Tables

## Decision: Keep The Increment Presentation-Only

**Rationale**: The approved spec scopes the work to the existing browser
workbench page and requires preserving existing contracts, output adapters,
browser-only sql.js boundaries, and deterministic slice behavior. Presenting
existing reconciliation records through clearer tables satisfies the analyst
need without touching calculation modules or persistence.

**Alternatives considered**:

- Add new reconciliation output adapters: rejected because the feature is a
  workbench display increment and explicitly excludes new output adapters.
- Persist table rows in SQLite: rejected because the rows are derived display
  projections over existing deterministic evidence and do not need new storage.

## Decision: Use Separate Shared-Fact And Shared-Value Display Models

**Rationale**: Shared facts and shared values answer different analyst
questions. Shared facts establish whether slices refer to the same case facts
and identifiers. Shared values expose raw and normalized value agreement,
formatting differences, nullable conditions, warnings, and drift. Separate
display models make the required columns explicit and independently testable.

**Alternatives considered**:

- Keep one combined reconciliation table: rejected because it cannot clearly
  distinguish fact-level agreement from value-level normalization evidence.
- Render only findings: rejected because agreements and non-finding statuses
  are required for deterministic review and stable row-order checks.

## Decision: Preserve Existing Status Classifications

**Rationale**: Existing reconciliation helpers already classify agreement,
drift, warning, nullable, unsupported, and formatting-only outcomes. The UI
should translate those classifications into readable table rows without
changing their meaning.

**Alternatives considered**:

- Collapse all statuses into agreement/drift: rejected because nullable,
  unsupported, warning, and formatting-only outcomes would lose review meaning.
- Recalculate status in the page layer: rejected because it would duplicate
  deterministic comparison logic and risk drift from shared helpers.

## Decision: Deterministic Ordering Comes From Stable Comparison Keys

**Rationale**: The tables must remain stable across repeated loads. Existing
comparison records expose stable identifiers and rule keys, so table ordering
should be derived from those stable values rather than insertion timing or
render behavior.

**Alternatives considered**:

- Preserve whatever array order arrives from rendering: rejected because tests
  should assert an explicit deterministic ordering rule.
- Sort by displayed label only: rejected because labels may be less unique than
  comparison identifiers and rule keys.

## Decision: No Real Natural-Person Data In Display Context

**Rationale**: The repository boundary allows approved samples and mocked or
simulated display labels only. Comparison tables may show approved sample IDs
and existing synthetic placeholder values, but person-level labels must remain
explicitly mocked or simulated.

**Alternatives considered**:

- Introduce realistic person names for analyst readability: rejected because
  the feature explicitly forbids real participant, beneficiary, or other
  natural-person data and prior usability work already supplies mocked context.

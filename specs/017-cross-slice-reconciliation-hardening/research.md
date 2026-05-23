# Research: Cross-Slice Reconciliation Hardening

## Decision: Use committed output evidence and approved samples as validation sources

**Rationale**: The feature is scoped to backend validation and regression
protection over already implemented slices. Current committed output fixtures,
approved BSRS configuration samples, approved V1 workbook samples, DD.csv, and
existing contracts are reviewed repository artifacts and therefore fit the
deterministic boundary.

**Alternatives considered**:

- Read raw PBGC source documents, OCR, PDFs, or emails: rejected because
  deterministic modules must not consume raw or unreviewed inputs.
- Fetch external workbooks or hosted guidance at runtime: rejected because the
  browser-only engine must not depend on network-loaded business logic.
- Generate new authoritative expected outputs: rejected because this hardening
  increment must reconcile current committed evidence rather than create a new
  output adapter or calculation domain.

## Decision: Add a small internal reconciliation helper

**Rationale**: Reconciliation needs shared normalization, deterministic sorting,
DD-first semantic resolution, approved fallback handling, and structured finding
payloads across BSRS, V1/VE, and valuation listings. A focused helper keeps this
logic testable without changing existing output adapters or successful output
packet shapes.

**Alternatives considered**:

- Embed reconciliation checks separately in each adapter: rejected because it
  would duplicate DD/fallback behavior and make drift findings harder to keep
  stable.
- Add a new public package or output adapter: rejected because the scope is
  internal backend validation over existing slices only.

## Decision: Compare only shared facts with reviewed equivalence

**Rationale**: A reconciliation record is meaningful only where the same
reviewed case fact is represented in more than one current slice. The helper
must therefore compare selected identifiers, forms, and DD-backed field
semantics with explicit slice/field evidence and must treat explicit nulls,
unsupported-branch warnings, absent optional evidence, and formatting-only
differences according to current contracts.

**Alternatives considered**:

- Compare every emitted value positionally: rejected because output formats
  include adapter-specific presentation and optional evidence that should not be
  treated as factual drift.
- Treat absent optional fields as mismatches by default: rejected because
  existing output contracts already define accepted optional or unsupported
  branches.

## Decision: Resolve V1/VE semantics through DD.csv before comparison

**Rationale**: The repository invariant makes `artifacts/mappings/DD.csv` the
canonical naming layer for V1 field semantics. Cross-slice comparison must use
the DD-backed canonical semantic when a DD entry exists and only use approved
contract-name fallback when no DD mapping exists.

**Alternatives considered**:

- Compare adapter field names directly: rejected because it can invent alternate
  semantics for DD-backed V1 fields.
- Silently fall back when a DD mapping is missing: rejected because fallback
  basis must be explicit and traceable.

## Decision: Keep findings deterministic and trace-rich

**Rationale**: Hardening findings are regression evidence. Accepted comparison
records and warning/error payloads must include compared slices, fields,
canonical DD or fallback basis, source artifact path, reviewed fact context,
rule version, producing module, severity, and code, then sort deterministically
for byte-stable repeated runs.

**Alternatives considered**:

- Emit ad hoc messages without structured metadata: rejected because the
  constitution requires traceability for warnings and errors.
- Rely on filesystem or object enumeration order: rejected because repeated
  validation must remain stable when evidence is enumerated differently.

## Decision: Preserve existing behavior and persistence boundaries

**Rationale**: This is a hardening increment. It must not add new business
domains, output adapters, database tables, migrations, seeds, server calls, UI
surfaces, lower source-layer writes, or changes to successful output behavior.

**Alternatives considered**:

- Persist a new reconciliation-results table: rejected because current
  contracts already bound persistence and the requested scope is regression
  protection.
- Modify output packets to carry reconciliation results: rejected because that
  would change existing output shapes outside a proven defect fix.

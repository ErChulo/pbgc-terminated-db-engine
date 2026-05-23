# Research: Cross-Slice Value Reconciliation Hardening

## Decision: Build on the existing cross-slice reconciliation helper

**Rationale**: The prior increment already established selected shared fact
inventory, deterministic ordering, evidence records, DD/fallback metadata, and
structured drift findings. Value-level hardening should extend that boundary
rather than creating a new package, output adapter, or persistence layer.

**Alternatives considered**:

- Add a new output adapter for reconciliation reports: rejected because the
  scope is backend validation and regression protection only.
- Implement value checks inside each output slice: rejected because it would
  duplicate shared normalization and severity behavior.
- Add a database table for value reconciliation results: rejected because
  current contracts already bound persistence and this increment is testable
  through regression evidence.

## Decision: Reconcile only selected values with reviewed shared meaning

**Rationale**: Numeric and categorical comparison is valid only where current
contracts, approved samples, or existing output evidence show that fields
represent the same reviewed fact. The selected rule inventory should therefore
make the comparison basis explicit for each participant, form, identifier,
nullable/required, numeric, and categorical value.

**Alternatives considered**:

- Compare all common field names automatically: rejected because matching names
  can still have adapter-specific presentation semantics.
- Compare every numeric output across all slices: rejected because output
  adapters may expose distinct actuarial concepts with similar values.

## Decision: Use value-type-specific normalization before classification

**Rationale**: Selected values can be numeric, categorical, identifier, form,
or nullable facts. Numeric values need deterministic normalization for
equivalent representations, categorical values need approved code/label
normalization, and nullable values need explicit required-or-nullable basis.

**Alternatives considered**:

- Compare raw serialized values only: rejected because approved formatting
  differences would create false drift.
- Treat all differences as blocking: rejected because current contracts accept
  optional nulls, unsupported branches, and formatting-only differences.

## Decision: Attach severity and basis metadata to every mismatch

**Rationale**: Reviewers need to distinguish blocking mismatches from
non-blocking warnings, accepted optional or nullable differences, unsupported
branches, and formatting-only classifications. Findings must carry severity and
basis metadata so repeated validation evidence is auditable and triageable.

**Alternatives considered**:

- Emit one generic mismatch code: rejected because the requested increment
  specifically requires severity-based mismatch classification.
- Store basis only in free-text messages: rejected because structured payload
  stability and traceability require machine-comparable fields.

## Decision: Preserve DD-first semantics and approved fallback behavior

**Rationale**: `artifacts/mappings/DD.csv` remains the canonical naming layer
where a matching Data Dictionary field exists. Value reconciliation must
continue to use DD-backed canonical semantics first and only use approved
contract-name fallback when no DD mapping exists.

**Alternatives considered**:

- Use adapter-specific names as semantic identifiers: rejected because it can
  invent alternate V1 field semantics.
- Silently fall back when DD mapping is absent: rejected because fallback basis
  must remain explicit and traceable.

## Decision: Keep validation deterministic and behavior-preserving

**Rationale**: This increment hardens existing outputs and must not add new
business domains, output adapters, migrations, seeds, server calls, raw-source
reads, UI surfaces, or lower source-layer writes. Accepted comparisons and
findings must sort deterministically for byte-stable repeated runs.

**Alternatives considered**:

- Persist findings by default: rejected because persistence is outside current
  contract requirements.
- Change output packet shapes to carry value-reconciliation metadata: rejected
  because behavior preservation is an explicit requirement.

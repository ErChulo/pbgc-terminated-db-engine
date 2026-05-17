# Research: Valuation Listings Output

## Decision: Treat valuation listings as a pure projection adapter

**Rationale**: The committed contract defines `valuation_listings_output` as a
deterministic transform from reviewed inputs and upstream deterministic outputs
into a stable downstream listing packet. The module should not recompute
benefits or infer missing facts.

**Alternatives considered**:
- Recalculate benefit families inside the adapter. Rejected because the benefit
  kernel is already the authoritative calculation slice.
- Merge valuation-listing logic into benefit kernel or V1/VE output. Rejected
  because the repository keeps downstream output adapters separate from the
  kernel and from one another.

## Decision: Persist valuation-listing rows in the existing adapter-output store

**Rationale**: The committed sqlite migration already defines adapter-output
tables used by downstream slices. Reusing the existing row store preserves
versioned delivery and keeps the valuation-listing output distinct from kernel
outputs.

**Alternatives considered**:
- Add a new adapter table. Rejected because the schema already contains the
  needed persistence layer.
- Store only in memory. Rejected because the slice requires committed static and
  sql.js-backed persistence.

## Decision: Build the adapter from committed upstream outputs only

**Rationale**: The contract explicitly requires reviewed structured inputs and
upstream deterministic outputs from date, service, compensation, form,
benefit-kernel, and V1/VE slices. That keeps the adapter within the deterministic
boundary and avoids raw-document dependency.

**Alternatives considered**:
- Accept raw case documents directly. Rejected by constitution and contract.
- Allow partially populated upstream outputs. Rejected because the contract and
  spec require structured warnings or blocking errors for missing required
  families.

## Decision: Keep BSRS as a downstream reference only

**Rationale**: The feature scope explicitly excludes BSRS configuration
implementation. The valuation-listings slice must remain isolated so that later
deliverables can consume its output without changing its projection rules.

**Alternatives considered**:
- Generate BSRS rows now. Rejected by scope.
- Omit downstream contract references entirely. Rejected because the adapter
  contract and engine contract identify BSRS as a dependent output.

## Decision: Trace every populated adapter field

**Rationale**: The contract requires field-level traceability for populated
values, warnings, and warning-bearing conditional branches. This keeps the
adapter auditable and reproducible for casework review.

**Alternatives considered**:
- Trace only the final row. Rejected because reviewers need field-level lineage.
- Skip trace for null fields. Accepted for null fields, but populated fields and
  warning paths still require trace records.

## Decision: Use DD.csv as the canonical naming layer

**Rationale**: The feature spec requires DD-first naming wherever a matching
Data Dictionary field exists. That keeps the adapter aligned with the
repository-wide naming invariant and avoids drift between display names and
canonical field semantics.

**Alternatives considered**:
- Keep field names only in adapter-local mappings. Rejected because the DD layer
  is already the canonical naming source.
- Allow direct output-only naming. Rejected because it weakens traceability.

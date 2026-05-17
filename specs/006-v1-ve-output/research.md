# Research: V1/VE Output

## Decision: Treat V1/VE as a pure projection adapter

**Rationale**: The committed contract defines `v1_ve_output` as a deterministic
transform from reviewed inputs and upstream deterministic outputs into a stable
downstream packet. The module should not recompute actuarial values or infer
missing facts.

**Alternatives considered**:
- Recalculate benefit families inside the adapter. Rejected because the benefit
  kernel is already the authoritative calculation slice.
- Merge V1/VE logic into benefit kernel. Rejected because the repository keeps
  downstream output adapters separate from the kernel.

## Decision: Persist V1/VE rows in `v1_ve_output_row`

**Rationale**: The committed sqlite migration `0005` already defines
`v1_ve_output_row` for downstream adapter persistence. Using the existing table
preserves versioned delivery and keeps the adapter output distinct from kernel
outputs.

**Alternatives considered**:
- Add a new adapter table. Rejected because the schema already contains the
  needed row store.
- Store only in memory. Rejected because the slice requires committed static and
  sql.js-backed persistence.

## Decision: Build the adapter from committed upstream outputs only

**Rationale**: The contract explicitly requires reviewed structured inputs and
upstream deterministic outputs from date, service, compensation, form, and
benefit-kernel slices. That keeps the adapter within the deterministic boundary
and avoids raw-document dependency.

**Alternatives considered**:
- Accept raw case documents directly. Rejected by constitution and contract.
- Allow partially populated upstream outputs. Rejected because the contract and
  spec require structured warnings or blocking errors for missing required
  families.

## Decision: Keep valuation listings and BSRS as downstream references only

**Rationale**: The feature scope explicitly excludes valuation-listings and
BSRS implementation. The V1/VE slice must remain isolated so those later
deliverables can consume its output without changing its calculation rules.

**Alternatives considered**:
- Generate listing or BSRS rows now. Rejected by scope.
- Omit downstream contract references entirely. Rejected because the adapter
  contract and engine contract identify them as dependent outputs.

## Decision: Trace every populated adapter field

**Rationale**: The contract requires field-level traceability for populated
values, warnings, and warning-bearing conditional branches. This keeps the
adapter auditable and reproducible for casework review.

**Alternatives considered**:
- Trace only the final row. Rejected because reviewers need field-level lineage.
- Skip trace for null fields. Accepted for null fields, but populated fields and
  warning paths still require trace records.

## Decision: Reuse the browser/sql.js runtime and existing regression slices

**Rationale**: The browser-only runtime and earlier slices already establish the
deterministic engine boundary. V1/VE should integrate with them rather than
introduce new runtime patterns.

**Alternatives considered**:
- Introduce server-side output generation. Rejected by constitution.
- Add a separate persistence stack. Rejected because the repository already
  standardizes on browser SQLite via sql.js.

# Research: BSRS Block Pattern Hardening

## Decision: Use approved BSRS sample configuration artifacts as the canonical block-pattern source

**Rationale**: The feature is explicitly scoped to backend validation and
regression protection using approved BSRS sample configuration artifacts already
committed in the repository. Treating these artifacts as the validation source
keeps the hardening increment inside the reviewed-input boundary and avoids
inventing new business rules outside approved samples.

**Alternatives considered**:

- Derive patterns from raw PBGC guidance or source documents: rejected because
  deterministic engine modules must not read raw or unreviewed source material.
- Add hand-authored block definitions unrelated to approved samples: rejected
  because it would weaken traceability to the committed approved artifacts.

## Decision: Add a small internal block-pattern validation helper only if tests require it

**Rationale**: Existing BSRS semantic hardening already has sample parsing,
source normalization, finding sorting, and structured finding types. A focused
helper can classify statement, recalculation, and optional-form block evidence
without adding a new output adapter, persistence model, or domain module.

**Alternatives considered**:

- Expand output generation code directly: rejected because validation must not
  change successful BSRS output packet content or adapter behavior.
- Create a new validation package: rejected because the scope is limited to
  `bsrs_configuration_output` and existing module contracts.

## Decision: Validate block families by section sequence and line-cluster evidence

**Rationale**: The approved samples encode block behavior through recurring
sections, lines, descriptions, details, and formatting markers. Validation should
recognize statement, recalculation, and optional-form families from those
approved patterns, distinguish formatting-only rows from semantic evidence, and
emit deterministic findings for missing, duplicated, suspicious, orphaned, or
out-of-order evidence.

**Alternatives considered**:

- Validate only file shape and headers: rejected because existing approved-sample
  checks already cover basic shape and this increment requires semantic block
  pattern hardening.
- Require every row to be semantic evidence: rejected because approved samples
  contain spacer, formatting, subtotal, narrative, and detail rows that should be
  classified without being mistaken for missing block markers.

## Decision: Keep findings deterministic and trace-rich

**Rationale**: Existing hardening tests require stable structured warning/error
payloads. Block-pattern findings must carry source path, row/block reference,
block family, section context, line-cluster evidence, rule version, producing
module, severity, and finding code so repeated runs can be compared byte-for-byte.

**Alternatives considered**:

- Emit ad hoc messages without structured metadata: rejected because the
  constitution requires traceability and structured warnings/errors.
- Sort findings by filesystem enumeration order: rejected because repeated
  validation must be stable even when enumeration order changes.

## Decision: Preserve existing behavior and persistence boundaries

**Rationale**: This is a hardening increment, not a new output adapter or
business-domain slice. The design must not add migrations, seeds, lower
source-layer writes, server calls, or runtime network inputs.

**Alternatives considered**:

- Persist a new validation-results table: rejected because no new persistence is
  needed for the requested MVP and current contracts already define any required
  trace/output rows.
- Add UI or reporting surfaces: rejected because the scope is backend validation
  and regression protection only.

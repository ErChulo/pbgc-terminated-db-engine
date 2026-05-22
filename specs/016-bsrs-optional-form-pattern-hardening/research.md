# Research: BSRS Optional-Form Pattern Hardening

## Decision: Use approved optional-form BSRS samples as canonical validation sources

**Rationale**: The feature is explicitly scoped to backend validation and
regression protection using approved BSRS sample configuration artifacts already
committed in the repository. The optional-form samples under
`artifacts/reference/approved-samples/bsrs-config/optional-forms/` are therefore
the reviewed sources for form-family labels, section sequence, and line-cluster
evidence.

**Alternatives considered**:

- Derive optional-form patterns from raw PBGC guidance or source documents:
  rejected because deterministic engine modules must not read raw or unreviewed
  source material.
- Invent new optional-form sections outside the approved samples: rejected
  because this would add unreviewed business semantics and weaken traceability.

## Decision: Extend the existing block-pattern validation boundary

**Rationale**: Statement and recalculation block-pattern hardening already
established a small internal helper, sample parsing, deterministic sorting, and
structured semantic finding payloads for `bsrs_configuration_output`.
Optional-form hardening should reuse that boundary rather than creating a new
package, output adapter, or persistence layer.

**Alternatives considered**:

- Add a new optional-form validation package: rejected because the scope is
  limited to `bsrs_configuration_output` and existing module contracts.
- Modify BSRS output generation directly: rejected because validation must not
  change successful output packet content or adapter behavior.

## Decision: Validate optional-form families and row roles together

**Rationale**: Approved optional-form samples include semantic form labels,
support/detail rows, unavailable-benefit rows, explanatory text, subtotal-like
lines, formatting-only rows, and spacers. Validation must classify these roles
so approved presentation rows do not create false missing-section findings while
orphan semantic rows still produce structured warnings or errors.

**Alternatives considered**:

- Validate only file shape and headers: rejected because existing
  approved-sample tests already cover basic shape and this increment requires
  semantic optional-form-pattern hardening.
- Treat every nonblank row as semantic evidence: rejected because approved
  samples include formatting and explanatory rows that must be distinguished
  from optional-form markers.

## Decision: Keep findings deterministic and trace-rich

**Rationale**: Existing hardening tests require stable structured warning/error
payloads. Optional-form findings must carry source path, row/block reference,
block family, form family, section context, line-cluster evidence, rule version,
producing module, severity, and finding code so repeated runs can be compared
byte-for-byte.

**Alternatives considered**:

- Emit ad hoc strings without metadata: rejected because the constitution
  requires traceability and structured warnings/errors.
- Rely on filesystem enumeration order: rejected because repeated validation
  must be stable even when artifact enumeration order changes.

## Decision: Preserve existing behavior and persistence boundaries

**Rationale**: This is a hardening increment, not a new output adapter or
business-domain slice. The design must not add migrations, seeds, lower
source-layer writes, server calls, or runtime network inputs.

**Alternatives considered**:

- Persist a new validation-results table: rejected because no new persistence is
  needed for the requested increment and current contracts already define any
  required trace/output rows.
- Add UI or reporting surfaces: rejected because the scope is backend validation
  and regression protection only.

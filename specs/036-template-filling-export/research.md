# Research: Template Filling Export

## Decision: Fill a Reviewed-Input CSV-Style Artifact First

**Rationale**: A CSV-style reviewed-input artifact is deterministic, inspectable, browser-local, and sufficient to prove the alpha path from approval to export readiness.

**Alternatives considered**: Filling binary PBGC document templates was deferred because it requires richer document handling and is not needed for the first alpha proof.

## Decision: Block Export Without Approved Rows

**Rationale**: Export readiness must not include pending, rejected, malformed, or invalid records.

**Alternatives considered**: Exporting with warnings was rejected because it would weaken the approval gate.

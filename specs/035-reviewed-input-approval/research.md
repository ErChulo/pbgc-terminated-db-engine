# Research: Reviewed Input Approval

## Decision: Display-Only Local Approval Decisions

**Rationale**: The alpha path needs a visible review gate now, while durable persistence and template filling are planned later.

**Alternatives considered**: Persisting approved rows to sql.js was deferred to avoid changing source-layer persistence contracts in this UI increment.

## Decision: Normalize Mocked Reviewed JSON Into Stable Rows

**Rationale**: Stable row ordering and payload shape lets analysts see exactly what would be eligible for later deterministic work.

**Alternatives considered**: Passing raw imported JSON directly downstream was rejected because it bypasses approval visibility.

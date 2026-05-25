# Research: Schema Library And Validator Surfaces

## Decision: Committed Schema Metadata

**Rationale**: The repository already contains versioned schema artifacts under `artifacts/schemas/`. The browser MVP can expose stable metadata derived from those committed artifacts without fetching hosted schemas.

**Alternatives considered**: Loading schemas from a server or external registry was rejected because the app must be browser-only with no hosted runtime dependencies.

## Decision: Structural Preview Validation

**Rationale**: This slice needs analyst feedback before the import/approval features exist. Structural required-field validation gives useful preview behavior while avoiding premature approval or deterministic engine execution.

**Alternatives considered**: Full JSON Schema validation was rejected for the MVP because committed artifacts are markdown schema references and no runtime JSON Schema package is currently needed.

## Decision: Browser-Local Textarea Import

**Rationale**: A local paste/import textarea satisfies reviewed JSON preview without introducing file handling, persistence, or upload semantics.

**Alternatives considered**: File picker upload was deferred to the dedicated upload/import pipeline feature.

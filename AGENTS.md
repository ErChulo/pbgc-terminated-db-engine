# PBGC Terminated DB Engine — Repository Rules

## Core architecture
- Browser-only application
- No server calls
- SQLite in browser via sql.js
- Vite-based development
- Static build artifacts must remain committed
- Do not ignore dist/ or bundles/

## Project goal
Build a deterministic PBGC terminated defined-benefit casework engine that:
- stores reviewed structured case data
- resolves deterministic actuarial logic
- produces V1/VE-style outputs
- produces valuation listings
- produces BSRS configuration outputs

## Deterministic boundary
The engine must never read raw OCR or raw source documents directly.
The engine accepts only reviewed structured inputs.

## Source layers
1. raw source documents
2. source assertions
3. resolved facts
4. resolved plan provisions
5. engine input packets
6. deterministic engine outputs
7. output adapters

## Versioning
Project baseline: v0.1.0

## File-delivery convention
Any delivered .sql, .js, .ts, or .tex artifact must be stored with appended .txt for email-safe transport.

## Repository discipline
- Keep contracts in artifacts/contracts
- Keep schemas in artifacts/schemas
- Keep templates in artifacts/templates
- Keep migrations in packages/db/migrations
- Keep seeds in packages/db/seeds
- Keep test cases in packages/tests
- Keep mappings in docs/mappings
- Keep architecture notes in docs/architecture

## Coding discipline
- Prefer deterministic transforms
- No hidden side effects
- No silent fallbacks
- Emit structured warnings and errors
- Preserve traceability for every computed output

<!-- SPECKIT START -->
Current feature plan: `specs/012-bsrs-semantic-hardening/plan.md`
<!-- SPECKIT END -->

## V1 data dictionary invariant
- DD.csv is the canonical naming layer for V1 field semantics.
- Every V1/VE field must first map to DD.csv when a matching DD field exists.
- Do not invent alternate semantic names for V1 fields when a DD.csv field is available.

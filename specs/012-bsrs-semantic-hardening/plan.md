# Implementation Plan: BSRS Semantic Hardening

**Branch**: `[011-bsrs-semantic-hardening]` | **Date**: 2026-05-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-bsrs-semantic-hardening/spec.md`

## Summary

Deliver a backend semantic-hardening increment for `bsrs_configuration_output`
only. The increment validates approved BSRS sample configuration artifacts and
the approved Statement Authoring function list already committed in the
repository. It adds regression protection for PrintCriteria semantics,
referenced functions, referenced fields, line/section structure, and approved
statement/recalculation block patterns while preserving existing BSRS contracts,
browser-only sql.js boundaries, and existing slice behavior.

## Technical Context

**Language/Version**: TypeScript for repository-local semantic validation and
Vitest regression coverage; approved BSRS sample configuration artifacts and
Statement Authoring guidance remain committed `.txt` artifacts.

**Primary Dependencies**: Existing Vite/sql.js workspace, existing
`bsrs_configuration_output` package and tests, committed approved BSRS samples in
`artifacts/reference/approved-samples/bsrs-config/`, committed Statement
Authoring function list in
`artifacts/guidance/bsrs/statement-authoring/BSRS functions.txt`, existing
BSRS/V1 field semantics, and `artifacts/mappings/DD.csv` where matching fields
exist.

**Storage**: No new persistence tables or migrations. Any validation evidence is
test-local or uses existing BSRS trace/output rows only where current contracts
already require them.

**Testing**: Regression tests for Statement Authoring function references,
PrintCriteria semantic validation, BSRS field-reference validation, approved
statement/recalculation block patterns, approved optional-form patterns,
deterministic validation finding shape, and existing BSRS output behavior.

**Target Platform**: Static browser application and repository-local validation;
no server runtime, hosted API, external persistence, or network-loaded business
logic.

**Project Type**: Browser-only Vite app with modular deterministic packages and
repository-local hardening tests for `bsrs_configuration_output`.

**Performance Goals**: Semantic validation over the committed approved BSRS
sample set completes within normal local regression-suite execution time and
produces deterministic findings across repeated runs.

**Constraints**: No server calls; reviewed structured inputs and approved
repository artifacts only; no raw OCR/source document reads; no new business
domains; no new output adapters; no changes to successful
`bsrs_configuration_output` packet content, persistence behavior, or adapter
scope; structured warnings/errors for validation failures.

**Scale/Scope**: BSRS semantic validation for the committed approved sample
configuration files and Statement Authoring function list only. V1/VE and Data
Dictionary references are used as existing field vocabulary dependencies, not as
new output-adapter implementation scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The increment uses committed artifacts and
  repository-local validation without server calls, hosted APIs, remote
  calculation services, telemetry, or network-loaded business logic.
- Reviewed input boundary: PASS. Semantic validation consumes approved
  repository artifacts, existing deterministic outputs, and existing contracts;
  it does not read raw OCR, source documents, emails, images, PDFs, or
  unreviewed extraction output.
- Traceability: PASS. Validation findings require source artifact path, row or
  block reference, referenced function or field, rule version, producing module,
  warning/error code, and semantic category.
- Modular contracts: PASS. Scope is limited to the existing
  `bsrs_configuration_output` module and semantic validation contract. No new
  business domains or output adapters are introduced.
- Versioned deliverables: PASS. Existing contracts, mappings, guidance, samples,
  tests, and committed static artifacts remain the source of truth. New `.ts`
  hardening tests are internal regression artifacts, not delivered artifacts, so
  email-safe `.txt` delivery copies do not apply.

## Project Structure

### Documentation (this feature)

```text
specs/012-bsrs-semantic-hardening/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── bsrs-semantic-validation.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
packages/
├── engine/
│   └── bsrs-configuration-output/
│       └── src/
├── tests/
│   ├── hardening-bsrs-function-set.test.ts (pre-existing validation source)
│   ├── hardening-bsrs-approved-samples.test.ts (pre-existing validation source)
│   ├── hardening-bsrs-semantic-functions.test.ts
│   ├── hardening-bsrs-printcriteria.test.ts
│   ├── hardening-bsrs-field-references.test.ts
│   ├── hardening-bsrs-block-patterns.test.ts
│   ├── hardening-bsrs-optional-form-patterns.test.ts
│   └── hardening-bsrs-semantic-behavior.test.ts

artifacts/
├── guidance/
│   └── bsrs/
│       └── statement-authoring/
│           └── BSRS functions.txt
├── reference/
│   └── approved-samples/
│       └── bsrs-config/
└── mappings/
    └── DD.csv
```

**Structure Decision**: Keep semantic hardening in existing
`bsrs_configuration_output` validation/test boundaries. Add focused repository
tests and, only if needed by tests, a small internal semantic-validation helper
near the BSRS output module. Do not create `packages/output-adapters/*`, new
database migrations, new UI pages, or new runtime subsystems.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/bsrs-semantic-validation.md](./contracts/bsrs-semantic-validation.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep validation local to
  the committed repository and browser-compatible TypeScript boundaries.
- Reviewed input boundary: PASS. The validation sources are approved
  configuration samples, approved function guidance, existing mappings, and
  existing deterministic outputs only.
- Traceability: PASS. The semantic validation contract records source path,
  row/block reference, referenced token, severity, code, and category for every
  finding.
- Modular contracts: PASS. The design extends validation coverage around
  `bsrs_configuration_output` without adding unrelated modules or output
  adapters.
- Versioned deliverables: PASS. New or changed `.ts` hardening tests are
  internal regression artifacts. Runtime or delivered artifact changes, if any
  are later proven necessary, must update versioned artifacts and committed
  build output according to the constitution.

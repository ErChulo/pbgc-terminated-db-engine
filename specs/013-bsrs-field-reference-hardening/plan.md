# Implementation Plan: BSRS Field Reference Hardening

**Branch**: `[012-bsrs-field-reference-hardening]` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/013-bsrs-field-reference-hardening/spec.md`

## Summary

Deliver backend field-reference semantic hardening for `bsrs_configuration_output`
only. The increment validates field-like tokens in approved BSRS sample
configuration artifacts against DD.csv, current committed engine/output field
names, documented controls, and approved no-DD sample fallbacks. It emits
deterministic structured findings for suspicious or orphan references while
preserving existing BSRS contracts, browser-only sql.js boundaries, and existing
successful output behavior.

## Technical Context

**Language/Version**: TypeScript for browser-compatible deterministic helpers
and Vitest regression coverage; approved BSRS sample configuration artifacts
and existing mappings remain committed repository artifacts.

**Primary Dependencies**: Existing Vite/sql.js workspace, existing
`bsrs_configuration_output` package and semantic-validation helpers, committed
approved BSRS samples in `artifacts/reference/approved-samples/bsrs-config/`,
`artifacts/mappings/DD.csv`, current committed engine/output field names, and
existing BSRS/V1/DD mapping helpers.

**Storage**: No new persistence tables or migrations. Field-reference
validation evidence is test-local or uses existing BSRS trace/output rows only
where current contracts already require them.

**Testing**: Regression tests for field-like token extraction, DD-backed
resolution, approved no-DD fallback behavior, suspicious/orphan reference
findings, repeated-run finding stability, and existing BSRS output behavior.

**Target Platform**: Static browser application and repository-local validation;
no server runtime, hosted API, external persistence, or network-loaded business
logic.

**Project Type**: Browser-only Vite app with modular deterministic packages and
repository-local hardening tests for `bsrs_configuration_output`.

**Performance Goals**: Field-reference validation over the committed approved
BSRS sample set completes within normal local regression-suite execution time
and produces deterministic findings across repeated runs.

**Constraints**: No server calls; reviewed structured inputs and approved
repository artifacts only; no raw OCR/source document reads; no new business
domains; no new output adapters; no changes to successful
`bsrs_configuration_output` packet content, persistence behavior, trace
behavior, or adapter scope; structured warnings/errors for validation failures;
DD.csv is canonical wherever a matching Data Dictionary field exists.

**Scale/Scope**: BSRS field-reference semantic validation for the committed
approved sample configuration files, DD.csv, and current committed field names
only. V1/VE, valuation listings, and other engine/output fields are vocabulary
dependencies, not new output-adapter implementation scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The increment uses committed artifacts and
  browser-compatible repository-local validation helpers without server calls,
  hosted APIs, remote calculation services, telemetry, or network-loaded
  business logic.
- Reviewed input boundary: PASS. Validation consumes approved repository
  artifacts, DD.csv mappings, existing deterministic field names, and existing
  contracts; it does not read raw OCR, source documents, emails, images, PDFs,
  or unreviewed extraction output.
- Traceability: PASS. Field-reference findings require source path, row/block
  reference, column name, token, vocabulary source, DD-backed status, approved
  fallback status, rule version, producing module, warning/error code, and
  semantic category.
- Modular contracts: PASS. Scope is limited to the existing
  `bsrs_configuration_output` validation boundary. No new business domains or
  output adapters are introduced.
- Versioned deliverables: PASS. Existing contracts, mappings, guidance, samples,
  tests, and committed static artifacts remain the source of truth. New `.ts`
  hardening tests/helpers are internal regression artifacts, not delivered
  artifacts, so email-safe `.txt` delivery copies do not apply.

## Project Structure

### Documentation (this feature)

```text
specs/013-bsrs-field-reference-hardening/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── bsrs-field-reference-validation.md
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
│           ├── bsrsFieldReferenceValidation.ts
│           ├── bsrsSemanticValidation.ts
│           ├── ddMapping.ts
│           └── semanticValidationTrace.ts
├── tests/
│   ├── hardening-bsrs-field-references.test.ts
│   ├── hardening-bsrs-semantic-behavior.test.ts
│   └── bsrs-configuration-output-*.test.ts

artifacts/
├── mappings/
│   └── DD.csv
└── reference/
    └── approved-samples/
        └── bsrs-config/
```

**Structure Decision**: Keep field-reference hardening in the existing
`bsrs_configuration_output` validation/test boundary. Add focused repository
tests and, only if needed by tests, a small internal field-reference validation
helper near the existing BSRS semantic-validation helpers. Do not create
`packages/output-adapters/*`, new database migrations, new UI pages, or new
runtime subsystems.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/bsrs-field-reference-validation.md](./contracts/bsrs-field-reference-validation.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep validation local to
  committed repository artifacts and browser-compatible deterministic helpers.
- Reviewed input boundary: PASS. Validation sources are approved BSRS samples,
  DD.csv, current committed field names, documented controls, and existing
  deterministic outputs only.
- Traceability: PASS. The field-reference validation contract records source
  path, row/block reference, column name, token, vocabulary source,
  DD-backed/fallback status, severity, code, and category for every finding.
- Modular contracts: PASS. The design extends validation coverage around
  `bsrs_configuration_output` without adding unrelated modules or output
  adapters.
- Versioned deliverables: PASS. New or changed `.ts` hardening tests/helpers are
  internal regression artifacts. Runtime or delivered artifact changes, if any
  are later proven necessary, must update versioned artifacts and committed
  build output according to the constitution.

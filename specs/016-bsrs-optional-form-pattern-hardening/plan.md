# Implementation Plan: BSRS Optional-Form Pattern Hardening

**Branch**: `[015-bsrs-optional-form-pattern-hardening]` | **Date**: 2026-05-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/016-bsrs-optional-form-pattern-hardening/spec.md`

## Summary

Deliver backend optional-form-pattern semantic hardening for
`bsrs_configuration_output` only. The increment validates approved
optional-form block patterns from the committed BSRS sample configuration
artifacts, including expected optional-form section sequencing,
optional-form-specific row role classification, structured findings, and
repeated-run stability. It preserves existing contracts, browser-only sql.js
boundaries, and current successful BSRS output behavior.

## Technical Context

**Language/Version**: TypeScript for browser-compatible deterministic helpers
and Vitest regression coverage; approved BSRS optional-form sample
configuration artifacts remain committed `.txt` repository artifacts.

**Primary Dependencies**: Existing Vite/sql.js workspace, existing
`bsrs_configuration_output` package, existing block-pattern and semantic
validation helpers, committed approved optional-form samples in
`artifacts/reference/approved-samples/bsrs-config/optional-forms/`, existing
BSRS sample parser/loader helpers, existing semantic finding types, and existing
BSRS output regression fixtures.

**Storage**: No new persistence tables, migrations, seeds, or lower source-layer
writes. Optional-form-pattern validation evidence is test-local or uses
existing BSRS trace/output rows only where current contracts already require
them.

**Testing**: Regression tests for approved optional-form block patterns,
expected optional-form section sequence, optional-form-specific row role
classification, malformed optional-form findings, repeated-run finding shape,
and existing BSRS output behavior preservation.

**Target Platform**: Static browser application and repository-local validation;
no server runtime, hosted API, external persistence, or network-loaded business
logic.

**Project Type**: Browser-only Vite app with modular deterministic packages and
repository-local hardening tests for `bsrs_configuration_output`.

**Performance Goals**: Optional-form-pattern validation over the committed
approved optional-form samples completes within normal local regression-suite
execution time and produces deterministic findings across repeated runs.

**Constraints**: No server calls; reviewed structured inputs and approved
repository artifacts only; no raw OCR/source document reads; no new business
domains; no new output adapters; no changes to successful
`bsrs_configuration_output` packet content, persistence behavior, trace
behavior, or adapter scope; structured warnings/errors for validation failures.

**Scale/Scope**: BSRS optional-form-pattern semantic validation for the
committed approved optional-form sample configuration files only. Optional-form
patterns are validation vocabulary for existing BSRS output, not new
output-adapter or actuarial-domain implementation scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The increment uses committed artifacts and
  browser-compatible repository-local validation helpers without server calls,
  hosted APIs, remote calculation services, telemetry, or network-loaded
  business logic.
- Reviewed input boundary: PASS. Validation consumes approved repository
  artifacts, existing deterministic outputs, and existing contracts; it does not
  read raw OCR, source documents, emails, images, PDFs, or unreviewed extraction
  output.
- Traceability: PASS. Optional-form-pattern findings require source path,
  row/block reference, block family, form family, section context,
  line-cluster evidence, rule version, producing module, warning/error code, and
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
specs/016-bsrs-optional-form-pattern-hardening/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── bsrs-optional-form-pattern-validation.md
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
│           ├── bsrsBlockPatternValidation.ts
│           ├── bsrsSampleLoader.ts
│           ├── bsrsSampleParser.ts
│           ├── bsrsSemanticValidation.ts
│           ├── semanticValidationTrace.ts
│           └── semanticValidationTypes.ts
├── tests/
│   ├── hardening-bsrs-block-patterns.test.ts
│   └── bsrs-configuration-output-*.test.ts

artifacts/
└── reference/
    └── approved-samples/
        └── bsrs-config/
            └── optional-forms/
                ├── qpsa-qdro/
                ├── single-and-joint/
                └── single-life/
```

**Structure Decision**: Keep optional-form-pattern hardening in the existing
`bsrs_configuration_output` validation/test boundary. Extend the existing
block-pattern validation helper and focused repository tests only as needed for
optional-form evidence. Do not create `packages/output-adapters/*`, new
database migrations, new UI pages, or new runtime subsystems.

## Complexity Tracking

No constitution violations or justified complexity exceptions.

## Phase 0: Research

See [research.md](./research.md). All technical context decisions are resolved
without remaining clarification markers.

## Phase 1: Design

See [data-model.md](./data-model.md),
[contracts/bsrs-optional-form-pattern-validation.md](./contracts/bsrs-optional-form-pattern-validation.md),
and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design artifacts keep validation local to
  committed repository artifacts and browser-compatible deterministic helpers.
- Reviewed input boundary: PASS. Validation sources are approved optional-form
  BSRS samples, existing deterministic outputs, and existing contracts only.
- Traceability: PASS. The optional-form-pattern validation contract records
  source path, row/block reference, block family, form family, section context,
  line-cluster evidence, severity, code, category, rule version, and producing
  module for every finding.
- Modular contracts: PASS. The design extends validation coverage around
  `bsrs_configuration_output` without adding unrelated modules or output
  adapters.
- Versioned deliverables: PASS. New or changed `.ts` hardening tests/helpers are
  internal regression artifacts. Runtime or delivered artifact changes, if any
  are later proven necessary, must update versioned artifacts and committed
  build output according to the constitution.

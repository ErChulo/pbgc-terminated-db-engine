# Implementation Plan: Schema Library And Validator Surfaces

**Branch**: `032-schema-library-validator` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/032-schema-library-validator/spec.md`

## Summary

Add a browser-only schema library reachable from the case dashboard. The MVP hosts committed reviewed-input schema metadata, shows selected schema details, supports browser-local reviewed JSON validation preview, and never reads raw sources, runs OCR/scraping, calls servers, writes sql.js rows, or changes output adapters.

## Technical Context

**Language/Version**: TypeScript in the existing browser app.

**Primary Dependencies**: Existing Vite app, hash-based page rendering, dashboard display state, static CSS, and focused UI tests.

**Storage**: No sql.js persistence. Browser-local validation preview state only.

**Testing**: Focused UI/display regression tests in `packages/tests/reconciliation-workbench-ui.test.ts`; lint, build, full test before merge.

**Target Platform**: Static browser application; no server runtime or hosted schema dependency.

**Project Type**: Browser-only Vite app with existing deterministic local packages.

**Performance Goals**: Validation preview fails fast for oversized JSON and stays non-blocking for MVP-size payloads.

**Constraints**: No server calls; no OCR; no in-app scraping execution; no raw source reads; no hosted schemas; no real natural-person data; no new business domains; no output adapters; no sql.js writes; committed `apps/web/dist/` output.

**Scale/Scope**: One schema library surface with deterministic committed schema entries and local structural validation preview.

## Constitution Check

- Browser-only static runtime: PASS.
- Reviewed input boundary: PASS. Schema preview uses browser-local reviewed JSON text only and does not feed deterministic engine modules.
- Traceability: PASS. Schema entries identify repository basis and validation previews list checked fields/messages.
- Modular contracts: PASS. Existing engine/output contracts remain unchanged; schema library is a UI display contract.
- Versioned deliverables: PASS. Static bundle output must be regenerated and committed; no delivered `.sql`, `.js`, `.ts`, or `.tex` delivery-copy artifact is introduced.

## Project Structure

```text
specs/032-schema-library-validator/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── schema-library-validator.md
└── tasks.md

apps/web/src/
├── app/
│   ├── caseNavigationDashboardSlice.ts
│   └── schemaLibrarySlice.ts
├── pages/
│   ├── CaseNavigationDashboardPage.ts
│   └── SchemaLibraryPage.ts
├── main.ts
└── styles.css

packages/tests/
└── reconciliation-workbench-ui.test.ts
```

**Structure Decision**: Add schema display/validation state under `apps/web/src/app/`, a page renderer under `apps/web/src/pages/`, link it from the existing dashboard stage, and keep focused UI regressions with the existing browser UI tests.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design Artifacts

See [data-model.md](./data-model.md), [contracts/schema-library-validator.md](./contracts/schema-library-validator.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS.
- Reviewed input boundary: PASS.
- Traceability: PASS.
- Modular contracts: PASS.
- Versioned deliverables: PASS.

## Complexity Tracking

No constitution violations.

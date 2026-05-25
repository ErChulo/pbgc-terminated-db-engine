# Implementation Plan: Prompt Library By Stage

**Branch**: `031-prompt-library-by-stage` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/031-prompt-library-by-stage/spec.md`

## Summary

Add a browser-only prompt library reachable from the case dashboard. The MVP hosts committed stage-specific external-LLM prompt entries, shows one selected prompt, supports browser-local draft/import display state, and never performs scraping, OCR, server calls, sql.js writes, or output-adapter writes.

## Technical Context

**Language/Version**: TypeScript in the existing browser app.

**Primary Dependencies**: Existing Vite app, hash-based page rendering, dashboard display state, static CSS, and focused UI tests.

**Storage**: No sql.js persistence. Browser-local draft/import display state only.

**Testing**: Focused UI/display regression tests in `packages/tests/reconciliation-workbench-ui.test.ts`; lint, build, full test before merge.

**Target Platform**: Static browser application; no server runtime or hosted prompt dependency.

**Project Type**: Browser-only Vite app with existing deterministic local packages.

**Performance Goals**: Prompt library render and validation remain lightweight and fail fast for oversized prompt imports.

**Constraints**: No server calls; no OCR; no in-app scraping execution; no raw source reads; no real natural-person data; no new business domains; no new output adapters; no sql.js writes; committed `apps/web/dist/` output.

**Scale/Scope**: One prompt library surface with deterministic alpha stage prompt entries, selected prompt viewer, browser-local draft text, and display-only import validation.

## Constitution Check

- Browser-only static runtime: PASS. Adds local app display state and page rendering only.
- Reviewed input boundary: PASS. Reads committed prompt definitions and mocked context; no raw/OCR/unreviewed extraction inputs.
- Traceability: PASS. Prompt entries identify stage and basis; no actuarial output trace is introduced.
- Modular contracts: PASS. Existing engine/output contracts remain unchanged; prompt library is a UI display contract.
- Versioned deliverables: PASS. Static bundle output must be regenerated and committed; no delivered `.sql`, `.js`, `.ts`, or `.tex` delivery-copy artifact is introduced.

## Project Structure

```text
specs/031-prompt-library-by-stage/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── prompt-library-by-stage.md
└── tasks.md

apps/web/src/
├── app/
│   ├── caseNavigationDashboardSlice.ts
│   └── promptLibrarySlice.ts
├── pages/
│   ├── CaseNavigationDashboardPage.ts
│   └── PromptLibraryPage.ts
├── main.ts
└── styles.css

packages/tests/
└── reconciliation-workbench-ui.test.ts
```

**Structure Decision**: Add prompt display state under `apps/web/src/app/`, a page renderer under `apps/web/src/pages/`, link it from the existing dashboard stage, and keep focused UI regressions with the existing browser UI tests.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design Artifacts

See [data-model.md](./data-model.md), [contracts/prompt-library-by-stage.md](./contracts/prompt-library-by-stage.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS.
- Reviewed input boundary: PASS.
- Traceability: PASS.
- Modular contracts: PASS.
- Versioned deliverables: PASS.

## Complexity Tracking

No constitution violations.

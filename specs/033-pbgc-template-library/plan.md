# Implementation Plan: PBGC Template Library

**Branch**: `033-pbgc-template-library` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/033-pbgc-template-library/spec.md`

## Summary

Add a browser-only PBGC template library reachable from the case dashboard. The MVP exposes committed official PBGC and import template metadata, shows selected template readiness, and keeps upload/import/filling/export as display-only future capabilities.

## Technical Context

**Language/Version**: TypeScript in the existing browser app.

**Primary Dependencies**: Existing Vite app, hash-based page rendering, dashboard display state, static CSS, and focused UI tests.

**Storage**: No sql.js persistence. Browser-local template selection/readiness display state only.

**Testing**: Focused UI/display regression tests in `packages/tests/reconciliation-workbench-ui.test.ts`; lint, build, full test before merge.

**Target Platform**: Static browser application; no server runtime or hosted template dependency.

**Project Type**: Browser-only Vite app with existing deterministic local packages.

**Performance Goals**: Template library renders metadata only and does not open or parse binary templates.

**Constraints**: No server calls; no OCR; no in-app scraping execution; no raw source reads; no hosted templates; no real natural-person data; no new business domains; no output adapters; no sql.js writes; no template filling/export; committed `apps/web/dist/` output.

**Scale/Scope**: One template library surface with deterministic committed template entries and readiness preview.

## Constitution Check

- Browser-only static runtime: PASS.
- Reviewed input boundary: PASS. Reads committed template metadata only; no raw/OCR/unreviewed extraction inputs.
- Traceability: PASS. Template entries identify repository basis and stage applicability; no computed actuarial output trace is introduced.
- Modular contracts: PASS. Existing engine/output contracts remain unchanged; template library is a UI display contract.
- Versioned deliverables: PASS. Static bundle output must be regenerated and committed; no delivered `.sql`, `.js`, `.ts`, or `.tex` delivery-copy artifact is introduced.

## Project Structure

```text
specs/033-pbgc-template-library/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── pbgc-template-library.md
└── tasks.md

apps/web/src/
├── app/
│   ├── caseNavigationDashboardSlice.ts
│   └── pbgcTemplateLibrarySlice.ts
├── pages/
│   ├── CaseNavigationDashboardPage.ts
│   └── PbgcTemplateLibraryPage.ts
├── main.ts
└── styles.css

packages/tests/
└── reconciliation-workbench-ui.test.ts
```

**Structure Decision**: Add template metadata/readiness state under `apps/web/src/app/`, a page renderer under `apps/web/src/pages/`, link it from the existing dashboard stage, and keep focused UI regressions with the existing browser UI tests.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design Artifacts

See [data-model.md](./data-model.md), [contracts/pbgc-template-library.md](./contracts/pbgc-template-library.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only static runtime: PASS.
- Reviewed input boundary: PASS.
- Traceability: PASS.
- Modular contracts: PASS.
- Versioned deliverables: PASS.

## Complexity Tracking

No constitution violations.

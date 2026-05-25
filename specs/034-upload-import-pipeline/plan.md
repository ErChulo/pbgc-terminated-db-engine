# Implementation Plan: Upload Import Pipeline

**Branch**: `034-upload-import-pipeline` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/034-upload-import-pipeline/spec.md`

## Summary

Add one browser-only Upload / Import page to the existing app. The MVP exposes reviewed structured JSON and inert external-LLM artifact text preview surfaces, deterministic warning/error/status payloads, oversized-load fail-fast handling, dashboard navigation, focused tests, and committed static build output without adding persistence writes, output adapters, OCR, scraping, or new business domains.

## Technical Context

**Language/Version**: TypeScript in the existing Vite browser app.

**Primary Dependencies**: Existing Vite app, current local TypeScript modules, existing test runner, no new runtime dependency.

**Storage**: Display-only local state; no sql.js persistence change for this MVP.

**Testing**: Focused UI/model regression tests in `packages/tests/reconciliation-workbench-ui.test.ts`, plus lint, build, and full test suite.

**Target Platform**: Static browser application.

**Project Type**: Existing browser-only Vite app with deterministic local modules.

**Performance Goals**: Validate small mocked inputs immediately, fail fast for oversized text before expensive parsing, and keep dashboard/workbench rendering responsive.

**Constraints**: No server calls; no OCR; no in-app scraping; no real natural-person data; no sql.js writes; no output-adapter writes; deterministic status, warning, error, and trace shapes; committed `apps/web/dist/`.

**Scale/Scope**: MVP local preview for one case workspace stage using mocked reviewed JSON and external-LLM artifact text.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: Pass. The design uses the existing static Vite app and no network runtime.
- Reviewed input boundary: Pass. Reviewed JSON preview is local and external artifact text is inert display-only material.
- Traceability: Pass. Preview records include source kind, selected stage, input size, module name, warnings, and errors.
- Modular contracts: Pass. This UI slice references existing engine/output contracts only and adds no deterministic engine module.
- Versioned deliverables: Pass. Spec artifacts, focused tests, source files, and committed `apps/web/dist/` are identified.

## Project Structure

### Documentation (this feature)

```text
specs/034-upload-import-pipeline/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── upload-import-pipeline.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   │   ├── caseNavigationDashboardSlice.ts
│   │   └── uploadImportPipelineSlice.ts
│   ├── pages/
│   │   └── UploadImportPipelinePage.ts
│   ├── main.ts
│   └── styles.css
└── dist/

packages/
└── tests/
    └── reconciliation-workbench-ui.test.ts
```

**Structure Decision**: Implement the feature inside the existing web app and focused UI test file. No database, engine, output-adapter, schema, migration, seed, or template changes are planned.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design

See [data-model.md](./data-model.md), [contracts/upload-import-pipeline.md](./contracts/upload-import-pipeline.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Browser-only runtime remains satisfied.
- Reviewed-input boundary remains satisfied because this slice previews local text only.
- Traceability remains satisfied with deterministic preview metadata.
- Modular contract scope remains satisfied with no new engine/output adapters.
- Static build output remains in scope for validation and commit.

## Complexity Tracking

No constitution violations.

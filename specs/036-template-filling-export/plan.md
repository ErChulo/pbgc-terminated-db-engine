# Implementation Plan: Template Filling Export

**Branch**: `036-template-filling-export` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/036-template-filling-export/spec.md`

## Summary

Add one browser-only Template Filling / Export page that fills a deterministic PBGC-style reviewed-input CSV artifact from approved mocked reviewed records, shows export readiness and trace metadata, and blocks export when approved rows are missing. No new output adapter, persistence, OCR, scraping, or network runtime is added.

## Technical Context

**Language/Version**: TypeScript in the existing Vite browser app.

**Primary Dependencies**: Existing app modules, reviewed-input approval state, template metadata, no new runtime dependency.

**Storage**: Display-only local state and browser-local download/copy affordance; no sql.js persistence change.

**Testing**: Focused UI/model tests in `packages/tests/reconciliation-workbench-ui.test.ts`, plus lint, build, and full tests.

**Target Platform**: Static browser application.

**Project Type**: Existing browser-only Vite app.

**Performance Goals**: Fill small mocked approved record sets immediately and avoid expensive work for blocked exports.

**Constraints**: No server calls; no OCR; no in-app scraping; no real natural-person data; no sql.js writes; no output-adapter writes; deterministic artifact content and trace shapes; committed `apps/web/dist/`.

**Scale/Scope**: MVP fills one reviewed-input CSV-style artifact from approved mocked records only.

## Constitution Check

- Browser-only static runtime: Pass.
- Reviewed input boundary: Pass; only approved mocked reviewed records are used.
- Traceability: Pass; artifact metadata includes template basis, approved record ids, module, and rule version.
- Modular contracts: Pass; no new engine/output adapter module.
- Versioned deliverables: Pass; source, tests, specs, and committed dist output are in scope.

## Project Structure

```text
specs/036-template-filling-export/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/template-filling-export.md
└── tasks.md

apps/web/src/app/templateFillingExportSlice.ts
apps/web/src/pages/TemplateFillingExportPage.ts
apps/web/src/app/caseNavigationDashboardSlice.ts
apps/web/src/main.ts
apps/web/src/styles.css
packages/tests/reconciliation-workbench-ui.test.ts
apps/web/dist/
```

**Structure Decision**: Implement a local web app model/page slice only.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design

See [data-model.md](./data-model.md), [contracts/template-filling-export.md](./contracts/template-filling-export.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

All gates remain passing after design.

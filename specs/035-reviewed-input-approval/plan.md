# Implementation Plan: Reviewed Input Approval

**Branch**: `035-reviewed-input-approval` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/035-reviewed-input-approval/spec.md`

## Summary

Add one browser-only Reviewed Input Approval page that consumes mocked reviewed JSON, normalizes it into stable review rows, applies display-only approve/reject decisions, and reports approved versus blocked record previews. The MVP adds no persistence writes, output adapters, engine domains, OCR, scraping, or network runtime.

## Technical Context

**Language/Version**: TypeScript in the existing Vite browser app.

**Primary Dependencies**: Existing Vite app and local TypeScript modules; no new runtime dependency.

**Storage**: Display-only local state; no sql.js persistence change.

**Testing**: Focused UI/model tests in `packages/tests/reconciliation-workbench-ui.test.ts`, plus lint, build, and full tests.

**Target Platform**: Static browser application.

**Project Type**: Existing browser-only Vite app.

**Performance Goals**: Normalize small mocked inputs immediately and block malformed/unsupported records before later work begins.

**Constraints**: No server calls; no OCR; no in-app scraping; no real natural-person data; no sql.js writes; no output-adapter writes; deterministic warning/error/trace shapes; committed `apps/web/dist/`.

**Scale/Scope**: MVP local approval review table for mocked reviewed records only.

## Constitution Check

- Browser-only static runtime: Pass.
- Reviewed input boundary: Pass; only mocked reviewed structured JSON is normalized.
- Traceability: Pass; rows and decisions include module, rule version, source layer, and record identifiers.
- Modular contracts: Pass; no new engine or output-adapter module.
- Versioned deliverables: Pass; source, tests, specs, and committed dist output are in scope.

## Project Structure

### Documentation (this feature)

```text
specs/035-reviewed-input-approval/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── reviewed-input-approval.md
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
│   │   └── reviewedInputApprovalSlice.ts
│   ├── pages/
│   │   └── ReviewedInputApprovalPage.ts
│   ├── main.ts
│   └── styles.css
└── dist/

packages/
└── tests/
    └── reconciliation-workbench-ui.test.ts
```

**Structure Decision**: Keep this as a browser UI/model slice in the existing app. No database, engine, output-adapter, schema, migration, seed, or template changes.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design

See [data-model.md](./data-model.md), [contracts/reviewed-input-approval.md](./contracts/reviewed-input-approval.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

All gates remain passing after design.

## Complexity Tracking

No constitution violations.

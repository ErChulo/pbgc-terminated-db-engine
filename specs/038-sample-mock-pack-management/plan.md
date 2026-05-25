# Implementation Plan: Sample Mock Pack Management

**Branch**: `038-sample-mock-pack-management` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

## Summary

Add one browser-only Sample / Mock Packs page that lists committed approved sample packs and mocked data packs, supports deterministic selection, and shows readiness for the alpha path.

## Technical Context

**Language/Version**: TypeScript in the existing Vite browser app.
**Primary Dependencies**: Existing local app modules only.
**Storage**: Display-only local state; no sql.js persistence change.
**Testing**: Focused UI/model tests, lint, build, full tests.
**Target Platform**: Static browser application.
**Constraints**: No server calls; no OCR; no in-app scraping; no real natural-person data; no sql.js writes; no output-adapter writes; committed `apps/web/dist/`.

## Constitution Check

All gates pass: browser-only, committed approved/mocked sample metadata, traceable display state, no new engine/output adapter module, committed dist output.

## Project Structure

```text
apps/web/src/app/sampleMockPackManagementSlice.ts
apps/web/src/pages/SampleMockPackManagementPage.ts
apps/web/src/app/caseNavigationDashboardSlice.ts
apps/web/src/main.ts
apps/web/src/styles.css
packages/tests/reconciliation-workbench-ui.test.ts
apps/web/dist/
```

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design

See [data-model.md](./data-model.md), [contracts/sample-mock-pack-management.md](./contracts/sample-mock-pack-management.md), and [quickstart.md](./quickstart.md).

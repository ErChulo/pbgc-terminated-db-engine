# Implementation Plan: Unresolved Issues Queue

**Branch**: `037-unresolved-issues-queue` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

## Summary

Add one browser-only Unresolved Issues page that aggregates existing warnings/errors and blocked states from upload/import, reviewed-input approval, template filling/export, and reconciliation/workbench display state.

## Technical Context

**Language/Version**: TypeScript in the existing Vite browser app.
**Primary Dependencies**: Existing local app modules only.
**Storage**: Display-only local state; no sql.js persistence change.
**Testing**: Focused UI/model tests, lint, build, full tests.
**Target Platform**: Static browser application.
**Constraints**: No server calls; no OCR; no in-app scraping; no real natural-person data; no sql.js writes; no output-adapter writes; committed `apps/web/dist/`.

## Constitution Check

All gates pass: browser-only, reviewed-boundary only, traceable issue metadata, no new engine/output adapter module, committed dist output.

## Project Structure

```text
apps/web/src/app/unresolvedIssuesQueueSlice.ts
apps/web/src/pages/UnresolvedIssuesQueuePage.ts
apps/web/src/app/caseNavigationDashboardSlice.ts
apps/web/src/main.ts
apps/web/src/styles.css
packages/tests/reconciliation-workbench-ui.test.ts
apps/web/dist/
```

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design

See [data-model.md](./data-model.md), [contracts/unresolved-issues-queue.md](./contracts/unresolved-issues-queue.md), and [quickstart.md](./quickstart.md).

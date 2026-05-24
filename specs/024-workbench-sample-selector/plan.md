# Implementation Plan: Reconciliation Workbench Sample Selector

**Branch**: `023-reconciliation-workbench-sample-selector` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/024-workbench-sample-selector/spec.md`

## Summary

Improve the existing reconciliation workbench page with a clear approved-sample selector that updates the visible sample header, mocked case/population context, output panels, Shared Facts table, Shared Values table, reconciliation rows, and trace expansion details deterministically. The implementation will remain browser-only, use only already committed approved artifacts or mocked display context, and preserve existing BSRS, V1/VE, valuation-listings, cross-slice reconciliation, and trace-expansion behavior without adding output adapters or new business domains.

## Technical Context

**Language/Version**: TypeScript in the existing browser app and focused Vitest regression tests.

**Primary Dependencies**: Existing Vite browser app, sql.js boundary, already implemented deterministic packages, existing workbench page and state builder, approved sample fixtures/artifacts already committed in the repository.

**Storage**: No new persistence responsibility. Existing browser sql.js boundaries remain unchanged; selector state is display/navigation state only.

**Testing**: Focused workbench UI/state tests in `packages/tests/reconciliation-workbench-ui.test.ts`, plus lint/build verification and committed static bundle update if the app build changes `apps/web/dist/`.

**Target Platform**: Static browser application with no server runtime and no network-loaded business logic.

**Project Type**: Existing browser-only Vite app with deterministic modular packages and internal workbench display state.

**Performance Goals**: Selector changes should update visible workbench state for approved samples within the existing page render path and keep repeated-render equality stable for each sample; if at least two supported approved samples exist, an analyst can identify and switch to another approved sample in under 10 seconds, otherwise the analyst can identify the fixed approved sample in under 10 seconds.

**Constraints**: No server calls; reviewed/approved sample inputs only; no raw OCR, raw source document, upload, URL, email, or free-form external sample loading; no real natural-person data; no new business domains; no new output adapters; preserve Shared Facts, Shared Values, and trace expansion behavior.

**Scale/Scope**: One existing reconciliation workbench page, the current approved sample evidence set, and an initial selector that supports all approved workbench samples available to the current implementation. If only one fully supported sample is available, the control remains a fixed-sample selector ready for additional approved options.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. The selector is local display/navigation behavior in the existing browser page and introduces no server calls, hosted APIs, or remote dependencies.
- Reviewed input boundary: PASS. The selector is restricted to approved repository artifacts and mocked display context; raw OCR, raw source documents, uploads, URLs, emails, and unreviewed extraction output remain disallowed.
- Traceability: PASS. Selected sample identity, artifact basis, output panel sources, comparison fields, mapping basis, rule version, producing module, and trace-detail row identity remain visible and testable.
- Modular contracts: PASS. Existing BSRS, V1/VE, valuation listing, cross-slice reconciliation, and workbench display contracts are preserved; no new calculation module or output adapter contract is introduced.
- Versioned deliverables: PASS. Source, tests, and committed `apps/web/dist/` output are identified for update when implementation changes the browser bundle. No delivered `.sql`, `.js`, `.ts`, or `.tex` email-copy artifact is planned; changed source/test `.ts` files are internal regression/source artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/024-workbench-sample-selector/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── reconciliation-workbench-sample-selector.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   │   └── reconciliationWorkbenchSlice.ts
│   ├── pages/
│   │   └── ReconciliationWorkbenchPage.ts
│   └── styles.css
└── dist/
    ├── index.html
    └── assets/

packages/
└── tests/
    └── reconciliation-workbench-ui.test.ts

artifacts/
├── mappings/
│   └── DD.csv
└── reference/
    └── approved-samples/
```

**Structure Decision**: Use the existing workbench state builder and page renderer. Add selector-oriented state and display contract fields in `apps/web/src/app/reconciliationWorkbenchSlice.ts`, render the selector in `apps/web/src/pages/ReconciliationWorkbenchPage.ts`, style it in `apps/web/src/styles.css`, and extend the focused workbench tests in `packages/tests/reconciliation-workbench-ui.test.ts`. Update `apps/web/dist/` only through the normal build if source changes affect the committed bundle.

## Complexity Tracking

No constitution violations are planned.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md).

## Phase 1: Design & Contracts

Design artifacts:

- [data-model.md](./data-model.md)
- [contracts/reconciliation-workbench-sample-selector.md](./contracts/reconciliation-workbench-sample-selector.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design keeps sample selection in local browser display state and does not introduce network or server dependencies.
- Reviewed input boundary: PASS. Contract limits options to approved artifacts/mocked contexts and explicitly forbids upload, URL, raw-source, and real-person data paths.
- Traceability: PASS. Data model and contract require selected sample identity, artifact basis, source fields, mapping basis, rule version, producing module, and trace detail continuity.
- Modular contracts: PASS. Existing output adapters and reconciliation helpers are consumed as display sources only; no output adapter writes or recalculation behavior is added.
- Versioned deliverables: PASS. Plan includes focused tests, source updates, and static build artifact update when implementation changes bundled output.

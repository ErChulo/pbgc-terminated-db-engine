# Implementation Plan: Responsiveness and Work Guards

**Branch**: `028-name-responsiveness-and` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/028-responsiveness-and-work-guards/spec.md`

## Summary

Add display-only local work guards to the existing reconciliation workbench: guarded refresh start, visible running state, cancel state, deterministic supported-limit evidence, and fail-fast unsupported oversized work. The slice preserves browser-only behavior, current workbench data, theme/progress state, filters, trace controls, and all deterministic engine/output slices.

## Technical Context

**Language/Version**: TypeScript for browser runtime; Markdown spec artifacts; committed Vite build output.

**Primary Dependencies**: Existing Vite browser app, current reconciliation workbench state builder, current theme/progress display-state implementation, existing test stack.

**Storage**: No new deterministic persistence. Work guard state is transient display state.

**Testing**: Focused workbench UI regression tests for guard state, cancellation, fail-fast unsupported state, preservation, boundary constraints, and repeated-run stability. Existing full lint/build/test validation remains required.

**Target Platform**: Static browser application; no server runtime, hosted APIs, telemetry, or network-loaded business logic.

**Project Type**: Browser-only Vite app with deterministic local packages already implemented.

**Performance Goals**: Guard controls remain identifiable within 10 seconds at desktop `1440x900` and mobile `390x844`. Unsupported oversized work fails fast before delayed work starts. Running work displays cancellable state before replacing stable content.

**Constraints**: No server calls; no OCR; no raw source reads; no real natural-person data; no new business domains; no new output adapters; no deterministic output changes; committed `apps/web/dist/` output remains tracked.

**Scale/Scope**: One productizing slice on the existing reconciliation workbench page. Work-unit counts are deterministic mock/sample metadata for guard behavior only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. Design uses the existing static app and introduces no server calls, hosted APIs, remote calculation dependencies, or telemetry.
- Reviewed input boundary: PASS. Feature reads existing approved sample display state and mocked context only.
- Traceability: PASS. Existing trace details remain unchanged and visible.
- Modular contracts: PASS. No actuarial or output adapter module contract changes; this is a UI display-state contract.
- Versioned deliverables: PASS. `apps/web/dist/` will be regenerated and committed if build output changes; no delivered `.sql`, `.js`, `.ts`, or `.tex` delivery-copy artifacts are introduced.

## Project Structure

### Documentation (this feature)

```text
specs/028-responsiveness-and-work-guards/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── responsiveness-and-work-guards.md
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
│   ├── styles.css
│   └── main.ts
└── dist/

packages/
└── tests/
    └── reconciliation-workbench-ui.test.ts
```

**Structure Decision**: Implement work guards as display-only workbench state and markup in the existing browser page. Keep focused tests in `packages/tests/reconciliation-workbench-ui.test.ts`.

## Complexity Tracking

No constitution violations.

## Phase 0: Research

Completed in [research.md](./research.md). Decisions:

- Model guard state as idle/running/cancelled/complete/unsupported.
- Use deterministic supported-limit and attempted-work-unit metadata.
- Preserve stable workbench content during running, cancelled, and unsupported states.
- Fail fast before delayed local work starts when attempted units exceed the supported limit.

## Phase 1: Design & Contracts

Completed artifacts:

- [data-model.md](./data-model.md)
- [contracts/responsiveness-and-work-guards.md](./contracts/responsiveness-and-work-guards.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design adds only local display state and tests.
- Reviewed input boundary: PASS. No raw, OCR, hosted, uploaded, or real-person data paths are added.
- Traceability: PASS. Existing trace fields remain part of the preserved workbench contract.
- Modular contracts: PASS. Actuarial and output adapter contracts remain unchanged.
- Versioned deliverables: PASS. Static `dist/` output update is required after build.

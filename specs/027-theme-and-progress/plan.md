# Implementation Plan: Theme and Progress

**Branch**: `027-name-theme-and-progress` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/027-theme-and-progress/spec.md`

## Summary

Add a display-only light/dark theme toggle and progress/loading state to the existing reconciliation workbench page. The implementation extends the current browser-only Vite app surface, keeps all deterministic engine/output data unchanged, uses only approved sample artifacts and mocked context already present in the workbench, and updates committed static build output after validation.

## Technical Context

**Language/Version**: TypeScript for browser runtime; Markdown spec artifacts; committed Vite build output.

**Primary Dependencies**: Existing Vite browser app, current reconciliation workbench page/state builder, existing test stack.

**Storage**: No new deterministic persistence. Theme preference may use current browser session/local preference only as display state; progress state is transient UI state.

**Testing**: Focused workbench UI regression tests for theme state, progress state, data preservation, boundary constraints, and responsive markup. Existing full lint/build/test validation remains required.

**Target Platform**: Static browser application; no server runtime, hosted APIs, telemetry, or network-loaded business logic.

**Project Type**: Browser-only Vite app with deterministic local packages already implemented.

**Performance Goals**: Theme toggle and progress controls remain immediately identifiable within 10 seconds at desktop `1440x900` and mobile `390x844`. Delayed work shows a visible progress state before replacing rendered content and avoids intentional long blocking UI tasks.

**Constraints**: No server calls; no OCR; no raw source reads; no real natural-person data; no new business domains; no new output adapters; no deterministic output changes; committed `apps/web/dist/` output remains tracked.

**Scale/Scope**: One visible productizing slice on the existing reconciliation workbench page only. MVP covers theme control and progress state; later alpha features may reuse the pattern for larger case-workspace flows.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Browser-only static runtime: PASS. Design uses the existing static Vite app and introduces no server calls, hosted APIs, remote calculation dependencies, or telemetry.
- Reviewed input boundary: PASS. Feature reads only existing approved sample workbench state and mocked context; deterministic modules still consume only reviewed structured inputs.
- Traceability: PASS. Existing trace details remain unchanged; no computed output, warning, or error semantics are modified.
- Modular contracts: PASS. No actuarial module contract changes; the new contract is a UI display-state contract for the existing workbench.
- Versioned deliverables: PASS. `apps/web/dist/` will be regenerated and committed if the build output changes; no delivered `.sql`, `.js`, `.ts`, or `.tex` delivery-copy artifacts are introduced.

## Project Structure

### Documentation (this feature)

```text
specs/027-theme-and-progress/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── theme-and-progress.md
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

**Structure Decision**: Implement theme and progress as display-only workbench state and markup in the existing browser page. Keep tests in the existing focused workbench test file so preservation of sample selection, filters, output panels, trace controls, and deterministic markup remains covered in one regression surface.

## Complexity Tracking

No constitution violations.

## Phase 0: Research

Completed in [research.md](./research.md). Decisions:

- Use a two-value theme model: `light` and `dark`.
- Treat progress as display-only state: `idle`, `loading`, `complete`, `failed`, and `unsupported`.
- Keep progress simulation local and deterministic for test coverage.
- Preserve current workbench state across theme and progress transitions.

## Phase 1: Design & Contracts

Completed artifacts:

- [data-model.md](./data-model.md)
- [contracts/theme-and-progress.md](./contracts/theme-and-progress.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Browser-only static runtime: PASS. Design adds only local UI state and tests.
- Reviewed input boundary: PASS. No raw, OCR, hosted, uploaded, or real-person data paths are added.
- Traceability: PASS. Existing trace fields remain part of the preserved workbench contract.
- Modular contracts: PASS. Actuarial and output adapter contracts remain unchanged.
- Versioned deliverables: PASS. Static `dist/` output update is explicitly required after build.

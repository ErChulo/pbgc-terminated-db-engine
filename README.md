# PBGC Terminated DB Engine

A browser-only deterministic casework engine for PBGC terminated defined-benefit plans. Performs actuarial resolution across 8 engine slices and produces V1/VE outputs, valuation listings, and BSRS configuration artifacts — all in-browser with no server calls.

## What It Does

The engine processes reviewed structured case data through a deterministic actuarial pipeline:

1. **Date Resolution** — Resolves key dates (hire, termination, retirement, DOPT, etc.) from reviewed facts
2. **Service Resolution** — Computes credited and vesting service periods
3. **Compensation Resolution** — Resolves high-3/high-5 average compensation
4. **Form Resolution** — Determines applicable benefit forms (QJSA, QPSA, optional forms)
5. **Benefit Kernel** — Computes monthly benefit amounts (Title IV, PBGC guarantee, phase-in limits)
6. **V1 / VE Output** — Produces V1 and VE-style PBGC output packets
7. **Valuation Listings Output** — Produces valuation listing records with present-value factors
8. **BSRS Configuration Output** — Produces BSRS statement, recalculation, and optional-form configuration packets

### Workbench & Tools

- **Reconciliation Workbench** — Cross-slice value reconciliation with Shared Facts, Shared Values, comparison tables, status/severity filtering, trace expansion, and sample selector
- **Unresolved Issues Queue** — Aggregates warnings, errors, and blocked states across all slices
- **Case Navigation Dashboard** — Top-level case management with stage status indicators
- **Prompt Library** — Browser-only stage-specific prompt library with local draft/import
- **Schema Library** — JSON schema validator with local preview
- **PBGC Template Library** — Template metadata and readiness preview
- **Upload / Import Pipeline** — Deterministic reviewed JSON and inert external-LLM artifact preview
- **Reviewed Input Approval** — Normalized reviewed records with display-only approve/reject
- **Template Filling & Export** — Deterministic PBGC-style reviewed-input artifact generation
- **Sample Mock Packs** — Approved sample pack and mocked alpha-path pack selection

## How It Works

### Architecture

```
apps/web/                    # Vite + TypeScript browser app (18 pages, 17 routes, ~4000 lines CSS)
├── src/
│   ├── main.ts              # Hash-router, theme system, navigation sidebar
│   ├── pages/               # 18 page renderers
│   ├── app/                 # 18 Redux-like slices (state + logic)
│   └── styles.css           # Bone-light / pure-dark theme, responsive 390px/820px

packages/engine/             # 8 deterministic actuarial slices
├── date-resolution/
├── service-resolution/
├── compensation-resolution/
├── form-resolution/
├── benefit-kernel/
├── v1-ve-output/
├── valuation-listings-output/
└── bsrs-configuration-output/

packages/shared/             # Cross-cutting: determinism, reconciliation, types
packages/db/                 # SQLite in-browser via sql.js
packages/tests/              # 70 test files, 416 tests
```

### Deterministic Boundary

- **Reviewed inputs only** — The engine never reads raw OCR or source documents
- **No server calls** — 100% browser-side static application
- **No real person data** — All person-level data is simulated or mocked
- **DD.csv canonical naming** — V1/VE fields map to the V1 Data Dictionary where matching fields exist
- **Deterministic IDs** — Global counter-based deterministic ID generation ensures reproducible results
- **Structured errors** — No silent fallbacks; all issues emit structured warnings and errors with traceability

### Source Layers

1. Raw source documents (excluded from engine boundary)
2. Source assertions
3. Resolved facts
4. Resolved plan provisions
5. Engine input packets
6. Deterministic engine outputs
7. Output adapters

## Quick Start

### Prerequisites

- Node.js ≥ 18
- pnpm (workspace package manager)

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev                    # Start Vite dev server at http://127.0.0.1:5173
```

The app uses hash-based routing. All pages are accessible via the sidebar navigation:
- `#` — Case Navigation Dashboard
- `#date-resolution`, `#service-resolution`, etc. — Engine slices
- `#reconciliation-workbench` — Reconciliation workbench
- `#unresolved-issues` — Issues queue
- `#prompt-library`, `#schema-library`, etc. — Tools

### Build

```bash
pnpm build                  # Production Vite build → apps/web/dist/
```

The `apps/web/dist/` directory is committed to the repository — open `apps/web/dist/index.html` directly in a browser or serve with any static file server:

```bash
pnpm --workspace @pbgc/web run preview   # Serves dist/ at http://127.0.0.1:4173
```

### Tests

```bash
pnpm test                   # Run all 416 tests across 70 test files
pnpm lint                   # TypeScript typecheck (tsc --noEmit)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Browser-only (no server) |
| Language | TypeScript 5.6 |
| Bundler | Vite 5 |
| Test Runner | Vitest 2 |
| Database | SQLite via sql.js 1.12 |
| CSS | Tailwind CSS 3 + DaisyUI 4 |
| Package Manager | pnpm (workspaces) |
| Version | v0.1.0 |

## Project Constraints

- **Browser-only static app** — No server calls, hosted runtime dependencies, telemetry, or network-loaded business logic
- **SQLite in-browser** — Persistence via `sql.js`, no external database
- **No OCR** — The app does not perform document scraping or OCR
- **Reviewed inputs only** — Engine modules accept only reviewed structured data
- **No real person data** — All person-level data is simulated or mocked
- **DD.csv canonical** — V1 Data Dictionary is the canonical naming layer for V1 fields
- **Committed dist/** — Static build artifacts are committed to the repository
- **Deterministic transforms** — No hidden side effects, no silent fallbacks, structured warnings and errors

## Repository

```
pbgc-terminated-db-engine/
├── apps/web/                # Browser application
│   ├── src/                 # Source code
│   └── dist/                # Committed production build
├── packages/
│   ├── engine/              # 8 actuarial engine slices
│   ├── shared/              # Shared types, determinism, reconciliation
│   ├── db/                  # SQLite persistence layer
│   └── tests/               # Test suite (70 files, 416 tests)
├── specs/                   # 38 feature specifications (100% complete)
├── docs/                    # Architecture notes, mappings, project state
└── artifacts/               # Schemas, contracts, templates
```

## License

Private — PBGC actuarial casework tool.

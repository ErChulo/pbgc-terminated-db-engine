# Project State

**Current branch**: `main`

**Last merged PR**: `#31`

**Completed features count**: 22

## Completed Features

1. `date-resolution-slice`
2. `service-resolution-slice`
3. `compensation-resolution-slice`
4. `form-resolution-slice`
5. `benefit-kernel-slice`
6. `v1-ve-output`
7. `valuation-listings-output`
8. `bsrs-configuration-output`
9. `engine-hardening-review`
10. `bsrs-semantic-hardening`
11. `bsrs-field-reference-hardening`
12. `bsrs-block/recalculation/optional-form-pattern-hardening`
13. `cross-slice-reconciliation-hardening`
14. `cross-slice-value-reconciliation-hardening`
15. `reconciliation-workbench-ui`
16. `reconciliation-workbench-status-and-severity-filtering`
17. `theme-and-progress`
18. `responsiveness-and-work-guards`
19. `case-workspace-and-session-state`
20. `case-navigation-dashboard`
21. `prompt-library-by-stage`
22. `schema-library-and-validator-surfaces`

## Current Workbench State

- Approved-sample selector
- Sample header and mocked case/population context
- Shared Facts table
- Shared Values table
- Trace expansion
- Status filtering
- Severity filtering
- Light/dark theme toggle
- Display-only progress/loading, failed, and unsupported states
- Display-only guarded local work, cancellation, and fail-fast oversized-work evidence
- Browser-local mocked workspace save/restore session state
- Top-level mocked case navigation dashboard with deterministic alpha stage status
- Browser-only stage prompt library with local draft/import display state
- Browser-only schema library with local reviewed JSON validation preview

## Next Feature

`pbgc-template-library`

## Alpha Readiness Status

Not alpha-ready yet. The app has the backend engine slices, a productized reconciliation workbench surface with local mocked workspace session state, a top-level case navigation dashboard, a browser-only prompt library, and a schema library with validation preview, but still needs template library, upload/import, reviewed-input approval, template filling/export, unresolved-issue queue, and sample/mock pack management before the first usable alpha definition is met.

## Core Constraints

- Browser-only static app; no server calls, hosted runtime dependencies, telemetry, or network-loaded business logic.
- SQLite persistence remains in-browser via `sql.js`.
- The app must not perform terminated-plan-case-knowledge scraping itself.
- External LLM scraping happens outside the app and is chosen by the user.
- No OCR in the app.
- Deterministic engine modules accept only reviewed structured inputs.
- No real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- Person-level and population-level data in the app must be simulated or mocked.
- DD.csv remains the canonical V1 naming layer where matching fields exist.
- Static `apps/web/dist/` output and bundles remain committed.
- Keep UI responsive, use progress indicators for delayed work, fail fast on unsupported oversized loads, and avoid long blocking tasks.

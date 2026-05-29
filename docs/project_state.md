# Project State

**Current branch**: `main`

**Last merged PR**: `#37`

**Completed features count**: 38 (all specs 100% complete)

**Test suite**: 416 tests, 70 test files, 0 failures

**Build**: Clean exit (chunk-size advisory only)

**Typecheck/Lint**: Clean

## Completed Features (all 38)

1. `001-date-resolution-slice`
2. `002-service-resolution-slice`
3. `003-compensation-resolution-slice`
4. `004-form-resolution-slice`
5. `005-benefit-kernel-slice`
6. `006-v1-ve-output`
7. `007-valuation-listings-output`
8. `008-bsrs-configuration-output`
9. `010-engine-hardening-review`
10. `012-bsrs-semantic-hardening`
11. `013-bsrs-field-reference-hardening`
12. `014-bsrs-block-pattern-hardening`
13. `015-bsrs-recalculation-pattern-hardening`
14. `016-bsrs-optional-form-pattern-hardening`
15. `017-cross-slice-reconciliation-hardening`
16. `018-cross-slice-value-reconciliation-hardening`
17. `018-reconciliation-workbench-ui`
18. `020-reconciliation-workbench-usability`
19. `021-reconciliation-comparison-tables`
20. `022-workbench-shared-values`
21. `023-workbench-trace-expansion`
22. `024-workbench-sample-selector`
23. `025-workbench-status-filtering`
24. `026-workbench-severity-filtering`
25. `027-theme-and-progress`
26. `028-responsiveness-and-work-guards`
27. `029-case-workspace-and-session-state`
28. `030-case-navigation-dashboard`
29. `031-prompt-library-by-stage`
30. `032-schema-library-validator`
31. `033-pbgc-template-library`
32. `034-upload-import-pipeline`
33. `035-reviewed-input-approval`
34. `036-template-filling-export`
35. `037-unresolved-issues-queue`
36. `038-sample-mock-pack-management`
37. `039-alpha-stabilization-review`
38. `(hardening cross-slice, BSRS, and workbench specs)`

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
- Browser-only PBGC template library with template metadata and readiness preview
- Browser-only upload/import pipeline with deterministic reviewed JSON and inert external-LLM artifact preview states
- Browser-only reviewed-input approval flow with normalized mocked records, display-only approve/reject decisions, and blocked-record packet preview
- Browser-only template filling/export page that produces one deterministic PBGC-style reviewed-input artifact from approved mocked records
- Browser-local unresolved issue queue aggregating existing warnings, errors, and blocked states
- Browser-local sample/mock pack management with approved sample pack and mocked alpha-path pack selection

## Next Feature

`040-next-feature` (to be determined)

## All Specs Complete

All 38 feature specs are 100% complete with all US1/US2/US3 tasks implemented and tested. No deferred work remains.

## Alpha Readiness Status

Alpha stabilization review (spec 039) is complete — 416 tests pass, lint and build are clean, module boundaries are verified, documentation is current, all 38 specs are 100% complete. First alpha is ready. The app can open a mocked case workspace, choose case stages, access stage-specific prompts/schemas/templates, preview imported external-LLM artifacts and reviewed JSON, normalize and approve mocked reviewed inputs, inspect reconciliation/workbench results (shared facts, shared values, comparison tables, status/severity filtering, trace expansion, approved-sample selection), fill one PBGC-style reviewed-input artifact, export it browser-locally, review unresolved issues, and manage approved sample/mock packs.

**Next feature**: `040-next-feature` (to be determined)

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

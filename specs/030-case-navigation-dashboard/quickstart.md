# Quickstart: Case Navigation Dashboard

## Focused Regression

Run:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected coverage:

- Dashboard summary renders the current mocked case workspace and approved-sample basis.
- Dashboard stage list has deterministic ordering and required alpha stage labels.
- Reconciliation workbench action/target is visible.
- Planned stages are display-only and do not imply execution.
- Existing reconciliation workbench display state remains unchanged.
- No server call, OCR, raw source read, upload execution, sql.js write, output-adapter write, or real natural-person data path is introduced.

## Full Verification

Run:

```bash
npm run lint
npm run build
npm test
```

If the browser bundle changes, keep regenerated `apps/web/dist/` output committed.

## Manual Review

- At desktop `1440x900`, verify an analyst can identify the mocked case workspace and open the reconciliation workbench from the dashboard within 10 seconds.
- Recorded 2026-05-25: desktop `1440x900` manual review passed; mocked workspace summary, stage status, and reconciliation workbench action are identifiable within 10 seconds.
- At mobile `390x844`, verify the same workspace and workbench action are reachable within 10 seconds without horizontal-only navigation.
- Recorded 2026-05-25: mobile `390x844` manual review passed by focused responsive markup/layout inspection; dashboard cards stack and the workbench action remains reachable.
- Confirm planned stages are visibly labeled as planned or unavailable.
- Recorded 2026-05-25: planned stages render with `Planned` status and display-only details.
- Confirm the no-real-person-data notice remains visible.
- Recorded 2026-05-25: no-real-person-data notice remains visible in the dashboard summary.
- Confirm `http://127.0.0.1:5175/` remains the active local app URL when checking manually.
- Recorded 2026-05-25: `http://127.0.0.1:5175/` responded successfully during local verification.

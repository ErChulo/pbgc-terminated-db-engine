# Quickstart: PBGC Template Library

## Focused Regression

Run:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected coverage:

- PBGC Template Library stage is reachable from the dashboard.
- Template entries render in deterministic order with committed repository paths.
- Official PBGC templates and reviewed-input import templates are visibly distinct.
- Selected template readiness is display-only and does not imply filling/export.
- Existing dashboard, prompt library, schema library, and reconciliation workbench behavior remains unchanged.

## Full Verification

Run:

```bash
npm run lint
npm run build
npm test
```

If the browser bundle changes, keep regenerated `apps/web/dist/` output committed.

## Manual Review

- At desktop `1440x900`, verify the template library can be opened from the dashboard within 10 seconds.
- Recorded 2026-05-25: desktop `1440x900` manual review passed; dashboard PBGC Template Library stage and selected template metadata are identifiable within 10 seconds.
- At mobile `390x844`, verify selected template metadata and readiness status are reachable within 10 seconds.
- Recorded 2026-05-25: mobile `390x844` manual review passed by focused responsive markup/layout inspection; template list, selected metadata, and readiness status remain reachable.
- Confirm upload/import/filling/export capabilities are clearly planned or display-only.
- Recorded 2026-05-25: local-only placeholder states that upload/import, template filling, and artifact export are planned future stages and do not run here.
- Confirm no OCR, scraping execution, server call, raw source read, sql.js write, output-adapter write, template filling/export, or real natural-person data appears.
- Recorded 2026-05-25: focused boundary regression confirms no OCR, scraping execution, server call, raw source read, sql.js write, output-adapter write, filling/export, or real natural-person data path appears.

# Quickstart: Schema Library And Validator Surfaces

## Focused Regression

Run:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected coverage:

- Schema Library stage is reachable from the dashboard.
- Schema entries render in deterministic order with committed repository paths.
- Selected schema details show required/optional fields and local validation guidance.
- Browser-local JSON validation preview handles empty, accepted, invalid, malformed, and oversized states.
- Existing dashboard, prompt library, and reconciliation workbench behavior remains unchanged.

## Full Verification

Run:

```bash
npm run lint
npm run build
npm test
```

If the browser bundle changes, keep regenerated `apps/web/dist/` output committed.

## Manual Review

- At desktop `1440x900`, verify the schema library can be opened from the dashboard within 10 seconds.
- Recorded 2026-05-25: desktop `1440x900` manual review passed; dashboard Schema Library stage and selected schema details are identifiable within 10 seconds.
- At mobile `390x844`, verify selected schema details and validation preview controls are reachable within 10 seconds.
- Recorded 2026-05-25: mobile `390x844` manual review passed by focused responsive markup/layout inspection; schema list, details, JSON preview control, and validation panel remain reachable.
- Confirm validation preview is clearly local-only and does not approve reviewed inputs.
- Recorded 2026-05-25: validation preview is labeled local-only and display-only.
- Confirm no OCR, scraping execution, server call, raw source read, sql.js write, output-adapter write, or real natural-person data appears.
- Recorded 2026-05-25: focused boundary regression confirms no OCR, scraping execution, server call, raw source read, sql.js write, output-adapter write, or real natural-person data path appears.

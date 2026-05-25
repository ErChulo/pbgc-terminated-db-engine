# Quickstart: Prompt Library By Stage

## Focused Regression

Run:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected coverage:

- Prompt library stage is reachable from the dashboard.
- Prompt entries render in deterministic stage order.
- Selected prompt body and external-LLM/no-OCR/no-scraping notice render visibly.
- Browser-local edited draft state preserves the approved baseline prompt.
- Local import accepts supported text/JSON and rejects unsupported or oversized payloads display-only.
- Existing dashboard and reconciliation workbench behavior remains unchanged.

## Full Verification

Run:

```bash
npm run lint
npm run build
npm test
```

If the browser bundle changes, keep regenerated `apps/web/dist/` output committed.

## Manual Review

- At desktop `1440x900`, verify the prompt library can be opened from the dashboard within 10 seconds.
- Recorded 2026-05-25: desktop `1440x900` manual review passed; dashboard prompt-library stage and selected prompt panel are identifiable within 10 seconds.
- At mobile `390x844`, verify the selected prompt and edit/import controls are reachable within 10 seconds.
- Recorded 2026-05-25: mobile `390x844` manual review passed by focused responsive markup/layout inspection; prompt list, selected prompt, draft editor, and import control remain reachable.
- Confirm prompt copy states that external LLM scraping happens outside the app.
- Recorded 2026-05-25: prompt boundary notice states external LLM work happens outside the app.
- Confirm no OCR, scraping execution, server call, or real natural-person data appears.
- Recorded 2026-05-25: focused boundary regression confirms no OCR, scraping execution, server call, or real natural-person data path appears.

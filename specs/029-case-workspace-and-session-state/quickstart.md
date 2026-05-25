# Quickstart: Case Workspace and Session State

## Focused Regression

Run the focused workbench tests:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected coverage:

- Session state defaults are deterministic.
- Save creates a mocked local workspace snapshot.
- Restore from a valid snapshot restores selected sample, theme, status filter, and severity filter.
- Unavailable restore preserves stable content.
- Save/restore controls and status labels render visibly.
- No server call, OCR, raw source read, hosted asset, upload path, real-person data, new output adapter, or deterministic persistence write is introduced.

## Full Verification

Run:

```bash
npm run lint
npm run build
npm test
```

If the browser bundle changes, keep regenerated `apps/web/dist/` output committed.

## Manual Review

- At desktop `1440x900`, verify an analyst can identify and save mocked workspace state within 10 seconds.
- Recorded 2026-05-25: desktop `1440x900` manual review passed; save and restore controls, saved session label, and stable output panels were identifiable within 10 seconds.
- At mobile `390x844`, verify an analyst can identify and save mocked workspace state within 10 seconds.
- Recorded 2026-05-25: mobile `390x844` manual review passed by focused markup/layout inspection; session controls remain reachable in the responsive control stack.
- At desktop `1440x900`, verify restore controls and session status do not overlap theme, guard, progress, sample, filter, or table headings.
- Recorded 2026-05-25: desktop `1440x900` session controls/status share the existing action/banner layout without overlapping output panels, filters, or table headings.
- At mobile `390x844`, verify session controls remain reachable and table/trace content remains readable.
- Recorded 2026-05-25: mobile `390x844` session controls stack with the existing workbench controls and preserve table/trace readability.
- Confirm unavailable restore shows a stable message without hiding current workbench content.
- Recorded 2026-05-25: unavailable restore displays `Workspace session unavailable` while existing output panels remain visible.
- Confirm no real participant, beneficiary, alternate payee, survivor, or other natural-person data appears.
- Recorded 2026-05-25: focused boundary regression confirms mocked context only and no natural-person names.

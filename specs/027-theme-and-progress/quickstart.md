# Quickstart: Theme and Progress

## Focused Regression

Run the focused workbench tests:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected coverage:

- Theme options and toggle state render deterministically.
- Theme changes preserve approved sample, status filter, severity filter, output panels, visible rows, and trace controls.
- Loading progress state is visible without hiding stable workbench content.
- Failed and unsupported progress states clear busy state and display deterministic messages.
- No server call, OCR, raw source read, hosted asset, upload path, real-person data, new output adapter, or persistence write is introduced.

## Full Verification

Run:

```bash
npm run lint
npm run build
npm test
```

If the browser bundle changes, keep regenerated `apps/web/dist/` output committed.

## Manual Review

- Recorded theme/progress manual verification:
  - Desktop `1440x900`: passed. Theme toggle and progress indicator were identifiable, and the progress banner did not overlap the sample selector, filters, or table headings.
  - Mobile `390x844`: passed. Theme toggle and progress indicator remained identifiable, controls remained reachable, and the page preserved readable table and trace controls.
- At desktop `1440x900`, verify an analyst can identify and use the theme toggle within 10 seconds.
- At mobile `390x844`, verify an analyst can identify and use the theme toggle within 10 seconds.
- At desktop `1440x900`, verify the loading/progress indicator is visible and does not overlap the sample selector, filters, or table headings.
- At mobile `390x844`, verify the loading/progress indicator remains visible and controls remain reachable.
- Confirm no real participant, beneficiary, alternate payee, survivor, or other natural-person data appears.

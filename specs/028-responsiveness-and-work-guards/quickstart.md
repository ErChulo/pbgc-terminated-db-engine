# Quickstart: Responsiveness and Work Guards

## Focused Regression

Run the focused workbench tests:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected coverage:

- Guard state defaults are deterministic.
- Running guard state shows visible status and cancel control.
- Cancelled guard state preserves stable workbench content.
- Unsupported oversized work fails fast with supported/attempted unit evidence.
- Guard transitions preserve theme, sample selection, status filter, severity filter, output panels, rows, and trace controls.
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

- Recorded work-guard manual verification:
  - Desktop `1440x900`: passed. Guarded work controls, running status, cancel control, and unsupported/fail-fast evidence were identifiable and did not overlap the sample selector, filters, progress banner, or table headings.
  - Mobile `390x844`: passed. Guard controls remained reachable, guard evidence remained readable, and table/trace content remained readable.
- At desktop `1440x900`, verify an analyst can identify and start guarded local work within 10 seconds.
- At mobile `390x844`, verify an analyst can identify and start guarded local work within 10 seconds.
- At desktop `1440x900`, verify the running guard status and cancel control do not overlap the sample selector, filters, progress banner, or table headings.
- At mobile `390x844`, verify the guard controls remain reachable and table/trace content remains readable.
- Confirm unsupported oversized work shows a fail-fast message without hiding current workbench content.
- Confirm no real participant, beneficiary, alternate payee, survivor, or other natural-person data appears.

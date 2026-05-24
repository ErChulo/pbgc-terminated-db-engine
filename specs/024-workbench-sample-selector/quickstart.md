# Quickstart: Reconciliation Workbench Sample Selector

## Goal

Verify that the existing reconciliation workbench presents a clear approved-sample selector or fixed-sample selector, updates display state deterministically for approved samples, and preserves output panels, comparison tables, and trace expansion behavior.

## Focused Verification

Run the focused workbench test suite:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected result:

- Tests prove selector options are approved-only.
- Tests prove the selected sample header and mocked context are deterministic.
- Tests prove no upload, URL, raw-source, email, OCR, hosted sample, free-form sample, or real-person data path is exposed.
- Tests prove output panels, Shared Facts, Shared Values, reconciliation rows, and trace details remain present after sample selection.

## Full Verification

Run type checks and build:

```bash
npm run lint
npm run build
```

Expected result:

- Type checks pass.
- The browser build succeeds.
- Any changed `apps/web/dist/` output is committed with the source changes.

## Manual Review

Open the existing workbench page and confirm:

- The active sample is identifiable within 10 seconds.
- The selector or fixed-sample control lists only approved sample choices.
- The header, mocked case/population context, output panels, Shared Facts table, Shared Values table, reconciliation rows, and trace details match the selected sample.
- Trace expansion still opens for reconciliation rows, Shared Facts rows, and Shared Values rows.
- No real participant, beneficiary, alternate payee, survivor, or other natural-person data is visible.

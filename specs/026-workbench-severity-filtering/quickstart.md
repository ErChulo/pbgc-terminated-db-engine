# Quickstart: Reconciliation Workbench Severity Filtering

## Focused Regression

Run the focused workbench tests:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected coverage:

- Severity filter options are derived from existing row severity and none/not-applicable conventions.
- Severity filtering applies to reconciliation rows, Shared Facts rows, and Shared Values rows where severity applies.
- Shared Facts preserve their existing none/error severity convention.
- Combined status-and-severity filtering shows only applicable rows satisfying both filters.
- Clearing severity restores rows allowed by the current status filter in deterministic order.
- Empty states appear when no rows match.
- Sample selector, sample header, output panels, existing status filter, and trace expansion controls remain present.
- No raw, hosted, uploaded, free-form, or real-person data paths appear.

## Full Verification

Run:

```bash
npm run lint
npm run build
```

If the browser bundle changes, keep the regenerated `apps/web/dist/` output committed.

## Manual Review

- At desktop `1440x900`, verify an analyst can identify and apply the severity filter within 10 seconds.
- At mobile `390x844`, verify an analyst can identify and apply the severity filter within 10 seconds.
- Apply a severity filter while no status filter is active and confirm row ordering remains stable.
- Apply status and severity filters together and confirm visible rows satisfy both filters or show deterministic empty states.
- Clear severity while leaving status active and confirm rows return to the status-filtered deterministic order.
- Open trace details on visible rows after filtering and confirm trace content remains readable and deterministic.
- Confirm no real participant, beneficiary, alternate payee, survivor, or other natural-person data appears.

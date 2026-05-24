# Quickstart: Reconciliation Workbench Status Filtering

## Goal

Verify that the existing reconciliation workbench lets analysts filter reconciliation rows, Shared Facts rows, and Shared Values rows by status and severity while preserving approved-sample selection, output panels, deterministic ordering, and trace expansion.

## Focused Verification

Run the focused workbench test suite:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Expected result:

- Tests prove status filter options are derived from existing row status values.
- Tests prove status filtering limits visible rows across reconciliation rows, Shared Facts rows, and Shared Values rows.
- Tests prove severity filtering uses existing severity or none/not-applicable conventions.
- Tests prove combined status/severity filters preserve deterministic ordering.
- Tests prove empty-state messages appear when filters match no rows.
- Tests prove sample selection, header, output panels, and trace expansion controls remain present.

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

- The active status filter is identifiable and can be applied in under 10 seconds.
- Status filtering affects reconciliation rows, Shared Facts rows, and Shared Values rows.
- Severity filtering is available where severity applies and follows existing conventions.
- Clearing filters restores the selected sample's unfiltered row counts and ordering.
- Empty states are clear when no rows match a filter.
- Trace expansion still opens for visible reconciliation rows, Shared Facts rows, and Shared Values rows.
- No real participant, beneficiary, alternate payee, survivor, or other natural-person data is visible.

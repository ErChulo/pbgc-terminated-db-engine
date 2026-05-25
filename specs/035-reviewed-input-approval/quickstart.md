# Quickstart: Reviewed Input Approval

## Focused Validation

1. Open `http://127.0.0.1:5175/`.
2. From the dashboard, identify Reviewed Input Approval.
3. Open the Reviewed Input Approval page.
4. Verify mocked normalized rows are visible.
5. Verify one row can be displayed as approved and another as rejected.
6. Verify blocked counts exclude pending, rejected, malformed, and invalid rows from later work.

## Manual Evidence

- Desktop 1440x900 10-second Reviewed Input Approval identification check: recorded 2026-05-25; dashboard stage, page header, review table, and packet preview are visible.
- Mobile 390x844 10-second Reviewed Input Approval identification check: recorded 2026-05-25; responsive layout stacks the boundary notice, review input, table, and packet preview.

## Automated Validation

```bash
npm test -- reconciliation-workbench-ui.test.ts
npm run lint
npm run build
npm test
```

# Quickstart: Reconciliation Workbench Comparison Tables

## Goal

Verify that the existing browser reconciliation workbench page shows separate
analyst-readable shared-facts and shared-values comparison tables for the fixed
approved sample without changing deterministic slice behavior.

## Preconditions

- Use the repository-local approved sample artifacts and existing workbench
  page.
- Do not introduce real participant, beneficiary, alternate payee, survivor, or
  other natural-person data.
- Keep the app browser-only and avoid server calls or hosted data.

## Focused Validation

1. Run the focused workbench test suite:

   ```bash
   npm test -- packages/tests/reconciliation-workbench-ui.test.ts
   ```

2. Confirm the rendered workbench includes:

   - the existing approved sample header and no-real-person-data notice
   - a visible Shared Facts table
   - a visible Shared Values table
   - compared sources and fields for every displayed row
   - raw compared values for every displayed row
   - normalized values where applicable in the Shared Values table
   - status and severity or intentional absence markers
   - deterministic repeated-render equality

3. Run preservation checks for existing reconciliation and output behavior:

   ```bash
   npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts packages/tests/hardening-cross-slice-value-reconciliation.test.ts
   npm test -- packages/tests/bsrs-configuration-output-output.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/valuation-listings-output-output.test.ts
   ```

4. Run static checks and rebuild committed web output if implementation changes
   the bundle:

   ```bash
   npm run lint
   npm run build
   ```

5. If the local app is running at `http://127.0.0.1:5175/`, refresh it and
   manually confirm the comparison tables are visible and readable without
   overlapping the existing output panels.

## Expected Result

The workbench remains display-only and deterministic. It shows separate
Shared Facts and Shared Values tables with compared sources, fields, values,
normalized values where applicable, status, severity where applicable, and
stable ordering, while preserving existing output slice behavior and avoiding
real natural-person data.

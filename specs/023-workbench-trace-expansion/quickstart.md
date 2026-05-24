# Quickstart: Reconciliation Workbench Trace Expansion

## Goal

Verify that the existing browser reconciliation workbench page provides
clickable trace-detail expansion for reconciliation rows, Shared Facts rows,
and Shared Values rows without changing deterministic slice behavior or
existing row content.

## Preconditions

- Use repository-local approved sample artifacts and the existing workbench
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
   - the existing output panels
   - the existing Shared Facts table
   - the existing Shared Values table
   - trace-detail expansion controls for reconciliation rows
   - trace-detail expansion controls for Shared Facts rows
   - trace-detail expansion controls for Shared Values rows
   - expanded details with compared sources, fields, values, mapping basis,
     rule version, and producing module
   - raw and normalized value context for Shared Values rows where applicable
   - intentional absence markers where details do not apply
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
   manually confirm that an analyst can expand trace details for one
   reconciliation row, one Shared Facts row, and one Shared Values row within
   10 seconds.

6. Verify long source names, field names, source paths, raw values, normalized
   values, and trace labels remain readable at desktop 1440x900 and mobile
   390x844 viewports.

## Expected Result

The workbench remains display-only and deterministic. It shows row-level
trace-detail expansion with compared sources, fields, raw values, normalized
values where applicable, status, severity where applicable, mapping basis,
source paths where available, rule version, producing module, and stable
ordering, while preserving existing output panels, Shared Facts behavior,
Shared Values behavior, slice behavior, and no-real-person-data boundaries.

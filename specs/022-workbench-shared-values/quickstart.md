# Quickstart: Reconciliation Workbench Shared Values

## Goal

Verify that the existing browser reconciliation workbench page shows a distinct
analyst-readable Shared Values table for the fixed approved sample without
changing deterministic slice behavior or existing Shared Facts behavior.

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
   - the existing output panels and Shared Facts table
   - a visible Shared Values table
   - compared sources and fields for every displayed Shared Values row
   - raw compared values for every displayed Shared Values row
   - normalized values or intentional absence markers for every displayed row
   - status and severity or intentional absence markers
   - traceability cues including rule version and producing module
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
   manually confirm that an analyst can identify compared sources, fields, raw
   values, normalized values, status, severity, and traceability cue for any
   Shared Values row within 10 seconds.

## Expected Result

The workbench remains display-only and deterministic. It shows a Shared Values
table with compared sources, fields, raw values, normalized values where
applicable, status, severity where applicable, traceability cues, and stable
ordering, while preserving existing output panels, Shared Facts behavior, slice
behavior, and no-real-person-data boundaries.

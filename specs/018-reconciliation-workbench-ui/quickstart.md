# Quickstart: Reconciliation Workbench UI

## Scope

This increment plans one visible browser workbench page that presents an
approved sample's existing BSRS configuration, V1/VE, valuation listings, and
cross-slice reconciliation evidence in one display-only view.

## Focused Checks

Run focused workbench tests with:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Run existing reconciliation hardening checks with:

```bash
npm test -- packages/tests/hardening-cross-slice-value-reconciliation.test.ts packages/tests/hardening-cross-slice-reconciliation.test.ts
```

Run existing output preservation checks with:

```bash
npm test -- packages/tests/bsrs-configuration-output-contract.test.ts packages/tests/bsrs-configuration-output-output.test.ts packages/tests/v1-ve-output-contract.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/valuation-listings-output-contract.test.ts packages/tests/valuation-listings-output-output.test.ts
```

Run final verification with:

```bash
npm test
npm run lint
npm run build
```

## Manual Browser Check

Start the existing web app and inspect the workbench:

```bash
npm --workspace @pbgc/web run dev
```

Expected outcome:

- one screen shows the approved sample identity
- BSRS configuration, V1/VE, and valuation listings panels are visible
- reconciliation rows show agreement-versus-drift status
- trace details expose compared slices, fields, values, source artifact, rule
  version, and producing module
- desktop and mobile widths do not overlap text or controls

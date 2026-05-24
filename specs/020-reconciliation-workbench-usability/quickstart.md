# Quickstart: Reconciliation Workbench Usability

## Scope

This increment improves the existing browser reconciliation workbench page so an
analyst can recognize the fixed approved sample, compare business-labeled output
panels, inspect shared-fact and shared-value tables, and expand trace details
without leaving the page.

## Focused Checks

Run focused workbench tests with:

```bash
npm test -- packages/tests/reconciliation-workbench-ui.test.ts
```

Run existing reconciliation checks with:

```bash
npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts packages/tests/hardening-cross-slice-value-reconciliation.test.ts
```

Run existing output preservation checks with:

```bash
npm test -- packages/tests/bsrs-configuration-output-output.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/valuation-listings-output-output.test.ts
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
npm --workspace @pbgc/web run dev -- --port 5175
```

Expected outcome:

- the first visible header identifies the fixed approved sample
- mocked case/population context is labeled as mocked or simulated
- the page states that no real natural-person data is used
- BSRS configuration, V1/VE, and valuation listings panels use business labels
- shared-facts and shared-values tables are both visible
- row statuses distinguish agreement, drift, warning, nullable, unsupported,
  and formatting-only where present
- clicking a trace-detail control reveals source artifact, rule version,
  producing module, mapping or fallback basis, compared fields, and compared
  values
- repeated reloads show the same header, panel order, row order, statuses, and
  trace content

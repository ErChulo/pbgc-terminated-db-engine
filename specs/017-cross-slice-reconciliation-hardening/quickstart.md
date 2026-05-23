# Quickstart: Cross-Slice Reconciliation Hardening

## Scope

This increment plans backend validation and regression protection across the
already implemented BSRS configuration, V1/VE, and valuation-listings output
slices. It uses approved sample artifacts, DD.csv, current committed output
evidence, and existing contracts already in the repository.

## Validation Sources

- `artifacts/mappings/DD.csv`
- `artifacts/reference/approved-samples/bsrs-config/**`
- `artifacts/reference/approved-samples/v1-workbooks/**`
- existing BSRS, V1/VE, and valuation-listing output fixtures and tests
- existing trace mapping documents under `docs/mappings/`

## Focused Checks

Run focused tests for this increment with:

```bash
npm test -- packages/tests/hardening-cross-slice-reconciliation.test.ts
```

Run existing output-slice regression checks with:

```bash
npm test -- packages/tests/bsrs-configuration-output-contract.test.ts packages/tests/bsrs-configuration-output-output.test.ts packages/tests/bsrs-configuration-output-persistence.test.ts packages/tests/bsrs-configuration-output-trace.test.ts packages/tests/v1-ve-output-contract.test.ts packages/tests/v1-ve-output-output.test.ts packages/tests/v1-ve-output-persistence.test.ts packages/tests/v1-ve-output-trace.test.ts packages/tests/valuation-listings-output-contract.test.ts packages/tests/valuation-listings-output-output.test.ts packages/tests/valuation-listings-output-persistence.test.ts packages/tests/valuation-listings-output-trace.test.ts
```

Run full project verification after implementation with:

```bash
npm test
npm run lint
npm run build
```

## Expected Outcomes

- Shared identifiers, form references, and DD-backed field semantics reconcile
  across current BSRS, V1/VE, and valuation-listing evidence.
- V1/VE fields use DD.csv canonical semantics before comparison when matching
  DD entries exist.
- Approved no-DD fallback comparisons record fallback basis explicitly.
- Drift, mapping failures, and unsupported comparisons emit deterministic
  structured findings.
- Existing output shapes, persistence behavior, trace behavior, and adapter
  boundaries remain unchanged.

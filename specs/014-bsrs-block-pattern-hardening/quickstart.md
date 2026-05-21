# Quickstart: BSRS Block Pattern Hardening

## Scope

This increment plans backend validation and regression protection for
`bsrs_configuration_output` block patterns only. It uses approved BSRS sample
configuration artifacts already committed in the repository.

## Validation Sources

- `artifacts/reference/approved-samples/bsrs-config/statements/**`
- `artifacts/reference/approved-samples/bsrs-config/recalculations/**`
- `artifacts/reference/approved-samples/bsrs-config/optional-forms/**`
- existing BSRS output fixtures and behavior-preservation tests

## Focused Checks

Run focused tests for this increment with:

```bash
npm test -- packages/tests/hardening-bsrs-block-patterns.test.ts packages/tests/hardening-bsrs-optional-form-patterns.test.ts packages/tests/hardening-bsrs-semantic-behavior.test.ts
```

Run the existing BSRS output regression set with:

```bash
npm test -- packages/tests/bsrs-configuration-output-contract.test.ts packages/tests/bsrs-configuration-output-output.test.ts packages/tests/bsrs-configuration-output-persistence.test.ts packages/tests/bsrs-configuration-output-trace.test.ts
```

Run full project verification after implementation with:

```bash
npm test
npm run lint
npm run build
```

## Expected Outcomes

- Approved statement block samples validate required section sequencing and
  line-cluster behavior.
- Approved recalculation block samples validate required recalculation section
  sequencing and support clusters.
- Approved optional-form block samples validate approved form-family labels,
  section context, and line clusters.
- Malformed sample-derived fixtures emit deterministic structured findings.
- Existing BSRS output behavior and adapter scope remain unchanged.

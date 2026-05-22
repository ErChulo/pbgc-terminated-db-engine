# Quickstart: BSRS Optional-Form Pattern Hardening

## Scope

This increment plans backend validation and regression protection for
`bsrs_configuration_output` optional-form patterns only. It uses approved BSRS
sample configuration artifacts already committed in the repository.

## Validation Sources

- `artifacts/reference/approved-samples/bsrs-config/optional-forms/**`
- existing BSRS output fixtures and behavior-preservation tests

## Focused Checks

Run focused tests for this increment with:

```bash
npm test -- packages/tests/hardening-bsrs-block-patterns.test.ts
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

- Approved optional-form block samples validate required section sequencing and
  line-cluster behavior.
- Approved optional-form rows classify semantic, support, detail,
  unavailable-benefit, subtotal, narrative, formatting, and spacer roles without
  false missing-section findings.
- Malformed sample-derived fixtures emit deterministic structured findings.
- Existing BSRS output behavior and adapter scope remain unchanged.

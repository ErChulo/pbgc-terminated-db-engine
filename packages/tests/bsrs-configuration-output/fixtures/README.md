# BSRS Configuration Output Fixtures

## Conditional Fixture Cases

| Test Case ID | Description | valuation_listings_fixture_index | statement_row_type |
|---|---|---|---|
| BSRS001 | Deferred vested BSRS configuration packet | 0 | participant |
| BSRS002 | In-pay survivor BSRS configuration packet | 1 | survivor |
| BSRS003 | Suppressed statement BSRS configuration packet | 0 | suppressed |
| BSRS004 | Beneficiary BSRS configuration packet | 0 | suppressed |
| BSRS005 | In-pay participant BSRS configuration packet | 1 | participant |
| BSRS006 | Basis-only participant (no conditional packets) BSRS configuration packet | 0 | participant |

## Conditional Branch Coverage

These fixture cases cover the following conditional branches defined in `branchRules.ts`:

- **In-pay branch**: BSRS005 (in_pay_packet present → ARD fields populated; BSRS002 with survivor context)
- **Non-in-pay branch**: BSRS001, BSRS003, BSRS004, BSRS006 (ARD fields explicit nulls)
- **Survivor branch**: BSRS002 (survivor-specific fields populated)
- **Non-survivor branch**: BSRS001, BSRS003, BSRS004, BSRS005, BSRS006 (sfname/slname/ssex/sdob/relation explicit nulls)
- **Suppressed branch**: BSRS003, BSRS004 (display fields explicit nulls)
- **Override-sensitive**: Programmatic packet modifications in test code

## Fixture Loader

Use `packet-loader.ts` to load fixtures:

```ts
import { loadAllBsrsFixtures, loadBsrsFixtureByName } from "./fixtures/packet-loader";

const all = loadAllBsrsFixtures();
const bsrs001 = loadBsrsFixtureByName("BSRS001");
```

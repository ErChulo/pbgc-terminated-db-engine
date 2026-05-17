# Research: engine-hardening-review

## Decision 1: Treat the existing reviewed fixture suites as the regression source of truth

- Decision: Use the committed fixture cases for date_resolution, service_resolution, compensation_resolution, form_resolution, benefit_kernel, v1_ve_output, valuation_listings_output, and bsrs_configuration_output as the basis for all hardening checks.
- Rationale: The user asked for review and hardening of the existing stack only, and the repository already contains deterministic reviewed inputs and expected outputs.
- Alternatives considered: Creating new synthetic hardening fixtures; rejected because they would expand scope without proving defects in the current stack.

## Decision 2: Guard DD.csv as the canonical naming layer only where matching DD entries exist

- Decision: Keep DD.csv as the canonical naming layer for fields that already have a matching Data Dictionary entry, and preserve approved contract names when no matching DD entry exists.
- Rationale: This matches the repository invariant already established for V1/VE and the later adapter slices, while avoiding silent name invention.
- Alternatives considered: Requiring DD.csv names for every field; rejected because several committed adapter fields intentionally fall back to the approved contract name.

## Decision 3: Add regression protection for adapter boundaries rather than adding new adapters

- Decision: Focus the hardening slice on tests that prove unrelated adapter tables remain untouched during each adapter run.
- Rationale: The user explicitly asked for adapter-exclusion invariants and no new business domains or adapters unless a defect fix requires it.
- Alternatives considered: Introducing a new unified output orchestration layer; rejected because the current repository already models the adapters independently.

## Decision 4: Preserve browser-only sql.js persistence as the execution boundary

- Decision: Keep the regression scope limited to browser-side sqlite persistence and committed outputs.
- Rationale: The constitution requires a browser-only static runtime and no server calls, so hardening must verify that boundary rather than alter it.
- Alternatives considered: Introducing external validation or back-end verification; rejected because it would violate the runtime constraints.

## Decision 5: Verify trace and output-shape stability as first-class hardening goals

- Decision: Include trace count, trace field-name, output row shape, and committed artifact stability checks for each existing slice.
- Rationale: The user specifically asked for traceability and output-shape stability, and those properties are already observable from committed tests and trace tables.
- Alternatives considered: Relying on output snapshots alone; rejected because snapshots do not fully prove traceability or adapter boundaries.

# Research: Service Resolution Slice

## Decision: Build service resolution as a new deterministic package beside date resolution

**Rationale**: The implemented first slice already established the browser-only
workspace, sql.js foundation, shared result types, deterministic ID helpers, and
date-resolution run pattern. Adding `packages/engine/service-resolution/`
preserves module boundaries while reusing the proven execution structure.

**Alternatives considered**:
- Add service logic inside the date-resolution package: rejected because the
  constitution requires modular actuarial contracts.
- Wait for compensation or benefit modules before service implementation:
  rejected because service resolution is independently executable from existing
  fixtures.

## Decision: Use existing `resolved_service_comp_output` for service outputs

**Rationale**: The committed v0.1.0 migration already creates
`resolved_service_comp_output` with service and compensation fields. This slice
will populate only `eligibility_service_resolved`, `vesting_service_resolved`,
`benefit_service_resolved`, and `accrual_service_resolved`, leaving compensation
fields null.

**Alternatives considered**:
- Create a new `resolved_service_output` table: rejected because it duplicates
  the committed schema and would require a versioned migration not requested by
  this slice.
- Store service output only in memory: rejected because deterministic outputs
  must be persisted and traceable.

## Decision: Treat `service_resolution_contract_v0.1.0.md` as authoritative module scope

**Rationale**: The contract defines required input groups, conditional packets,
rule hierarchy, outputs, warning/error behavior, and trace requirements. The
plan does not infer service rules from raw documents or unresolved assertions.

**Alternatives considered**:
- Interpret source documents directly: rejected by the deterministic boundary.
- Implement transfer, break, segment, and override behavior beyond fixture
  coverage immediately: rejected unless existing fixtures or planning tasks
  require those branches; this slice must remain bounded.

## Decision: Use existing CSV service fixtures as acceptance fixtures

**Rationale**: `packages/tests/service_resolution_test_cases_v0.1.0.csv`
provides three representative service paths: frozen full plan years, shorter
terminated service, and active-at-DOPT service. These map directly to the
feature success criteria.

**Alternatives considered**:
- Replace fixtures with new examples: rejected unless implementation finds a
  versioned contract defect.
- Use only hand-authored unit cases: rejected because the user explicitly
  requested existing repository test cases.

## Decision: Keep date-resolution as prior context, not a required input

**Rationale**: Service fixture rows contain the dates needed to compute service.
The service contract does not require date-resolution outputs as inputs. The
browser can display both slices, but deterministic service calculation should
remain a pure transform from reviewed service inputs.

**Alternatives considered**:
- Require date-resolution output before service resolution: rejected because it
  adds an unnecessary dependency not required by the service contract.
- Ignore the existing date slice entirely: rejected because the UI and run
  pattern should build on the established browser foundation.

## Decision: Persist trace through existing `module_trace`

**Rationale**: The first slice already uses `module_trace` for date outputs.
The same table supports service output lineage with `module_name =
service_resolution`, field names, rule branches, input fields, intermediate
values, output values, and warnings.

**Alternatives considered**:
- Store trace only in output JSON: rejected because existing schema already
  supports queryable module trace.
- Defer trace to downstream modules: rejected because service outputs must be
  independently reviewable.

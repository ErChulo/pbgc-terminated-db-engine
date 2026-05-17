# Feature Specification: Service Resolution Slice

**Feature Branch**: `002-service-resolution-slice`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Build the second executable slice of the PBGC terminated defined-benefit engine. Scope only the service_resolution module on top of the already-implemented browser-side SQLite foundation and date_resolution slice. Use the existing service_resolution contract, engine contract, schemas, migrations, seeds, templates, and service_resolution test cases already in the repository. Exclude compensation_resolution, form_resolution, benefit_kernel, and output adapters from implementation except as referenced contracts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Reviewed Service Resolution (Priority: P1)

As a PBGC casework reviewer, I need to run service resolution for reviewed
participant service inputs so I can verify eligibility, vesting, benefit, and
accrual service before compensation, form, benefit, or output modules are added.

**Why this priority**: Service resolution is the next deterministic dependency
after the browser-side foundation and date-resolution slice. Later actuarial
modules depend on resolved service quantities being reproducible and traceable.

**Independent Test**: Can be fully tested by loading the existing service
resolution test cases and confirming each reviewed packet produces the expected
eligibility, vesting, benefit, and accrual service totals.

**Acceptance Scenarios**:

1. **Given** a reviewed service-resolution input packet matching the active
   contract, **When** the reviewer runs service resolution, **Then** the system
   records one deterministic run and one resolved service result with all four
   service quantities matching the expected case outcome.
2. **Given** a participant with frozen service before plan termination, **When**
   the reviewer runs service resolution, **Then** the output reflects the frozen
   service amount and the trace identifies the freeze branch.
3. **Given** a participant active at DOPT with no DOTE, **When** the reviewer
   runs service resolution, **Then** service is resolved through DOPT using the
   reviewed rule and any non-blocking active-status warning is traceable.

---

### User Story 2 - Reject Invalid Service Inputs (Priority: P2)

As a PBGC casework reviewer, I need invalid service packets to be blocked so no
service output appears authoritative when required service fields are missing,
malformed, unresolved, or internally inconsistent.

**Why this priority**: Service drives downstream eligibility and benefit logic;
invalid service inputs must stop execution instead of creating silent fallback
values.

**Independent Test**: Can be tested by omitting required service groups, using
blank strings instead of explicit nulls, and creating invalid date ordering such
as DOH after DOTE.

**Acceptance Scenarios**:

1. **Given** a service packet missing a required group, **When** the reviewer
   attempts to run service resolution, **Then** no resolved service output is
   produced and the blocking error identifies the missing group.
2. **Given** reviewed employment dates with invalid ordering, **When** the
   reviewer attempts to run service resolution, **Then** the run is blocked and
   the error identifies the affected date fields.

---

### User Story 3 - Review Service Trace (Priority: P3)

As a PBGC casework reviewer, I need trace details for each service quantity so I
can see which reviewed inputs, rule version, branch, freeze decision, or override
decision produced it.

**Why this priority**: Traceability is required for defensible casework review
and provides the audit pattern for downstream service-dependent modules.

**Independent Test**: Can be tested by selecting a completed service-resolution
run and verifying each populated service quantity has trace metadata back to the
input packet, rule version, module version, applied rule branch, and reviewed
service fields.

**Acceptance Scenarios**:

1. **Given** a completed service-resolution run, **When** the reviewer inspects
   the trace, **Then** every resolved service quantity has input-packet, rule,
   module, branch, and reviewed-field references.
2. **Given** a completed run with a warning, **When** the reviewer inspects the
   result, **Then** the warning note is visible without changing valid service
   output values.

### Edge Cases

- Required service input group is missing from the packet.
- Required service field is present as a blank string instead of an explicit
  null or controlled value.
- DOH, DOP, DOTE, DOPT, or DOBF is malformed or has impossible calendar values.
- Date ordering is invalid, including DOH after DOTE or DOP after DOTE.
- DOTE is null for an active participant at DOPT.
- DOBF freezes accrual or benefit service before DOPT.
- Reviewed service override data exists but is not in scope for the fixture path.
- Break, transfer, segment, or frozen-accrual conditional state is triggered but
  the corresponding reviewed packet is missing.
- Compensation, form, benefit kernel, and output-adapter contracts exist but are
  outside execution scope for this slice.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST reuse the already-implemented local casework database
  foundation and deterministic run pattern from the first executable slice.
- **FR-002**: System MUST build or accept a `service_resolution` engine input
  packet using only reviewed structured rows and the active service-resolution
  contract.
- **FR-003**: System MUST reject service-resolution execution when required
  reviewed input groups or fields are missing, malformed, unresolved, internally
  inconsistent, or represented by blank strings instead of explicit nulls.
- **FR-004**: System MUST produce the resolved service outputs defined by the
  active service-resolution contract: `eligibility_service_resolved`,
  `vesting_service_resolved`, `benefit_service_resolved`, and
  `accrual_service_resolved`.
- **FR-005**: System MUST preserve traceability from every populated service
  output to the reviewed input packet, module name, module version, rule version,
  rule branch, source reviewed fields, and any freeze, break, transfer, segment,
  or override decision.
- **FR-006**: System MUST emit structured blocking errors for invalid packets
  and structured non-blocking warnings for valid packets with review-relevant
  service conditions.
- **FR-007**: System MUST make repeated runs against the same reviewed inputs and
  rule version produce the same resolved values and trace content, excluding
  generated run identifiers and timestamps.
- **FR-008**: System MUST verify the existing service-resolution test cases,
  including frozen full plan years, shorter terminated service, and active-at-
  DOPT service paths.
- **FR-009**: System MUST keep compensation resolution, form resolution, benefit
  kernel, V1/VE output, valuation listings, and BSRS configuration outside
  execution scope for this slice.
- **FR-010**: System MUST expose enough run status for a reviewer to distinguish
  successful completion, blocked execution, and completed execution with warnings.
- **FR-011**: System MUST avoid any server call, remote calculation, telemetry
  dependency, or raw-document read during the executable slice.
- **FR-012**: System MUST use existing repository contracts, schemas, migrations,
  seeds, templates, mappings, and service-resolution test cases unless planning
  identifies a contract gap that must be handled as a separate versioned change.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Active reviewed rows and packets conforming to
  `engine_packet_builder_contract_v0.1.0`, `engine_contract_v0.1.0`, and
  `service_resolution_contract_v0.1.0`, including case plan timeline, resolved
  plan logic, participant role population, service employment history,
  actuarial assumption factor set, limitation packet, and triggered service
  segment, service override, transfer, break-in-service, or frozen-accrual
  packets.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs,
  and unreviewed extraction output MUST NOT be read by deterministic engine
  modules.
- **Source Layer Reads**: Resolved facts, resolved plan provisions, reference
  rows, engine input packets, and prior deterministic run context from the
  browser-side foundation when needed for display or sequencing.
- **Source Layer Writes**: Engine input packet status when packet assembly is in
  scope, engine run status, resolved service output, structured warnings/errors,
  and trace output for service resolution.
- **Traceability Required**: Input packet identifier, case identifier, subject
  type, subject key, contract version, schema version, module name, module
  version, rule version, producing rule branch, reviewed field references, output
  field name, warning flag, warning note, freeze/break/transfer/override branch
  indicators, and calculation run identifier.

### Key Entities *(include if feature involves data)*

- **Case Header**: Reviewed case shell with case, plan, plan anniversary, DOPT,
  BPD, and DOBF values used by the service-resolution packet.
- **Resolved Fact**: Active reviewed person or case fact used by deterministic
  execution, with source assertion lineage and review status already resolved.
- **Resolved Plan Provision**: Active reviewed service logic used as controlled
  service-resolution rules.
- **Engine Input Packet**: Grouped reviewed input for one case, subject, and
  `service_resolution` packet type.
- **Engine Run**: Execution record identifying a deterministic run, status,
  artifact versions, and calculation run identifier.
- **Resolved Service Output**: Service-resolution result containing eligibility,
  vesting, benefit, and accrual service quantities.
- **Trace Output**: Reviewable lineage tying each service output to the input
  packet, reviewed fields, rule branch, service basis, freeze/break/transfer/
  override decisions, and module version.
- **Date Resolution Run Context**: Previously implemented deterministic date
  slice output available for sequencing and reviewer context, but not a required
  input for service quantity calculation unless planning introduces an explicit
  reviewed dependency.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can complete a service-resolution run for each existing
  service-resolution test case in under 2 minutes per case.
- **SC-002**: 100% of existing service-resolution test cases produce the
  expected eligibility, vesting, benefit, and accrual service outputs.
- **SC-003**: 100% of invalid service packets in validation tests are blocked
  before any resolved service output is recorded.
- **SC-004**: 100% of populated resolved service fields include trace metadata
  back to the run, rule version, module version, and reviewed input packet.
- **SC-005**: Re-running the same reviewed service input packet five times
  produces identical resolved values and trace decisions for all five runs,
  excluding generated run identifiers and timestamps.
- **SC-006**: No execution path in this slice requires a network connection or
  raw source-document access.

## Assumptions

- The browser-side SQLite foundation and `date_resolution` MVP remain available
  as the prior executable slice.
- Reviewed source data and service provisions are already accepted or accepted
  with note before the deterministic service slice runs.
- Raw OCR ingestion, source assertion extraction, and conflict resolution remain
  outside this feature.
- The second executable slice may use the existing service-resolution CSV test
  cases as validation fixtures.
- Existing v0.1.0 contracts, schemas, migrations, seeds, mappings, and templates
  are the baseline unless planning identifies a required versioned correction.
- Referenced downstream contracts may be loaded for dependency awareness, but
  compensation, form, benefit kernel, and output adapters are not executed in
  this slice.

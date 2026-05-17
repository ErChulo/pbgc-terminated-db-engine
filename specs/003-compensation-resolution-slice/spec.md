# Feature Specification: Compensation Resolution Slice

**Feature Branch**: `003-compensation-resolution-slice`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Build the third executable slice of the PBGC terminated defined-benefit engine. Scope only the compensation_resolution module on top of the already-implemented browser-side SQLite foundation, date_resolution slice, and service_resolution slice. Use the existing compensation_resolution contract, engine contract, schemas, migrations, seeds, templates, and compensation_resolution test cases already in the repository. Exclude form_resolution, benefit_kernel, and output adapters from implementation except as referenced contracts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Reviewed Compensation Resolution (Priority: P1)

As a PBGC casework reviewer, I need to run compensation resolution for reviewed
participant compensation inputs so I can verify compensation, average
compensation, and covered compensation before form, benefit, or output modules
are added.

**Why this priority**: Compensation resolution is the next deterministic
dependency after date and service resolution. Later accrued-benefit and
valuation work depends on reproducible compensation values with clear reviewed
input lineage.

**Independent Test**: Can be fully tested by loading the existing
compensation-resolution test cases and confirming each reviewed packet produces
the expected compensation, average compensation, and covered compensation
outputs.

**Acceptance Scenarios**:

1. **Given** a reviewed compensation-resolution input packet matching the active
   contract, **When** the reviewer runs compensation resolution, **Then** the
   system records one deterministic run and one resolved compensation result
   with all expected compensation fields matching the test case outcome.
2. **Given** a final-average-pay case with a reviewed final average
   compensation amount, **When** the reviewer runs compensation resolution,
   **Then** compensation and average compensation resolve to the reviewed amount
   and the trace identifies the final-average branch.
3. **Given** an integrated formula case with a reviewed covered compensation
   amount, **When** the reviewer runs compensation resolution, **Then** covered
   compensation resolves to the reviewed amount and the trace identifies the
   covered-compensation branch.
4. **Given** a frozen-benefit support case with no reviewed compensation amount
   expected for this slice, **When** the reviewer runs compensation resolution,
   **Then** the output leaves compensation quantities explicitly null and emits a
   traceable non-blocking warning for downstream review.

---

### User Story 2 - Reject Invalid Compensation Inputs (Priority: P2)

As a PBGC casework reviewer, I need invalid compensation packets to be blocked
so no compensation output appears authoritative when required reviewed fields
are missing, malformed, unresolved, or internally inconsistent.

**Why this priority**: Compensation values drive downstream benefit formulas and
integrated formula handling; invalid inputs must stop execution instead of
creating silent fallback values.

**Independent Test**: Can be tested by omitting required compensation groups,
using blank strings instead of explicit nulls, providing unsupported compensation
bases, or triggering conditional compensation history, covered compensation,
limit, frozen-benefit support, or PIA offset requirements without reviewed
support packets.

**Acceptance Scenarios**:

1. **Given** a compensation packet missing a required group, **When** the
   reviewer attempts to run compensation resolution, **Then** no resolved
   compensation output is produced and the blocking error identifies the missing
   group.
2. **Given** a compensation packet with a blank reviewed compensation value
   where an explicit null or numeric value is required, **When** the reviewer
   attempts to run compensation resolution, **Then** the run is blocked and the
   error identifies the affected field.
3. **Given** a compensation packet with a conditional trigger but no required
   conditional packet, **When** the reviewer attempts to run compensation
   resolution, **Then** the run is blocked and the error identifies the trigger
   and missing reviewed packet.

---

### User Story 3 - Review Compensation Trace (Priority: P3)

As a PBGC casework reviewer, I need trace details for each compensation output
so I can see which reviewed inputs, rule version, branch, override, covered
compensation, frozen-benefit support, or warning decision produced it.

**Why this priority**: Traceability is required for defensible casework review
and provides the audit pattern for service-and-compensation dependent benefit
calculations.

**Independent Test**: Can be tested by selecting a completed
compensation-resolution run and verifying each populated compensation output has
trace metadata back to the input packet, module version, rule version, reviewed
fields, and applied branch.

**Acceptance Scenarios**:

1. **Given** a completed compensation-resolution run, **When** the reviewer
   inspects the trace, **Then** every populated compensation field has
   input-packet, rule, module, branch, and reviewed-field references.
2. **Given** a completed frozen-benefit support run with null compensation
   outputs, **When** the reviewer inspects the result, **Then** the warning note
   is visible without substituting fallback compensation values.

### Edge Cases

- Required compensation input group is missing from the packet.
- Required compensation field is present as a blank string instead of an explicit
  null, boolean, controlled code, or numeric value.
- Compensation amount is malformed, negative when not permitted, or represented
  with unsupported units.
- `compensation_history_available_indicator` is true but reviewed compensation
  history required for recomputation is missing.
- Covered compensation is triggered by plan logic but no reviewed covered
  compensation value or covered compensation packet exists.
- Frozen accrued benefit support is triggered but reviewed frozen-benefit support
  fields are incomplete.
- PIA offset, statutory cap, or plan cap is triggered but the corresponding
  reviewed packet is missing.
- Prior date-resolution or service-resolution results exist for reviewer context
  but do not authorize compensation execution unless the compensation packet is
  itself active and reviewed.
- Form resolution, benefit kernel, V1/VE output, valuation listings, and BSRS
  configuration contracts exist but are outside execution scope for this slice.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST reuse the already-implemented local casework database
  foundation and deterministic run pattern from the prior executable slices.
- **FR-002**: System MUST build or accept a `compensation_resolution` engine
  input packet using only reviewed structured rows and the active
  compensation-resolution contract.
- **FR-003**: System MUST reject compensation-resolution execution when required
  reviewed input groups or fields are missing, malformed, unresolved,
  internally inconsistent, or represented by blank strings instead of explicit
  nulls.
- **FR-004**: System MUST produce the resolved compensation outputs defined by
  the active compensation-resolution contract: `compensation_resolved`,
  `average_compensation_resolved`, and `covered_compensation_resolved`.
- **FR-005**: System MUST preserve traceability from every populated
  compensation output to the reviewed input packet, module name, module version,
  rule version, rule branch, reviewed source fields, and any override, covered
  compensation, compensation-history, cap, frozen-benefit support, or PIA offset
  decision.
- **FR-006**: System MUST emit structured blocking errors for invalid packets and
  structured non-blocking warnings for valid packets with review-relevant
  compensation conditions.
- **FR-007**: System MUST make repeated runs against the same reviewed inputs and
  rule version produce the same resolved values and trace content, excluding
  generated run identifiers and timestamps.
- **FR-008**: System MUST verify the existing compensation-resolution test cases,
  including simple final-average pay, integrated covered compensation, and
  frozen-benefit support paths.
- **FR-009**: System MUST keep form resolution, benefit kernel, V1/VE output,
  valuation listings, and BSRS configuration outside execution scope for this
  slice.
- **FR-010**: System MUST expose enough run status for a reviewer to distinguish
  successful completion, blocked execution, and completed execution with
  warnings.
- **FR-011**: System MUST avoid any server call, remote calculation, telemetry
  dependency, or raw-document read during the executable slice.
- **FR-012**: System MUST use existing repository contracts, schemas,
  migrations, seeds, templates, mappings, and compensation-resolution test cases
  unless planning identifies a contract gap that must be handled as a separate
  versioned change.
- **FR-013**: System MUST preserve service-resolution outputs in the shared
  service-and-compensation output record pattern and update only compensation
  fields when the compensation slice writes its outputs.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Active reviewed rows and packets conforming to
  `engine_packet_builder_contract_v0.1.0`, `engine_contract_v0.1.0`, and
  `compensation_resolution_contract_v0.1.0`, including case plan timeline,
  resolved plan logic, participant role population, service employment history,
  compensation accrual inputs, benefit administration state, limitation packet,
  and triggered compensation history, average compensation override, covered
  compensation, compensation limit, frozen-benefit support, or PIA offset
  packets.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs,
  and unreviewed extraction output MUST NOT be read by deterministic engine
  modules.
- **Source Layer Reads**: Resolved facts, resolved plan provisions, reference
  rows, active compensation engine input packets, prior date-resolution and
  service-resolution run context for display or sequencing, and existing
  service output rows when needed to preserve the shared output record.
- **Source Layer Writes**: Engine input packet status when packet assembly is in
  scope, engine run status, resolved compensation output fields, structured
  warnings/errors, and trace output for compensation resolution.
- **Traceability Required**: Input packet identifier, case identifier, subject
  type, subject key, contract version, schema version, module name, module
  version, rule version, producing rule branch, reviewed field references,
  output field name, warning flag, warning note, override/history/covered
  compensation/cap/freeze/PIA branch indicators, and calculation run identifier.

### Key Entities *(include if feature involves data)*

- **Case Header**: Reviewed case shell with case, plan, plan anniversary, DOPT,
  BPD, and DOBF values used by the compensation-resolution packet.
- **Resolved Fact**: Active reviewed participant or case fact used by
  deterministic execution, with source assertion lineage and review status
  already resolved.
- **Resolved Plan Provision**: Active reviewed compensation logic used as
  controlled compensation-resolution rules.
- **Engine Input Packet**: Grouped reviewed input for one case, subject, and
  `compensation_resolution` packet type.
- **Engine Run**: Execution record identifying a deterministic run, status,
  artifact versions, and calculation run identifier.
- **Resolved Service and Compensation Output**: Shared deterministic output
  containing prior service fields and compensation-resolution fields for
  compensation, average compensation, and covered compensation.
- **Trace Output**: Reviewable lineage tying each compensation output to the
  input packet, reviewed fields, rule branch, compensation basis, covered
  compensation, cap, frozen-benefit support, override decisions, warnings, and
  module version.
- **Prior Date and Service Run Context**: Previously implemented deterministic
  outputs available for sequencing and reviewer context, without expanding this
  slice into form, benefit, or output-adapter execution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can complete a compensation-resolution run for each
  existing compensation-resolution test case in under 2 minutes per case.
- **SC-002**: 100% of existing compensation-resolution test cases produce the
  expected compensation, average compensation, and covered compensation outputs,
  including explicit null outputs where expected.
- **SC-003**: 100% of invalid compensation packets in validation tests are
  blocked before any authoritative compensation output is recorded.
- **SC-004**: 100% of populated resolved compensation fields include trace
  metadata back to the run, rule version, module version, and reviewed input
  packet.
- **SC-005**: Re-running the same reviewed compensation input packet five times
  produces identical resolved values and trace decisions for all five runs,
  excluding generated run identifiers and timestamps.
- **SC-006**: No execution path in this slice requires a network connection or
  raw source-document access.

## Assumptions

- The browser-side SQLite foundation, `date_resolution` slice, and
  `service_resolution` slice remain available as prior executable slices.
- Reviewed compensation source data and plan compensation provisions are already
  accepted or accepted with note before the deterministic compensation slice
  runs.
- Raw OCR ingestion, source assertion extraction, and conflict resolution remain
  outside this feature.
- The third executable slice may use the existing compensation-resolution CSV
  test cases as validation fixtures.
- Existing v0.1.0 contracts, schemas, migrations, seeds, mappings, and templates
  are the baseline unless planning identifies a required versioned correction.
- Referenced downstream contracts may be loaded for dependency awareness, but
  form resolution, benefit kernel, and output adapters are not executed in this
  slice.

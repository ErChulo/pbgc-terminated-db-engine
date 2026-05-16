# Feature Specification: Date Resolution Slice

**Feature Branch**: `001-date-resolution-slice`

**Created**: 2026-05-16

**Status**: Draft

**Input**: User description: "Build the first executable slice of the PBGC terminated defined-benefit engine. Scope only the browser-side SQLite foundation plus the date_resolution module. Use the existing contracts, schemas, migrations, seeds, templates, and test cases already in the repository. The implementation target is a Vite-based browser-only app using sql.js, no server calls, deterministic reviewed-input boundary, and reproducible date_resolution outputs with trace. Exclude service_resolution, compensation_resolution, form_resolution, benefit_kernel, and output adapters from this slice except as referenced contracts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Reviewed Date Resolution (Priority: P1)

As a PBGC casework reviewer, I need to load reviewed case inputs and run the
date-resolution slice so I can verify normal, early, required beginning, and
valuation commencement dates before any downstream actuarial modules are added.

**Why this priority**: This is the first executable engine slice and establishes
the deterministic boundary that later service, compensation, form, benefit, and
output modules depend on.

**Independent Test**: Can be fully tested by loading the existing reviewed case
shell, reference data, engine packet contract, and date-resolution test cases,
then confirming each produced date matches the expected reviewed result.

**Acceptance Scenarios**:

1. **Given** a reviewed date-resolution input packet matching the active contract,
   **When** the reviewer runs date resolution, **Then** the system records one
   deterministic run and one resolved-dates result with `nrd`, `erd`, `rbd`,
   `xra`, and `xrd` matching the expected case outcome.
2. **Given** the same reviewed input packet and rule version are run more than
   once, **When** the reviewer compares the outputs, **Then** the resolved dates
   and trace references are identical for every run except run timestamps and
   generated run identifiers.
3. **Given** a reviewed input packet for a beneficiary path, **When** date
   resolution runs, **Then** participant-only outputs that do not apply remain
   explicitly empty and the trace explains the beneficiary-specific branch.

---

### User Story 2 - Reject Incomplete Reviewed Inputs (Priority: P2)

As a PBGC casework reviewer, I need the slice to reject incomplete or unresolved
reviewed inputs so that no date output appears authoritative unless the required
contract fields were present and accepted.

**Why this priority**: A reproducible output is only defensible when missing or
ambiguous inputs stop execution instead of causing silent fallbacks.

**Independent Test**: Can be tested by omitting each required input group from a
date-resolution packet and confirming the run is blocked with structured errors
that identify the missing group or field.

**Acceptance Scenarios**:

1. **Given** a packet missing a required date-resolution input group, **When** the
   reviewer attempts to run the slice, **Then** no resolved-dates output is
   produced and the blocking error lists the missing group.
2. **Given** a packet containing blank strings instead of explicit nulls, **When**
   the reviewer attempts to run the slice, **Then** the packet is rejected and
   the error identifies the invalid field representation.

---

### User Story 3 - Review Trace for Produced Dates (Priority: P3)

As a PBGC casework reviewer, I need trace details for each date output so I can
see which reviewed inputs, rule version, and date-resolution branch produced it.

**Why this priority**: Traceability makes the first executable slice reviewable
and provides the audit pattern for later deterministic modules.

**Independent Test**: Can be tested by selecting a completed date-resolution run
and verifying every resolved output has trace metadata back to the input packet,
rule version, module version, and applied rule family.

**Acceptance Scenarios**:

1. **Given** a completed run, **When** the reviewer inspects the trace, **Then**
   every populated resolved date has an input-packet reference, module version,
   rule version, and rule branch note.
2. **Given** a completed run with a warning, **When** the reviewer inspects the
   result, **Then** the warning flag and warning note are visible without
   changing the deterministic output value.

### Edge Cases

- Required input group is missing from the date-resolution packet.
- Required field is present as a blank string rather than an ISO date, controlled
  code, number, boolean, or explicit null.
- Date input is malformed or impossible, such as an invalid calendar day.
- Conditional QPSA, death-benefit, or QDRO state is triggered but its reviewed
  packet is missing.
- Role type is beneficiary or alternate payee and participant-only date outputs
  do not apply.
- Date rules produce a first-of-month result that crosses a year boundary.
- The same case and subject are run repeatedly with the same accepted inputs.
- Referenced service, compensation, form, benefit, or output-adapter contracts
  exist but are outside execution scope for this slice.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST initialize a local casework database from the existing
  committed SQLite migrations and seeds required for the browser-side foundation.
- **FR-002**: System MUST build or accept a `date_resolution` engine input packet
  using only reviewed structured rows and the active date-resolution contract.
- **FR-003**: System MUST reject date-resolution execution when required reviewed
  input groups or fields are missing, malformed, unresolved, or represented by
  blank strings instead of explicit nulls.
- **FR-004**: System MUST produce the resolved date outputs defined by the active
  date-resolution contract: `nrd`, `erd`, `eurd`, `eprd`, `rbd`, `xra`, `xrd`,
  `sxra`, `term_lw_xra`, and `term_lw_anb`.
- **FR-005**: System MUST preserve traceability from every populated resolved
  date to the reviewed input packet, module name, module version, rule version,
  rule branch, and source reviewed fields used by that output.
- **FR-006**: System MUST emit structured blocking errors for invalid packets and
  structured non-blocking warnings for valid packets with review-relevant date
  conditions.
- **FR-007**: System MUST make repeated runs against the same reviewed inputs and
  rule version produce the same resolved values and trace content, excluding
  generated run identifiers and timestamps.
- **FR-008**: System MUST verify the existing date-resolution test cases,
  including deferred vested participant, in-pay participant, and non-spouse
  beneficiary paths.
- **FR-009**: System MUST keep service resolution, compensation resolution, form
  resolution, benefit kernel, V1/VE output, valuation listings, and BSRS
  configuration outside execution scope for this slice.
- **FR-010**: System MUST expose enough run status for a reviewer to distinguish
  successful completion, blocked execution, and completed execution with warnings.
- **FR-011**: System MUST avoid any server call, remote calculation, telemetry
  dependency, or raw-document read during the executable slice.
- **FR-012**: System MUST use existing repository contracts, schemas, migrations,
  seeds, templates, mappings, and date-resolution test cases unless planning
  identifies a contract gap that must be handled as a separate versioned change.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Active reviewed rows and packets conforming to
  `engine_packet_builder_contract_v0.1.0`, `engine_contract_v0.1.0`, and
  `date_resolution_contract_v0.1.0`, including case plan timeline, resolved plan
  logic, participant role population, service employment history, benefit
  administration state, actuarial assumption factor set, limitation packet, and
  triggered QPSA, death-benefit, or QDRO packets.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and
  unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Resolved facts, resolved plan provisions, reference
  rows, and engine input packets.
- **Source Layer Writes**: Engine input packet status when packet assembly is in
  scope, engine run status, resolved dates output, structured warnings/errors,
  and trace output for date resolution.
- **Traceability Required**: Input packet identifier, case identifier, subject
  type, subject key, contract version, schema version, module name, module
  version, rule version, producing rule branch, reviewed field references, output
  field name, warning flag, warning note, and calculation run identifier.

### Key Entities *(include if feature involves data)*

- **Case Header**: Reviewed case shell with case, plan, plan anniversary, DOPT,
  DOTR, and BPD values used by the date-resolution packet.
- **Resolved Fact**: Active reviewed person or case fact used by deterministic
  execution, with source assertion lineage and review status already resolved.
- **Resolved Plan Provision**: Active reviewed plan logic used as controlled
  date-resolution rules.
- **Engine Input Packet**: Grouped reviewed input for one case, subject, and
  `date_resolution` packet type.
- **Engine Run**: Execution record identifying a deterministic run, status,
  artifact versions, and calculation run identifier.
- **Resolved Dates Output**: Date-resolution result row containing the primary
  resolved date fields and warning fields.
- **Trace Output**: Reviewable lineage tying each resolved date to the input
  packet, reviewed fields, rule branch, and module version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can load the seeded casework foundation and complete a
  date-resolution run for each existing date-resolution test case in under 2
  minutes per case.
- **SC-002**: 100% of existing date-resolution test cases produce the expected
  populated date and age outputs.
- **SC-003**: 100% of invalid packets in validation tests are blocked before any
  resolved-dates output is recorded.
- **SC-004**: 100% of populated resolved date fields include trace metadata back
  to the run, rule version, module version, and reviewed input packet.
- **SC-005**: Re-running the same reviewed input packet five times produces
  identical resolved values and trace decisions for all five runs, excluding
  generated run identifiers and timestamps.
- **SC-006**: No execution path in this slice requires a network connection or
  raw source-document access.

## Assumptions

- Reviewed source data and plan provisions are already accepted or accepted with
  note before the deterministic slice runs.
- Raw OCR ingestion, source assertion extraction, and conflict resolution remain
  outside this feature.
- The first executable slice may use the existing placeholder case shell and
  existing date-resolution CSV test cases as validation fixtures.
- Existing v0.1.0 contracts, schemas, migrations, seeds, mappings, and templates
  are the baseline unless planning identifies a required versioned correction.
- Referenced downstream contracts may be loaded for dependency awareness, but
  downstream modules and output adapters are not executed in this slice.

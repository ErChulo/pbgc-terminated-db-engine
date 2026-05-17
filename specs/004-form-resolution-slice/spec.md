# Feature Specification: Form Resolution Slice

**Feature Branch**: `004-form-resolution-slice`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Build the fourth executable slice of the PBGC terminated defined-benefit engine. Scope only the form_resolution module on top of the already-implemented browser-side SQLite foundation, date_resolution slice, service_resolution slice, and compensation_resolution slice. Use the existing form_resolution contract, engine contract, schemas, migrations, seeds, templates, and form_resolution test cases already in the repository. Exclude benefit_kernel and output adapters from implementation except as referenced contracts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Reviewed Form Resolution (Priority: P1)

As a PBGC casework reviewer, I need to run form resolution for reviewed
participant, beneficiary, or alternate-payee form inputs so I can verify the
retirement type, normal form, in-pay form, death-benefit form, payment status,
lump-sum option, and programming indicators before benefit-kernel or output
modules are added.

**Why this priority**: Form resolution is the next deterministic dependency
after date, service, and compensation resolution. Later benefit calculations and
deliverables depend on resolved form state being reproducible and traceable.

**Independent Test**: Can be fully tested by loading the existing
form-resolution test cases and confirming each reviewed packet produces the
expected retirement type, normal single form, normal married form, death form,
and lump-sum option outputs.

**Acceptance Scenarios**:

1. **Given** a reviewed form-resolution input packet matching the active
   contract, **When** the reviewer runs form resolution, **Then** the system
   records one deterministic run and one resolved form result with expected
   form fields matching the test case outcome.
2. **Given** a single deferred vested participant, **When** the reviewer runs
   form resolution, **Then** the normal single form, normal married form,
   death-benefit form, retirement type, and lump-sum option match the reviewed
   plan rules.
3. **Given** a married participant already in pay, **When** the reviewer runs
   form resolution, **Then** the run resolves an in-pay retirement type and
   payment status without calculating monthly benefit amounts.
4. **Given** an alternate-payee QDRO separate-interest path, **When** the
   reviewer runs form resolution, **Then** the output resolves QDRO-aware form
   state without executing benefit-kernel or output-adapter logic.

---

### User Story 2 - Reject Invalid Form Inputs (Priority: P2)

As a PBGC casework reviewer, I need invalid form packets to be blocked so no
form output appears authoritative when required reviewed fields are missing,
malformed, unresolved, or internally inconsistent.

**Why this priority**: Form state controls downstream benefit and deliverable
behavior; invalid form inputs must stop execution instead of creating silent
fallback codes.

**Independent Test**: Can be tested by omitting required form groups, using blank
strings instead of explicit nulls, providing unsupported form rules, or
triggering conditional in-pay, QPSA, QDRO, death-benefit, or contribution
packets without reviewed support.

**Acceptance Scenarios**:

1. **Given** a form packet missing a required group, **When** the reviewer
   attempts to run form resolution, **Then** no resolved form output is produced
   and the blocking error identifies the missing group.
2. **Given** a form packet with conflicting pay status and current pay fields,
   **When** the reviewer attempts to run form resolution, **Then** the run is
   blocked and the error identifies the conflicting fields.
3. **Given** a QDRO, QPSA, in-pay, or death-benefit trigger without the required
   reviewed conditional packet, **When** the reviewer attempts to run form
   resolution, **Then** the run is blocked and the error identifies the trigger
   and missing packet.

---

### User Story 3 - Review Form Trace (Priority: P3)

As a PBGC casework reviewer, I need trace details for each form output so I can
see which reviewed inputs, rule version, branch, current-pay evidence, QDRO,
QPSA, death-benefit, lump-sum, or PBGC form-policy decision produced it.

**Why this priority**: Traceability is required for defensible casework review
and provides the audit pattern for benefit-kernel and output-adapter dependent
form state.

**Independent Test**: Can be tested by selecting a completed form-resolution run
and verifying each populated form output has trace metadata back to the input
packet, module version, rule version, reviewed fields, and applied branch.

**Acceptance Scenarios**:

1. **Given** a completed form-resolution run, **When** the reviewer inspects the
   trace, **Then** every populated form field has input-packet, rule, module,
   branch, and reviewed-field references.
2. **Given** a completed run with a warning, **When** the reviewer inspects the
   result, **Then** the warning note is visible without changing valid form
   output values.

### Edge Cases

- Required form input group is missing from the packet.
- Required form field is present as a blank string instead of an explicit null,
  boolean, controlled code, or numeric value.
- Normal single or normal married form rule is unsupported by the active
  contract version.
- Current pay status is `in_pay` but the reviewed in-pay packet is missing.
- Participant has date of death or beneficiary role but reviewed death-benefit
  packet is missing.
- `qpsa_indicator` is true but reviewed QPSA packet is missing.
- `qdro_indicator` is true but reviewed QDRO packet is missing.
- Lump-sum rule indicates an option but limitation inputs suppress or qualify
  the option.
- Prior date, service, and compensation results exist for reviewer context but
  do not authorize form execution unless the form packet is itself active and
  reviewed.
- Benefit kernel, V1/VE output, valuation listings, and BSRS configuration
  contracts exist but are outside execution scope for this slice.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST reuse the already-implemented local casework database
  foundation and deterministic run pattern from the prior executable slices.
- **FR-002**: System MUST build or accept a `form_resolution` engine input
  packet using only reviewed structured rows and the active form-resolution
  contract.
- **FR-003**: System MUST reject form-resolution execution when required
  reviewed input groups or fields are missing, malformed, unresolved,
  internally inconsistent, or represented by blank strings instead of explicit
  nulls.
- **FR-004**: System MUST produce the resolved form outputs defined by the
  active form-resolution contract: `rettyp`, `form_code_nsf`, `form_code_nmf`,
  `form_code_ptp`, `form_code_ptp_qpsa`, `form_code_death`,
  `annuity_status_pay`, `lsoption`, `bs_ind`, `br_ind`, and `ofa_indicator`.
- **FR-005**: System MUST preserve traceability from every populated form output
  to the reviewed input packet, module name, module version, rule version, rule
  branch, reviewed source fields, and any current-pay, QDRO, QPSA,
  death-benefit, lump-sum, contribution, or PBGC form-policy decision.
- **FR-006**: System MUST emit structured blocking errors for invalid packets
  and structured non-blocking warnings for valid packets with review-relevant
  form conditions.
- **FR-007**: System MUST make repeated runs against the same reviewed inputs
  and rule version produce the same resolved values and trace content, excluding
  generated run identifiers and timestamps.
- **FR-008**: System MUST verify the existing form-resolution test cases,
  including single deferred vested participant, married participant in pay, and
  QDRO separate-interest paths.
- **FR-009**: System MUST keep benefit kernel, V1/VE output, valuation listings,
  and BSRS configuration outside execution scope for this slice.
- **FR-010**: System MUST expose enough run status for a reviewer to distinguish
  successful completion, blocked execution, and completed execution with
  warnings.
- **FR-011**: System MUST avoid any server call, remote calculation, telemetry
  dependency, or raw-document read during the executable slice.
- **FR-012**: System MUST use existing repository contracts, schemas,
  migrations, seeds, templates, mappings, and form-resolution test cases unless
  planning identifies a contract gap that must be handled as a separate
  versioned change.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Active reviewed rows and packets conforming to
  `engine_packet_builder_contract_v0.1.0`, `engine_contract_v0.1.0`, and
  `form_resolution_contract_v0.1.0`, including case plan timeline, resolved
  plan logic, participant role population, benefit administration state,
  actuarial assumption factor set, limitation packet, and triggered in-pay,
  QPSA, QDRO, death-benefit, mandatory employee contribution, or voluntary
  employee contribution packets.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs,
  and unreviewed extraction output MUST NOT be read by deterministic engine
  modules.
- **Source Layer Reads**: Resolved facts, resolved plan provisions, reference
  rows, active form engine input packets, prior date-resolution,
  service-resolution, and compensation-resolution run context for display or
  sequencing, and existing deterministic outputs when needed for reviewer
  context.
- **Source Layer Writes**: Engine input packet status when packet assembly is in
  scope, engine run status, resolved form output fields, structured
  warnings/errors, and trace output for form resolution.
- **Traceability Required**: Input packet identifier, case identifier, subject
  type, subject key, contract version, schema version, module name, module
  version, rule version, producing rule branch, reviewed field references,
  output field name, warning flag, warning note, current-pay/QDRO/QPSA/death/
  lump-sum/contribution/PBGC-policy branch indicators, and calculation run
  identifier.

### Key Entities *(include if feature involves data)*

- **Case Header**: Reviewed case shell with case, plan, DOPT, BPD, and DOBF
  values used by the form-resolution packet.
- **Resolved Fact**: Active reviewed participant, beneficiary, alternate-payee,
  payment, marital, death, QDRO, or QPSA fact used by deterministic execution,
  with source assertion lineage and review status already resolved.
- **Resolved Plan Provision**: Active reviewed form logic used as controlled
  normal-form, death-benefit, lump-sum, and conversion rules.
- **Engine Input Packet**: Grouped reviewed input for one case, subject, and
  `form_resolution` packet type.
- **Engine Run**: Execution record identifying a deterministic run, status,
  artifact versions, and calculation run identifier.
- **Resolved Forms Output**: Deterministic output containing retirement type,
  normal form codes, in-pay form codes, death form, annuity status, lump-sum
  option, and programming indicators.
- **Trace Output**: Reviewable lineage tying each form output to the input
  packet, reviewed fields, rule branch, current-pay evidence, QDRO, QPSA,
  death-benefit, lump-sum, contribution, PBGC-policy decisions, warnings, and
  module version.
- **Prior Date, Service, and Compensation Run Context**: Previously implemented
  deterministic outputs available for sequencing and reviewer context, without
  expanding this slice into benefit-kernel or output-adapter execution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can complete a form-resolution run for each existing
  form-resolution test case in under 2 minutes per case.
- **SC-002**: 100% of existing form-resolution test cases produce the expected
  retirement type, normal single form, normal married form, death form, and
  lump-sum option outputs, including explicit null outputs where expected.
- **SC-003**: 100% of invalid form packets in validation tests are blocked
  before any authoritative form output is recorded.
- **SC-004**: 100% of populated resolved form fields include trace metadata back
  to the run, rule version, module version, and reviewed input packet.
- **SC-005**: Re-running the same reviewed form input packet five times produces
  identical resolved values and trace decisions for all five runs, excluding
  generated run identifiers and timestamps.
- **SC-006**: No execution path in this slice requires a network connection,
  benefit-kernel execution, output-adapter execution, or raw source-document
  access.

## Assumptions

- The browser-side SQLite foundation, `date_resolution`, `service_resolution`,
  and `compensation_resolution` slices remain available as prior executable
  slices.
- Reviewed form source data and plan form provisions are already accepted or
  accepted with note before the deterministic form slice runs.
- Raw OCR ingestion, source assertion extraction, and conflict resolution remain
  outside this feature.
- The fourth executable slice may use the existing form-resolution CSV test
  cases as validation fixtures.
- Existing v0.1.0 contracts, schemas, migrations, seeds, mappings, and templates
  are the baseline unless planning identifies a required versioned correction.
- Referenced downstream contracts may be loaded for dependency awareness, but
  benefit kernel and output adapters are not executed in this slice.

# Feature Specification: Benefit Kernel Slice

**Feature Branch**: `006-build-fifth-executable`

**Created**: 2026-05-17

**Status**: Draft

**Input**: User description: "Build the fifth executable slice of the PBGC terminated defined-benefit engine. Scope only the benefit_kernel module on top of the already-implemented browser-side SQLite foundation, date_resolution slice, service_resolution slice, compensation_resolution slice, and form_resolution slice. Use the existing benefit_kernel contract, engine contract, schemas, migrations, seeds, templates, and benefit_kernel test cases already in the repository. Exclude V1/VE output, valuation listings output, BSRS configuration output, and other output adapters from implementation except as referenced contracts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Reviewed Benefit Kernel (Priority: P1)

As a PBGC casework reviewer, I need to run the benefit kernel for reviewed participant benefit inputs and previously resolved date, service, compensation, and form states so I can verify the principal monthly benefit and present-value quantities before any output adapters are added.

**Why this priority**: The benefit kernel is the core actuarial calculation dependency for later V1/VE, valuation listing, and BSRS deliverables. The first executable slice must prove that reviewed upstream states can produce deterministic benefit outputs without invoking downstream adapters.

**Independent Test**: Can be fully tested by loading the existing benefit-kernel test cases and confirming the reviewed packet produces expected termination monthly benefit, XRD monthly benefit, and present-value outputs for the supported fixture path.

**Acceptance Scenarios**:

1. **Given** a reviewed benefit-kernel input packet matching the active contract and containing required upstream date, service, compensation, and form outputs, **When** the reviewer runs the benefit kernel, **Then** the system records one deterministic run and one benefit-kernel output row with expected monthly benefit and present-value fields.
2. **Given** the simple deferred vested benefit-kernel fixture, **When** the reviewer runs the benefit kernel, **Then** the termination monthly benefit at normal retirement, XRD monthly benefit, and termination present value match the committed expected fixture values.
3. **Given** integrated formula or QPSA branch fixture rows whose expected benefit fields are intentionally blank, **When** the reviewer runs the benefit kernel, **Then** the system returns explicit null outputs with review warnings instead of silently calculating unsupported values.
4. **Given** a successful benefit-kernel run, **When** the reviewer checks repository outputs, **Then** no V1/VE, valuation listing, BSRS, or other output-adapter result is generated.

---

### User Story 2 - Reject Invalid Benefit Inputs (Priority: P2)

As a PBGC casework reviewer, I need invalid benefit-kernel packets to be blocked so no monthly benefit or present-value output appears authoritative when required reviewed inputs, upstream outputs, or limitation fields are missing or inconsistent.

**Why this priority**: The benefit kernel creates downstream actuarial values. Invalid upstream states must stop execution rather than create fallback benefit amounts.

**Independent Test**: Can be tested by omitting required contract groups, using blank strings where explicit nulls are required, removing upstream date/service/compensation/form outputs, or triggering conditional limitation, QDRO, QPSA, in-pay, death, disability, contribution, asset-recovery, or cash-balance packets without reviewed support.

**Acceptance Scenarios**:

1. **Given** a benefit-kernel packet missing a required group or upstream deterministic output, **When** the reviewer attempts to run the kernel, **Then** no benefit-kernel output is produced and the blocking error identifies the missing group or output family.
2. **Given** a benefit-kernel packet with blank strings, malformed numeric values, or internally inconsistent reviewed states, **When** the reviewer attempts execution, **Then** the run is blocked with structured errors that identify the affected fields.
3. **Given** a conditional branch trigger without its reviewed conditional packet, **When** the reviewer attempts execution, **Then** the run is blocked and no monthly benefit, present value, or adapter output is written.

---

### User Story 3 - Review Benefit Trace (Priority: P3)

As a PBGC casework reviewer, I need trace details for each populated benefit-kernel output so I can see the reviewed formula, upstream module values, limitation branch, present-value factor, warning, and rule version that produced it.

**Why this priority**: Benefit outputs require defensible actuarial review and provide the audit trail for later output adapters without letting adapters recalculate benefits.

**Independent Test**: Can be tested by selecting a completed benefit-kernel run and verifying each populated monthly benefit or present-value output has trace metadata back to the reviewed input packet, upstream deterministic outputs, module version, rule version, and applied branch.

**Acceptance Scenarios**:

1. **Given** a completed benefit-kernel run, **When** the reviewer inspects the trace, **Then** every populated benefit field has input-packet, upstream-output, rule, module, branch, and reviewed-field references.
2. **Given** a completed run with warnings for unsupported fixture branches, **When** the reviewer inspects the result, **Then** the warning note is visible and unsupported outputs remain explicit nulls.

### Edge Cases

- Required benefit-kernel input group is missing from the packet.
- Upstream date, service, compensation, or form output is missing, inactive, or does not match the packet subject.
- Required numeric benefit input is blank, malformed, negative where not allowed, or provided as text instead of an explicit numeric value or null.
- Accrued-benefit formula is integrated, offset, cash-balance, hybrid, frozen, disability, death-benefit, QDRO, QPSA, in-pay, contribution, section 436, aggregate-limit, asset-recovery, or other conditional branch not supported by the MVP fixture path.
- Phase-in, accrued-at-termination, vested-at-termination, annuity-starting-date, death-benefit, form-of-benefit, actuarial-equivalence, majority-owner, bankruptcy, aggregate-limit, or ongoing-employment limitation flags conflict with available reviewed support.
- Present-value factor inputs are missing or inconsistent with reviewed assumptions.
- Prior module outputs exist for reviewer context but do not authorize execution unless the benefit-kernel packet is itself active and reviewed.
- V1/VE output, valuation listings, BSRS configuration, and other output-adapter contracts exist but are outside execution scope for this slice.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST reuse the already-implemented local casework persistence foundation and deterministic run pattern from the prior executable slices.
- **FR-002**: System MUST build or accept a `benefit_kernel` engine input packet using only reviewed structured inputs and the active benefit-kernel contract.
- **FR-003**: System MUST require reviewed upstream date-resolution, service-resolution, compensation-resolution, and form-resolution output values needed by the active benefit-kernel contract.
- **FR-004**: System MUST reject benefit-kernel execution when required reviewed input groups, upstream outputs, controlled rule values, numeric values, limitation fields, or conditional packets are missing, malformed, unresolved, internally inconsistent, or represented by blank strings instead of explicit nulls.
- **FR-005**: System MUST produce the benefit-kernel output fields defined by the active contract and supported by the committed fixture cases, including `term_mb_nrd_nsf`, `xrd_mb_term`, and `pvmb_term` for the simple deferred vested fixture.
- **FR-006**: System MUST emit explicit null outputs and structured warnings for committed fixture rows that identify unsupported benefit families or branch paths rather than calculating silent fallback values.
- **FR-007**: System MUST persist successful benefit-kernel outputs as deterministic engine outputs and MUST NOT write V1/VE, valuation listing, BSRS, or other output-adapter outputs in this slice.
- **FR-008**: System MUST preserve traceability from every populated benefit-kernel output to the reviewed input packet, module name, module version, rule version, upstream deterministic outputs, reviewed source fields, calculation branch, limitations applied, and warning notes.
- **FR-009**: System MUST emit structured blocking errors for invalid packets and structured non-blocking warnings for valid packets with review-relevant unsupported or limited branch conditions.
- **FR-010**: System MUST make repeated runs against the same reviewed inputs and rule version produce the same resolved values and trace content, excluding generated run identifiers and timestamps.
- **FR-011**: System MUST verify the existing benefit-kernel test cases, including simple deferred vested, integrated formula, and QPSA branch rows.
- **FR-012**: System MUST expose enough run status for a reviewer to distinguish successful completion, blocked execution, and completed execution with warnings.
- **FR-013**: System MUST avoid any server call, remote calculation, telemetry dependency, or raw-document read during the executable slice.
- **FR-014**: System MUST use existing repository contracts, schemas, migrations, seeds, templates, mappings, and benefit-kernel test cases unless a separate versioned contract change is planned.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Active reviewed rows and packets conforming to `engine_packet_builder_contract_v0.1.0`, `engine_contract_v0.1.0`, and `benefit_kernel_contract_v0.1.0`, including case timeline, resolved plan logic, participant role population, service history, compensation inputs, benefit administration state, actuarial assumption factor set, limitation packet, upstream date/service/compensation/form outputs, and triggered conditional packets.
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and unreviewed extraction output MUST NOT be read by deterministic engine modules.
- **Source Layer Reads**: Resolved facts, resolved plan provisions, active benefit-kernel input packets, prior date-resolution outputs, prior service-and-compensation outputs, prior form-resolution outputs, reference rows, and deterministic run context.
- **Source Layer Writes**: Engine run status, benefit-kernel output fields, structured warnings/errors, and trace output for benefit-kernel execution.
- **Traceability Required**: Input packet identifier, case identifier, subject type, subject key, contract version, schema version, upstream calculation run identifiers, module name, module version, rule version, producing rule branch, reviewed field references, output field name, warning flag, warning note, limitation branch indicators, present-value factor references, and calculation run identifier.

### Key Entities *(include if feature involves data)*

- **Case Header**: Reviewed case shell with case, plan, DOPT, DOTR, BPD, and DOBF values used by the benefit-kernel packet.
- **Resolved Fact**: Active reviewed participant, beneficiary, alternate-payee, payment, service, compensation, form, death, QDRO, QPSA, disability, limitation, or assumption fact used by deterministic execution.
- **Resolved Plan Provision**: Active reviewed benefit formula, eligibility, service, compensation, form, adjustment, limitation, and actuarial equivalence provisions.
- **Engine Input Packet**: Grouped reviewed input for one case, subject, and `benefit_kernel` packet type.
- **Prior Date Resolution Output**: Deterministic date output family required by the benefit-kernel contract.
- **Prior Service and Compensation Output**: Deterministic service and compensation output family required by the benefit-kernel contract.
- **Prior Form Resolution Output**: Deterministic form status output family required by the benefit-kernel contract.
- **Engine Run**: Execution record identifying a deterministic benefit-kernel attempt, status, artifact versions, warnings, errors, and calculation run identifier.
- **Benefit Kernel Output**: Deterministic output containing monthly benefit, survivor, QPSA, lump-sum, Title Four, section 4022(c), nonguaranteed/PBGC-funds, present-value, and load fields supported by the active contract.
- **Trace Output**: Reviewable lineage tying each populated benefit-kernel output to the input packet, upstream deterministic outputs, reviewed fields, rule branch, limitation logic, present-value factors, warnings, and module version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can complete a benefit-kernel run for each existing benefit-kernel fixture in under 2 minutes per case.
- **SC-002**: The simple deferred vested fixture produces the expected monthly benefit and present-value fields exactly as shown in the committed test case.
- **SC-003**: Re-running the same reviewed benefit-kernel packet five times produces identical benefit values and trace decisions, excluding generated identifiers and timestamps.
- **SC-004**: Invalid benefit-kernel packets are blocked before any authoritative benefit output is produced in 100% of validation scenarios.
- **SC-005**: No V1/VE, valuation listing, BSRS, or other output-adapter output is generated by any run in this slice.
- **SC-006**: Every populated benefit-kernel output field has reviewable trace metadata linking it to the input packet, upstream deterministic outputs, rule version, and applied branch.

## Assumptions

- The fifth slice runs after the local browser casework foundation and the date, service, compensation, and form executable slices are present.
- The MVP calculation path is bounded by the existing benefit-kernel fixture rows and may emit warnings with explicit nulls for committed rows whose expected benefit outputs are blank.
- Existing v0.1.0 contracts, schemas, migrations, seeds, templates, and test cases remain authoritative for this specification.
- Output adapters for V1/VE, valuation listings, BSRS configuration, and other deliverables are referenced only as downstream consumers and are not executed or implemented in this slice.
- Static build artifacts remain committed whenever runtime behavior changes in later implementation steps.

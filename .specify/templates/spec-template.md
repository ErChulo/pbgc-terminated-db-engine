# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific PBGC casework capability]
- **FR-002**: System MUST accept only [reviewed structured input packet/source layer]
- **FR-003**: System MUST emit structured warnings/errors for [validation condition]
- **FR-004**: System MUST preserve traceability from [output] to reviewed inputs,
  rule version, and producing module
- **FR-005**: System MUST produce or update [V1/VE output, valuation listing, BSRS
  configuration, or other deterministic output]

*Example of marking unclear requirements:*

- **FR-006**: System MUST resolve [NEEDS CLARIFICATION: unresolved reviewed fact,
  plan provision, or rule version]
- **FR-007**: System MUST handle [NEEDS CLARIFICATION: output adapter or delivery
  artifact requirements]

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: [List reviewed structured inputs consumed by this feature]
- **Disallowed Inputs**: Raw OCR, raw source documents, emails, images, PDFs, and
  unreviewed extraction output MUST NOT be read by deterministic engine modules
- **Source Layer Reads**: [raw source documents/source assertions/resolved facts/
  resolved plan provisions/engine input packets/deterministic outputs/output adapters]
- **Source Layer Writes**: [source assertions/resolved facts/resolved plan provisions/
  engine input packets/deterministic outputs/output adapters]
- **Traceability Required**: [Input references, rule versions, module names, warnings,
  errors, and output fields that require trace links]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [Reviewed input, resolved fact/provision, engine packet, or output
  entity; key attributes without implementation]
- **[Entity 2]**: [Relationships to source assertions, rules, modules, or outputs]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about reviewed source data availability and casework reviewer role]
- [Assumption about scope boundaries, e.g., raw OCR ingestion remains outside the
  deterministic engine]
- [Assumption about browser/sql.js persistence, static build delivery, or offline use]
- [Dependency on existing contracts, schemas, migrations, seeds, mappings, or rule versions]

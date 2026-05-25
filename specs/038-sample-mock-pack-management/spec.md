# Feature Specification: Sample Mock Pack Management

**Feature Branch**: `038-sample-mock-pack-management`

**Created**: 2026-05-25

**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Approved Mock Pack (Priority: P1)

An analyst opens Sample / Mock Packs, reviews approved sample and mock pack metadata, confirms no real natural-person data is included, and selects a pack for the existing alpha path.

**Why this priority**: The first alpha needs explicit control over approved samples and mocked data packs.

**Independent Test**: Can be tested by rendering the page and verifying stable pack ordering, selected pack details, included stages, mocked-only notices, and deterministic selection.

**Acceptance Scenarios**:

1. **Given** the dashboard is visible, **When** the analyst opens Sample / Mock Packs, **Then** approved sample packs and mock data packs are listed.
2. **Given** a selected pack, **When** the page renders, **Then** its artifact basis, included stages, and mocked-only notice are visible.
3. **Given** repeated builds with the same selected pack, **When** state is rebuilt, **Then** ordering and selected details are identical.

## Requirements *(mandatory)*

- **FR-001**: System MUST expose Sample / Mock Packs from the dashboard as an available page.
- **FR-002**: System MUST list approved sample packs and mock data packs using committed local artifact bases only.
- **FR-003**: System MUST show selected pack identity, included alpha stages, readiness status, artifact basis, and no-real-person-data notice.
- **FR-004**: System MUST keep pack ordering and selection deterministic.
- **FR-005**: System MUST not introduce real natural-person data, network runtime, OCR, scraping, sql.js writes, or output adapter writes.

### Deterministic Boundary *(mandatory)*

- **Reviewed Inputs**: Existing approved sample artifacts and mocked pack metadata.
- **Disallowed Inputs**: Real natural-person data, OCR, in-app scraping, live network retrieval, and unapproved packs.
- **Source Layer Reads**: Committed approved sample metadata and mocked pack metadata.
- **Source Layer Writes**: Display-only selected pack state; no persistence writes and no output adapter writes.
- **Traceability Required**: Pack id, artifact basis, included stages, module name, and rule version.

### Key Entities

- **Sample Mock Pack**: Pack id, label, kind, artifact basis, included stages, readiness, ordering key, and mocked-only notice.

## Success Criteria *(mandatory)*

- **SC-001**: At desktop 1440x900 and mobile 390x844, an analyst can identify Sample / Mock Packs and selected pack readiness within 10 seconds.
- **SC-002**: Repeated builds produce identical pack ordering and selected pack details.
- **SC-003**: Existing focused UI tests continue to pass.

## Assumptions

- This MVP manages committed approved/mocked pack metadata only; creating or uploading new packs is later work.

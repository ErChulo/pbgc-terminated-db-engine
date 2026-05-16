<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- PRINCIPLE_1_NAME -> I. Browser-Only Static Runtime
- PRINCIPLE_2_NAME -> II. Reviewed Inputs and Deterministic Boundaries
- PRINCIPLE_3_NAME -> III. Traceable Layered Data Lineage
- PRINCIPLE_4_NAME -> IV. Modular Actuarial Contracts
- PRINCIPLE_5_NAME -> V. Versioned Static Deliverables
Added sections:
- Architectural Constraints
- Development Workflow and Compliance
Removed sections:
- Placeholder Section 2
- Placeholder Section 3
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/templates/checklist-template.md
- ✅ .specify/templates/commands/*.md (directory absent; no command templates to update)
Runtime guidance requiring updates:
- ✅ AGENTS.md (already aligned)
- ⚠ README.md pending richer project overview beyond constitution scope
Follow-up TODOs:
- None
-->
# PBGC Terminated DB Engine Constitution

## Core Principles

### I. Browser-Only Static Runtime
The application MUST run entirely in the browser as a Vite-built static application.
SQLite persistence MUST use sql.js in the browser. Runtime behavior MUST NOT depend on
server calls, hosted APIs, backend services, remote calculation services, telemetry
endpoints, or network-loaded business logic.

Rationale: PBGC casework outputs must be reproducible from the committed code,
reviewed inputs, and packaged static assets without hidden runtime dependencies.

### II. Reviewed Inputs and Deterministic Boundaries
The deterministic engine MUST accept only reviewed structured inputs. It MUST NOT read,
parse, infer from, or calculate directly against raw OCR, raw source documents, emails,
images, PDFs, or unreviewed extraction output. Any ambiguity MUST be resolved before the
engine input packet is accepted, or the engine MUST emit a structured blocking error.

Rationale: Human-reviewed facts and provisions define the calculation boundary. This
keeps actuarial logic auditable and prevents accidental reliance on unstable source
interpretation.

### III. Traceable Layered Data Lineage
Every persisted fact, resolved provision, engine input, computed output, warning, and
error MUST preserve traceability through the source layers: raw source documents, source
assertions, resolved facts, resolved plan provisions, engine input packets,
deterministic engine outputs, and output adapters. Computed values MUST record the rule
version, input references, and calculation module that produced them.

Rationale: Casework review requires a defensible path from each output value back to the
reviewed inputs and deterministic rule set that produced it.

### IV. Modular Actuarial Contracts
Actuarial logic MUST be implemented through explicit, versioned module contracts for
date resolution, service resolution, compensation resolution, form resolution, the
benefit kernel, V1/VE output, valuation listings, and BSRS configuration. Each module
MUST declare its inputs, outputs, validation errors, warnings, and traceability fields.
Modules MUST use deterministic transforms with no hidden side effects or silent
fallbacks.

Rationale: Modular contracts keep PBGC rules reviewable, testable, and replaceable
without changing unrelated casework behavior.

### V. Versioned Static Deliverables
The project baseline is v0.1.0. Application behavior, schemas, migrations, seeds,
contracts, templates, mappings, and output adapters MUST be versioned when their
meaning changes. Static build artifacts, including dist output and bundles, MUST remain
committed and MUST NOT be ignored. Delivered `.sql`, `.js`, `.ts`, and `.tex` artifacts
MUST be stored with an appended `.txt` extension for email-safe transport.

Rationale: The repository itself is the auditable release package. Versioned artifacts
and committed builds support deterministic review and repeatable delivery.

## Architectural Constraints

Features MUST preserve the repository's browser-only Vite and sql.js architecture. New
work MUST place contracts in `artifacts/contracts`, schemas in `artifacts/schemas`,
templates in `artifacts/templates`, migrations in `packages/db/migrations`, seeds in
`packages/db/seeds`, test cases in `packages/tests`, mappings in `docs/mappings`, and
architecture notes in `docs/architecture`.

Feature designs MUST explicitly identify which source layer they read and which source
layer they write. A feature that imports or stores source assertions MAY reference raw
source-document identifiers for lineage, but deterministic engine modules MUST consume
only resolved facts, resolved plan provisions, or engine input packets.

Output adapters MUST be separate from the benefit kernel. V1/VE output, valuation
listings, and BSRS configuration MUST map deterministic engine outputs into delivery
formats without recalculating benefits or changing resolved facts.

## Development Workflow and Compliance

Each feature specification MUST state the reviewed input contract, deterministic
boundary, traceability requirements, expected warnings and errors, and affected output
adapters. Each implementation plan MUST pass a Constitution Check before design work
and again after design artifacts are produced.

Tests MUST cover contract validation, deterministic calculations, traceability metadata,
structured warnings and errors, sql.js persistence behavior, and output adapter mappings
for any changed module. Tests MAY be scoped to the changed module when the public
contract is unchanged. Broader regression tests are REQUIRED when a shared contract,
schema, migration, seed, or output adapter changes.

Generated tasks MUST include any required updates to contracts, schemas, migrations,
seeds, mapping documentation, static build artifacts, and email-safe `.txt` delivery
copies. A task is incomplete until the affected committed artifacts and version markers
match the implemented behavior.

## Governance

This constitution supersedes conflicting local practices, templates, and generated
feature artifacts. Amendments require a documented change to this file, a Sync Impact
Report, and review of dependent Spec Kit templates and runtime guidance.

Versioning follows semantic versioning for governance: MAJOR for incompatible principle
removals or redefinitions, MINOR for added principles or materially expanded guidance,
and PATCH for clarifications that do not change compliance obligations. Project
artifact versions continue to follow their own release identifiers, beginning from the
v0.1.0 project baseline.

Compliance review is REQUIRED for every feature plan, task set, and implementation that
touches engine inputs, actuarial logic, output adapters, persistence, delivery
artifacts, or versioned contracts. Any violation MUST be listed in Complexity Tracking
with the reason, risk, and rejected simpler alternative.

**Version**: 1.0.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16

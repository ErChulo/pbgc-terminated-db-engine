# Research: Case Navigation Dashboard

## Decision: Reuse Existing Workbench Display State

**Rationale**: The current workbench already exposes approved sample identity, mocked case/population context, no-real-person-data notice, and navigation-relevant status. Reusing this state keeps the dashboard deterministic and prevents duplicate sample metadata.

**Alternatives considered**: Creating a new sample loader was rejected because it would duplicate approved-sample parsing and increase drift risk.

## Decision: Display-Only Stage Status

**Rationale**: The alpha needs visible stage navigation before prompt/schema/template/upload/review/export slices exist. Display-only status entries create a deterministic shell without implying unsupported stages have executed.

**Alternatives considered**: Implementing stage workflows now was rejected because the backlog defines those as separate features.

## Decision: No New Persistence

**Rationale**: The dashboard is a navigation surface and should preserve the existing browser-local workbench session behavior without adding sql.js tables or lower source-layer writes.

**Alternatives considered**: Persisting dashboard stage status was rejected because statuses are deterministic from committed stage definitions and current workbench display state.

## Decision: Focused UI Regression Tests

**Rationale**: This slice changes browser navigation and display state rather than deterministic engine calculations. Focused tests should prove dashboard content, stage ordering, workbench link presence, boundary safety, and existing workbench preservation.

**Alternatives considered**: New engine or persistence tests were rejected because no engine module, schema, migration, or sql.js persistence behavior changes.

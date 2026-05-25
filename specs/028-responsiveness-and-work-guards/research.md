# Research: Responsiveness and Work Guards

## Decision: Model work guards as display-only state

**Rationale**: The current alpha surface needs visible protection against blocking interactions without adding new persistence or business domains. A state model with idle, running, cancelled, complete, and unsupported covers the MVP paths.

**Alternatives considered**:

- Persisted work queue: rejected because there is no server runtime and no case workspace persistence in this feature.
- Background worker processing: rejected for this MVP because the workbench operations are still small and the next step is fail-fast/cancel UX, not heavy compute.

## Decision: Use deterministic work-unit evidence

**Rationale**: Guard messages need to explain why work is supported or unsupported without using real participant counts. Deterministic attempted/supported units make tests stable and keep the data explicitly mocked.

**Alternatives considered**:

- Measuring browser execution time only: rejected because timing can be flaky and does not explain unsupported work.
- Hidden thresholds: rejected because analysts need visible guard evidence.

## Decision: Fail fast before delayed work starts

**Rationale**: Unsupported oversized work must not enter a long local operation. Displaying a deterministic unsupported state preserves current content and avoids blocking the UI.

**Alternatives considered**:

- Try work and abort later: rejected because it can still block the UI.
- Silently ignore oversized work: rejected because no silent fallbacks are allowed.

## Decision: Preserve existing theme/progress/workbench state

**Rationale**: Guard transitions must not reset selected sample, theme, filters, output panels, rows, or traces. These are analyst context, not work inputs.

**Alternatives considered**:

- Reset to default on guard changes: rejected because it loses user context.

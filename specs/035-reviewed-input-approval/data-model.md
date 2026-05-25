# Data Model: Reviewed Input Approval

## NormalizedReviewRow

- `row_id`: Stable row identifier.
- `case_id`: Mocked case identifier.
- `reviewed_record_id`: Assertion, fact, provision, engine input, or reviewed input identifier.
- `source_layer`: Reviewed source layer label.
- `decision`: `pending`, `approved`, `rejected`, or `blocked`.
- `eligibility`: `eligible` or `blocked`.
- `warnings`: Structured display-only warnings.
- `errors`: Structured display-only errors.
- `trace_basis`: Producing module, rule version, import source, and source layer.

## ApprovedPacketPreview

- `approved_count`: Count of approved eligible rows.
- `blocked_count`: Count of blocked, pending, rejected, or invalid rows.
- `approved_fields`: Deterministic field inventory for approved rows.
- `basis`: Stable source evidence string.

## Validation Rules

- Each normalized row must include `case_id`.
- Each normalized row must include one reviewed record identifier.
- Pending, rejected, invalid, malformed, and blocked rows are not eligible for later deterministic work.
- Warnings and errors sort by code.

# Data Model: Unresolved Issues Queue

## IssueQueueItem

- `issue_id`: Stable identifier.
- `source_stage`: Producing page or slice.
- `severity`: `info`, `warning`, or `error`.
- `status`: `open` or `blocked`.
- `code`: Existing warning/error code.
- `message`: Analyst-readable message.
- `trace_basis`: Producing module, rule version, and source id.

## IssueQueueSummary

- `total_count`: Total issue count.
- `error_count`: Error issue count.
- `warning_count`: Warning issue count.
- `info_count`: Info issue count.

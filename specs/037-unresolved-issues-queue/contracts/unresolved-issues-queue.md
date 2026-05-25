# Contract: Unresolved Issues Queue

## `buildUnresolvedIssuesQueue()`

Returns deterministic display-only issue queue state.

### Output

- `items`: Stable ordered issue rows.
- `summary`: Counts by severity.
- `boundary_notice`: Browser-local issue queue boundary.

### Invariants

- No network work.
- No OCR.
- No in-app scraping.
- No sql.js writes.
- No output-adapter writes.
- No real natural-person sample data.

# Contract: Reviewed Input Approval

## `buildReviewedInputApproval(input)`

Builds deterministic display-only reviewed-input approval state.

### Input

- `reviewed_json_text`: Optional mocked reviewed JSON.
- `decisions`: Optional map of reviewed record identifiers to `approved` or `rejected`.

### Output

- `rows`: Stable normalized review rows.
- `approved_packet_preview`: Approved versus blocked count and field inventory.
- `boundary_notice`: Reviewed-input gate notice.
- `trace`: Module name, rule version, and source stage.

### Invariants

- No network work.
- No OCR.
- No in-app scraping.
- No sql.js writes.
- No output-adapter writes.
- No real natural-person sample data.
- Pending, rejected, malformed, and invalid records remain blocked.

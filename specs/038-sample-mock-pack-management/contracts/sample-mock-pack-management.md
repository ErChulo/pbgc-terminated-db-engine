# Contract: Sample Mock Pack Management

## `buildSampleMockPackManagement(input)`

Returns deterministic display-only pack-management state.

### Output

- `packs`: Stable ordered pack list.
- `selected_pack`: Selected pack detail.
- `boundary_notice`: Mocked-only pack boundary.

### Invariants

- No network work.
- No OCR.
- No in-app scraping.
- No sql.js writes.
- No output-adapter writes.
- No real natural-person sample data.

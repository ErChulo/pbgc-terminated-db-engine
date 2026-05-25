# Data Model: Sample Mock Pack Management

## SampleMockPack

- `pack_id`: Stable pack identifier.
- `label`: Analyst-visible pack name.
- `kind`: `approved_sample` or `mock_data`.
- `artifact_basis`: Committed local artifact basis.
- `included_stages`: Alpha stages covered by the pack.
- `readiness`: `ready` or `display_only`.
- `mocked_only_notice`: No-real-person-data notice.
- `ordering_key`: Stable ordering key.

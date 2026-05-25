# Data Model: Case Navigation Dashboard

## Case Dashboard Summary

- `workspace_id`: Stable mocked workspace identifier.
- `workspace_label`: Analyst-facing mocked workspace label.
- `sample_id`: Existing approved sample identifier.
- `sample_label`: Existing approved sample label.
- `artifact_basis`: Existing approved local artifact basis.
- `mock_case_label`: Mocked case context label.
- `mock_population_label`: Mocked population context label.
- `no_real_person_data_notice`: Required no-real-person-data notice.
- `primary_action_label`: Label for opening the reconciliation workbench.
- `primary_action_target`: Existing workbench navigation target.

## Case Stage Navigation Item

- `stage_key`: Stable internal key.
- `label`: Analyst-facing stage label.
- `status`: One of `available`, `current`, `planned`, or `unavailable`.
- `status_label`: Analyst-facing status text.
- `detail`: Deterministic status detail.
- `basis`: Existing evidence or planned-stage basis.
- `ordering_key`: Stable ordering key.
- `target`: Navigation target when available, otherwise `null`.

## Dashboard Display State

- `summary`: Case Dashboard Summary.
- `stages`: Stable ordered Case Stage Navigation Item list.
- `active_stage_key`: Current stage key.
- `generated_at`: Stable source evidence from the selected approved sample.

## Validation Rules

- Stage ordering must be stable by `ordering_key`.
- Only stages backed by existing implemented surfaces may have a navigation target in this MVP.
- Planned/unavailable stages must be display-only and must not trigger upload, OCR, scraping, template filling, sql.js writes, or output-adapter writes.
- All case/population/person-level labels must remain mocked or simulated.

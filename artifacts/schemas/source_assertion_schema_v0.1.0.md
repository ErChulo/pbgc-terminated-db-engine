# source_assertion_schema v0.1.0

## Purpose

Defines the atomic extraction record produced from raw case sources before resolution into reviewed facts or reviewed plan provisions.

One row represents **one assertion from one source**.

---

## Grain

**One assertion per row**

Formally:

`(case_id, document_id, subject_type, subject_key, field_name, assertion_sequence)`

---

## Required fields

| field_name | type | null | description |
|---|---|---:|---|
| assertion_id | TEXT | no | Stable unique identifier for the assertion record |
| case_id | TEXT | no | PBGC case identifier |
| document_id | TEXT | no | Internal document identifier within the project |
| plan_file_type | TEXT | no | ImageViewer / plan file type code |
| source_system | TEXT | no | Source repository name, usually `ImageViewer` |
| source_file_name | TEXT | yes | Original filename |
| source_file_hash | TEXT | yes | Content hash of source file |
| ocr_text_id | TEXT | yes | Identifier of OCR text artifact used for extraction |
| page_number | INTEGER | yes | 1-based page number |
| section_reference | TEXT | yes | Section, article, exhibit, or similar citation anchor |
| citation_text | TEXT | yes | Human-readable citation string |
| subject_type | TEXT | no | Domain object type for the assertion |
| subject_key | TEXT | no | Stable subject identifier within case |
| field_name | TEXT | no | Target schema field or provision code asserted by this row |
| raw_value | TEXT | no | Raw extracted text value from source |
| normalized_value | TEXT | yes | Normalized machine-usable value |
| normalized_value_type | TEXT | no | Type of normalized value |
| units | TEXT | yes | Units if applicable |
| effective_date | TEXT | yes | Effective date associated with asserted content |
| adoption_date | TEXT | yes | Adoption date associated with asserted content |
| phase_in_pct | REAL | yes | Phase-in percentage if applicable |
| confidence_score | REAL | yes | Extraction confidence from 0.0 to 1.0 |
| extraction_method | TEXT | no | How the assertion was produced |
| extracted_by | TEXT | no | Extractor id, tool id, or user id |
| extracted_at | TEXT | no | ISO-8601 timestamp of extraction |
| review_status | TEXT | no | Review lifecycle status |
| review_note | TEXT | yes | Reviewer note |
| reviewer_id | TEXT | yes | Reviewer identifier |
| reviewed_at | TEXT | yes | ISO-8601 timestamp of review |
| superseded_by_assertion_id | TEXT | yes | Later assertion replacing this assertion record if needed |
| schema_version | TEXT | no | Schema version, fixed as `0.1.0` |

---

## Allowed enums

### `subject_type`
- `case`
- `plan`
- `document`
- `plan_regime`
- `participant`
- `beneficiary`
- `alternate_payee`
- `relationship`
- `asset`
- `limitation_context`
- `assumption_set`
- `deliverable`

### `normalized_value_type`
- `text`
- `integer`
- `real`
- `boolean`
- `date`
- `percent`
- `currency`
- `code`
- `json`

### `extraction_method`
- `manual`
- `ocr_parse`
- `llm_extract`
- `regex_extract`
- `table_extract`
- `hybrid`

### `review_status`
- `pending`
- `accepted`
- `rejected`
- `needs_review`
- `superseded`

---

## Constraints

1. `assertion_id` must be unique.
2. `schema_version` must equal `0.1.0`.
3. `confidence_score`, if present, must satisfy `0.0 <= confidence_score <= 1.0`.
4. `page_number`, if present, must be greater than or equal to `1`.
5. `phase_in_pct`, if present, must satisfy `0 <= phase_in_pct <= 100`.
6. `reviewer_id` and `reviewed_at` should be null when `review_status = 'pending'`.
7. `normalized_value` may be null only when the assertion cannot yet be normalized.
8. `raw_value` must never be null.
9. `field_name` must be either:
   - a field in `pbgc_defined_benefit_input_schema`, or
   - a controlled provision code used by the Plan Summary / provision resolver.
10. `plan_file_type` should match the canonical plan document types registry.

---

## Recommended indexes

- `(case_id)`
- `(case_id, document_id)`
- `(case_id, subject_type, subject_key)`
- `(case_id, field_name)`
- `(case_id, review_status)`
- `(plan_file_type)`
- `(document_id, page_number)`

---

## Minimal example

| assertion_id | case_id | document_id | plan_file_type | subject_type | subject_key | field_name | raw_value | normalized_value | normalized_value_type | page_number | citation_text | extraction_method | review_status | schema_version |
|---|---|---|---|---|---|---|---|---|---|---:|---|---|---|---|
| A000001 | 23173400 | DOC-5B-1978 | 5B | plan | PLAN-1 | plan_anniversary | January 1 | 0101 | code | 3 | Plan §1.01, p.3 | llm_extract | pending | 0.1.0 |
| A000002 | 23173400 | DOC-3B-TA | 3B | case | CASE-23173400 | dopt | June 30, 2024 | 2024-06-30 | date | 1 | Trusteeship Agreement, p.1 | manual | accepted | 0.1.0 |

---

## Notes

- This schema is **pre-resolution**. It stores candidate assertions, not final truth.
- Conflicts between assertions are resolved later into:
  - `resolved_fact`
  - `resolved_plan_provision`
- Multiple assertions may exist for the same `(case_id, subject_key, field_name)`.

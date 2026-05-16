# resolved_fact_schema v0.1.0

## Purpose

Defines the reviewed, settled fact record produced after resolving one or more source assertions.

One row represents **one resolved fact for one subject in one case**.

---

## Grain

**One resolved fact per row**

Formally:

`(case_id, subject_type, subject_key, field_name)`

This schema is **post-resolution** and **pre-calculation**.

---

## Required fields

| field_name | type | null | description |
|---|---|---:|---|
| resolved_fact_id | TEXT | no | Stable unique identifier for the resolved fact record |
| case_id | TEXT | no | PBGC case identifier |
| subject_type | TEXT | no | Domain object type for the resolved fact |
| subject_key | TEXT | no | Stable subject identifier within case |
| field_name | TEXT | no | Target schema field resolved by this row |
| resolved_value | TEXT | no | Final resolved value in canonical serialized form |
| resolved_value_type | TEXT | no | Type of resolved value |
| units | TEXT | yes | Units if applicable |
| resolution_basis | TEXT | no | Basis used to settle the value |
| primary_source_assertion_id | TEXT | no | Main supporting source assertion chosen |
| source_assertion_ids | TEXT | yes | JSON array of all assertion ids considered |
| source_variance_flag | TEXT | no | Whether conflicting candidate assertions existed |
| variance_note | TEXT | yes | Explanation of any conflict or reconciliation |
| confidence_score | REAL | yes | Confidence in final resolved fact from 0.0 to 1.0 |
| resolved_by | TEXT | no | Resolver id, reviewer id, or user id |
| resolved_at | TEXT | no | ISO-8601 timestamp of resolution |
| effective_date | TEXT | yes | Effective date tied to the resolved fact if applicable |
| adoption_date | TEXT | yes | Adoption date tied to the resolved fact if applicable |
| phase_in_pct | REAL | yes | Phase-in percentage if applicable |
| status | TEXT | no | Lifecycle status of the resolved fact |
| superseded_by_resolved_fact_id | TEXT | yes | Later resolved fact replacing this row if needed |
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

### `resolved_value_type`
- `text`
- `integer`
- `real`
- `boolean`
- `date`
- `percent`
- `currency`
- `code`
- `json`

### `resolution_basis`
- `single_best_source`
- `best_available_source`
- `cross_source_reconciliation`
- `plan_summary_resolution`
- `manual_review`
- `policy_resolution`
- `derived_from_controlled_lookup`

### `source_variance_flag`
- `Y`
- `N`

### `status`
- `active`
- `superseded`
- `rejected`

---

## Constraints

1. `resolved_fact_id` must be unique.
2. `schema_version` must equal `0.1.0`.
3. There should be at most one `active` row for a given `(case_id, subject_type, subject_key, field_name)`.
4. `confidence_score`, if present, must satisfy `0.0 <= confidence_score <= 1.0`.
5. `phase_in_pct`, if present, must satisfy `0 <= phase_in_pct <= 100`.
6. `primary_source_assertion_id` must reference an existing row in `source_assertion`.
7. `source_variance_flag = 'N'` implies `variance_note` may be null.
8. `source_variance_flag = 'Y'` implies `variance_note` should not be null.
9. `resolved_value` must never be null.
10. `field_name` must be a field in `pbgc_defined_benefit_input_schema` or another controlled field registry accepted by the project.

---

## Recommended indexes

- `(case_id)`
- `(case_id, subject_type, subject_key)`
- `(case_id, field_name)`
- `(case_id, subject_type, subject_key, field_name, status)`
- `(primary_source_assertion_id)`
- `(status)`

---

## Minimal example

| resolved_fact_id | case_id | subject_type | subject_key | field_name | resolved_value | resolved_value_type | resolution_basis | primary_source_assertion_id | source_variance_flag | variance_note | status | schema_version |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RF000001 | 23173400 | case | CASE-23173400 | dopt | 2024-06-30 | date | single_best_source | A000002 | N |  | active | 0.1.0 |
| RF000002 | 23173400 | plan | PLAN-1 | plan_anniversary | 0101 | code | cross_source_reconciliation | A000001 | Y | SPD and restatement agreed after normalization to MMDD code. | active | 0.1.0 |

---

## Notes

- This schema stores **settled facts**, not raw evidence.
- Multiple source assertions may feed one resolved fact.
- This schema is intended to populate:
  - required inputs
  - conditional inputs
  - resolved case facts
- It does **not** store derived calculation outputs. Those belong downstream.

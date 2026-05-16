# resolved_plan_provision_schema v0.1.0

## Purpose

Defines the reviewed, settled plan-provision record produced after resolving one or more source assertions into a governing provision regime.

One row represents **one resolved plan provision for one case, one provision code, and one governing effective regime**.

---

## Grain

**One resolved plan provision per row**

Formally:

`(case_id, provision_code, effective_start_date, effective_end_date, governing_document_id)`

This schema is **post-resolution** and **pre-calculation**.

---

## Required fields

| field_name | type | null | description |
|---|---|---:|---|
| resolved_plan_provision_id | TEXT | no | Stable unique identifier for the resolved provision record |
| case_id | TEXT | no | PBGC case identifier |
| plan_id | TEXT | no | Plan identifier within case |
| provision_code | TEXT | no | Controlled provision code, typically aligned to a Plan Summary item or internal provision registry |
| provision_section | TEXT | yes | Higher-level Plan Summary section or grouping |
| governing_document_id | TEXT | no | Document chosen as the controlling source for this resolved provision row |
| governing_document_type | TEXT | no | ImageViewer / plan file type code for the controlling document |
| effective_start_date | TEXT | no | Start date for the resolved provision regime |
| effective_end_date | TEXT | yes | End date for the resolved provision regime; null if open-ended |
| adoption_date | TEXT | yes | Adoption date tied to the provision if applicable |
| phase_in_pct | REAL | yes | Phase-in percentage if applicable |
| resolved_value | TEXT | no | Canonical resolved provision value in serialized form |
| resolved_value_type | TEXT | no | Type of resolved provision value |
| resolved_text | TEXT | yes | Human-readable summary of the resolved provision |
| citation_text | TEXT | yes | Human-readable citation string for the controlling support |
| primary_source_assertion_id | TEXT | no | Main supporting source assertion chosen |
| source_assertion_ids | TEXT | yes | JSON array of all assertion ids considered |
| resolution_basis | TEXT | no | Basis used to settle the provision |
| source_variance_flag | TEXT | no | Whether conflicting candidate assertions existed |
| variance_note | TEXT | yes | Explanation of any conflict or reconciliation |
| interpretation_note | TEXT | yes | Clarifying note where the plan text is ambiguous or where interpretation was needed |
| requires_case_memo_note_flag | TEXT | no | Whether the issue should also be surfaced in the Actuarial Case Memo |
| confidence_score | REAL | yes | Confidence in final resolved provision from 0.0 to 1.0 |
| resolved_by | TEXT | no | Resolver id, reviewer id, or user id |
| resolved_at | TEXT | no | ISO-8601 timestamp of resolution |
| status | TEXT | no | Lifecycle status of the resolved provision |
| superseded_by_resolved_plan_provision_id | TEXT | yes | Later resolved provision replacing this row if needed |
| schema_version | TEXT | no | Schema version, fixed as `0.1.0` |

---

## Allowed enums

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
- `case_specific_interpretation`

### `source_variance_flag`
- `Y`
- `N`

### `requires_case_memo_note_flag`
- `Y`
- `N`

### `status`
- `active`
- `superseded`
- `rejected`

---

## Constraints

1. `resolved_plan_provision_id` must be unique.
2. `schema_version` must equal `0.1.0`.
3. There should be at most one `active` row for a given `(case_id, provision_code, effective_start_date, governing_document_id)`.
4. `effective_end_date`, if present, must be greater than or equal to `effective_start_date`.
5. `confidence_score`, if present, must satisfy `0.0 <= confidence_score <= 1.0`.
6. `phase_in_pct`, if present, must satisfy `0 <= phase_in_pct <= 100`.
7. `primary_source_assertion_id` must reference an existing row in `source_assertion`.
8. `source_variance_flag = 'N'` implies `variance_note` may be null.
9. `source_variance_flag = 'Y'` implies `variance_note` should not be null.
10. `resolved_value` must never be null.
11. `provision_code` must belong to a controlled provision registry accepted by the project, such as a Plan Summary item code or internal provision-code table.
12. `requires_case_memo_note_flag = 'Y'` should generally imply `interpretation_note` is not null.

---

## Recommended indexes

- `(case_id)`
- `(case_id, plan_id)`
- `(case_id, provision_code)`
- `(case_id, provision_code, effective_start_date, effective_end_date)`
- `(governing_document_id)`
- `(primary_source_assertion_id)`
- `(status)`

---

## Minimal example

| resolved_plan_provision_id | case_id | plan_id | provision_code | governing_document_id | governing_document_type | effective_start_date | effective_end_date | adoption_date | resolved_value | resolved_value_type | resolution_basis | primary_source_assertion_id | source_variance_flag | requires_case_memo_note_flag | status | schema_version |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RPP000001 | 23173400 | PLAN-1 | normal_retirement_eligibility_rule | DOC-5B-1978 | 5B | 1978-01-01 | 2010-12-31 | 1978-01-01 | age_65 | code | plan_summary_resolution | A010001 | N | N | active | 0.1.0 |
| RPP000002 | 23173400 | PLAN-1 | early_retirement_adjustment_rule | DOC-5A-2011 | 5A | 2011-01-01 | 2024-06-30 | 2011-01-01 | 4pct_per_year | code | cross_source_reconciliation | A010145 | Y | Y | active | 0.1.0 |

---

## Notes

- This schema stores **settled plan provisions**, not raw evidence.
- Multiple source assertions may feed one resolved provision row.
- This schema is intended to populate:
  - resolved plan logic in `pbgc_defined_benefit_input_schema`
  - Plan Summary outputs
  - plan-regime inputs for deterministic calculations
- It does **not** store participant-specific resolved facts or derived calculation outputs. Those belong in `resolved_fact` and downstream calculation layers.

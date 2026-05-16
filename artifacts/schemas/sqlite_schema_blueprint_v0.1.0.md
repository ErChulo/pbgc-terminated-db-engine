# sqlite_schema_blueprint v0.1.0

## Purpose

Blueprint for the browser-side SQLite database used by the PBGC terminated defined-benefit casework project.

Target runtime:
- SQLite in browser via `sql.js`
- no server
- deterministic engine reads only reviewed structured rows
- raw evidence, reviewed facts, resolved provisions, run outputs, and export rows are all queryable locally

---

## Design principles

1. Separate **raw evidence** from **reviewed facts**.
2. Separate **resolved plan provisions** from **resolved person facts**.
3. Separate **engine inputs** from **engine outputs**.
4. Keep every important row **versionable** and **traceable**.
5. Store **one fact per row** where conflict resolution matters.
6. Use **wide export tables only at the output edge**.
7. Prefer **controlled codes** over free text for deterministic logic.
8. Keep document blobs outside SQLite when large; store metadata, hashes, OCR ids, and paths in SQLite.

---

## Database modules

1. reference
2. intake
3. assertions
4. resolution
5. engine
6. outputs
7. audit
8. app control

---

## Core table inventory

## 1. reference tables

### `ref_plan_file_type`
Purpose: canonical ImageViewer document taxonomy.

Primary key:
- `plan_file_type`

Columns:
- `plan_file_type`
- `description`
- `actuarial_casework_flag`
- `case_processing_relevant`
- `parent_plan_file_type`
- `sort_order`
- `is_active`

Indexes:
- `(case_processing_relevant)`
- `(parent_plan_file_type)`

---

### `ref_schema_field`
Purpose: registry of fields in `pbgc_defined_benefit_input_schema`.

Primary key:
- `field_name`

Columns:
- `field_name`
- `schema_class`
- `schema_group`
- `field_type`
- `is_required`
- `is_conditional`
- `is_derived`
- `notes`

Indexes:
- `(schema_class, schema_group)`

---

### `ref_provision_code`
Purpose: controlled plan-provision registry.

Primary key:
- `provision_code`

Columns:
- `provision_code`
- `provision_section`
- `description`
- `output_group`
- `is_active`

Indexes:
- `(provision_section)`

---

### `ref_rule_code`
Purpose: normalized rule-code registry for deterministic modules.

Primary key:
- `rule_code`

Columns:
- `rule_code`
- `rule_family`
- `rule_description`
- `json_definition`
- `is_active`

Indexes:
- `(rule_family)`

---

### `ref_assumption_set`
Purpose: controlled actuarial assumption bundles.

Primary key:
- `assumption_set_id`

Columns:
- `assumption_set_id`
- `label`
- `interest_basis_code`
- `mortality_basis_code`
- `pre_retirement_mortality_code`
- `post_retirement_mortality_code`
- `form_conversion_method`
- `lookback_period`
- `stability_period`
- `required_beginning_date_method`
- `lump_sum_basis_code`
- `annuity_basis_code`
- `effective_start_date`
- `effective_end_date`

Indexes:
- `(effective_start_date, effective_end_date)`

---

## 2. intake tables

### `case_header`
Purpose: one row per case.

Primary key:
- `case_id`

Columns:
- `case_id`
- `plan_id`
- `plan_name`
- `plan_number`
- `plan_anniversary`
- `dopt`
- `dotr`
- `bpd`
- `nod`
- `noit`
- `dobf`
- `successor_plan_indicator`
- `created_at`
- `updated_at`

Indexes:
- `(plan_id)`
- `(dopt)`

---

### `document_inventory`
Purpose: one row per document in project intake.

Primary key:
- `document_id`

Foreign keys:
- `case_id -> case_header.case_id`
- `plan_file_type -> ref_plan_file_type.plan_file_type`

Columns:
- `document_id`
- `case_id`
- `plan_file_type`
- `source_system`
- `source_file_name`
- `normalized_file_name`
- `folder_path`
- `mime_type`
- `sha256`
- `file_size_bytes`
- `ocr_text_id`
- `document_date`
- `received_date`
- `imageviewer_doc_number`
- `case_processing_relevant`
- `review_priority`
- `notes`

Indexes:
- `(case_id, plan_file_type)`
- `(case_id, case_processing_relevant)`
- `(sha256)`

---

### `ocr_text_registry`
Purpose: OCR/search artifact registry.

Primary key:
- `ocr_text_id`

Foreign keys:
- `document_id -> document_inventory.document_id`

Columns:
- `ocr_text_id`
- `document_id`
- `text_path`
- `page_count`
- `ocr_engine`
- `ocr_engine_version`
- `language_code`
- `ocr_confidence`
- `created_at`

Indexes:
- `(document_id)`

---

### `document_page_anchor`
Purpose: page/section anchors for citation precision.

Primary key:
- `page_anchor_id`

Foreign keys:
- `document_id -> document_inventory.document_id`

Columns:
- `page_anchor_id`
- `document_id`
- `page_number`
- `section_reference`
- `anchor_text`
- `anchor_hash`

Indexes:
- `(document_id, page_number)`
- `(document_id, section_reference)`

---

## 3. assertion tables

### `source_assertion`
Purpose: atomic extracted assertion layer.

Primary key:
- `assertion_id`

Foreign keys:
- `case_id -> case_header.case_id`
- `document_id -> document_inventory.document_id`
- `plan_file_type -> ref_plan_file_type.plan_file_type`

Columns:
- `assertion_id`
- `case_id`
- `document_id`
- `plan_file_type`
- `source_system`
- `source_file_name`
- `source_file_hash`
- `ocr_text_id`
- `page_number`
- `section_reference`
- `citation_text`
- `subject_type`
- `subject_key`
- `field_name`
- `raw_value`
- `normalized_value`
- `normalized_value_type`
- `units`
- `effective_date`
- `adoption_date`
- `phase_in_pct`
- `confidence_score`
- `extraction_method`
- `extracted_by`
- `extracted_at`
- `review_status`
- `review_note`
- `reviewer_id`
- `reviewed_at`
- `superseded_by_assertion_id`
- `schema_version`

Indexes:
- `(case_id, subject_type, subject_key)`
- `(case_id, field_name)`
- `(case_id, review_status)`
- `(document_id, page_number)`

---

### `assertion_tag`
Purpose: many-to-many tags for assertions.

Primary key:
- `(assertion_id, tag_code)`

Foreign keys:
- `assertion_id -> source_assertion.assertion_id`

Columns:
- `assertion_id`
- `tag_code`

Indexes:
- `(tag_code)`

---

## 4. resolution tables

### `resolved_fact`
Purpose: settled fact layer for case, participant, beneficiary, alternate payee, asset, etc.

Primary key:
- `resolved_fact_id`

Foreign keys:
- `case_id -> case_header.case_id`
- `primary_source_assertion_id -> source_assertion.assertion_id`

Columns:
- `resolved_fact_id`
- `case_id`
- `subject_type`
- `subject_key`
- `field_name`
- `resolved_value`
- `resolved_value_type`
- `units`
- `resolution_basis`
- `primary_source_assertion_id`
- `source_assertion_ids_json`
- `source_variance_flag`
- `variance_note`
- `confidence_score`
- `resolved_by`
- `resolved_at`
- `effective_date`
- `adoption_date`
- `phase_in_pct`
- `status`
- `superseded_by_resolved_fact_id`
- `schema_version`

Unique constraint:
- active uniqueness on `(case_id, subject_type, subject_key, field_name, status)`

Indexes:
- `(case_id, subject_type, subject_key)`
- `(case_id, field_name)`
- `(status)`

---

### `resolved_plan_provision`
Purpose: settled plan-provision regime layer.

Primary key:
- `resolved_plan_provision_id`

Foreign keys:
- `case_id -> case_header.case_id`
- `governing_document_id -> document_inventory.document_id`
- `primary_source_assertion_id -> source_assertion.assertion_id`
- `provision_code -> ref_provision_code.provision_code`

Columns:
- `resolved_plan_provision_id`
- `case_id`
- `plan_id`
- `provision_code`
- `provision_section`
- `governing_document_id`
- `governing_document_type`
- `effective_start_date`
- `effective_end_date`
- `adoption_date`
- `phase_in_pct`
- `resolved_value`
- `resolved_value_type`
- `resolved_text`
- `citation_text`
- `primary_source_assertion_id`
- `source_assertion_ids_json`
- `resolution_basis`
- `source_variance_flag`
- `variance_note`
- `interpretation_note`
- `requires_case_memo_note_flag`
- `confidence_score`
- `resolved_by`
- `resolved_at`
- `status`
- `superseded_by_resolved_plan_provision_id`
- `schema_version`

Indexes:
- `(case_id, provision_code)`
- `(case_id, effective_start_date, effective_end_date)`
- `(governing_document_id)`
- `(status)`

---

### `schema_field_source_map`
Purpose: field-to-source registry.

Primary key:
- `map_id`

Columns:
- `map_id`
- `schema_version`
- `schema_class`
- `schema_group`
- `field_name`
- `source_subject`
- `preferred_plan_file_types`
- `fallback_plan_file_types`
- `preferred_pbgc_sources`
- `extraction_rule`
- `resolution_basis`
- `required_review`
- `notes`

Indexes:
- `(schema_class, schema_group)`
- `(field_name)`

---

## 5. engine input tables

### `engine_input_packet`
Purpose: versioned packet boundary for deterministic runs.

Primary key:
- `input_packet_id`

Foreign keys:
- `case_id -> case_header.case_id`

Columns:
- `input_packet_id`
- `case_id`
- `subject_key`
- `subject_type`
- `packet_type`
- `schema_version`
- `packet_json`
- `built_from_resolved_at`
- `built_by`
- `built_at`
- `status`

Indexes:
- `(case_id, subject_type, subject_key)`
- `(packet_type)`
- `(status)`

---

### `engine_run`
Purpose: one deterministic run.

Primary key:
- `calculation_run_id`

Foreign keys:
- `case_id -> case_header.case_id`
- `input_packet_id -> engine_input_packet.input_packet_id`

Columns:
- `calculation_run_id`
- `case_id`
- `input_packet_id`
- `rule_version`
- `deliverable_version`
- `run_context`
- `started_at`
- `completed_at`
- `run_status`
- `warning_count`
- `error_count`

Indexes:
- `(case_id, run_status)`
- `(started_at)`

---

### `engine_warning`
Purpose: warnings per run.

Primary key:
- `warning_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `warning_id`
- `calculation_run_id`
- `module_name`
- `subject_key`
- `field_name`
- `warning_code`
- `warning_note`

Indexes:
- `(calculation_run_id, module_name)`

---

### `engine_error`
Purpose: errors per run.

Primary key:
- `error_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `error_id`
- `calculation_run_id`
- `module_name`
- `subject_key`
- `field_name`
- `error_code`
- `error_note`

Indexes:
- `(calculation_run_id, module_name)`

---

## 6. engine output tables

### `resolved_dates_output`
Purpose: output of `date_resolution`.

Primary key:
- `resolved_dates_output_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `resolved_dates_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`
- `nrd`
- `erd`
- `eurd`
- `eprd`
- `rbd`
- `xra`
- `xrd`
- `sxra`
- `term_lw_xra`
- `term_lw_anb`

Indexes:
- `(calculation_run_id, subject_key)`

---

### `resolved_service_comp_output`
Purpose: output of `service_resolution` and `compensation_resolution`.

Primary key:
- `resolved_service_comp_output_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `resolved_service_comp_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`
- `eligibility_service_resolved`
- `vesting_service_resolved`
- `benefit_service_resolved`
- `accrual_service_resolved`
- `compensation_resolved`
- `average_compensation_resolved`
- `covered_compensation_resolved`

Indexes:
- `(calculation_run_id, subject_key)`

---

### `resolved_forms_output`
Purpose: output of `form_resolution`.

Primary key:
- `resolved_forms_output_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `resolved_forms_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`
- `rettyp`
- `form_code_nsf`
- `form_code_nmf`
- `form_code_ptp`
- `form_code_ptp_qpsa`
- `form_code_death`
- `annuity_status_pay`
- `lsoption`
- `bs_ind`
- `br_ind`
- `ofa_indicator`

Indexes:
- `(calculation_run_id, subject_key)`

---

### `benefit_kernel_output`
Purpose: wide core calculation output.

Primary key:
- `benefit_kernel_output_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `benefit_kernel_output_id`
- `calculation_run_id`
- `case_id`
- `subject_key`

Plan-benefit columns:
- `term_mb_nrd_nsf`
- `term_surv_mb_nrd`
- `term_surv_mb_eurd`
- `term_surv_mb_erd`
- `rbd_surv_mb_term`
- `term_surv_mb_ard`
- `xrd_mb_term`
- `xrd_surv_mb_term`
- `xrd_mb_qpsa_term`
- `ls_term`
- `ls_qpsa`

Title Four columns:
- `xrd_mb_title_iv`
- `nrd_mb_title_iv_nsf`
- `eurd_mb_title_iv_nsf`
- `erd_mb_title_iv_nsf`
- `rbd_mb_title_iv`
- `ard_mb_title_iv`
- `pvmb_title_iv_no_q_no_l`
- `pvmb_title_iv_qpsa`
- `pvmb_title_iv_no_load`
- `title_iv_load`
- `pvmb_title_iv`

Section 4022(c) columns:
- `xrd_mb_4022c`
- `pvmb_4022c_no_q_no_l`
- `pvmb_4022c_qpsa`
- `pvmb_4022c_no_load`
- `load_4022c`
- `pvmb_4022c`

Nonguaranteed / PBGC-funds columns:
- `pvmb_bas_ungb_no_q_no_l`
- `pvmb_bas_ungb_qpsa`
- `bnnfa_pvmb_no_load`
- `bnnfa_load`
- `bnnfa_pvmb`
- `pvpbl_ann_rates_no_q_no_l`
- `pvpbl_ann_rates_qpsa`
- `pvpbl_ann_rates_no_load`
- `pbl_load`
- `pvpbl_ann_rates`

Present-value columns:
- `pvf_lev_ann`
- `pvf_lev_ls`
- `pvf_qpsa_ls`
- `pvmb_term_no_q_no_l`
- `pvmb_term_qpsa`
- `pvmb_term_no_load`
- `term_load`
- `pvmb_term`

Indexes:
- `(calculation_run_id, subject_key)`

---

### `module_trace`
Purpose: field-level trace across deterministic modules.

Primary key:
- `module_trace_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `module_trace_id`
- `calculation_run_id`
- `module_name`
- `subject_key`
- `field_name`
- `rule_applied`
- `input_fields_used_json`
- `intermediate_values_json`
- `output_value`
- `warning_note`

Indexes:
- `(calculation_run_id, module_name)`
- `(subject_key, field_name)`

---

## 7. output adapter tables

### `v1_ve_output_row`
Purpose: wide V1 or VE adapter row.

Primary key:
- `v1_ve_output_row_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `v1_ve_output_row_id`
- `calculation_run_id`
- `case_id`
- `plan_id`
- `subject_key`
- `row_json`
- `listing_sort_key`
- `adapter_version`

Indexes:
- `(calculation_run_id, subject_key)`

---

### `valuation_listing_output_row`
Purpose: wide valuation-listing adapter row.

Primary key:
- `valuation_listing_output_row_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `valuation_listing_output_row_id`
- `calculation_run_id`
- `case_id`
- `plan_id`
- `subject_key`
- `listing_row_type`
- `listing_sort_key`
- `row_json`
- `adapter_version`

Indexes:
- `(calculation_run_id, listing_row_type, listing_sort_key)`

---

### `bsrs_configuration_output_row`
Purpose: wide statement-programming adapter row.

Primary key:
- `bsrs_configuration_output_row_id`

Foreign keys:
- `calculation_run_id -> engine_run.calculation_run_id`

Columns:
- `bsrs_configuration_output_row_id`
- `calculation_run_id`
- `case_id`
- `plan_id`
- `subject_key`
- `statement_row_type`
- `statement_sort_key`
- `row_json`
- `adapter_version`

Indexes:
- `(calculation_run_id, statement_row_type, statement_sort_key)`

---

## 8. audit and app-control tables

### `review_decision_log`
Purpose: structured review and resolution decisions.

Primary key:
- `decision_log_id`

Columns:
- `decision_log_id`
- `case_id`
- `subject_key`
- `decision_type`
- `decision_summary`
- `decision_basis`
- `linked_assertion_ids_json`
- `linked_resolved_fact_ids_json`
- `linked_resolved_plan_provision_ids_json`
- `reviewer_id`
- `decision_at`

Indexes:
- `(case_id, subject_key)`
- `(decision_type)`

---

### `artifact_version`
Purpose: local registry of schema/contracts/output versions.

Primary key:
- `artifact_name`

Columns:
- `artifact_name`
- `artifact_version`
- `artifact_hash`
- `activated_at`

---

### `migration_log`
Purpose: local schema migration tracking.

Primary key:
- `migration_id`

Columns:
- `migration_id`
- `migration_name`
- `applied_at`
- `schema_version_before`
- `schema_version_after`

---

## Suggested SQLite views

### `vw_active_resolved_fact`
Filter active resolved facts only.

```sql
CREATE VIEW vw_active_resolved_fact AS
SELECT *
FROM resolved_fact
WHERE status = 'active';
```

### `vw_active_resolved_plan_provision`
Filter active plan provisions only.

```sql
CREATE VIEW vw_active_resolved_plan_provision AS
SELECT *
FROM resolved_plan_provision
WHERE status = 'active';
```

### `vw_case_documents_relevant`
Relevant case documents only.

```sql
CREATE VIEW vw_case_documents_relevant AS
SELECT *
FROM document_inventory
WHERE case_processing_relevant = 1;
```

### `vw_latest_engine_run`
Latest completed run per case.

```sql
CREATE VIEW vw_latest_engine_run AS
SELECT e.*
FROM engine_run e
JOIN (
  SELECT case_id, MAX(completed_at) AS max_completed_at
  FROM engine_run
  WHERE run_status = 'completed'
  GROUP BY case_id
) x
  ON e.case_id = x.case_id
 AND e.completed_at = x.max_completed_at;
```

---

## Suggested row keys

### Subject-key convention
Use stable keys such as:
- `CASE-23173400`
- `PLAN-1`
- `P-1001`
- `B-1001-S`
- `AP-1001-1`
- `ASSET-1`

### Run-key convention
Use stable keys such as:
- `RUN-000001`
- `RUN-000002`

---

## Suggested implementation notes for sql.js

1. Keep wide output rows as `row_json` in adapter tables first.
2. Add extracted projection views later if needed.
3. Use `TEXT` for dates in ISO form.
4. Use `REAL` for actuarial numeric values.
5. Use JSON text columns where one-to-many detail is small and local.
6. Keep large OCR text outside SQLite; store a path or id only.
7. Export the whole `.sqlite` file after meaningful review checkpoints.

---

## Suggested first migration order

1. `ref_plan_file_type`
2. `ref_schema_field`
3. `ref_provision_code`
4. `ref_rule_code`
5. `ref_assumption_set`
6. `case_header`
7. `document_inventory`
8. `ocr_text_registry`
9. `document_page_anchor`
10. `source_assertion`
11. `resolved_fact`
12. `resolved_plan_provision`
13. `schema_field_source_map`
14. `engine_input_packet`
15. `engine_run`
16. `engine_warning`
17. `engine_error`
18. `resolved_dates_output`
19. `resolved_service_comp_output`
20. `resolved_forms_output`
21. `benefit_kernel_output`
22. `module_trace`
23. `v1_ve_output_row`
24. `valuation_listing_output_row`
25. `bsrs_configuration_output_row`
26. `review_decision_log`
27. `artifact_version`
28. `migration_log`

---

## Suggested first implementation slice

Build only:

- `case_header`
- `document_inventory`
- `source_assertion`
- `resolved_fact`
- `resolved_plan_provision`
- `engine_run`
- `resolved_dates_output`
- `module_trace`

That is enough to start real work.

---

## Minimal DDL starter example

```sql
CREATE TABLE case_header (
  case_id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  plan_name TEXT,
  plan_number TEXT,
  plan_anniversary TEXT,
  dopt TEXT,
  dotr TEXT,
  bpd TEXT,
  nod TEXT,
  noit TEXT,
  dobf TEXT,
  successor_plan_indicator TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE document_inventory (
  document_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  plan_file_type TEXT NOT NULL,
  source_system TEXT NOT NULL,
  source_file_name TEXT,
  normalized_file_name TEXT,
  folder_path TEXT,
  mime_type TEXT,
  sha256 TEXT,
  file_size_bytes INTEGER,
  ocr_text_id TEXT,
  document_date TEXT,
  received_date TEXT,
  imageviewer_doc_number TEXT,
  case_processing_relevant INTEGER,
  review_priority INTEGER,
  notes TEXT,
  FOREIGN KEY (case_id) REFERENCES case_header(case_id)
);

CREATE TABLE source_assertion (
  assertion_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  plan_file_type TEXT NOT NULL,
  source_system TEXT NOT NULL,
  source_file_name TEXT,
  source_file_hash TEXT,
  ocr_text_id TEXT,
  page_number INTEGER,
  section_reference TEXT,
  citation_text TEXT,
  subject_type TEXT NOT NULL,
  subject_key TEXT NOT NULL,
  field_name TEXT NOT NULL,
  raw_value TEXT NOT NULL,
  normalized_value TEXT,
  normalized_value_type TEXT NOT NULL,
  units TEXT,
  effective_date TEXT,
  adoption_date TEXT,
  phase_in_pct REAL,
  confidence_score REAL,
  extraction_method TEXT NOT NULL,
  extracted_by TEXT NOT NULL,
  extracted_at TEXT NOT NULL,
  review_status TEXT NOT NULL,
  review_note TEXT,
  reviewer_id TEXT,
  reviewed_at TEXT,
  superseded_by_assertion_id TEXT,
  schema_version TEXT NOT NULL,
  FOREIGN KEY (case_id) REFERENCES case_header(case_id),
  FOREIGN KEY (document_id) REFERENCES document_inventory(document_id)
);
```

---

## Version note

This blueprint is a **database design blueprint**, not a final migration pack.
It is the correct starting point for the browser-side `sql.js` repository at `v0.1.0`.

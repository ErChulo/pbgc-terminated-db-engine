# engine_contract.md

**Version:** v0.1.0  
**Project:** PBGC Terminated Defined Benefit Plan Workbench  
**Status:** Draft baseline

---

## 1. Purpose

This document defines the contract between:

1. the **LLM-assisted acquisition layer**,
2. the **human review/resolution layer**, and
3. the **deterministic actuarial engine**.

The deterministic engine must not read raw plan documents, OCR text, or free-form legal prose directly. It may consume only structured, reviewed inputs.

---

## 2. Scope

This contract governs deterministic computation for:

- accrued benefit determination,
- reserve / liability values as of date of plan termination,
- future benefit adjustment logic,
- administration-support outputs,
- downstream programming inputs for valuation listings,
- downstream programming inputs for benefit statement and retirement statement configuration,
- support data for actuarial memorandum outputs.

This contract does **not** govern:

- OCR,
- document search,
- raw plan-document scraping,
- free-form legal interpretation,
- user-interface behavior except where needed to preserve deterministic input/output semantics.

---

## 3. Design principles

1. **Deterministic boundary**  
   The engine accepts only structured inputs.

2. **No raw-document dependency**  
   Raw documents, OCR text, and unreviewed LLM outputs are upstream only.

3. **No hidden business logic**  
   Business rules used by the engine must live in code, tables, or explicit configuration.

4. **No circular fields**  
   A derived field must never be used as its own source.

5. **Source facts separate from derived values**  
   Required and conditional inputs are distinct from derived outputs.

6. **Case-specific resolution before calculation**  
   Plan-specific interpretation must be resolved before engine execution.

7. **Versioned reproducibility**  
   Every engine run must be reproducible from explicit inputs, rule versions, and assumption versions.

---

## 4. Upstream-to-engine boundary

### 4.1 Upstream layers

The following layers are upstream of the deterministic engine:

- ImageViewer document inventory,
- OCR text,
- plan document classification,
- source assertion extraction,
- source citation anchoring,
- plan provision resolution,
- participant data resolution,
- limitation applicability resolution,
- reference-data attachment,
- human review and approval.

### 4.2 Engine entry condition

The deterministic engine may run only after all required inputs have status:

- `accepted`, or
- `accepted_with_note`

Conditional inputs must satisfy the same rule whenever their triggering conditions are true.

---

## 5. Canonical input contract

The engine consumes one packet conforming to:

- `pbgc_defined_benefit_input_schema v0.1.0`

with exactly three classes:

- `required`
- `conditional`
- `derived`

The engine may **read** only:

- `required`
- `conditional`

The engine may **write** only:

- `derived`

---

## 6. Input units of execution

### 6.1 Primary execution grain

The primary execution key is:

`(case_id, person_key, role_type, entitlement_key, as_of_date, rule_version)`

### 6.2 Allowed role types

- `participant`
- `beneficiary`
- `alternate_payee`

### 6.3 Allowed execution contexts

- `plan_summary_support`
- `valuation`
- `termination_valuation`
- `administration`
- `recalculation`
- `listing_generation`
- `bsrs_configuration`
- `memo_support`

---

## 7. Required input classes

The engine contract recognizes these required groups:

- `case_plan_timeline`
- `resolved_plan_logic`
- `participant_role_population`
- `service_employment_history`
- `compensation_accrual_inputs`
- `benefit_administration_state`
- `actuarial_assumption_factor_set`
- `limitation_packet`
- `provenance_packet`

The engine must reject execution if any required group is missing or malformed.

---

## 8. Conditional input classes

The engine contract recognizes these conditional groups:

- `section_436_packet`
- `aggregate_limit_packet`
- `qdro_packet`
- `qpsa_packet`
- `in_pay_packet`
- `death_benefit_packet`
- `mandatory_employee_contribution_packet`
- `voluntary_employee_contribution_packet`
- `disability_packet`
- `asset_recovery_packet`
- `cash_balance_packet`

The engine must validate trigger conditions before execution.

Examples:

- if `section_436_applicable_indicator = true`, then `section_436_packet` is mandatory.
- if `qdro_indicator = true`, then `qdro_packet` is mandatory.
- if `aggregate_limit_applicable_indicator = true`, then `aggregate_limit_packet` is mandatory.
- if `full_pbgc_payable_outputs_needed = true`, then `asset_recovery_packet` is mandatory.

---

## 9. Derived output classes

The engine may produce these output groups:

- `resolved_dates`
- `resolved_service_compensation`
- `resolved_forms_status`
- `plan_benefit_results`
- `title_iv_results`
- `section_4022c_results`
- `nonguaranteed_and_pbgc_funds_results`
- `present_value_results`
- `deliverable_outputs`
- `trace_outputs`

Derived outputs are authoritative only for the specific run identified by `calculation_run_id`.

---

## 10. Deterministic modules

The v0.1.0 engine is partitioned into these modules:

1. `date_resolution`
2. `service_resolution`
3. `compensation_resolution`
4. `retirement_eligibility_resolution`
5. `form_resolution`
6. `death_and_survivor_resolution`
7. `accrued_benefit_calculation`
8. `plan_benefit_calculation`
9. `limitation_application`
10. `title_iv_calculation`
11. `section_4022c_calculation`
12. `termination_benefit_calculation`
13. `present_value_calculation`
14. `listing_output_adapter`
15. `bsrs_output_adapter`
16. `memo_support_adapter`
17. `trace_generation`

Each module must:

- declare its input fields,
- declare its output fields,
- declare its dependencies on prior modules,
- avoid side effects on unrelated fields.

---

## 11. Module ordering

The minimum allowed order is:

1. resolve dates
2. resolve status and role
3. resolve service and compensation
4. resolve retirement and commencement conditions
5. resolve forms
6. resolve survivor state
7. calculate accrued / plan benefit
8. apply limitations
9. calculate Title IV and section 4022(c)
10. calculate termination benefit
11. calculate present values
12. generate output adapters
13. generate trace

No module may skip required upstream dependencies.

---

## 12. Input status contract

Every source-backed input field must carry one status from:

- `accepted`
- `accepted_with_note`
- `rejected`
- `missing`
- `conflicted`
- `not_applicable`

Engine rule:

- `accepted` and `accepted_with_note` are executable.
- `not_applicable` is executable only when conditionally valid.
- `missing`, `rejected`, and `conflicted` are non-executable unless a documented deterministic fallback rule exists.

---

## 13. Provenance contract

Every non-derived engine input must be traceable to at least one reviewed source.

Minimum provenance fields:

- `source_document_id`
- `source_document_type`
- `source_page_reference`
- `source_section_reference`
- `source_field_name`
- `source_confidence`
- `extraction_method`
- `reviewer_id`
- `review_status`
- `last_reviewed_at`

The engine must pass provenance identifiers into `trace_outputs`.

---

## 14. Error contract

The engine must fail closed.

### 14.1 Hard-stop errors

Examples:

- missing required input group,
- invalid date ordering,
- impossible role combination,
- unresolved conditional branch,
- invalid assumption-set reference,
- circular dependency,
- output requested without required upstream packet.

### 14.2 Soft warnings

Examples:

- accepted_with_note source,
- fallback source used,
- plan-practice note attached,
- nonstandard interpretation flag,
- incomplete historical compensation replaced by frozen accrued benefit.

Warnings must not silently alter output semantics.

---

## 15. Determinism contract

For identical:

- input packet,
- rule version,
- assumption-set version,
- factor-table version,
- engine version,

the engine must return identical derived outputs.

No module may call:

- remote APIs,
- network services,
- unversioned external data,
- nondeterministic random functions.

---

## 16. Versioning contract

The engine must stamp every run with:

- `engine_version`
- `schema_version`
- `rule_version`
- `assumption_set_id`
- `plan_factor_table_id`
- `calculation_run_id`
- `run_timestamp`

Versioning policy:

- breaking input/output contract change -> MAJOR
- backward-compatible field or module addition -> MINOR
- bug fix without contract change -> PATCH

---

## 17. Output contract by deliverable

### 17.1 V1 / VE

The engine must emit a structured V1-ready packet containing:

- normalized inputs,
- deterministic intermediates,
- final output fields,
- trace identifiers.

### 17.2 Valuation Listings

The engine must emit listing-ready output only as a terminal report artifact.
Valuation Listings are output-only and must not feed upstream logic.

### 17.3 Benefit Statement and Retirement Statement configuration

The engine must emit code-ready or configuration-ready values needed for statement programming.

### 17.4 Actuarial Case Memo support

The engine must emit support tables and trace data, not narrative final prose.
Narrative drafting remains outside the deterministic core.

---

## 18. What the engine must never do

The deterministic engine must never:

- parse OCR text,
- infer plan provisions from prose at runtime,
- resolve legal ambiguity silently,
- choose among conflicting sources without an explicit reviewed fact,
- embed undocumented actuarial assumptions,
- use a derived field as raw input,
- rely on user-interface state as business state.

---

## 19. First implementation target for v0.1.0

The first contract-compliant implementation should support at least these deterministic families:

1. retirement-date resolution,
2. service resolution,
3. form-resolution scaffolding,
4. normal single accrued benefit scaffolding,
5. present-value scaffolding,
6. trace generation.

The purpose of v0.1.0 is to establish a stable engine boundary, not full production rule completeness.

---

## 20. Minimal run example

### Input

- reviewed `required` packet,
- no active `conditional` packets,
- execution context = `termination_valuation`

### Engine responsibilities

1. derive NRD, ERD, EURD, EPRD, RBD, XRA, XRD,
2. resolve service and compensation,
3. calculate plan accrued normal single benefit,
4. compute present-value scaffolding,
5. emit trace.

### Output

- `resolved_dates`
- `resolved_service_compensation`
- `plan_benefit_results`
- `present_value_results`
- `trace_outputs`

---

## 21. Acceptance criteria for this contract

This contract is satisfied when:

1. a developer can validate an input packet before execution,
2. a developer can determine which conditional packets are mandatory,
3. the engine consumes only reviewed structured inputs,
4. the engine produces deterministic outputs,
5. the engine emits traceable run metadata,
6. downstream adapters can consume outputs without reading raw documents.

---

## 22. Immediate follow-on artifacts

After this contract, the next artifacts should be:

1. `source_assertion_schema.md`
2. `resolved_fact_schema.md`
3. `resolved_plan_provision_schema.md`
4. `v1_output_contract.md`
5. `bsrs_output_contract.md`
6. `valuation_listings_output_contract.md`

---

## 23. Summary

The deterministic engine is a strict computational boundary.

It takes:

- structured,
- reviewed,
- versioned,
- provenance-carrying inputs,

and returns:

- structured,
- reproducible,
- traceable outputs.

Everything probabilistic, documentary, or interpretive must happen before this boundary.

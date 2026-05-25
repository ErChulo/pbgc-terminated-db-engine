# Contract: Case Navigation Dashboard

## Scope

Display-only browser contract for the top-level case dashboard. It does not define a server API, engine contract, schema, migration, output adapter, or sql.js persistence contract.

## Build Function

`buildCaseNavigationDashboard(options?) -> CaseNavigationDashboardState`

### Inputs

- `sample_id` optional approved sample identifier.
- `active_stage_key` optional stage key.

### Output Shape

- `summary`: mocked workspace and approved-sample summary.
- `stages`: deterministic alpha stage list.
- `active_stage_key`: active stage key.
- `generated_at`: stable evidence string from approved local artifacts.

## Required Stage Keys

- `case_workspace`
- `reconciliation_workbench`
- `prompt_library`
- `schema_library`
- `pbgc_template_library`
- `upload_import`
- `reviewed_input_approval`
- `template_filling_export`
- `unresolved_issues`
- `sample_mock_packs`

## Boundary Rules

- The dashboard may link to the existing reconciliation workbench.
- Planned stages must be display-only in this slice.
- The contract must not expose upload execution, OCR, scraping, server calls, sql.js writes, output-adapter writes, or real natural-person data.
- Opening the dashboard must not mutate existing reconciliation workbench state.

# Data Model: Reconciliation Workbench Sample Selector

## ApprovedSampleOption

Selectable display option for an approved workbench sample.

Fields:

- `sample_id`: Stable approved sample identifier.
- `sample_label`: Analyst-readable sample label.
- `selector_label`: Label displayed in the sample selector.
- `artifact_basis`: Repository-backed approved artifact reference or approved mocked-context reference.
- `mock_case_label`: Simulated case context shown in the header.
- `mock_population_label`: Simulated population context shown in the header.
- `ordering_key`: Stable ordering key for selector options.
- `is_default`: Whether the option is the default selected sample.

Validation rules:

- Must refer only to approved repository artifacts or approved mocked sample context.
- Must not contain URL, upload, raw-source, email, OCR, or free-form external loading instructions.
- Must not include real participant, beneficiary, alternate payee, survivor, or other natural-person data.
- Options must sort deterministically by `ordering_key`.

## SelectedWorkbenchSample

The active sample used to populate the visible workbench.

Fields:

- `sample_id`: Selected approved sample identifier.
- `selected_label`: Header/selector label for the active sample.
- `artifact_basis`: Approved evidence basis for the selected sample.
- `generated_at`: Stable source evidence indicator derived from approved local evidence, not wall-clock time.

Validation rules:

- Must match one `ApprovedSampleOption`.
- Re-selecting the same sample must preserve identical display state.
- Unknown or unsupported sample ids must not cause raw-source or external loading.

State transitions:

- `default selected` -> `approved option selected`: Rebuild visible workbench state from the selected approved sample.
- `approved option selected` -> `same option selected`: Keep stable state without duplicating rows or controls.
- `approved option selected` -> `unsupported option requested`: Keep current selected sample and surface existing structured warning/error conventions if applicable.

## WorkbenchDisplayState

The visible workbench state derived from the selected sample.

Fields:

- `sample_context`: Selected sample header, mocked context labels, no-real-person-data notice, and stable generated evidence.
- `output_panels`: Existing BSRS configuration, V1/VE output, and valuation listings panels.
- `shared_fact_rows`: Existing Shared Facts comparison rows.
- `shared_value_rows`: Existing Shared Values comparison rows.
- `reconciliation_rows`: Existing cross-slice reconciliation rows.
- `findings`: Existing warning/drift findings.

Validation rules:

- Must preserve existing panel count and table structure for supported samples.
- Must preserve status and severity vocabularies already used by the workbench.
- Must preserve trace-detail rows and expansion identifiers for reconciliation, Shared Facts, and Shared Values rows.
- Must remain deterministic across repeated builds for the same selected sample.

## MockedCasePopulationContext

Simulated display context used to make a selected sample recognizable.

Fields:

- `mock_case_label`: Non-person case context label.
- `mock_population_label`: Non-person population context label.
- `no_real_person_data_notice`: Required notice that the workbench uses no real natural-person data.

Validation rules:

- Must be clearly mocked or simulated.
- Must not contain real or realistic natural-person names.
- Must not create new reviewed facts, resolved facts, engine inputs, output adapter rows, or persistence writes.

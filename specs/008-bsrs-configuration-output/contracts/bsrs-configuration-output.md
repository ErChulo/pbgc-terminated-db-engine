# BSRS Configuration Output Contract

## Purpose

Define the deterministic `bsrs_configuration_output` adapter that projects
reviewed inputs and upstream deterministic outputs into a stable BSRS
configuration output packet and persisted row.

## Module

- `bsrs_configuration_output`
- version `0.1.0`

## Required Inputs

The adapter consumes only reviewed structured inputs and upstream deterministic
outputs. Required input families include:

- case plan timeline
- participant role population
- service employment history
- benefit administration state
- limitation packet
- resolved dates
- resolved service compensation
- resolved forms status
- benefit kernel output
- V1/VE output row
- valuation listings output row
- trace inputs

Conditional inputs are required when contract-triggering branches apply:

- in-pay packet
- survivor packet
- form-driven packet
- configuration override packet, if supported by the contract

## Output Families

The adapter must populate the committed BSRS output families:

- identity and control fields
- person and role fields
- date fields
- form and payment-state fields
- statement amount support fields
- present-value and support fields
- statement-programming control fields
- trace fields

## Deterministic Rules

1. The adapter must be a pure projection over reviewed inputs and upstream
   deterministic outputs.
2. The adapter must preserve explicit nulls for inapplicable fields.
3. The adapter must emit structured warnings or errors for missing required or
   conditional inputs.
4. The adapter must preserve field-level traceability for populated values.
5. The adapter must not recalculate benefit values.
6. The adapter must not generate V1/VE or valuation-listings rows.
7. The adapter must resolve matching field names through `artifacts/mappings/DD.csv`
   first when a matching DD field exists.

## Persistence Contract

Successful runs persist:

- one `engine_run` row
- one `bsrs_configuration_output_row` row
- `module_trace` records tied to the calculation run

Failed validation runs persist:

- one failed `engine_run` row
- no authoritative `bsrs_configuration_output_row` row

## Downstream Boundaries

The following remain dependency references only and are not implemented in this
slice:

- `v1_ve_output`
- `valuation_listings_output`
- other output adapters

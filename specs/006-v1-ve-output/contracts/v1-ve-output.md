# V1/VE Output Contract

## Purpose

Define the deterministic `v1_ve_output` adapter that projects reviewed inputs
and upstream deterministic outputs into a stable V1/VE-ready output packet and
persisted row.

## Module

- `v1_ve_output`
- version `0.1.0`

## Required Inputs

The adapter consumes only reviewed structured inputs and upstream deterministic
outputs. Required input families include:

- case plan timeline
- participant role population
- benefit administration state
- limitation packet
- resolved dates
- resolved forms status
- benefit kernel output
- trace inputs

Conditional inputs are required when contract-triggering branches apply:

- in-pay packet
- QDRO packet
- QPSA packet
- technical output override packet, if supported by the contract

## Output Families

The adapter must populate the committed V1/VE output families:

- identity and control fields
- demographic and date fields
- form and payment-state fields
- Title IV fields
- Section 4022(c) fields
- termination-benefit fields
- nonguaranteed and PBGC-funds fields
- present-value factor fields
- trace fields

## Deterministic Rules

1. The adapter must be a pure projection over reviewed inputs and upstream
   deterministic outputs.
2. The adapter must preserve explicit nulls for inapplicable fields.
3. The adapter must emit structured warnings or errors for missing required or
   conditional inputs.
4. The adapter must preserve field-level traceability for populated values.
5. The adapter must not recalculate benefit values.
6. The adapter must not generate valuation-listings or BSRS configuration rows.

## Persistence Contract

Successful runs persist:

- one `engine_run` row
- one `v1_ve_output_row` row
- trace records tied to the calculation run

Failed validation runs persist:

- one failed `engine_run` row
- no authoritative `v1_ve_output_row` row

## Downstream Boundaries

The following remain dependency references only and are not implemented in this
slice:

- `valuation_listings_output`
- `bsrs_configuration_output`
- other output adapters

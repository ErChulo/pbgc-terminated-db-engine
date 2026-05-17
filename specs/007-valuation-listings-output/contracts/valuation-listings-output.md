# Valuation Listings Output Contract

## Purpose

Define the deterministic `valuation_listings_output` adapter that projects
reviewed inputs and upstream deterministic outputs into a stable
valuation-listing-ready output packet and persisted row.

## Module

- `valuation_listings_output`
- version `0.1.0`

## Required Inputs

The adapter consumes only reviewed structured inputs and upstream deterministic
outputs. Required input families include:

- case plan timeline
- participant role population
- benefit administration state
- limitation packet
- resolved dates
- resolved service compensation
- resolved forms status
- benefit kernel output
- V1/VE output row
- trace inputs

Conditional inputs are required when contract-triggering branches apply:

- in-pay packet
- QDRO packet
- QPSA packet
- asset recovery packet
- listing projection override packet, if supported by the contract

## Output Families

The adapter must populate the committed valuation-listing output families:

- identity and control fields
- demographic and date fields
- service and compensation fields
- form and payment-state fields
- plan-benefit fields
- Title IV fields
- Section 4022(c) fields
- nonguaranteed and PBGC-funds fields
- present-value factor fields
- official PBGC deliverable template fields
- trace fields

## Deterministic Rules

1. The adapter must be a pure projection over reviewed inputs and upstream
   deterministic outputs.
2. The adapter must preserve explicit nulls for inapplicable fields.
3. The adapter must emit structured warnings or errors for missing required or
   conditional inputs.
4. The adapter must preserve field-level traceability for populated values.
5. The adapter must not recalculate benefit values.
6. The adapter must not generate BSRS configuration rows.
7. The adapter must resolve matching field names through `artifacts/mappings/DD.csv`
   first when a matching DD field exists.

## Persistence Contract

Successful runs persist:

- one `engine_run` row
- one valuation-listing output row
- trace records tied to the calculation run

Failed validation runs persist:

- one failed `engine_run` row
- no authoritative valuation-listing output row

## Downstream Boundaries

The following remain dependency references only and are not implemented in this
slice:

- `bsrs_configuration_output`
- other output adapters

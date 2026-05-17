# Compensation Resolution Slice v0.1.0

The MVP adds the browser-only `compensation_resolution` deterministic module on
top of the existing Vite, sql.js, database migration, `date_resolution`, and
`service_resolution` foundation.

## Runtime Boundary

- Reads only active reviewed `engine_input_packet` rows with
  `packet_type = compensation_resolution`.
- Uses committed fixture CSV rows only to build reviewed packets for tests and
  the browser fixture runner.
- Does not read raw documents, OCR, emails, images, PDFs, or unreviewed
  extraction output.
- Does not call servers, hosted APIs, telemetry, or remote calculation services.

## MVP Rule Path

The executable MVP supports the committed final-average-pay fixture path from
`packages/tests/compensation_resolution_test_cases_v0.1.0.csv`. Final average
compensation resolves to compensation and average compensation. Reviewed covered
compensation resolves only when supplied. Frozen-benefit support completes with
explicit null compensation values and a structured warning.

## Persistence

Successful runs write:

- `engine_run`
- compensation columns in `resolved_service_comp_output`
- `module_trace` rows for populated compensation outputs

Existing service columns in `resolved_service_comp_output` are preserved when a
prior service output row exists for the same case and subject. No form,
benefit-kernel, V1/VE, valuation-listing, or BSRS adapter implementation is
included in this slice.

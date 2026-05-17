# Service Resolution Slice v0.1.0

The MVP adds the browser-only `service_resolution` deterministic module on top
of the existing Vite, sql.js, database migration, and `date_resolution`
foundation.

## Runtime Boundary

- Reads only active reviewed `engine_input_packet` rows with
  `packet_type = service_resolution`.
- Uses committed fixture CSV rows only to build reviewed packets for tests and
  the browser fixture runner.
- Does not read raw documents, OCR, emails, images, PDFs, or unreviewed
  extraction output.
- Does not call servers, hosted APIs, telemetry, or remote calculation services.

## MVP Rule Path

The executable MVP supports the committed `plan_year_1000_hours` fixture path
from `packages/tests/service_resolution_test_cases_v0.1.0.csv`. Service is
resolved as inclusive plan years from DOP through the earliest reviewed service
end boundary among DOTE, DOPT, and DOBF.

## Persistence

Successful runs write:

- `engine_run`
- service columns in `resolved_service_comp_output`
- `module_trace` rows for populated service outputs

Compensation columns in `resolved_service_comp_output` remain null. No
compensation, form, benefit-kernel, V1/VE, valuation-listing, or BSRS adapter
implementation is included in this slice.

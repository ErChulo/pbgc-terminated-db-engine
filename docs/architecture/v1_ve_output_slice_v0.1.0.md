# V1/VE Output Slice v0.1.0

The sixth executable slice adds `packages/engine/v1-ve-output/` on top of the
existing browser-only Vite and sql.js foundation. It consumes only reviewed
V1/VE input packets and upstream deterministic outputs, then writes a
deterministic V1/VE adapter row to `v1_ve_output_row`.

The MVP fixture path supports two reviewed cases:

- `VE001` for the deferred vested populated path
- `VE002` for the in-pay path with explicit null benefit branches

Trace rows are written for every populated V1/VE output field with upstream
source-group references, rule version, branch indicators, and explicit warning
notes for null benefit branches.

Validation was exercised with `npm test`, `npm run lint`, and `npm run build`
on 2026-05-17.

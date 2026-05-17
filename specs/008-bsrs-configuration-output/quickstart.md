# Quickstart: BSRS Configuration Output

## Prerequisites

- Node.js and npm available in the local workspace
- Browser capable of running the committed Vite application
- Existing repository artifacts and migrations already present

## Validate the repository baseline

```bash
npm test
npm run build
```

## Run the browser application

```bash
npm --workspace @pbgc/web run dev
```

Open the local Vite URL printed by the dev server and navigate to the BSRS
configuration slice once implementation is present.

## Verify the BSRS slice

1. Load a committed reviewed fixture packet that exercises BSRS configuration
   branches.
2. Generate the BSRS configuration output.
3. Confirm the output packet uses DD-first names where `artifacts/mappings/DD.csv`
   provides a matching field.
4. Confirm the same packet and rule version generate identical output on repeat
   runs.
5. Confirm failed validation cases persist a failed engine run without an
   authoritative BSRS output row.

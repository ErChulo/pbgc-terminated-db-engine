# Quickstart: Upload Import Pipeline

## Focused Validation

1. Open the app at `http://127.0.0.1:5175/`.
2. From the dashboard, identify the Upload / Import stage.
3. Open the Upload / Import page.
4. Paste mocked reviewed JSON:

```json
{"case_id":"CASE-MOCK-001","assertion_id":"ASSERTION-MOCK-001","stage":"upload_import","source_layer":"source_assertion"}
```

5. Paste mocked external-LLM artifact text:

```text
External LLM artifact for CASE-MOCK-001 prepared outside the app. Mocked review notes only.
```

6. Verify the reviewed JSON preview is accepted.
7. Verify the external artifact preview is inert and display-only.
8. Verify malformed and oversized input states are deterministic.

## Manual Evidence

- Desktop 1440x900 10-second Upload / Import identification check: recorded 2026-05-25; dashboard stage and page header are visible with mocked-only notices.
- Mobile 390x844 10-second Upload / Import identification check: recorded 2026-05-25; responsive layout stacks the stage link, boundary notice, and preview controls.

## Automated Validation

```bash
npm test -- reconciliation-workbench-ui.test.ts
npm run lint
npm run build
npm test
```

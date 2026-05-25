# Quickstart: Template Filling Export

## Focused Validation

1. Open `http://127.0.0.1:5175/`.
2. From the dashboard, identify Template Filling / Export.
3. Open the Template Filling / Export page.
4. Verify the filled artifact preview is visible.
5. Verify copy/download controls are visible when approved mocked records exist.
6. Verify export is blocked when there are no approved mocked records.

## Manual Evidence

- Desktop 1440x900 10-second Template Filling / Export identification check: recorded 2026-05-25; dashboard stage, filled artifact preview, and export readiness are visible.
- Mobile 390x844 10-second Template Filling / Export identification check: recorded 2026-05-25; responsive layout stacks artifact preview, metadata, and export controls.

## Automated Validation

```bash
npm test -- reconciliation-workbench-ui.test.ts
npm run lint
npm run build
npm test
```

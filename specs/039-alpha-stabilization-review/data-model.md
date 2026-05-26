# Data Model: Alpha Stabilization Review

## Verification Checklist Entities

### Nav Route Verification Record

| Field | Type | Description |
|-------|------|-------------|
| hash | string | The route hash (e.g., `#date-resolution`) |
| label | string | Display label (e.g., "Date Resolution") |
| section | string | Nav section (Engine, Workbench, Tools) |
| renders | boolean | Page renders without error |
| darkTheme | boolean | Dark theme applied correctly |
| mobileLayout | boolean | Responsive layout at 390×844 |
| consoleErrors | string[] | Any console errors captured |
| notes | string | Observations or issues found |

### Theme Coverage Record

| Field | Type | Description |
|-------|------|-------------|
| cssClass | string | The CSS class or selector |
| lightTheme | boolean | `[data-theme="bone-light"]` variant exists |
| darkTheme | boolean | `[data-theme="pure-dark"]` variant exists |
| usesColor | boolean | Has explicit color/background/border declarations |
| pageLocation | string | Which page(s) use this class |

### Build Integrity Record

| Field | Type | Description |
|-------|------|-------------|
| checkType | string | build, test, or serve |
| exitCode | number | 0 for success |
| warnings | string[] | Non-blocking warnings |
| errors | string[] | Blocking errors |
| timestamp | string | When the check ran |

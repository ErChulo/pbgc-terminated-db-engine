# Research: Alpha Stabilization Review

## Analysis Date: 2026-05-25

## Current State

- **Completed features**: 28 (#001–#038)
- **Navigation routes**: 17 (dashboard + 8 engine + 2 workbench + 7 tools)
- **Page files**: 19 page renderers in `apps/web/src/pages/`
- **Slice files**: 14 state slices in `apps/web/src/app/`
- **Test file**: 1 UI test suite in `packages/tests/reconciliation-workbench-ui.test.ts`
- **Total source LOC**: ~4,650 in pages + slices
- **CSS style definitions**: ~1,100 lines with 28 themed panel variants
- **Theme support**: Light (bone-light) and dark (pure-dark) via `data-theme` attribute

## Known Issues

### Navigation
- 17 routes are defined in `NAV_SECTIONS` in `main.ts`
- Each must have matching route handler in `renderApp()` hash switch
- Each must have a working render function import and page component

### Theme Coverage
- 28 themed components with both light and dark variants defined in `styles.css`
- Some newer pages may have incomplete dark theme definitions
- Need systematic check of every page under both themes

### Responsive Design
- Breakpoint at 820px collapses grids to single column
- Need to verify all 10+ grid layouts work at mobile widths
- Table horizontal scroll behavior for small screens

### Build
- Known warning: chunk size > 500 kB (non-blocking advisory)
- Tailwind CSS classes defined in template but may not be fully used
- Dist assets must be rebuilt after any CSS/JS fixes

### No New Engine Logic
- This is strictly a stabilization/hardening pass
- No changes to deterministic engine modules
- No changes to output adapters
- No changes to data contracts or persistence

## Approach

### Systematic Route Audit
1. For each of the 17 routes, verify:
   - Page renders without throwing
   - Console has no errors
   - Theme toggle works correctly
   - Mobile layout stacks correctly

### Systematic Theme Audit
1. For each CSS class group, verify:
   - `[data-theme="bone-light"]` variant exists
   - `[data-theme="pure-dark"]` variant exists
   - No unthemed color references leak through

### Build Integrity
1. `npm run build` must pass with exit 0
2. `npm test` must pass
3. Dist must serve without 404s

## Decisions

- **Decision**: Use systematic page-by-page verification rather than automated snapshot testing for this pass
- **Rationale**: This is a stabilization review, not a new feature. Manual verification provides higher confidence for alpha readiness
- **Alternatives considered**: Playwright/Cypress E2E tests — scope for future feature

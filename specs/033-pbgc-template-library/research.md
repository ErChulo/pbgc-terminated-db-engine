# Research: PBGC Template Library

## Decision: Metadata-Only Template Browsing

**Rationale**: The repository contains committed binary PBGC templates and CSV import templates. Metadata-only browsing keeps the app responsive and avoids parsing binary documents in this slice.

**Alternatives considered**: Rendering docx contents in-browser was rejected because it would add complexity and is not needed before template filling/export.

## Decision: Distinguish Official Output Templates From Import Templates

**Rationale**: Users need to know whether a template is a future output artifact shell or a reviewed-input preparation template.

**Alternatives considered**: A single flat list without category was rejected because it obscures alpha stage purpose.

## Decision: Display-Only Readiness

**Rationale**: Template filling and export are future features. Readiness preview sets expectations without executing unsupported work.

**Alternatives considered**: Producing filled artifacts now was rejected because reviewed-input approval and template filling/export are separate backlog items.

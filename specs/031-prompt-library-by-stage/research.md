# Research: Prompt Library By Stage

## Decision: Committed Static Prompt Entries

**Rationale**: The app must host prompts without network dependencies. Committed prompt entries keep the alpha deterministic and auditable.

**Alternatives considered**: Fetching prompt libraries from a hosted source was rejected because the app is browser-only and must avoid server/runtime network dependencies.

## Decision: Browser-Local Draft And Import State

**Rationale**: Analysts need to edit and import prompt text while keeping approved baselines unchanged. Display-only local state gives that behavior without treating drafts as reviewed case evidence.

**Alternatives considered**: sql.js persistence was rejected for the MVP because prompt drafts are not deterministic engine inputs or output artifacts.

## Decision: No Scraping Execution In App

**Rationale**: The app manages prompts for external LLM workflows chosen by the user. It must not run scraping, OCR, or source-document interpretation itself.

**Alternatives considered**: Calling an LLM or browser OCR locally was rejected because it violates the product boundary and would introduce non-deterministic runtime behavior.

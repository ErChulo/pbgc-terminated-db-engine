# Research: Upload Import Pipeline

## Decision: Use Local Text Import Preview for MVP

**Rationale**: Textarea-based import preview avoids browser file API complexity while still proving the alpha path for reviewed structured JSON and external-LLM artifact text. It keeps the app browser-only and deterministic.

**Alternatives considered**: File picker upload was deferred because this MVP does not need binary file handling and the app must avoid OCR or source parsing behavior.

## Decision: Validate Reviewed JSON Before Later Approval Work

**Rationale**: The feature must fail fast on malformed, invalid, empty, and oversized inputs before normalization, approval, persistence, or template filling.

**Alternatives considered**: Accepting all JSON for later validation was rejected because it weakens the reviewed-input boundary and makes errors less traceable.

## Decision: Treat External-LLM Artifact Text as Inert

**Rationale**: External LLM scraping happens outside the app. The app can host the text for analyst review but must not infer facts, scrape, OCR, or write output adapters from it.

**Alternatives considered**: Parsing artifact text for field extraction was rejected because it belongs to later reviewed-input normalization and approval flows.

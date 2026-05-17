# Data Model: engine-hardening-review

## Reviewed Fixture Case

- **Purpose**: Represents a committed regression input for an existing slice.
- **Key attributes**: test case id, description, slice name, reviewed packet reference, expected output family.
- **Relationships**: Produces a deterministic output artifact and trace records.

## Deterministic Output Artifact

- **Purpose**: Represents the persisted output row set and its trace/warning metadata for one slice run.
- **Key attributes**: calculation run id, case id, subject key, row payload, adapter version, warning count, trace count.
- **Relationships**: Linked to the reviewed fixture case and the module trace rows.

## DD Mapping Entry

- **Purpose**: Represents a canonical naming record used when a field has a matching DD.csv entry.
- **Key attributes**: field name, canonical DD name, fallback status.
- **Relationships**: Used by hardening checks to confirm DD-first resolution and approved fallback naming.

## Adapter Boundary Record

- **Purpose**: Represents evidence that a run touched only the intended adapter tables.
- **Key attributes**: calculation run id, adapter table name, row count, exclusion status.
- **Relationships**: Supports adapter-exclusion regression tests across the existing output slices.

## Trace Record

- **Purpose**: Represents a field-level explanation of how a populated output value was produced.
- **Key attributes**: module name, field name, rule version, input references, canonical DD name, output value.
- **Relationships**: Linked to the deterministic output artifact and reviewed fixture case.

## Validation Rules

- Repeated runs over the same reviewed fixture case must produce the same output artifact and trace counts.
- Fields with DD.csv matches must resolve to the canonical DD name.
- Fields without DD.csv matches must keep the approved contract name.
- Adapter boundary records must show zero rows in unrelated adapter tables for the slice under test.
- Trace records must continue to identify the producing module and rule version for each populated field.

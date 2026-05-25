export type SchemaValidationStatus = "empty" | "accepted" | "invalid" | "malformed" | "oversized";

export type SchemaLibraryEntry = {
  schema_id: string;
  stage_key: string;
  title: string;
  repository_path: string;
  required_fields: string[];
  optional_fields: string[];
  basis: string;
  ordering_key: string;
};

export type SchemaValidationPreview = {
  selected_schema_id: string;
  status: SchemaValidationStatus;
  checked_fields: string[];
  warnings: string[];
  errors: string[];
  input_size: number;
  basis: string;
};

export type SchemaLibraryState = {
  schemas: SchemaLibraryEntry[];
  selected_schema: SchemaLibraryEntry;
  validation: SchemaValidationPreview;
  boundary_notice: string;
};

const SCHEMA_BOUNDARY_NOTICE =
  "Schema Library boundary: local reviewed JSON preview only. No OCR, in-app scraping, hosted schemas, sql.js writes, or output-adapter writes occur here.";
const VALIDATION_BASIS = "browser-local schema validation preview";
const JSON_PREVIEW_LIMIT = 8000;

const SCHEMAS = [
  {
    schema_id: "source_assertion_schema",
    stage_key: "upload_import",
    title: "Source Assertion Schema",
    repository_path: "artifacts/schemas/source_assertion_schema_v0.1.0.md",
    required_fields: ["case_id", "assertion_id", "source_layer"],
    optional_fields: ["source_reference", "review_status", "trace_note"],
  },
  {
    schema_id: "resolved_fact_schema",
    stage_key: "reviewed_input_approval",
    title: "Resolved Fact Schema",
    repository_path: "artifacts/schemas/resolved_fact_schema_v0.1.0.md",
    required_fields: ["case_id", "fact_id", "fact_value"],
    optional_fields: ["fact_type", "effective_date", "reviewer_note"],
  },
  {
    schema_id: "resolved_plan_provision_schema",
    stage_key: "reviewed_input_approval",
    title: "Resolved Plan Provision Schema",
    repository_path: "artifacts/schemas/resolved_plan_provision_schema_v0.1.0.md",
    required_fields: ["case_id", "provision_id", "provision_value"],
    optional_fields: ["plan_id", "effective_date", "source_assertion_ids"],
  },
  {
    schema_id: "sqlite_schema_blueprint",
    stage_key: "case_workspace",
    title: "SQLite Schema Blueprint",
    repository_path: "artifacts/schemas/sqlite_schema_blueprint_v0.1.0.md",
    required_fields: ["table_name", "primary_key", "version"],
    optional_fields: ["columns", "indexes", "notes"],
  },
] as const;

export function buildSchemaLibrary(
  options: {
    selected_schema_id?: string;
    json_text?: string;
  } = {},
): SchemaLibraryState {
  const schemas = SCHEMAS.map((schema, index) => ({
    ...schema,
    required_fields: [...schema.required_fields],
    optional_fields: [...schema.optional_fields],
    basis: "committed schema artifact v0.1.0",
    ordering_key: `${String(index + 1).padStart(6, "0")}|${schema.schema_id}`,
  }));
  const selectedSchema = schemas.find((schema) => schema.schema_id === options.selected_schema_id) ?? schemas[0];
  return {
    schemas,
    selected_schema: selectedSchema,
    validation: validateReviewedJsonPreview(selectedSchema, options.json_text),
    boundary_notice: SCHEMA_BOUNDARY_NOTICE,
  };
}

function validateReviewedJsonPreview(schema: SchemaLibraryEntry, jsonText: string | undefined): SchemaValidationPreview {
  const text = jsonText ?? "";
  if (!text.trim()) return buildValidationPreview(schema, "empty", [], [], [], text.length);
  if (text.length > JSON_PREVIEW_LIMIT) {
    return buildValidationPreview(schema, "oversized", [], [], ["JSON preview exceeds the alpha size limit."], text.length);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return buildValidationPreview(schema, "malformed", [], [], ["JSON text could not be parsed."], text.length);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return buildValidationPreview(schema, "invalid", [], [], ["Reviewed JSON preview must be an object."], text.length);
  }
  const record = parsed as Record<string, unknown>;
  const checkedFields = [...schema.required_fields];
  const errors = schema.required_fields
    .filter((field) => record[field] === undefined || record[field] === null || record[field] === "")
    .map((field) => `Missing required field: ${field}`);
  const warnings = schema.optional_fields
    .filter((field) => record[field] === undefined)
    .map((field) => `Optional field not present: ${field}`);
  return buildValidationPreview(schema, errors.length === 0 ? "accepted" : "invalid", checkedFields, warnings, errors, text.length);
}

function buildValidationPreview(
  schema: SchemaLibraryEntry,
  status: SchemaValidationStatus,
  checkedFields: string[],
  warnings: string[],
  errors: string[],
  inputSize: number,
): SchemaValidationPreview {
  return {
    selected_schema_id: schema.schema_id,
    status,
    checked_fields: checkedFields,
    warnings,
    errors,
    input_size: inputSize,
    basis: VALIDATION_BASIS,
  };
}

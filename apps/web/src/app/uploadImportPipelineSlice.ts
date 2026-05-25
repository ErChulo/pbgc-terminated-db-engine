export type UploadImportStatus = "empty" | "accepted" | "invalid" | "malformed" | "oversized";

export type UploadImportKind = "reviewed_structured_json" | "external_llm_artifact";

export type UploadImportMessage = {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
};

export type UploadImportSource = {
  source_id: UploadImportKind;
  label: string;
  stage_key: string;
  kind: UploadImportKind;
  boundary_basis: string;
  ordering_key: string;
};

export type UploadImportTraceBasis = {
  producing_module: "upload_import_pipeline";
  rule_version: "0.1.0";
  selected_stage: string;
  source_kind: UploadImportKind;
};

export type UploadImportPreview = {
  source_id: UploadImportKind;
  status: UploadImportStatus;
  status_label: string;
  input_size: number;
  accepted_fields: string[];
  warnings: UploadImportMessage[];
  errors: UploadImportMessage[];
  trace_basis: UploadImportTraceBasis;
};

export type UploadImportPipelineState = {
  sources: UploadImportSource[];
  selected_stage: string;
  reviewed_json_text: string;
  external_artifact_text: string;
  reviewed_json_preview: UploadImportPreview;
  external_artifact_preview: UploadImportPreview;
  boundary_notice: string;
  no_real_person_data_notice: string;
  trace: {
    producing_module: "upload_import_pipeline";
    rule_version: "0.1.0";
    selected_stage: string;
    source_kinds: UploadImportKind[];
  };
};

export type UploadImportPipelineInput = {
  reviewed_json_text?: string;
  external_artifact_text?: string;
  selected_stage?: string;
};

const MAX_IMPORT_TEXT_LENGTH = 8000;
const MODULE_NAME = "upload_import_pipeline" as const;
const RULE_VERSION = "0.1.0" as const;
const DEFAULT_STAGE = "upload_import";

const IMPORT_SOURCES: UploadImportSource[] = [
  {
    source_id: "reviewed_structured_json",
    label: "Reviewed Structured JSON",
    stage_key: DEFAULT_STAGE,
    kind: "reviewed_structured_json",
    boundary_basis: "Reviewed local JSON preview before normalization or approval.",
    ordering_key: "000001|reviewed_structured_json",
  },
  {
    source_id: "external_llm_artifact",
    label: "External LLM Artifact Text",
    stage_key: DEFAULT_STAGE,
    kind: "external_llm_artifact",
    boundary_basis: "Inert local text prepared outside the app for analyst review.",
    ordering_key: "000002|external_llm_artifact",
  },
];

export function buildUploadImportPipeline(input: UploadImportPipelineInput = {}): UploadImportPipelineState {
  const selectedStage = input.selected_stage ?? DEFAULT_STAGE;
  const reviewedJsonText = input.reviewed_json_text ?? "";
  const externalArtifactText = input.external_artifact_text ?? "";
  const sources = IMPORT_SOURCES.map((source) => ({
    ...source,
    stage_key: selectedStage,
  })).sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));

  return {
    sources,
    selected_stage: selectedStage,
    reviewed_json_text: reviewedJsonText,
    external_artifact_text: externalArtifactText,
    reviewed_json_preview: buildReviewedJsonPreview(reviewedJsonText, selectedStage),
    external_artifact_preview: buildExternalArtifactPreview(externalArtifactText, selectedStage),
    boundary_notice:
      "Browser-local preview only. External LLM artifacts are prepared outside the app. No OCR, in-app scraping, network retrieval, database writes, or adapter writes occur here.",
    no_real_person_data_notice:
      "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is used on this import page.",
    trace: {
      producing_module: MODULE_NAME,
      rule_version: RULE_VERSION,
      selected_stage: selectedStage,
      source_kinds: sources.map((source) => source.kind),
    },
  };
}

function buildReviewedJsonPreview(text: string, selectedStage: string): UploadImportPreview {
  const inputSize = text.length;
  const traceBasis = buildTraceBasis("reviewed_structured_json", selectedStage);
  if (text.trim().length === 0) {
    return preview("reviewed_structured_json", "empty", "Empty", inputSize, [], [], [message("REVIEWED_JSON_EMPTY", "warning", "Reviewed JSON text is empty.")], traceBasis);
  }
  if (inputSize > MAX_IMPORT_TEXT_LENGTH) {
    return preview(
      "reviewed_structured_json",
      "oversized",
      "Oversized",
      inputSize,
      [],
      [],
      [message("REVIEWED_JSON_OVERSIZED", "error", "Reviewed JSON exceeds the alpha import size limit.")],
      traceBasis,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return preview(
      "reviewed_structured_json",
      "malformed",
      "Malformed JSON",
      inputSize,
      [],
      [],
      [message("REVIEWED_JSON_MALFORMED", "error", "Reviewed JSON text could not be parsed.")],
      traceBasis,
    );
  }

  const records = Array.isArray(parsed) ? parsed : [parsed];
  if (records.length === 0 || records.some((record) => !isPlainObject(record))) {
    return preview(
      "reviewed_structured_json",
      "invalid",
      "Invalid reviewed JSON",
      inputSize,
      [],
      [],
      [message("REVIEWED_JSON_SHAPE_INVALID", "error", "Reviewed JSON must be an object or array of objects.")],
      traceBasis,
    );
  }

  const acceptedFields = Array.from(new Set(records.flatMap((record) => Object.keys(record as Record<string, unknown>)))).sort();
  const errors: UploadImportMessage[] = [];
  if (!records.every((record) => hasNonEmptyString(record as Record<string, unknown>, "case_id"))) {
    errors.push(message("CASE_ID_MISSING", "error", "Each reviewed JSON record must include case_id."));
  }
  if (!records.every(hasReviewedRecordId)) {
    errors.push(message("REVIEWED_RECORD_ID_MISSING", "error", "Each reviewed JSON record must include a reviewed record identifier."));
  }
  if (errors.length > 0) {
    return preview("reviewed_structured_json", "invalid", "Invalid reviewed JSON", inputSize, acceptedFields, [], errors, traceBasis);
  }

  return preview(
    "reviewed_structured_json",
    "accepted",
    "Accepted",
    inputSize,
    acceptedFields,
    [message("REVIEWED_JSON_DISPLAY_ONLY", "info", "Reviewed JSON accepted for local preview only.")],
    [],
    traceBasis,
  );
}

function buildExternalArtifactPreview(text: string, selectedStage: string): UploadImportPreview {
  const inputSize = text.length;
  const traceBasis = buildTraceBasis("external_llm_artifact", selectedStage);
  if (text.trim().length === 0) {
    return preview("external_llm_artifact", "empty", "Empty", inputSize, [], [], [message("EXTERNAL_ARTIFACT_EMPTY", "warning", "External artifact text is empty.")], traceBasis);
  }
  if (inputSize > MAX_IMPORT_TEXT_LENGTH) {
    return preview(
      "external_llm_artifact",
      "oversized",
      "Oversized",
      inputSize,
      [],
      [],
      [message("EXTERNAL_ARTIFACT_OVERSIZED", "error", "External artifact text exceeds the alpha import size limit.")],
      traceBasis,
    );
  }
  return preview(
    "external_llm_artifact",
    "accepted",
    "Accepted as inert review text",
    inputSize,
    [],
    [message("INERT_EXTERNAL_ARTIFACT", "info", "External LLM artifact text is retained as inert local review material.")],
    [],
    traceBasis,
  );
}

function preview(
  sourceId: UploadImportKind,
  status: UploadImportStatus,
  statusLabel: string,
  inputSize: number,
  acceptedFields: string[],
  warnings: UploadImportMessage[],
  errors: UploadImportMessage[],
  traceBasis: UploadImportTraceBasis,
): UploadImportPreview {
  return {
    source_id: sourceId,
    status,
    status_label: statusLabel,
    input_size: inputSize,
    accepted_fields: [...acceptedFields].sort(),
    warnings: [...warnings].sort((left, right) => left.code.localeCompare(right.code)),
    errors: [...errors].sort((left, right) => left.code.localeCompare(right.code)),
    trace_basis: traceBasis,
  };
}

function buildTraceBasis(sourceKind: UploadImportKind, selectedStage: string): UploadImportTraceBasis {
  return {
    producing_module: MODULE_NAME,
    rule_version: RULE_VERSION,
    selected_stage: selectedStage,
    source_kind: sourceKind,
  };
}

function message(code: string, severity: UploadImportMessage["severity"], messageText: string): UploadImportMessage {
  return { code, severity, message: messageText };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasNonEmptyString(record: Record<string, unknown>, field: string): boolean {
  return typeof record[field] === "string" && String(record[field]).trim().length > 0;
}

function hasReviewedRecordId(value: unknown): boolean {
  const record = value as Record<string, unknown>;
  return ["assertion_id", "fact_id", "provision_id", "engine_input_id", "reviewed_input_id"].some((field) => hasNonEmptyString(record, field));
}

export type ReviewedInputDecision = "pending" | "approved" | "rejected" | "blocked";
export type ReviewedInputEligibility = "eligible" | "blocked";
export type ReviewedInputQueueStatus = "ready" | "empty" | "malformed";

export type ReviewedInputMessage = {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
};

export type ReviewedInputApprovalTraceBasis = {
  producing_module: "reviewed_input_approval";
  rule_version: "0.1.0";
  import_source: "upload_import_pipeline";
  source_layer: string;
};

export type NormalizedReviewRow = {
  row_id: string;
  ordering_key: string;
  case_id: string;
  reviewed_record_id: string;
  source_layer: string;
  decision: ReviewedInputDecision;
  decision_label: string;
  eligibility: ReviewedInputEligibility;
  status_label: string;
  accepted_fields: string[];
  warnings: ReviewedInputMessage[];
  errors: ReviewedInputMessage[];
  trace_basis: ReviewedInputApprovalTraceBasis;
};

export type ApprovedPacketPreview = {
  approved_count: number;
  blocked_count: number;
  approved_fields: string[];
  basis: string;
};

export type ReviewedInputApprovalState = {
  queue_status: ReviewedInputQueueStatus;
  reviewed_json_text: string;
  rows: NormalizedReviewRow[];
  approved_packet_preview: ApprovedPacketPreview;
  warnings: ReviewedInputMessage[];
  errors: ReviewedInputMessage[];
  boundary_notice: string;
  no_real_person_data_notice: string;
  trace: {
    producing_module: "reviewed_input_approval";
    rule_version: "0.1.0";
    source_stage: "upload_import";
  };
};

export type ReviewedInputApprovalInput = {
  reviewed_json_text?: string;
  decisions?: Partial<Record<string, Exclude<ReviewedInputDecision, "pending" | "blocked">>>;
};

const MODULE_NAME = "reviewed_input_approval" as const;
const RULE_VERSION = "0.1.0" as const;
const DEFAULT_REVIEWED_JSON_TEXT = JSON.stringify(
  [
    {
      case_id: "CASE-MOCK-001",
      assertion_id: "ASSERTION-MOCK-001",
      source_layer: "source_assertion",
      stage: "upload_import",
    },
    {
      case_id: "CASE-MOCK-001",
      fact_id: "FACT-MOCK-001",
      source_layer: "resolved_fact",
      stage: "upload_import",
    },
  ],
  null,
  2,
);

export function buildReviewedInputApproval(input: ReviewedInputApprovalInput = {}): ReviewedInputApprovalState {
  const reviewedJsonText = input.reviewed_json_text ?? DEFAULT_REVIEWED_JSON_TEXT;
  const boundary_notice =
    "Browser-local approval gate only. Mocked reviewed records must be approved here before any later deterministic engine or template work.";
  const no_real_person_data_notice =
    "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is used on this approval page.";
  const trace = {
    producing_module: MODULE_NAME,
    rule_version: RULE_VERSION,
    source_stage: "upload_import" as const,
  };

  if (reviewedJsonText.trim().length === 0) {
    return state("empty", reviewedJsonText, [], [message("APPROVAL_QUEUE_EMPTY", "warning", "Reviewed input approval queue is empty.")], [], boundary_notice, no_real_person_data_notice, trace);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(reviewedJsonText);
  } catch {
    return state(
      "malformed",
      reviewedJsonText,
      [],
      [],
      [message("APPROVAL_JSON_MALFORMED", "error", "Reviewed input JSON could not be parsed.")],
      boundary_notice,
      no_real_person_data_notice,
      trace,
    );
  }

  const records = Array.isArray(parsed) ? parsed : [parsed];
  const rows = records.map((record, index) => normalizeRecord(record, index, input.decisions ?? {})).sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));
  return state("ready", reviewedJsonText, rows, [], [], boundary_notice, no_real_person_data_notice, trace);
}

function normalizeRecord(record: unknown, index: number, decisions: Partial<Record<string, "approved" | "rejected">>): NormalizedReviewRow {
  const objectRecord = isPlainObject(record) ? record : {};
  const caseId = stringField(objectRecord, "case_id");
  const reviewedRecordId = getReviewedRecordId(objectRecord);
  const sourceLayer = stringField(objectRecord, "source_layer") || "reviewed_structured_input";
  const acceptedFields = Object.keys(objectRecord).sort();
  const rowId = reviewedRecordId || `blocked-record-${String(index + 1).padStart(3, "0")}`;
  const errors: ReviewedInputMessage[] = [];
  const warnings: ReviewedInputMessage[] = [];

  if (!caseId) {
    errors.push(message("CASE_ID_MISSING", "error", "Reviewed row is missing case_id."));
  }
  if (!reviewedRecordId) {
    errors.push(message("REVIEWED_RECORD_ID_MISSING", "error", "Reviewed row is missing a reviewed record identifier."));
  }

  let decision: ReviewedInputDecision = decisions[reviewedRecordId] ?? "pending";
  if (errors.length > 0) {
    decision = "blocked";
  } else if (decision === "pending") {
    warnings.push(message("APPROVAL_DECISION_PENDING", "warning", "Reviewed row is pending approval."));
  } else if (decision === "rejected") {
    errors.push(message("APPROVAL_DECISION_REJECTED", "error", "Reviewed row was rejected and remains blocked."));
  }

  const eligibility: ReviewedInputEligibility = decision === "approved" && errors.length === 0 ? "eligible" : "blocked";
  return {
    row_id: rowId,
    ordering_key: `${String(index + 1).padStart(6, "0")}|${rowId}`,
    case_id: caseId || "CASE-MOCK-MISSING",
    reviewed_record_id: reviewedRecordId || "REVIEWED-RECORD-MISSING",
    source_layer: sourceLayer,
    decision,
    decision_label: formatDecision(decision),
    eligibility,
    status_label: eligibility === "eligible" ? "Approved for later work" : "Blocked from later work",
    accepted_fields: acceptedFields,
    warnings: warnings.sort((left, right) => left.code.localeCompare(right.code)),
    errors: errors.sort((left, right) => left.code.localeCompare(right.code)),
    trace_basis: {
      producing_module: MODULE_NAME,
      rule_version: RULE_VERSION,
      import_source: "upload_import_pipeline",
      source_layer: sourceLayer,
    },
  };
}

function state(
  queueStatus: ReviewedInputQueueStatus,
  reviewedJsonText: string,
  rows: NormalizedReviewRow[],
  warnings: ReviewedInputMessage[],
  errors: ReviewedInputMessage[],
  boundaryNotice: string,
  noRealPersonDataNotice: string,
  trace: ReviewedInputApprovalState["trace"],
): ReviewedInputApprovalState {
  const approvedRows = rows.filter((row) => row.eligibility === "eligible");
  const approvedFields = Array.from(new Set(approvedRows.flatMap((row) => row.accepted_fields))).sort();
  return {
    queue_status: queueStatus,
    reviewed_json_text: reviewedJsonText,
    rows,
    approved_packet_preview: {
      approved_count: approvedRows.length,
      blocked_count: rows.length - approvedRows.length,
      approved_fields: approvedFields,
      basis: "browser-local reviewed input approval preview",
    },
    warnings: warnings.sort((left, right) => left.code.localeCompare(right.code)),
    errors: errors.sort((left, right) => left.code.localeCompare(right.code)),
    boundary_notice: boundaryNotice,
    no_real_person_data_notice: noRealPersonDataNotice,
    trace,
  };
}

function getReviewedRecordId(record: Record<string, unknown>): string {
  for (const field of ["assertion_id", "fact_id", "provision_id", "engine_input_id", "reviewed_input_id"]) {
    const value = stringField(record, field);
    if (value) return value;
  }
  return "";
}

function stringField(record: Record<string, unknown>, field: string): string {
  return typeof record[field] === "string" ? String(record[field]).trim() : "";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function message(code: string, severity: ReviewedInputMessage["severity"], messageText: string): ReviewedInputMessage {
  return { code, severity, message: messageText };
}

function formatDecision(decision: ReviewedInputDecision): string {
  return decision
    .split("_")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

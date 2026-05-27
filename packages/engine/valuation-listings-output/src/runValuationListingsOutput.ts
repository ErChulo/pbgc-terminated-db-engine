import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedValuationListingOutput,
  parsePacketJson,
} from "@pbgc/db";
import { buildInputPacketNotActiveError } from "./errors";
import { resolveValuationListingsOutput } from "./resolveValuationListingsOutput";
import { validateValuationListingsOutputPacket } from "./validatePacket";
import { buildValuationListingTraces } from "./trace";
import {
  VALUATION_LISTINGS_OUTPUT_ADAPTER_VERSION,
  type ValuationListingsOutputArtifact,
  type ValuationListingsOutputPacket,
  type ValuationListingsOutputRequest,
  type ValuationListingsOutputResult,
} from "./types";

export function runValuationListingsOutput(db: Database, request: ValuationListingsOutputRequest): ValuationListingsOutputResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "valuation_listings_output") {
    const error = buildInputPacketNotActiveError(request.input_packet_id, request.rule_version);
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, 1));
    return failedResult(calculation_run_id, [error]);
  }

  const packet = parsePacketJson<ValuationListingsOutputPacket>(record);
  const validationErrors = validateValuationListingsOutputPacket(packet, request.input_packet_id, request.rule_version);
  if (validationErrors.length > 0) {
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, validationErrors.length));
    return failedResult(calculation_run_id, validationErrors);
  }

  const resolved = resolveValuationListingsOutput(packet, request.input_packet_id, request.rule_version);
  const valuation_listing_output_row_id = createDeterministicId("valuation-listing");
  const traces = buildValuationListingTraces(calculation_run_id, request.subject_key, resolved.row, packet, resolved.warnings);
  const output: ValuationListingsOutputArtifact = {
    row: resolved.row,
    metadata: {
      case_id: request.case_id,
      plan_id: packet.case_plan_timeline.plan_id,
      bcv_rec_id: packet.participant_role_population.bcv_rec_id,
      calculation_run_id,
      deliverable_version: request.deliverable_version,
      adapter_version: VALUATION_LISTINGS_OUTPUT_ADAPTER_VERSION,
      listing_row_type: packet.listing_row_type,
      listing_sort_key: resolved.row.listing_sort_key,
    },
    warnings: resolved.warnings,
    traces,
  };
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", resolved.warnings.length, 0));
  insertResolvedValuationListingOutput(db, {
    valuation_listing_output_row_id,
    calculation_run_id,
    case_id: request.case_id,
    plan_id: packet.case_plan_timeline.plan_id,
    subject_key: request.subject_key,
    listing_row_type: packet.listing_row_type,
    listing_sort_key: resolved.row.listing_sort_key,
    row_json: JSON.stringify(resolved.row),
    adapter_version: VALUATION_LISTINGS_OUTPUT_ADAPTER_VERSION,
  });
  for (const trace of traces) insertModuleTrace(db, trace);
  return {
    calculation_run_id,
    run_status: "completed",
    valuation_listing_output_row_id,
    warning_count: resolved.warnings.length,
    error_count: 0,
    warnings: resolved.warnings,
    errors: [],
    output,
    traces,
  };
}

function makeRun(
  request: ValuationListingsOutputRequest,
  calculation_run_id: string,
  started_at: string,
  run_status: EngineRunRecord["run_status"],
  warning_count: number,
  error_count: number,
): EngineRunRecord {
  return {
    calculation_run_id,
    case_id: request.case_id,
    input_packet_id: request.input_packet_id,
    rule_version: request.rule_version,
    deliverable_version: request.deliverable_version,
    run_context: "valuation_listings_output_mvp",
    started_at,
    completed_at: currentTimestamp(),
    run_status,
    warning_count,
    error_count,
  };
}

function failedResult(calculationRunId: string, errors: StructuredIssue[]): ValuationListingsOutputResult {
  return {
    calculation_run_id: calculationRunId,
    run_status: "failed",
    warning_count: 0,
    error_count: errors.length,
    warnings: [],
    errors,
    traces: [],
  };
}



import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedV1VeOutput,
  parsePacketJson,
} from "@pbgc/db";
import { buildInputPacketNotActiveError } from "./errors";
import { resolveV1VeOutput } from "./resolveV1VeOutput";
import { validateV1VeOutputPacket } from "./validatePacket";
import { buildV1VeTraces } from "./trace";
import {
  V1_VE_OUTPUT_ADAPTER_VERSION,
  type V1VeOutputPacket,
  type V1VeOutputArtifact,
  type V1VeOutputRequest,
  type V1VeOutputResult,
} from "./types";

export function runV1VeOutput(db: Database, request: V1VeOutputRequest): V1VeOutputResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "v1_ve_output") {
    const error = buildInputPacketNotActiveError(request.input_packet_id, request.rule_version);
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, 1));
    return failedResult(calculation_run_id, [error]);
  }

  const packet = parsePacketJson<V1VeOutputPacket>(record);
  const errors = validateV1VeOutputPacket(packet, request.input_packet_id, request.rule_version);
  if (errors.length > 0) {
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, errors.length));
    return failedResult(calculation_run_id, errors);
  }

  const resolved = resolveV1VeOutput(packet, request.input_packet_id, request.rule_version);
  const v1_ve_output_row_id = createDeterministicId("v1-ve-output");
  const traces = buildV1VeTraces(calculation_run_id, request.subject_key, resolved.row, packet, resolved.warnings);
  const output: V1VeOutputArtifact = {
    row: resolved.row,
    metadata: {
      case_id: request.case_id,
      plan_id: packet.case_plan_timeline.plan_id,
      bcv_rec_id: packet.participant_role_population.bcv_rec_id,
      calculation_run_id,
      deliverable_version: request.deliverable_version,
      adapter_version: V1_VE_OUTPUT_ADAPTER_VERSION,
    },
    warnings: resolved.warnings,
    traces,
  };
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", resolved.warnings.length, 0));
  insertResolvedV1VeOutput(db, {
    v1_ve_output_row_id,
    calculation_run_id,
    case_id: request.case_id,
    plan_id: packet.case_plan_timeline.plan_id,
    subject_key: request.subject_key,
    row_json: JSON.stringify(resolved.row),
    listing_sort_key: packet.participant_role_population.bcv_rec_id,
    adapter_version: V1_VE_OUTPUT_ADAPTER_VERSION,
  });
  for (const trace of traces) insertModuleTrace(db, trace);
  return {
    calculation_run_id,
    run_status: "completed",
    v1_ve_output_row_id,
    warning_count: resolved.warnings.length,
    error_count: 0,
    warnings: resolved.warnings,
    errors: [],
    output,
    traces,
  };
}

function makeRun(
  request: V1VeOutputRequest,
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
    run_context: "v1_ve_output_mvp",
    started_at,
    completed_at: currentTimestamp(),
    run_status,
    warning_count,
    error_count,
  };
}

function failedResult(calculationRunId: string, errors: StructuredIssue[]): V1VeOutputResult {
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



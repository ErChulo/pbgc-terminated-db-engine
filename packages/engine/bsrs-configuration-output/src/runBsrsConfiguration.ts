import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedBsrsConfigurationOutput,
  parsePacketJson,
} from "@pbgc/db";
import { buildInputPacketNotActiveError } from "./errors";
import { buildBsrsConfigurationTraces } from "./trace";
import { resolveBsrsConfigurationOutput } from "./resolveBsrsConfigurationOutput";
import { validateBsrsConfigurationPacket } from "./validatePacket";
import {
  BSRS_CONFIGURATION_OUTPUT_ADAPTER_VERSION,
  BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
  type BsrsConfigurationOutputArtifact,
  type BsrsConfigurationOutputPacket,
  type BsrsConfigurationOutputRequest,
  type BsrsConfigurationOutputResult,
} from "./types";

export function runBsrsConfiguration(db: Database, request: BsrsConfigurationOutputRequest): BsrsConfigurationOutputResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "bsrs_configuration_output") {
    const error = buildInputPacketNotActiveError(request.input_packet_id, request.rule_version);
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, 1));
    return failedResult(calculation_run_id, [error]);
  }

  const packet = parsePacketJson<BsrsConfigurationOutputPacket>(record);
  const validationErrors = validateBsrsConfigurationPacket(packet, request.input_packet_id, request.rule_version);
  if (validationErrors.length > 0) {
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, validationErrors.length));
    return failedResult(calculation_run_id, validationErrors);
  }

  const resolved = resolveBsrsConfigurationOutput(packet, request.input_packet_id, request.rule_version);
  const bsrs_configuration_output_row_id = createDeterministicId("bsrs-configuration");
  resolved.row.calculation_run_id = calculation_run_id;
  resolved.row.deliverable_version = request.deliverable_version;
  resolved.row.schema_version = packet.schema_version;
  resolved.row.bsrs_configuration_output_rule_trace = `${BSRS_CONFIGURATION_OUTPUT_MODULE_NAME}@${BSRS_CONFIGURATION_OUTPUT_ADAPTER_VERSION}:dd_first_projection`;
  const traces = buildBsrsConfigurationTraces(calculation_run_id, request.subject_key, resolved.row, packet, resolved.warnings);
  const output: BsrsConfigurationOutputArtifact = {
    row: resolved.row,
    metadata: {
      case_id: request.case_id,
      plan_id: packet.case_plan_timeline.plan_id,
      bcv_rec_id: packet.participant_role_population.bcv_rec_id,
      calculation_run_id,
      deliverable_version: request.deliverable_version,
      adapter_version: BSRS_CONFIGURATION_OUTPUT_ADAPTER_VERSION,
      statement_row_type: packet.statement_row_type,
      statement_sort_key: packet.statement_sort_key,
    },
    warnings: resolved.warnings,
    traces,
  };
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", resolved.warnings.length, 0));
  insertResolvedBsrsConfigurationOutput(db, {
    bsrs_configuration_output_row_id,
    calculation_run_id,
    case_id: request.case_id,
    plan_id: packet.case_plan_timeline.plan_id,
    subject_key: request.subject_key,
    statement_row_type: packet.statement_row_type,
    statement_sort_key: packet.statement_sort_key,
    row_json: JSON.stringify(resolved.row),
    adapter_version: BSRS_CONFIGURATION_OUTPUT_ADAPTER_VERSION,
  });
  for (const trace of traces) insertModuleTrace(db, trace);
  return {
    calculation_run_id,
    run_status: "completed",
    bsrs_configuration_output_row_id,
    warning_count: resolved.warnings.length,
    error_count: 0,
    warnings: resolved.warnings,
    errors: [],
    output,
    traces,
  };
}

function makeRun(
  request: BsrsConfigurationOutputRequest,
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
    run_context: "bsrs_configuration_output_mvp",
    started_at,
    completed_at: currentTimestamp(),
    run_status,
    warning_count,
    error_count,
  };
}

function failedResult(calculationRunId: string, errors: StructuredIssue[]): BsrsConfigurationOutputResult {
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



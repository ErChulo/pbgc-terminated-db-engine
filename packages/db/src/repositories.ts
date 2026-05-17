import type { Database } from "sql.js";
import type { EngineRunRecord, ModuleTrace } from "@pbgc/shared";
import type { DateResolutionOutput, DateResolutionPacket } from "@pbgc/date-resolution";
import type { ServiceResolutionOutput, ServiceResolutionPacket } from "@pbgc/service-resolution";
import { queryAll, queryOne } from "./sqljs";

export type EngineInputPacketRecord = {
  input_packet_id: string;
  case_id: string;
  subject_key: string;
  subject_type: string;
  packet_type: "date_resolution" | "service_resolution";
  schema_version: string;
  packet_json: string;
  built_from_resolved_at: string | null;
  built_by: string;
  built_at: string;
  status: "active" | "superseded" | "rejected";
};

export function insertEngineInputPacket(db: Database, packet: EngineInputPacketRecord): void {
  db.run(
    `INSERT INTO engine_input_packet (
      input_packet_id, case_id, subject_key, subject_type, packet_type, schema_version,
      packet_json, built_from_resolved_at, built_by, built_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      packet.input_packet_id,
      packet.case_id,
      packet.subject_key,
      packet.subject_type,
      packet.packet_type,
      packet.schema_version,
      packet.packet_json,
      packet.built_from_resolved_at,
      packet.built_by,
      packet.built_at,
      packet.status,
    ],
  );
}

export function getEngineInputPacket(db: Database, inputPacketId: string): EngineInputPacketRecord | null {
  return queryOne(db, "SELECT * FROM engine_input_packet WHERE input_packet_id = ?", [inputPacketId]) as EngineInputPacketRecord | null;
}

export function insertEngineRun(db: Database, run: EngineRunRecord): void {
  db.run(
    `INSERT INTO engine_run (
      calculation_run_id, case_id, input_packet_id, rule_version, deliverable_version,
      run_context, started_at, completed_at, run_status, warning_count, error_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      run.calculation_run_id,
      run.case_id,
      run.input_packet_id,
      run.rule_version,
      run.deliverable_version,
      run.run_context,
      run.started_at,
      run.completed_at,
      run.run_status,
      run.warning_count,
      run.error_count,
    ],
  );
}

export function insertResolvedDatesOutput(db: Database, output: DateResolutionOutput): void {
  db.run(
    `INSERT INTO resolved_dates_output (
      resolved_dates_output_id, calculation_run_id, case_id, subject_key,
      nrd, erd, eurd, eprd, rbd, xra, xrd, sxra, term_lw_xra, term_lw_anb
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.resolved_dates_output_id,
      output.calculation_run_id,
      output.case_id,
      output.subject_key,
      output.nrd,
      output.erd,
      output.eurd,
      output.eprd,
      output.rbd,
      output.xra,
      output.xrd,
      output.sxra,
      output.term_lw_xra,
      output.term_lw_anb,
    ],
  );
}

export function listResolvedDatesOutputs(db: Database): DateResolutionOutput[] {
  return queryAll(db, "SELECT * FROM resolved_dates_output ORDER BY resolved_dates_output_id") as DateResolutionOutput[];
}

export function insertResolvedServiceOutput(db: Database, output: ServiceResolutionOutput): void {
  db.run(
    `INSERT INTO resolved_service_comp_output (
      resolved_service_comp_output_id, calculation_run_id, case_id, subject_key,
      eligibility_service_resolved, vesting_service_resolved, benefit_service_resolved, accrual_service_resolved,
      compensation_resolved, average_compensation_resolved, covered_compensation_resolved
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.resolved_service_comp_output_id,
      output.calculation_run_id,
      output.case_id,
      output.subject_key,
      output.eligibility_service_resolved,
      output.vesting_service_resolved,
      output.benefit_service_resolved,
      output.accrual_service_resolved,
      output.compensation_resolved,
      output.average_compensation_resolved,
      output.covered_compensation_resolved,
    ],
  );
}

export function listResolvedServiceOutputs(db: Database): ServiceResolutionOutput[] {
  return queryAll(db, "SELECT * FROM resolved_service_comp_output ORDER BY resolved_service_comp_output_id") as ServiceResolutionOutput[];
}

export function insertModuleTrace(db: Database, trace: ModuleTrace): void {
  db.run(
    `INSERT INTO module_trace (
      module_trace_id, calculation_run_id, module_name, subject_key, field_name,
      rule_applied, input_fields_used_json, intermediate_values_json, output_value, warning_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      trace.module_trace_id,
      trace.calculation_run_id,
      trace.module_name,
      trace.subject_key,
      trace.field_name,
      trace.rule_applied,
      trace.input_fields_used_json,
      trace.intermediate_values_json,
      trace.output_value,
      trace.warning_note,
    ],
  );
}

export function listModuleTraces(db: Database, calculationRunId: string, moduleName: ModuleTrace["module_name"]): ModuleTrace[] {
  return queryAll(
    db,
    "SELECT * FROM module_trace WHERE calculation_run_id = ? AND module_name = ? ORDER BY module_trace_id",
    [calculationRunId, moduleName],
  ) as ModuleTrace[];
}

export function parsePacketJson<TPacket extends DateResolutionPacket | ServiceResolutionPacket = DateResolutionPacket | ServiceResolutionPacket>(
  record: EngineInputPacketRecord,
): TPacket {
  return JSON.parse(record.packet_json) as TPacket;
}

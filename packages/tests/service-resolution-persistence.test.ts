import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
  listResolvedServiceOutputs,
} from "@pbgc/db";
import { buildServicePacketFromFixture, runServiceResolution } from "@pbgc/service-resolution";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";

describe("service_resolution sql.js persistence", () => {
  it("persists engine_run, service outputs, and service trace for valid fixture packets", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseServiceResolutionFixtures()[0];
    const packet = buildServicePacketFromFixture(fixture);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-SR001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "service_resolution",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });
    const result = runServiceResolution(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-SR001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(result.warning_count).toBe(0);
    expect(result.error_count).toBe(0);

    const outputs = listResolvedServiceOutputs(db);
    expect(outputs).toHaveLength(1);
    expect(outputs[0].eligibility_service_resolved).toBe(25);
    expect(outputs[0].vesting_service_resolved).toBe(25);
    expect(outputs[0].benefit_service_resolved).toBe(25);
    expect(outputs[0].accrual_service_resolved).toBe(25);
    expect(outputs[0].compensation_resolved).toBeNull();
    expect(outputs[0].average_compensation_resolved).toBeNull();
    expect(outputs[0].covered_compensation_resolved).toBeNull();

    const traces = listModuleTraces(db, result.calculation_run_id, "service_resolution");
    expect(traces.map((trace) => trace.field_name).sort()).toEqual([
      "accrual_service_resolved",
      "benefit_service_resolved",
      "eligibility_service_resolved",
      "vesting_service_resolved",
    ]);
  });
});

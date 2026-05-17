import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  insertEngineRun,
  insertResolvedServiceOutput,
  listModuleTraces,
  listResolvedCompensationOutputs,
} from "@pbgc/db";
import { buildCompensationPacketFromFixture, runCompensationResolution } from "@pbgc/compensation-resolution";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";

describe("compensation_resolution sql.js persistence", () => {
  it("persists engine_run, compensation outputs, and trace while preserving service columns", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseCompensationResolutionFixtures()[0];
    const packet = buildCompensationPacketFromFixture(fixture);
    insertEngineRun(db, {
      calculation_run_id: "service-run-CR001",
      case_id: packet.case_id,
      input_packet_id: null,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
      run_context: "test_service_preservation",
      started_at: currentTimestamp(),
      completed_at: currentTimestamp(),
      run_status: "completed",
      warning_count: 0,
      error_count: 0,
    });
    insertResolvedServiceOutput(db, {
      resolved_service_comp_output_id: "service-output-CR001",
      calculation_run_id: "service-run-CR001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      eligibility_service_resolved: 25,
      vesting_service_resolved: 25,
      benefit_service_resolved: 25,
      accrual_service_resolved: 25,
      compensation_resolved: null,
      average_compensation_resolved: null,
      covered_compensation_resolved: null,
    });
    insertEngineInputPacket(db, {
      input_packet_id: "packet-CR001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "compensation_resolution",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });
    const result = runCompensationResolution(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-CR001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(result.warning_count).toBe(0);
    expect(result.error_count).toBe(0);

    const outputs = listResolvedCompensationOutputs(db);
    expect(outputs).toHaveLength(2);
    const compensationOutput = outputs.find((output) => output.resolved_service_comp_output_id === result.resolved_service_comp_output_id);
    expect(compensationOutput).toMatchObject({
      eligibility_service_resolved: 25,
      vesting_service_resolved: 25,
      benefit_service_resolved: 25,
      accrual_service_resolved: 25,
      compensation_resolved: 80000,
      average_compensation_resolved: 80000,
      covered_compensation_resolved: null,
    });

    const traces = listModuleTraces(db, result.calculation_run_id, "compensation_resolution");
    expect(traces.map((trace) => trace.field_name).sort()).toEqual([
      "average_compensation_resolved",
      "compensation_resolved",
    ]);
  });
});

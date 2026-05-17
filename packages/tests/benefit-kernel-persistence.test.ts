import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
  listResolvedBenefitKernelOutputs,
} from "@pbgc/db";
import { buildBenefitPacketFromFixture, runBenefitKernel } from "@pbgc/benefit-kernel";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";

describe("benefit_kernel sql.js persistence", () => {
  it("persists engine_run, benefit outputs, and trace without downstream outputs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-BK001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-BK001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(result.warning_count).toBe(0);
    expect(result.error_count).toBe(0);

    const outputs = listResolvedBenefitKernelOutputs(db);
    expect(outputs).toHaveLength(1);
    expect(outputs[0]).toMatchObject({
      benefit_kernel_output_id: result.benefit_kernel_output_id,
      term_mb_nrd_nsf: 2500,
      xrd_mb_term: 2500,
      pvmb_term: 198400,
    });

    const traces = listModuleTraces(db, result.calculation_run_id, "benefit_kernel");
    expect(traces.map((trace) => trace.field_name).sort()).toEqual([
      "pvmb_term",
      "term_mb_nrd_nsf",
      "xrd_mb_term",
    ]);
  });
});

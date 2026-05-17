import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
} from "@pbgc/db";
import { buildBenefitPacketFromFixture, runBenefitKernel } from "@pbgc/benefit-kernel";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";

describe("benefit_kernel traceability", () => {
  it("produces trace rows for populated outputs and repeated runs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const inputPacketId = "packet-BK001";

    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
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

    const first = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });
    const second = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });
    expect(first.run_status).toBe("completed");
    expect(second.run_status).toBe("completed");
    expect(first.warning_count).toBe(0);
    expect(second.warning_count).toBe(0);
    expect(listModuleTraces(db, first.calculation_run_id, "benefit_kernel").map((trace) => trace.field_name).sort()).toEqual([
      "pvmb_term",
      "term_mb_nrd_nsf",
      "xrd_mb_term",
    ]);
    expect(listModuleTraces(db, second.calculation_run_id, "benefit_kernel").map((trace) => trace.field_name).sort()).toEqual([
      "pvmb_term",
      "term_mb_nrd_nsf",
      "xrd_mb_term",
    ]);
  });
});

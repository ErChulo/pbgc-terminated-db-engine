import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listResolvedBenefitKernelOutputs,
} from "@pbgc/db";
import { buildBenefitPacketFromFixture, runBenefitKernel } from "@pbgc/benefit-kernel";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";

describe("benefit_kernel validation", () => {
  it("blocks missing required groups and avoids authoritative outputs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    delete brokenPacket.resolved_dates;
    insertEngineInputPacket(db, {
      input_packet_id: "packet-BK001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
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

    expect(result.run_status).toBe("failed");
    expect(result.error_count).toBeGreaterThan(0);
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });
});

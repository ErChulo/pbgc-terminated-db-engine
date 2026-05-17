import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
} from "@pbgc/db";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";

describe("v1_ve_output traceability", () => {
  it("produces trace rows for populated outputs and repeated runs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = buildV1VePacketFromFixture(parseV1VeOutputFixtures()[0]);
    const inputPacketId = "packet-VE001";

    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "v1_ve_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const first = runV1VeOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });
    const second = runV1VeOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(first.run_status).toBe("completed");
    expect(second.run_status).toBe("completed");
    expect(listModuleTraces(db, first.calculation_run_id, "v1_ve_output").length).toBeGreaterThan(0);
    expect(listModuleTraces(db, second.calculation_run_id, "v1_ve_output").length).toBeGreaterThan(0);
  });
});

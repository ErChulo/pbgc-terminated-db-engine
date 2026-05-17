import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
} from "@pbgc/db";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput } from "@pbgc/valuation-listings-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";

describe("valuation_listings_output traceability", () => {
  it("produces trace rows for populated outputs and repeated runs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    const inputPacketId = "packet-VL001";

    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "valuation_listings_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const first = runValuationListingsOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });
    const second = runValuationListingsOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(first.run_status).toBe("completed");
    expect(second.run_status).toBe("completed");
    expect(listModuleTraces(db, first.calculation_run_id, "valuation_listings_output").length).toBeGreaterThan(0);
    expect(listModuleTraces(db, second.calculation_run_id, "valuation_listings_output").length).toBeGreaterThan(0);
  });
});

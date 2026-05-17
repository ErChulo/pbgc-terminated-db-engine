import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import { applyMvpDatabaseFoundation, createSqlJsContextFromStatic, insertEngineInputPacket, listResolvedDatesOutputs } from "@pbgc/db";
import { buildPacketFromFixture, runDateResolution } from "@pbgc/date-resolution";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";

describe("date_resolution sql.js persistence", () => {
  it("persists engine_run and resolved_dates_output for valid fixture packets", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-DR001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "date_resolution",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });
    const result = runDateResolution(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-DR001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });
    expect(result.run_status).toBe("completed");
    expect(listResolvedDatesOutputs(db)).toHaveLength(1);
    expect(listResolvedDatesOutputs(db)[0].nrd).toBe("2025-05-01");
  });
});

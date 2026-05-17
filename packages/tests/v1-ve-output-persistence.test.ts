import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
  listResolvedV1VeOutputs,
} from "@pbgc/db";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";

describe("v1_ve_output sql.js persistence", () => {
  it("persists engine_run, v1_ve_output_row, and trace without downstream adapter rows", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = buildV1VePacketFromFixture(parseV1VeOutputFixtures()[0]);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-VE001",
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

    const result = runV1VeOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-VE001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(listResolvedV1VeOutputs(db)).toHaveLength(1);
    expect(listModuleTraces(db, result.calculation_run_id, "v1_ve_output").length).toBeGreaterThan(0);
    expect(await sqlCount(db, "valuation_listing_output_row")).toBe(0);
    expect(await sqlCount(db, "bsrs_configuration_output_row")).toBe(0);
  });
});

function sqlCount(db: ReturnType<typeof createSqlJsContextFromStatic>["db"], table: string): number {
  const result = db.exec(`SELECT COUNT(*) AS count FROM ${table}`) as Array<{ values: Array<Array<number>> }>;
  return Number(result[0]?.values[0]?.[0] ?? 0);
}

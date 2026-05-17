import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
  listResolvedValuationListingOutputs,
} from "@pbgc/db";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput } from "@pbgc/valuation-listings-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";

describe("valuation_listings_output sql.js persistence", () => {
  it("persists engine_run, valuation_listing_output_row, and trace without downstream adapter rows", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-VL001",
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

    const result = runValuationListingsOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-VL001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(listResolvedValuationListingOutputs(db)).toHaveLength(1);
    expect(listModuleTraces(db, result.calculation_run_id, "valuation_listings_output").length).toBeGreaterThan(0);
    expect(await sqlCount(db, "valuation_listing_output_row")).toBe(1);
    expect(await sqlCount(db, "bsrs_configuration_output_row")).toBe(0);
  });
});

function sqlCount(db: ReturnType<typeof createSqlJsContextFromStatic>["db"], table: string): number {
  const result = db.exec(`SELECT COUNT(*) AS count FROM ${table}`) as Array<{ values: Array<Array<number>> }>;
  return Number(result[0]?.values[0]?.[0] ?? 0);
}

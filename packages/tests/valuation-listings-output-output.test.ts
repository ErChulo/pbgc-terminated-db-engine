import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listResolvedValuationListingOutputs,
} from "@pbgc/db";
import {
  buildValuationListingsPacketFromFixture,
  canonicalDdFieldName,
  hasDdMapping,
  runValuationListingsOutput,
  VALUATION_LISTINGS_OUTPUT_FIELDS,
} from "@pbgc/valuation-listings-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";

describe("valuation_listings_output deterministic outputs", () => {
  it("keeps emitted DD-backed valuation-listings fields covered by DD.csv canonical names", () => {
    const ddCsv = readFileSync(resolve(process.cwd(), "artifacts/mappings/DD.csv"), "utf8");
    const ddFields = new Set(
      ddCsv
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.split(",")[0]?.replace(/^"/, "").replace(/"$/, "").trim())
        .filter((field): field is string => Boolean(field)),
    );

    for (const field of VALUATION_LISTINGS_OUTPUT_FIELDS) {
      if (!hasDdMapping(field)) continue;
      expect(ddFields.has(canonicalDdFieldName(field))).toBe(true);
    }
  });

  it("matches committed expected outputs for the deferred vested path", async () => {
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
    expect(result.output?.row.term_mb_nrd_nsf).toBe(2500);
    expect(result.output?.row.xrd_mb_term).toBe(2500);
    expect(result.output?.row.pvmb_term).toBe(198400);
    expect(result.warning_count).toBe(0);

    const outputs = listResolvedValuationListingOutputs(db);
    expect(outputs).toHaveLength(1);
    expect(JSON.parse(outputs[0].row_json)).toMatchObject({
      term_mb_nrd_nsf: 2500,
      xrd_mb_term: 2500,
      pvmb_term: 198400,
    });
  });

  it("returns explicit null outputs and warnings for the unsupported branch", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[1]);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-VL002",
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
      input_packet_id: "packet-VL002",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(result.output?.row.term_mb_nrd_nsf).toBeNull();
    expect(result.output?.row.xrd_mb_term).toBeNull();
    expect(result.output?.row.pvmb_term).toBeNull();
    expect(result.warning_count).toBeGreaterThan(0);
    expect(result.warnings.map((warning) => warning.code)).toContain("NULL_OUTPUT_FIELD");
  });
});

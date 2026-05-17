import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listResolvedV1VeOutputs,
  listV1VeRunsWithTrace,
} from "@pbgc/db";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";

function seedPacket(db: ReturnType<typeof createSqlJsContextFromStatic>["db"], fixtureIndex: number): { case_id: string; subject_key: string } {
  const packet = buildV1VePacketFromFixture(parseV1VeOutputFixtures()[fixtureIndex]);
  insertEngineInputPacket(db, {
    input_packet_id: `packet-${fixtureIndex}`,
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
  return { case_id: packet.case_id, subject_key: packet.subject_key };
}

describe("v1_ve_output deterministic outputs", () => {
  it("matches committed expected outputs for the deferred vested path", async () => {
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
    expect(result.output?.row.term_mb_nrd_nsf).toBe(2500);
    expect(result.output?.row.xrd_mb_term).toBe(2500);
    expect(result.output?.row.pvmb_term).toBe(198400);
    expect(result.warning_count).toBe(0);

    const outputs = listResolvedV1VeOutputs(db);
    expect(outputs).toHaveLength(1);
    expect(JSON.parse(outputs[0].row_json)).toMatchObject({
      term_mb_nrd_nsf: 2500,
      xrd_mb_term: 2500,
      pvmb_term: 198400,
    });
  });

  it("returns explicit null outputs and warnings for the unsupported benefit branch", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = buildV1VePacketFromFixture(parseV1VeOutputFixtures()[1]);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-VE002",
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
      input_packet_id: "packet-VE002",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(result.output?.row.term_mb_nrd_nsf).toBeNull();
    expect(result.output?.row.xrd_mb_term).toBeNull();
    expect(result.output?.row.pvmb_term).toBeNull();
    expect(result.warning_count).toBeGreaterThan(0);
    expect(result.warnings.map((warning) => warning.code)).toContain("NULL_OUTPUT_FIELD");
    expect(listV1VeRunsWithTrace(db)).toHaveLength(1);
  });
});

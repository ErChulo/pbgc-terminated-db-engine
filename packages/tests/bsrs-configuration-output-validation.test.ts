import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
} from "@pbgc/db";
import {
  buildBsrsConfigurationPacketFromFixture,
  runBsrsConfiguration,
  type BsrsConfigurationOutputPacket,
} from "@pbgc/bsrs-configuration-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

function makePacket(overrides: Partial<BsrsConfigurationOutputPacket> = {}): BsrsConfigurationOutputPacket {
  resetDeterminismForTests();
  const fixture = parseBsrsConfigurationFixtures()[0];
  const base = buildBsrsConfigurationPacketFromFixture(fixture);
  return { ...base, ...overrides } as BsrsConfigurationOutputPacket;
}

async function runPacket(packet: BsrsConfigurationOutputPacket) {
  resetDeterminismForTests();
  const SQL = await initSqlJs();
  const { db } = createSqlJsContextFromStatic(SQL);
  applyMvpDatabaseFoundation(db);
  const inputPacketId = "packet-test";
  insertEngineInputPacket(db, {
    input_packet_id: inputPacketId,
    case_id: packet.case_id,
    subject_key: packet.subject_key,
    subject_type: packet.subject_type,
    packet_type: "bsrs_configuration_output",
    schema_version: "0.1.0",
    packet_json: JSON.stringify(packet),
    built_from_resolved_at: null,
    built_by: "test",
    built_at: currentTimestamp(),
    status: "active",
  });
  return runBsrsConfiguration(db, {
    case_id: packet.case_id,
    subject_type: packet.subject_type,
    subject_key: packet.subject_key,
    input_packet_id: inputPacketId,
    rule_version: "0.1.0",
    deliverable_version: "0.1.0",
  });
}

describe("bsrs_configuration_output validation (US2)", () => {
  it("T039: rejects blank non-nullable string fields", async () => {
    const packet = makePacket();
    (packet.case_plan_timeline as Record<string, unknown>).plan_id = "   ";
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.errors.some((e) => e.code === "BLANK_FIELD_VALUE")).toBe(true);
  });

  it("T039: rejects malformed numeric values", async () => {
    const packet = makePacket();
    (packet.resolved_service_compensation as Record<string, unknown>).accrual_service_resolved = -1;
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.errors.some((e) => e.code === "MALFORMED_NUMERIC_VALUE")).toBe(true);
  });

  it("T039: rejects unsupported statement_row_type", async () => {
    const packet = makePacket();
    (packet as Record<string, unknown>).statement_row_type = "invalid_row_type";
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.errors.some((e) => e.code === "UNSUPPORTED_CONTROLLED_RULE")).toBe(true);
  });

  it("T039: rejects unsupported calc_indicator", async () => {
    const packet = makePacket();
    (packet.limitation_packet as Record<string, unknown>).calc_indicator = "X";
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.errors.some((e) => e.code === "UNSUPPORTED_CONTROLLED_RULE")).toBe(true);
  });

  it("T039: requires in_pay_packet when current_pay_status is in_pay", async () => {
    const packet = makePacket();
    packet.benefit_administration_state.current_pay_status = "in_pay";
    delete (packet as Partial<BsrsConfigurationOutputPacket>).in_pay_packet;
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.errors.some((e) => e.code === "MISSING_CONDITIONAL_PACKET")).toBe(true);
  });

  it("T039: requires qdro_packet when qdro_indicator is true", async () => {
    const packet = makePacket();
    packet.participant_role_population.qdro_indicator = true;
    delete (packet as Partial<BsrsConfigurationOutputPacket>).qdro_packet;
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.errors.some((e) => e.code === "MISSING_CONDITIONAL_PACKET")).toBe(true);
  });

  it("T039: requires qpsa_packet when qpsa_indicator is true", async () => {
    const packet = makePacket();
    packet.participant_role_population.qpsa_indicator = true;
    delete (packet as Partial<BsrsConfigurationOutputPacket>).qpsa_packet;
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.errors.some((e) => e.code === "MISSING_CONDITIONAL_PACKET")).toBe(true);
  });

  it("T039: requires death_benefit_packet when statement_row_type is survivor", async () => {
    const packet = makePacket();
    (packet as Record<string, unknown>).statement_row_type = "survivor";
    delete (packet as Partial<BsrsConfigurationOutputPacket>).death_benefit_packet;
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.errors.some((e) => e.code === "MISSING_CONDITIONAL_PACKET")).toBe(true);
  });

  it("T040: persists failed runs with structured errors and no output row", async () => {
    const packet = makePacket();
    (packet.case_plan_timeline as Record<string, unknown>).plan_id = "   ";
    const result = await runPacket(packet);
    expect(result.run_status).toBe("failed");
    expect(result.error_count).toBeGreaterThan(0);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.output).toBeUndefined();
  });

  it("T040: produces deterministic errors for the same invalid packet", async () => {
    const packet = makePacket();
    (packet.case_plan_timeline as Record<string, unknown>).plan_id = "   ";
    const first = await runPacket(packet);
    const second = await runPacket(packet);
    expect(first.errors.map((e) => e.code).sort()).toEqual(second.errors.map((e) => e.code).sort());
  });
});

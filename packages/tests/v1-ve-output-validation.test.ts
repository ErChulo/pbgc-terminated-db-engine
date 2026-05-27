import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listResolvedV1VeOutputs,
} from "@pbgc/db";
import { buildV1VePacketFromFixture, runV1VeOutput, validateV1VeOutputPacket } from "@pbgc/v1-ve-output";
import type { V1VeOutputPacket } from "@pbgc/v1-ve-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";

function makeValidPacket(): V1VeOutputPacket {
  return buildV1VePacketFromFixture(parseV1VeOutputFixtures()[0]);
}

describe("v1_ve_output validation", () => {
  it("T037: blocks missing required groups and avoids authoritative outputs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = makeValidPacket();
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    delete brokenPacket.resolved_dates;

    insertEngineInputPacket(db, {
      input_packet_id: "packet-VE001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "v1_ve_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
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

    expect(result.run_status).toBe("failed");
    expect(result.error_count).toBeGreaterThan(0);
    expect(listResolvedV1VeOutputs(db)).toHaveLength(0);
  });

  it("T038: blocks missing upstream benefit_kernel_output group", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = makeValidPacket();
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    delete brokenPacket.benefit_kernel_output;

    insertEngineInputPacket(db, {
      input_packet_id: "packet-VE038",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "v1_ve_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runV1VeOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-VE038",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.errors.map((e) => e.code)).toContain("MISSING_INPUT_GROUP");
    expect(listResolvedV1VeOutputs(db)).toHaveLength(0);
  });

  it("T039: blocks blank strings and malformed numeric values", () => {
    const packet = makeValidPacket();
    const broken = JSON.parse(JSON.stringify(packet)) as V1VeOutputPacket;

    broken.case_plan_timeline.case_id = "";
    broken.participant_role_population.fname = "   ";

    const errors = validateV1VeOutputPacket(broken, "packet-T039", "0.1.0");
    expect(errors.map((e) => e.code)).toContain("BLANK_FIELD_VALUE");
  });

  it("T040: blocks unsupported controlled rules", () => {
    const packet = makeValidPacket();
    const broken = JSON.parse(JSON.stringify(packet)) as V1VeOutputPacket;

    broken.limitation_packet.calc_indicator = "X";
    broken.limitation_packet.calculation_context = "unknown_context";

    const errors = validateV1VeOutputPacket(broken, "packet-T040", "0.1.0");
    expect(errors.map((e) => e.code)).toContain("UNSUPPORTED_CONTROLLED_RULE");
  });

  it("T041: blocks missing conditional packets for in-pay inconsistency", () => {
    const packet = makeValidPacket();
    const broken = JSON.parse(JSON.stringify(packet)) as V1VeOutputPacket;

    broken.resolved_forms_status.annuity_status_pay = "in_pay";
    broken.benefit_administration_state.current_pay_status = "not_in_pay";

    const errors = validateV1VeOutputPacket(broken, "packet-T041a", "0.1.0");
    expect(errors.map((e) => e.code)).toContain("MISSING_CONDITIONAL_PACKET");
  });

  it("T041: blocks missing conditional packets for QDRO with no branch state", () => {
    const packet = makeValidPacket();
    const broken = JSON.parse(JSON.stringify(packet)) as V1VeOutputPacket;

    broken.participant_role_population.qdro_indicator = true;
    broken.resolved_forms_status.bs_ind = null;
    broken.resolved_forms_status.br_ind = null;

    const errors = validateV1VeOutputPacket(broken, "packet-T041b", "0.1.0");
    expect(errors.map((e) => e.code)).toContain("MISSING_CONDITIONAL_PACKET");
  });

  it("T041: blocks missing conditional packets for QPSA with null form codes", () => {
    const packet = makeValidPacket();
    const broken = JSON.parse(JSON.stringify(packet)) as V1VeOutputPacket;

    broken.participant_role_population.qpsa_indicator = true;
    broken.resolved_forms_status.form_code_ptp_qpsa = null;
    broken.resolved_forms_status.form_code_death = null;

    const errors = validateV1VeOutputPacket(broken, "packet-T041c", "0.1.0");
    expect(errors.map((e) => e.code)).toContain("MISSING_CONDITIONAL_PACKET");
  });

  it("T042: persists failed engine_run without v1_ve_output_row on invalid packet", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = makeValidPacket();
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    delete brokenPacket.resolved_service_compensation;

    insertEngineInputPacket(db, {
      input_packet_id: "packet-T042",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "v1_ve_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runV1VeOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-T042",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.error_count).toBeGreaterThan(0);
    expect(result.v1_ve_output_row_id).toBeUndefined();
    expect(listResolvedV1VeOutputs(db)).toHaveLength(0);
  });
});

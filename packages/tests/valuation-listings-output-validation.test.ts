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
  runValuationListingsOutput,
  validateValuationListingsOutputPacket,
  type ValuationListingsOutputPacket,
} from "@pbgc/valuation-listings-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";

describe("valuation_listings_output validation", () => {
  it("rejects packets with missing required groups", () => {
    resetDeterminismForTests();
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    const broken = { ...packet } as Partial<ValuationListingsOutputPacket> & Record<string, unknown>;
    delete broken.case_plan_timeline;
    const errors = validateValuationListingsOutputPacket(
      broken as ValuationListingsOutputPacket,
      "packet-VL-ERR",
      "0.1.0",
    );
    expect(errors.map((e) => e.code)).toContain("MISSING_INPUT_GROUP");
  });

  it("rejects packets with missing upstream output group", () => {
    resetDeterminismForTests();
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    const broken = { ...packet } as Partial<ValuationListingsOutputPacket> & Record<string, unknown>;
    delete broken.benefit_kernel_output;
    const errors = validateValuationListingsOutputPacket(
      broken as ValuationListingsOutputPacket,
      "packet-VL-ERR",
      "0.1.0",
    );
    expect(errors.map((e) => e.code)).toContain("MISSING_INPUT_GROUP");
  });

  it("rejects blank strings in non-nullable fields", () => {
    resetDeterminismForTests();
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    packet.participant_role_population.fname = "  ";
    const errors = validateValuationListingsOutputPacket(packet, "packet-VL-ERR", "0.1.0");
    expect(errors.map((e) => e.code)).toContain("BLANK_FIELD_VALUE");
  });

  it("rejects malformed numeric values", () => {
    resetDeterminismForTests();
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    packet.benefit_administration_state.current_payment_amount = -1;
    const errors = validateValuationListingsOutputPacket(packet, "packet-VL-ERR", "0.1.0");
    expect(errors.map((e) => e.code)).toContain("MALFORMED_NUMERIC_VALUE");
  });

  it("rejects unsupported listing_row_type", () => {
    resetDeterminismForTests();
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    packet.listing_row_type = "invalid_type" as never;
    const errors = validateValuationListingsOutputPacket(packet, "packet-VL-ERR", "0.1.0");
    expect(errors.map((e) => e.code)).toContain("UNSUPPORTED_CONTROLLED_RULE");
  });

  it("requires in-pay conditional data when current_pay_status is in_pay", () => {
    resetDeterminismForTests();
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    packet.benefit_administration_state.current_pay_status = "in_pay";
    packet.benefit_administration_state.current_payment_amount = null;
    const errors = validateValuationListingsOutputPacket(packet, "packet-VL-ERR", "0.1.0");
    expect(errors.some((e) => e.code === "MISSING_CONDITIONAL_PACKET")).toBe(true);
  });

  it("requires QPSA form code when qpsa_indicator is true", () => {
    resetDeterminismForTests();
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    packet.participant_role_population.qpsa_indicator = true;
    packet.resolved_forms_status.form_code_ptp_qpsa = null;
    const errors = validateValuationListingsOutputPacket(packet, "packet-VL-ERR", "0.1.0");
    expect(errors.some((e) => e.code === "MISSING_CONDITIONAL_PACKET")).toBe(true);
  });

  it("persists failed engine_run without authoritative output row", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[0]);
    const broken = { ...packet } as Partial<ValuationListingsOutputPacket> & Record<string, unknown>;
    delete broken.v1_ve_output_row;
    const inputPacketId = "packet-VL-FAIL";

    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "valuation_listings_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(broken),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runValuationListingsOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.error_count).toBeGreaterThan(0);
    expect(listResolvedValuationListingOutputs(db)).toHaveLength(0);
  });
});

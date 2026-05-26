import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listResolvedBenefitKernelOutputs,
} from "@pbgc/db";
import { buildBenefitPacketFromFixture, runBenefitKernel } from "@pbgc/benefit-kernel";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";

describe("benefit_kernel validation", () => {
  it("T037 blocks missing required groups and avoids authoritative outputs", async () => {
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    delete (brokenPacket as any).resolved_dates;
    insertEngineInputPacket(db, {
      input_packet_id: "packet-BK001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-BK001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.error_count).toBeGreaterThan(0);
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });

  it("T038 blocks missing upstream date, service, compensation, and form output groups", async () => {
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    delete (brokenPacket as any).resolved_service_compensation;
    insertEngineInputPacket(db, {
      input_packet_id: "packet-T038",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-T038",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.errors.map((e) => e.code)).toContain("MISSING_INPUT_GROUP");
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });

  it("T039 blocks blank strings and malformed numeric values", async () => {
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));

    // Blank string in a required field
    (brokenPacket as any).case_plan_timeline.case_id = "  ";

    // Malformed number in a numeric field
    (brokenPacket as any).service_employment_history.benefit_service_at_dopt = "not_a_number";

    insertEngineInputPacket(db, {
      input_packet_id: "packet-T039",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-T039",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    const codes = result.errors.map((e) => e.code);
    expect(codes).toContain("BLANK_FIELD_VALUE");
    expect(codes).toContain("MALFORMED_NUMERIC_VALUE");
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });

  it("T040 blocks unsupported formula, limitation, and present-value controlled rules", async () => {
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));

    (brokenPacket as any).resolved_plan_logic.accrued_benefit_formula = "cash_balance";
    (brokenPacket as any).resolved_plan_logic.normal_single_form_rule = "j_and_s_50";

    insertEngineInputPacket(db, {
      input_packet_id: "packet-T040",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-T040",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    const codes = result.errors.map((e) => e.code);
    expect(codes).toContain("UNSUPPORTED_CONTROLLED_RULE");
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });

  it("T041 blocks missing conditional packets", async () => {
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));

    // Set section_436 trigger without the conditional packet
    brokenPacket.limitation_packet.section_436_applicable_indicator = true;
    delete (brokenPacket as any).section_436_packet;

    insertEngineInputPacket(db, {
      input_packet_id: "packet-T041",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-T041",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.errors.map((e) => e.code)).toContain("MISSING_CONDITIONAL_PACKET");
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });

  it("T041 blocks missing QPSA conditional packet when qpsa_indicator is true (T041b)", async () => {
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[2]; // BK003 with QPSA
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    delete (brokenPacket as any).qpsa_packet;

    insertEngineInputPacket(db, {
      input_packet_id: "packet-T041b",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-T041b",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.errors.map((e) => e.code)).toContain("MISSING_CONDITIONAL_PACKET");
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });

  it("T041 blocks missing in_pay_packet when current_pay_status is in_pay (T041c)", async () => {
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    brokenPacket.benefit_administration_state.current_pay_status = "in_pay";
    delete (brokenPacket as any).in_pay_packet;

    insertEngineInputPacket(db, {
      input_packet_id: "packet-T041c",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-T041c",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.errors.map((e) => e.code)).toContain("MISSING_CONDITIONAL_PACKET");
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });

  it("T042 verifies failed validation runs produce engine_run but no benefit_kernel_output", async () => {
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBenefitKernelFixtures()[0];
    const packet = buildBenefitPacketFromFixture(fixture);
    const brokenPacket = JSON.parse(JSON.stringify(packet));
    delete (brokenPacket as any).resolved_dates;

    insertEngineInputPacket(db, {
      input_packet_id: "packet-T042",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(brokenPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-T042",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("failed");
    expect(result.error_count).toBeGreaterThan(0);
    // Failed run should not produce an output
    expect(result.output).toBeUndefined();
    // Database should have no benefit_kernel_output rows
    expect(listResolvedBenefitKernelOutputs(db)).toHaveLength(0);
  });
});

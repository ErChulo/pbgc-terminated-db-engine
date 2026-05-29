import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
} from "@pbgc/db";
import {
  buildBsrsConfigurationPacketFromFixture,
  resolveBranchContext,
  resolveBranchNulls,
  runBsrsConfiguration,
  type BsrsConfigurationOutputPacket,
} from "@pbgc/bsrs-configuration-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("bsrs_configuration_output conditional nullability", () => {
  it("resolves in-pay branch context from packet correctly (T038)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);

    const context = resolveBranchContext(packet);

    // The first fixture is a standard participant (not in_pay, not survivor)
    expect(context.isInPay).toBe(false);
    expect(context.isSurvivor).toBe(false);
    expect(context.isQdro).toBe(false);
    expect(context.isQpsa).toBe(false);
    expect(context.isSuppressed).toBe(false);
    expect(context.hasOverride).toBe(false);
  });

  it("sets explicit nulls for in-pay ARD fields when not in pay (T038)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);

    // Modify packet to not be in-pay
    const nonInPayPacket: BsrsConfigurationOutputPacket = {
      ...packet,
      benefit_administration_state: {
        ...packet.benefit_administration_state,
        current_pay_status: "not_in_pay",
      },
    };

    const context = resolveBranchContext(nonInPayPacket);
    const result = resolveBranchNulls(nonInPayPacket, context, "packet-TEST", "0.1.0");

    // non-in-pay: ARD fields should be in explicitNulls
    expect(result.explicitNulls.has("form_code_ard")).toBe(true);
    expect(result.explicitNulls.has("spc_ard")).toBe(true);
    expect(result.explicitNulls.has("mths_ard")).toBe(true);
    expect(result.explicitNulls.has("lev_mb_ard")).toBe(true);
    expect(result.explicitNulls.has("current_payment_amount")).toBe(true);
  });

  it("preserves explicit nulls in suppressed row branches (T038)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);

    // Simulate a suppressed row
    const suppressedPacket: BsrsConfigurationOutputPacket = {
      ...packet,
      statement_row_type: "suppressed",
    };

    const context = resolveBranchContext(suppressedPacket);
    const result = resolveBranchNulls(suppressedPacket, context, "packet-TEST", "0.1.0");

    // Suppressed: display fields should be explicit nulls
    expect(result.explicitNulls.has("display_form_code")).toBe(true);
    expect(result.explicitNulls.has("display_monthly_amount")).toBe(true);
    expect(result.explicitNulls.has("display_survivor_amount")).toBe(true);
    expect(result.explicitNulls.has("display_lump_sum_amount")).toBe(true);
    expect(result.explicitNulls.has("benefit_effective_date_for_statement")).toBe(true);
  });

  it("preserves explicit nulls for survivor-only fields in non-survivor branches (T038)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    // Default is participant (not survivor)

    const context = resolveBranchContext(packet);
    const result = resolveBranchNulls(packet, context, "packet-TEST", "0.1.0");

    // Non-survivor: spouse fields should be explicit nulls
    expect(result.explicitNulls.has("sfname")).toBe(true);
    expect(result.explicitNulls.has("slname")).toBe(true);
    expect(result.explicitNulls.has("ssex")).toBe(true);
    expect(result.explicitNulls.has("sdob")).toBe(true);
    expect(result.explicitNulls.has("relation")).toBe(true);
  });

  it("does not alter non-conditional fields when applying branch nulls (T038)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);

    const context = resolveBranchContext(packet);
    const result = resolveBranchNulls(packet, context, "packet-TEST", "0.1.0");

    // Core identity fields should NOT be in the explicit nulls set
    expect(result.explicitNulls.has("case_id")).toBe(false);
    expect(result.explicitNulls.has("plan_id")).toBe(false);
    expect(result.explicitNulls.has("fname")).toBe(false);
    expect(result.explicitNulls.has("lname")).toBe(false);
    expect(result.explicitNulls.has("retstat")).toBe(false);
  });

  it("completes full run with explicit nulls preserved in output row (T038)", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);

    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);

    // Modify to not be in-pay so ARD fields are explicit nulls
    const nonInPayPacket: BsrsConfigurationOutputPacket = {
      ...packet,
      benefit_administration_state: {
        ...packet.benefit_administration_state,
        current_pay_status: "not_in_pay",
      },
      in_pay_packet: undefined,
    };

    insertEngineInputPacket(db, {
      input_packet_id: "packet-COND-TEST",
      case_id: nonInPayPacket.case_id,
      subject_key: fixture.test_case_id,
      subject_type: nonInPayPacket.subject_type,
      packet_type: "bsrs_configuration_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(nonInPayPacket),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBsrsConfiguration(db, {
      case_id: nonInPayPacket.case_id,
      subject_type: nonInPayPacket.subject_type,
      subject_key: fixture.test_case_id,
      input_packet_id: "packet-COND-TEST",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(result.output).toBeDefined();

    // Non-in-pay: ARD fields should be explicit nulls in the output row
    expect(result.output!.row.form_code_ard).toBeNull();
    expect(result.output!.row.spc_ard).toBeNull();
    expect(result.output!.row.mths_ard).toBeNull();
    expect(result.output!.row.lev_mb_ard).toBeNull();
    expect(result.output!.row.current_payment_amount).toBeNull();

    // Non-survivor: spouse fields should be null
    expect(result.output!.row.sfname).toBeNull();
    expect(result.output!.row.slname).toBeNull();
    expect(result.output!.row.ssex).toBeNull();
    expect(result.output!.row.sdob).toBeNull();
    expect(result.output!.row.relation).toBeNull();

    // Core identity fields should still be populated
    expect(result.output!.row.case_id.length).toBeGreaterThan(0);
    expect(result.output!.row.fname.length).toBeGreaterThan(0);
    expect(result.output!.row.lname.length).toBeGreaterThan(0);
  });
});

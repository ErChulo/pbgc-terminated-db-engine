import { describe, expect, it } from "vitest";
import { buildFormPacketFromFixture, validateFormResolutionPacket } from "@pbgc/form-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import type { FormResolutionPacket } from "@pbgc/form-resolution";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";

describe("form_resolution validation (US2)", () => {
  it("rejects a packet with a missing required group", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    delete (packet as Record<string, unknown>).case_plan_timeline;
    const errors = validateFormResolutionPacket(packet, "packet-T037", "0.1.0");
    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("MISSING_INPUT_GROUP");
    expect(errors[0].input_group).toBe("case_plan_timeline");
  });

  it("rejects a packet with a blank string instead of a required value", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.resolved_plan_logic as Record<string, unknown>).normal_single_form_rule = "";
    const errors = validateFormResolutionPacket(packet, "packet-T038", "0.1.0");
    const blankError = errors.find((e) => e.field_name === "normal_single_form_rule");
    expect(blankError).toBeDefined();
    expect(blankError!.code).toBe("BLANK_FIELD_VALUE");
  });

  it("rejects a packet with a missing required field in a group", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    delete (packet.participant_role_population as Record<string, unknown>).retstat;
    const errors = validateFormResolutionPacket(packet, "packet-T038b", "0.1.0");
    const missingField = errors.find((e) => e.field_name === "retstat");
    expect(missingField).toBeDefined();
    expect(missingField!.code).toBe("BLANK_FIELD_VALUE");
  });

  it("rejects a packet with an unsupported normal single form rule", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.resolved_plan_logic as Record<string, unknown>).normal_single_form_rule = "jla";
    const errors = validateFormResolutionPacket(packet, "packet-T039", "0.1.0");
    const unsupported = errors.find((e) => e.code === "UNSUPPORTED_FORM_RULE");
    expect(unsupported).toBeDefined();
    expect(unsupported!.field_name).toBe("normal_single_form_rule");
  });

  it("rejects a packet with an unsupported death benefit rule", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.resolved_plan_logic as Record<string, unknown>).pre_retirement_death_benefit_rule = "death_before_retirement";
    const errors = validateFormResolutionPacket(packet, "packet-T039b", "0.1.0");
    const unsupported = errors.find((e) => e.code === "UNSUPPORTED_FORM_RULE" && e.field_name === "pre_retirement_death_benefit_rule");
    expect(unsupported).toBeDefined();
  });

  it("rejects a packet with an unsupported lump sum rule", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.resolved_plan_logic as Record<string, unknown>).consensual_lump_sum_rule = "available";
    const errors = validateFormResolutionPacket(packet, "packet-T039c", "0.1.0");
    const unsupported = errors.find((e) => e.code === "UNSUPPORTED_FORM_RULE" && e.field_name === "consensual_lump_sum_rule");
    expect(unsupported).toBeDefined();
  });

  it("rejects a packet with blank string in a nullable field that has explicit null semantics", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.benefit_administration_state as Record<string, unknown>).current_form_code = "   ";
    const errors = validateFormResolutionPacket(packet, "packet-T038c", "0.1.0");
    const blank = errors.find((e) => e.field_name === "current_form_code");
    expect(blank).toBeDefined();
    expect(blank!.code).toBe("BLANK_FIELD_VALUE");
  });

  it("rejects a packet with conflicting pay status (in_pay but no in_pay_packet)", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.benefit_administration_state as Record<string, unknown>).current_pay_status = "in_pay";
    delete (packet as Record<string, unknown>).in_pay_packet;
    const errors = validateFormResolutionPacket(packet, "packet-T041", "0.1.0");
    const missing = errors.find((e) => e.code === "MISSING_CONDITIONAL_PACKET");
    expect(missing).toBeDefined();
  });

  it("rejects a packet with QPSA indicator true but no QPSA packet", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.participant_role_population as Record<string, unknown>).qpsa_indicator = true;
    delete (packet as Record<string, unknown>).qpsa_packet;
    const errors = validateFormResolutionPacket(packet, "packet-T041b", "0.1.0");
    const missing = errors.find((e) => e.code === "MISSING_CONDITIONAL_PACKET" && e.input_group === "participant_role_population");
    expect(missing).toBeDefined();
  });

  it("rejects a packet with QDRO indicator true but no QDRO packet", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.participant_role_population as Record<string, unknown>).qdro_indicator = true;
    delete (packet as Record<string, unknown>).qdro_packet;
    const errors = validateFormResolutionPacket(packet, "packet-T041c", "0.1.0");
    const missing = errors.find((e) => e.code === "MISSING_CONDITIONAL_PACKET" && e.input_group === "participant_role_population");
    expect(missing).toBeDefined();
  });

  it("rejects a packet with malformed boolean field (string instead of boolean)", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    (packet.participant_role_population as Record<string, unknown>).qdro_indicator = "true";
    const errors = validateFormResolutionPacket(packet, "packet-malformed-bool", "0.1.0");
    const malformed = errors.find((e) => e.code === "MALFORMED_BOOLEAN");
    expect(malformed).toBeDefined();
    expect(malformed!.field_name).toBe("qdro_indicator");
  });

  it("accepts a valid fixture packet with no errors", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    const errors = validateFormResolutionPacket(packet, "packet-FR001", "0.1.0");
    expect(errors).toHaveLength(0);
  });

  it("accepts a fixture packet with supported nullable fields as null", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    expect(packet.benefit_administration_state.current_form_code).toBeNull();
    const errors = validateFormResolutionPacket(packet, "packet-FR001-nullable", "0.1.0");
    expect(errors).toHaveLength(0);
  });
});

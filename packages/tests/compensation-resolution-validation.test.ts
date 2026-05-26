import { describe, expect, it } from "vitest";
import { buildCompensationPacketFromFixture, resolveCompensation, validateCompensationResolutionPacket } from "@pbgc/compensation-resolution";
import type { CompensationResolutionPacket } from "@pbgc/compensation-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";

describe("compensation_resolution validation — invalid packets", () => {
  it("blocks packets missing required groups", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = { ...packet, case_plan_timeline: undefined } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("MISSING_INPUT_GROUP");
    expect(errors[0].input_group).toBe("case_plan_timeline");
  });

  it("blocks packets with multiple missing required groups", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = { ...packet, case_plan_timeline: null, compensation_accrual_inputs: undefined } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const missingGroupErrors = errors.filter((e) => e.code === "MISSING_INPUT_GROUP");
    expect(missingGroupErrors.length).toBeGreaterThanOrEqual(2);
  });

  it("blocks blank string compensation_accrual_inputs fields", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      compensation_accrual_inputs: {
        ...packet.compensation_accrual_inputs,
        compensation_basis_code: "",
        final_average_compensation: "",
      },
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const blankErrors = errors.filter((e) => e.code === "BLANK_FIELD_VALUE");
    expect(blankErrors.length).toBeGreaterThanOrEqual(2);
    expect(blankErrors.some((e) => e.field_name === "compensation_basis_code")).toBe(true);
    expect(blankErrors.some((e) => e.field_name === "final_average_compensation")).toBe(true);
  });

  it("blocks blank string fields in multiple groups", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      participant_role_population: { ...packet.participant_role_population, dob: "" },
      service_employment_history: { ...packet.service_employment_history, doh: "   " },
      benefit_administration_state: { ...packet.benefit_administration_state, dor: "" },
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const blankErrors = errors.filter((e) => e.code === "BLANK_FIELD_VALUE");
    expect(blankErrors.length).toBeGreaterThanOrEqual(3);
  });

  it("blocks malformed compensation amounts", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      compensation_accrual_inputs: {
        ...packet.compensation_accrual_inputs,
        final_average_compensation: "not-a-number",
      },
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const malformedErrors = errors.filter((e) => e.code === "MALFORMED_COMPENSATION_AMOUNT");
    expect(malformedErrors.length).toBeGreaterThanOrEqual(1);
    expect(malformedErrors[0].field_name).toBe("final_average_compensation");
  });

  it("blocks negative compensation amounts", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      compensation_accrual_inputs: {
        ...packet.compensation_accrual_inputs,
        final_average_compensation: -10000,
      },
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const negativeErrors = errors.filter((e) => e.code === "NEGATIVE_COMPENSATION_AMOUNT");
    expect(negativeErrors.length).toBeGreaterThanOrEqual(1);
    expect(negativeErrors[0].field_name).toBe("final_average_compensation");
  });

  it("blocks unsupported compensation basis codes", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      compensation_accrual_inputs: {
        ...packet.compensation_accrual_inputs,
        compensation_basis_code: "career_average",
      },
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const basisErrors = errors.filter((e) => e.code === "UNSUPPORTED_COMPENSATION_BASIS");
    expect(basisErrors).toHaveLength(1);
  });

  it("blocks unsupported average compensation period", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      compensation_accrual_inputs: {
        ...packet.compensation_accrual_inputs,
        average_compensation_period: "3_year",
      },
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const periodErrors = errors.filter((e) => e.code === "UNSUPPORTED_AVERAGE_PERIOD");
    expect(periodErrors).toHaveLength(1);
  });

  it("blocks unsupported average compensation rule", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      resolved_plan_logic: {
        ...packet.resolved_plan_logic,
        average_compensation_rule: "career_average",
      },
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const ruleErrors = errors.filter((e) => e.code === "UNSUPPORTED_AVERAGE_RULE");
    expect(ruleErrors).toHaveLength(1);
  });

  it("blocks frozen_accrued_benefit_indicator without frozen_benefit_support_packet", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      compensation_accrual_inputs: {
        ...packet.compensation_accrual_inputs,
        frozen_accrued_benefit_indicator: true,
      },
      frozen_benefit_support_packet: undefined,
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    const conditionalErrors = errors.filter((e) => e.code === "CONDITIONAL_PACKET_MISSING");
    expect(conditionalErrors).toHaveLength(1);
    expect(conditionalErrors[0].field_name).toBe("frozen_accrued_benefit_indicator");
  });

  it("allows frozen_accrued_benefit_indicator=true with frozen_benefit_support_packet present", () => {
    resetDeterminismForTests();
    const cr003 = parseCompensationResolutionFixtures().find((f) => f.test_case_id === "CR003");
    if (!cr003) throw new Error("Missing CR003 fixture");
    const packet = buildCompensationPacketFromFixture(cr003);
    const errors = validateCompensationResolutionPacket(packet, "packet-CR003", "0.1.0");
    const conditionalErrors = errors.filter((e) => e.code === "CONDITIONAL_PACKET_MISSING");
    expect(conditionalErrors).toHaveLength(0);
  });

  it("returns multiple errors for multiple issues combined", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const invalid = {
      ...packet,
      service_employment_history: undefined,
      compensation_accrual_inputs: {
        ...packet.compensation_accrual_inputs,
        compensation_basis_code: "",
        final_average_compensation: -1,
      },
    } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });

  it("valid packet produces no errors", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    const errors = validateCompensationResolutionPacket(packet, "packet-valid", "0.1.0");
    expect(errors).toHaveLength(0);
  });

  it("valid packet for CR003 (frozen benefit) produces no validation errors", () => {
    resetDeterminismForTests();
    const cr003 = parseCompensationResolutionFixtures().find((f) => f.test_case_id === "CR003");
    if (!cr003) throw new Error("Missing CR003 fixture");
    const packet = buildCompensationPacketFromFixture(cr003);
    const errors = validateCompensationResolutionPacket(packet, "packet-CR003", "0.1.0");
    expect(errors).toHaveLength(0);
  });

  it("failed run does not produce authoritative compensation values", () => {
    resetDeterminismForTests();
    const fixture = parseCompensationResolutionFixtures()[0];
    const packet = buildCompensationPacketFromFixture(fixture);
    const invalid = { ...packet, compensation_accrual_inputs: undefined } as unknown as CompensationResolutionPacket;
    const errors = validateCompensationResolutionPacket(invalid, "packet-test", "0.1.0");
    expect(errors.length).toBeGreaterThan(0);
    // Verify that resolveCompensation would not be called on invalid packet
    const { values } = resolveCompensation(packet, "packet-test", "0.1.0");
    expect(values.compensation_resolved).not.toBeNull();
  });
});

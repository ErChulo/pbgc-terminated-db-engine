import { describe, expect, it } from "vitest";
import { buildPacketFromFixture, validateDateResolutionPacket } from "@pbgc/date-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";
import type { DateResolutionPacket } from "@pbgc/date-resolution";

describe("date_resolution invalid packet rejection", () => {
  it("rejects a packet missing case_plan_timeline", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    delete (broken as Record<string, unknown>).case_plan_timeline;
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("MISSING_REQUIRED_GROUP");
    expect(errors[0].input_group).toBe("case_plan_timeline");
  });

  it("rejects a packet missing resolved_plan_logic", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    delete (broken as Record<string, unknown>).resolved_plan_logic;
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("MISSING_REQUIRED_GROUP");
    expect(errors[0].input_group).toBe("resolved_plan_logic");
  });

  it("rejects a packet missing participant_role_population", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    delete (broken as Record<string, unknown>).participant_role_population;
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("MISSING_REQUIRED_GROUP");
    expect(errors[0].input_group).toBe("participant_role_population");
  });

  it("rejects a packet missing service_employment_history", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    delete (broken as Record<string, unknown>).service_employment_history;
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe("MISSING_REQUIRED_GROUP");
  });

  it("rejects a packet with null required groups", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const broken: DateResolutionPacket = {
      ...packet,
      case_plan_timeline: null as unknown as DateResolutionPacket["case_plan_timeline"],
    };
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "MISSING_REQUIRED_GROUP")).toBe(true);
  });

  it("rejects a packet when qpsa_trigger is true but qpsa_packet is missing", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const triggered: DateResolutionPacket = {
      ...packet,
      limitation_packet: { ...packet.limitation_packet, qpsa_trigger: true },
    };
    const errors = validateDateResolutionPacket(triggered, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "CONDITIONAL_PACKET_MISSING" && e.input_group === "qpsa_packet")).toBe(true);
  });

  it("rejects a packet when death_benefit_trigger is true but death_benefit_packet is missing", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const triggered: DateResolutionPacket = {
      ...packet,
      limitation_packet: { ...packet.limitation_packet, death_benefit_trigger: true },
    };
    const errors = validateDateResolutionPacket(triggered, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "CONDITIONAL_PACKET_MISSING" && e.input_group === "death_benefit_packet")).toBe(true);
  });

  it("rejects a packet when qdro_trigger is true but qdro_packet is missing", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const triggered: DateResolutionPacket = {
      ...packet,
      limitation_packet: { ...packet.limitation_packet, qdro_trigger: true },
    };
    const errors = validateDateResolutionPacket(triggered, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "CONDITIONAL_PACKET_MISSING" && e.input_group === "qdro_packet")).toBe(true);
  });

  it("accepts a packet when trigger is false and conditional packet is missing", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const triggered: DateResolutionPacket = {
      ...packet,
      limitation_packet: { ...packet.limitation_packet, qpsa_trigger: false },
    };
    const errors = validateDateResolutionPacket(triggered, "packet-test", "0.1.0");
    expect(errors.filter((e) => e.code === "CONDITIONAL_PACKET_MISSING")).toHaveLength(0);
  });

  it("returns multiple errors when multiple groups are missing", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    delete (broken as Record<string, unknown>).case_plan_timeline;
    delete (broken as Record<string, unknown>).resolved_plan_logic;
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    const missingGroupErrors = errors.filter((e) => e.code === "MISSING_REQUIRED_GROUP");
    expect(missingGroupErrors).toHaveLength(2);
  });
});

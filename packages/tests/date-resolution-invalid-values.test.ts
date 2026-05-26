import { describe, expect, it } from "vitest";
import { buildPacketFromFixture, validateDateResolutionPacket } from "@pbgc/date-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";
import type { DateResolutionPacket } from "@pbgc/date-resolution";

describe("date_resolution invalid values rejection", () => {
  it("rejects blank strings in required fields", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    (broken as Record<string, unknown>).participant_role_population = {
      ...packet.participant_role_population,
      dob: "",
    };
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "BLANK_STRING_NOT_ALLOWED")).toBe(true);
  });

  it("rejects blank strings in service_employment_history dates", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    (broken as Record<string, unknown>).service_employment_history = {
      ...packet.service_employment_history,
      dote: "",
    };
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "BLANK_STRING_NOT_ALLOWED")).toBe(true);
  });

  it("rejects blank strings in benefit_administration_state", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    (broken as Record<string, unknown>).benefit_administration_state = {
      ...packet.benefit_administration_state,
      dor: "",
    };
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "BLANK_STRING_NOT_ALLOWED")).toBe(true);
  });

  it("rejects malformed ISO dates in date fields", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const broken: DateResolutionPacket = {
      ...packet,
      participant_role_population: {
        ...packet.participant_role_population,
        dob: "not-a-date",
      },
    };
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "INVALID_ISO_DATE")).toBe(true);
  });

  it("rejects impossible calendar dates", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const broken: DateResolutionPacket = {
      ...packet,
      participant_role_population: {
        ...packet.participant_role_population,
        dob: "2020-02-30",
      },
    };
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "INVALID_ISO_DATE")).toBe(true);
  });

  it("rejects invalid dates in nested service_employment_history", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const broken: DateResolutionPacket = {
      ...packet,
      service_employment_history: {
        ...packet.service_employment_history,
        dote: "abcdef",
      },
    };
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    expect(errors.some((e) => e.code === "INVALID_ISO_DATE" && e.field_name === "dote")).toBe(true);
  });

  it("accepts explicit nulls in date fields without errors", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const withNulls: DateResolutionPacket = {
      ...packet,
      participant_role_population: {
        ...packet.participant_role_population,
        sdob: null,
      },
    };
    const errors = validateDateResolutionPacket(withNulls, "packet-test", "0.1.0");
    expect(errors).toHaveLength(0);
  });

  it("returns multiple errors for multiple blank strings", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const broken = { ...packet } as any;
    (broken as Record<string, unknown>).participant_role_population = {
      ...packet.participant_role_population,
      dob: "",
      dod: "",
    };
    const errors = validateDateResolutionPacket(broken, "packet-test", "0.1.0");
    const blankErrors = errors.filter((e) => e.code === "BLANK_STRING_NOT_ALLOWED");
    expect(blankErrors.length).toBeGreaterThanOrEqual(2);
  });
});

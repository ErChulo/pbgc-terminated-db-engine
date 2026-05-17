import { describe, expect, it } from "vitest";
import { buildCompensationPacketFromFixture, resolveCompensation } from "@pbgc/compensation-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";

describe("compensation_resolution deterministic outputs", () => {
  it("matches committed expected outputs for CR001, CR002, and CR003", () => {
    resetDeterminismForTests();
    for (const fixture of parseCompensationResolutionFixtures()) {
      const result = resolveCompensation(buildCompensationPacketFromFixture(fixture), `packet-${fixture.test_case_id}`, "0.1.0");
      expect(result.values.compensation_resolved === null ? "" : String(result.values.compensation_resolved)).toBe(fixture.expected_compensation_resolved);
      expect(result.values.average_compensation_resolved === null ? "" : String(result.values.average_compensation_resolved)).toBe(fixture.expected_average_compensation_resolved);
      expect(result.values.covered_compensation_resolved === null ? "" : String(result.values.covered_compensation_resolved)).toBe(fixture.expected_covered_compensation_resolved);
    }
  });

  it("emits a warning without fallback values for frozen-benefit support fixture CR003", () => {
    resetDeterminismForTests();
    const fixture = parseCompensationResolutionFixtures().find((row) => row.test_case_id === "CR003");
    if (!fixture) throw new Error("Missing CR003 fixture");
    const result = resolveCompensation(buildCompensationPacketFromFixture(fixture), "packet-CR003", "0.1.0");
    expect(result.values).toEqual({
      compensation_resolved: null,
      average_compensation_resolved: null,
      covered_compensation_resolved: null,
    });
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].code).toBe("FROZEN_BENEFIT_SUPPORT_NO_COMPENSATION");
  });
});

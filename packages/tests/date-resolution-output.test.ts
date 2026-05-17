import { describe, expect, it } from "vitest";
import { buildPacketFromFixture, resolveDates } from "@pbgc/date-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";

describe("date_resolution deterministic outputs", () => {
  it("matches committed expected outputs for DR001, DR002, and DR003", () => {
    resetDeterminismForTests();
    for (const fixture of parseDateResolutionFixtures()) {
      const output = resolveDates(buildPacketFromFixture(fixture));
      expect(output.nrd ?? "").toBe(fixture.expected_nrd);
      expect(output.erd ?? "").toBe(fixture.expected_erd);
      expect(output.rbd ?? "").toBe(fixture.expected_rbd);
      expect(output.xra === null ? "" : String(output.xra)).toBe(fixture.expected_xra);
      expect(output.xrd ?? "").toBe(fixture.expected_xrd);
    }
  });
});

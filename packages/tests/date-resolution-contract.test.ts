import { describe, expect, it } from "vitest";
import { buildPacketFromFixture, validateDateResolutionPacket } from "@pbgc/date-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";

describe("date_resolution contract packets", () => {
  it("builds valid reviewed packets from committed fixture rows", () => {
    resetDeterminismForTests();
    for (const fixture of parseDateResolutionFixtures()) {
      const packet = buildPacketFromFixture(fixture);
      const errors = validateDateResolutionPacket(packet, `packet-${fixture.test_case_id}`, "0.1.0");
      expect(errors).toEqual([]);
      expect(packet.packet_type).toBe("date_resolution");
      expect(packet.case_plan_timeline.case_id).toBe("CASE-PLACEHOLDER");
    }
  });
});

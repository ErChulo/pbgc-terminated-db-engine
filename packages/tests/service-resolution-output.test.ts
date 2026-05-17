import { describe, expect, it } from "vitest";
import { buildServicePacketFromFixture, resolveService } from "@pbgc/service-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";

describe("service_resolution deterministic outputs", () => {
  it("matches committed expected outputs for SR001, SR002, and SR003", () => {
    resetDeterminismForTests();
    for (const fixture of parseServiceResolutionFixtures()) {
      const output = resolveService(buildServicePacketFromFixture(fixture));
      expect(String(output.eligibility_service_resolved ?? "")).toBe(fixture.expected_eligibility_service);
      expect(String(output.vesting_service_resolved ?? "")).toBe(fixture.expected_vesting_service);
      expect(String(output.benefit_service_resolved ?? "")).toBe(fixture.expected_benefit_service);
      expect(String(output.accrual_service_resolved ?? "")).toBe(fixture.expected_accrual_service);
    }
  });
});

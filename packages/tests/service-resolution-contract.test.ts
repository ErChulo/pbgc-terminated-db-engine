import { describe, expect, it } from "vitest";
import { buildServicePacketFromFixture, SERVICE_RESOLUTION_MODULE_NAME, type RunServiceResolutionRequest } from "@pbgc/service-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";

describe("service_resolution contract shape", () => {
  it("builds reviewed service_resolution packets with required contract groups", () => {
    resetDeterminismForTests();
    const packet = buildServicePacketFromFixture(parseServiceResolutionFixtures()[0]);
    expect(packet.packet_type).toBe(SERVICE_RESOLUTION_MODULE_NAME);
    expect(packet.schema_version).toBe("0.1.0");
    expect(packet.case_plan_timeline).toHaveProperty("dopt");
    expect(packet.resolved_plan_logic).toHaveProperty("eligibility_service_rule");
    expect(packet.participant_role_population).toHaveProperty("retirement_status_as_of_dopt");
    expect(packet.service_employment_history).toMatchObject({
      service_basis_code: "plan_year_1000_hours",
      service_hours_requirement: 1000,
      service_period_basis: "plan_anniversary",
    });
    expect(packet.actuarial_assumption_factor_set).toHaveProperty("retirement_age_convention");
    expect(packet.limitation_packet).toHaveProperty("ongoing_employment_contingency_indicator");
  });

  it("uses the approved run request fields and versions", () => {
    const request: RunServiceResolutionRequest = {
      case_id: "CASE-PLACEHOLDER",
      subject_type: "participant",
      subject_key: "SR001",
      input_packet_id: "packet-SR001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    };
    expect(Object.keys(request)).toEqual([
      "case_id",
      "subject_type",
      "subject_key",
      "input_packet_id",
      "rule_version",
      "deliverable_version",
    ]);
  });
});

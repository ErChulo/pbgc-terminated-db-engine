import { describe, expect, it } from "vitest";
import {
  buildCompensationPacketFromFixture,
  COMPENSATION_RESOLUTION_MODULE_NAME,
  type RunCompensationResolutionRequest,
} from "@pbgc/compensation-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";

describe("compensation_resolution contract shape", () => {
  it("builds reviewed compensation_resolution packets with required contract groups", () => {
    resetDeterminismForTests();
    const packet = buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]);
    expect(packet.packet_type).toBe(COMPENSATION_RESOLUTION_MODULE_NAME);
    expect(packet.schema_version).toBe("0.1.0");
    expect(packet.case_plan_timeline).toHaveProperty("dopt");
    expect(packet.resolved_plan_logic).toHaveProperty("compensation_definition_rule");
    expect(packet.participant_role_population).toHaveProperty("dob");
    expect(packet.service_employment_history).toHaveProperty("dop");
    expect(packet.compensation_accrual_inputs).toMatchObject({
      compensation_basis_code: "final_average_pay",
      average_compensation_period: "5_year",
      final_average_compensation: 80000,
    });
    expect(packet.benefit_administration_state).toHaveProperty("asd");
    expect(packet.limitation_packet).toHaveProperty("bpd_limitation_indicator");
  });

  it("uses the approved run request fields and versions", () => {
    const request: RunCompensationResolutionRequest = {
      case_id: "CASE-PLACEHOLDER",
      subject_type: "participant",
      subject_key: "CR001",
      input_packet_id: "packet-CR001",
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

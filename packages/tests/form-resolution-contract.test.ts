import { describe, expect, it } from "vitest";
import { buildFormPacketFromFixture, FORM_RESOLUTION_MODULE_NAME, type RunFormResolutionRequest } from "@pbgc/form-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";

describe("form_resolution contract shape", () => {
  it("builds reviewed form_resolution packets with required contract groups", () => {
    resetDeterminismForTests();
    const packet = buildFormPacketFromFixture(parseFormResolutionFixtures()[0]);
    expect(packet.packet_type).toBe(FORM_RESOLUTION_MODULE_NAME);
    expect(packet.schema_version).toBe("0.1.0");
    expect(packet.case_plan_timeline).toHaveProperty("dopt");
    expect(packet.resolved_plan_logic).toHaveProperty("normal_single_form_rule");
    expect(packet.participant_role_population).toHaveProperty("qdro_indicator");
    expect(packet.benefit_administration_state).toHaveProperty("current_pay_status");
    expect(packet.actuarial_assumption_factor_set).toHaveProperty("form_conversion_method");
    expect(packet.limitation_packet).toHaveProperty("form_of_benefit_limitation_indicator");
  });

  it("uses the approved run request fields and versions", () => {
    const request: RunFormResolutionRequest = {
      case_id: "CASE-PLACEHOLDER",
      subject_type: "participant",
      subject_key: "FR001",
      input_packet_id: "packet-FR001",
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

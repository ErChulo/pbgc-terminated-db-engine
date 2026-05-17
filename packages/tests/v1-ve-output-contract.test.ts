import { describe, expect, it } from "vitest";
import { buildV1VePacketFromFixture, V1_VE_OUTPUT_MODULE_NAME, type V1VeOutputRequest } from "@pbgc/v1-ve-output";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";

describe("v1_ve_output contract shape", () => {
  it("builds reviewed V1/VE packets with required contract groups", () => {
    resetDeterminismForTests();
    const packet = buildV1VePacketFromFixture(parseV1VeOutputFixtures()[0]);
    expect(packet.packet_type).toBe(V1_VE_OUTPUT_MODULE_NAME);
    expect(packet.schema_version).toBe("0.1.0");
    expect(packet.case_plan_timeline).toHaveProperty("plan_id");
    expect(packet.participant_role_population).toHaveProperty("bcv_rec_id");
    expect(packet.benefit_administration_state).toHaveProperty("current_pay_status");
    expect(packet.limitation_packet).toHaveProperty("calc_indicator");
    expect(packet.resolved_dates).toHaveProperty("xrd");
    expect(packet.resolved_service_compensation).toHaveProperty("benefit_service_resolved");
    expect(packet.resolved_forms_status).toHaveProperty("rettyp");
    expect(packet.benefit_kernel_output).toHaveProperty("pvmb_term");
  });

  it("uses the approved run request fields and versions", () => {
    const request: V1VeOutputRequest = {
      case_id: "CASE-PLACEHOLDER",
      subject_type: "participant",
      subject_key: "VE001",
      input_packet_id: "packet-VE001",
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

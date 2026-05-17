import { describe, expect, it } from "vitest";
import { buildBenefitPacketFromFixture, BENEFIT_KERNEL_MODULE_NAME, type RunBenefitKernelRequest } from "@pbgc/benefit-kernel";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";

describe("benefit_kernel contract shape", () => {
  it("builds reviewed benefit_kernel packets with required contract groups", () => {
    resetDeterminismForTests();
    const packet = buildBenefitPacketFromFixture(parseBenefitKernelFixtures()[0]);
    expect(packet.packet_type).toBe(BENEFIT_KERNEL_MODULE_NAME);
    expect(packet.schema_version).toBe("0.1.0");
    expect(packet.case_plan_timeline).toHaveProperty("dotr");
    expect(packet.resolved_plan_logic).toHaveProperty("accrued_benefit_formula");
    expect(packet.participant_role_population).toHaveProperty("custid");
    expect(packet.service_employment_history).toHaveProperty("benefit_service_at_dopt");
    expect(packet.compensation_accrual_inputs).toHaveProperty("final_average_compensation");
    expect(packet.benefit_administration_state).toHaveProperty("payment_history_available_indicator");
    expect(packet.actuarial_assumption_factor_set).toHaveProperty("assumption_set_id");
    expect(packet.limitation_packet).toHaveProperty("calc_indicator");
    expect(packet.resolved_dates).toHaveProperty("xrd");
    expect(packet.resolved_service_compensation).toHaveProperty("benefit_service_resolved");
    expect(packet.resolved_forms_status).toHaveProperty("rettyp");
  });

  it("uses the approved run request fields and versions", () => {
    const request: RunBenefitKernelRequest = {
      case_id: "CASE-PLACEHOLDER",
      subject_type: "participant",
      subject_key: "BK001",
      input_packet_id: "packet-BK001",
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

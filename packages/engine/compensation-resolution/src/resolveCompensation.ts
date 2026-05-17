import type { StructuredIssue } from "@pbgc/shared";
import { resolveFixtureCompensationValues } from "./compensationMath";
import { COMPENSATION_RESOLUTION_MODULE_NAME, type CompensationResolutionPacket, type CompensationResolutionValues } from "./types";

export type ResolvedCompensation = {
  values: CompensationResolutionValues;
  warnings: StructuredIssue[];
};

export function resolveCompensation(packet: CompensationResolutionPacket, inputPacketId = "direct", ruleVersion = "0.1.0"): ResolvedCompensation {
  const values = resolveFixtureCompensationValues(packet);
  const warnings: StructuredIssue[] = [];
  if (packet.compensation_accrual_inputs.frozen_accrued_benefit_indicator && values.compensation_resolved === null) {
    warnings.push({
      code: "FROZEN_BENEFIT_SUPPORT_NO_COMPENSATION",
      message: "Frozen benefit support branch completed with explicit null compensation outputs",
      field_name: "frozen_accrued_benefit_indicator",
      input_group: "compensation_accrual_inputs",
      input_packet_id: inputPacketId,
      module_name: COMPENSATION_RESOLUTION_MODULE_NAME,
      rule_version: ruleVersion,
    });
  }
  return { values, warnings };
}

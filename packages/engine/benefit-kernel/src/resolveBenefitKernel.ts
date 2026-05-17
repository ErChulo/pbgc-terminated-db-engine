import type { StructuredIssue } from "@pbgc/shared";
import { BENEFIT_KERNEL_MODULE_NAME, type BenefitKernelPacket, type BenefitKernelValues } from "./types";
import { computeBenefitValues, emptyBenefitValues } from "./benefitMath";

export function resolveBenefitKernel(
  packet: BenefitKernelPacket,
  inputPacketId: string,
  ruleVersion: string,
): { values: BenefitKernelValues; warnings: StructuredIssue[] } {
  const warnings: StructuredIssue[] = [];
  const supportedFormula = packet.resolved_plan_logic.accrued_benefit_formula === "1.5pct_final_avg_pay_x_service";
  const qpsa = Boolean(packet.participant_role_population.qpsa_indicator);
  const qdro = Boolean(packet.participant_role_population.qdro_indicator);
  const inPay = packet.benefit_administration_state.current_pay_status === "in_pay";

  if (!supportedFormula) {
    warnings.push(issue("UNSUPPORTED_INTEGRATED_FORMULA", "Integrated formula branch is unsupported in the MVP and returns explicit null benefit outputs", inputPacketId, ruleVersion, "accrued_benefit_formula", "resolved_plan_logic"));
    return { values: emptyBenefitValues(), warnings };
  }

  if (qpsa) {
    warnings.push(issue("UNSUPPORTED_QPSA_BRANCH", "QPSA branch is unsupported in the MVP and returns explicit null benefit outputs", inputPacketId, ruleVersion, "qpsa_indicator", "participant_role_population"));
    return { values: emptyBenefitValues(), warnings };
  }

  if (qdro) {
    warnings.push(issue("UNSUPPORTED_QDRO_BRANCH", "QDRO branch is unsupported in the MVP and returns explicit null benefit outputs", inputPacketId, ruleVersion, "qdro_indicator", "participant_role_population"));
    return { values: emptyBenefitValues(), warnings };
  }

  if (inPay) {
    warnings.push(issue("UNSUPPORTED_IN_PAY_BRANCH", "In-pay branch is unsupported in the MVP and returns explicit null benefit outputs", inputPacketId, ruleVersion, "current_pay_status", "benefit_administration_state"));
    return { values: emptyBenefitValues(), warnings };
  }

  return { values: computeBenefitValues(packet), warnings };
}

function issue(
  code: string,
  message: string,
  inputPacketId: string,
  ruleVersion: string,
  field_name?: string,
  input_group?: string,
): StructuredIssue {
  return {
    code,
    message,
    field_name,
    input_group,
    input_packet_id: inputPacketId,
    module_name: BENEFIT_KERNEL_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

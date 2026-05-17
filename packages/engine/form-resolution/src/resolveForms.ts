import type { StructuredIssue } from "@pbgc/shared";
import { resolveFormValues } from "./formRules";
import { FORM_RESOLUTION_MODULE_NAME, type FormResolutionPacket, type FormResolutionValues } from "./types";

export function resolveForms(
  packet: FormResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): { values: FormResolutionValues; warnings: StructuredIssue[] } {
  const values = resolveFormValues(packet);
  const warnings: StructuredIssue[] = [];
  if (packet.benefit_administration_state.current_pay_status === "in_pay") {
    warnings.push(issue("IN_PAY_FORM_REVIEWED", "Reviewed in-pay form state was preserved without benefit calculation", inputPacketId, ruleVersion, "current_pay_status", "benefit_administration_state"));
  }
  if (packet.participant_role_population.qdro_indicator) {
    warnings.push(issue("QDRO_FORM_REVIEWED", "Reviewed QDRO form treatment was applied without benefit-kernel execution", inputPacketId, ruleVersion, "qdro_indicator", "participant_role_population"));
  }
  if (packet.participant_role_population.qpsa_indicator) {
    warnings.push(issue("QPSA_FORM_REVIEWED", "Reviewed QPSA form treatment was applied", inputPacketId, ruleVersion, "qpsa_indicator", "participant_role_population"));
  }
  return { values, warnings };
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
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

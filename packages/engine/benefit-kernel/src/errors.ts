import { BENEFIT_KERNEL_MODULE_NAME } from "./types";
import type { StructuredIssue } from "@pbgc/shared";

export function makeBenefitKernelIssue(
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

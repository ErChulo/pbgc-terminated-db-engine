import type { StructuredIssue } from "@pbgc/shared";
import { BENEFIT_KERNEL_MODULE_NAME } from "./types";

export function buildMissingInputGroupError(
  group: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MISSING_INPUT_GROUP",
    message: `Missing required benefit-kernel input group ${group}`,
    input_group: group,
    module_name: BENEFIT_KERNEL_MODULE_NAME,
    rule_version: ruleVersion,
    input_packet_id: inputPacketId,
  };
}

export function buildBlankFieldError(
  group: string,
  field: string,
  inputPacketId: string,
  ruleVersion: string,
  suffix = "",
): StructuredIssue {
  return {
    code: "BLANK_FIELD_VALUE",
    message: `Blank benefit-kernel field ${group}.${field}${suffix ? ` (${suffix})` : ""}`,
    field_name: field,
    input_group: group,
    module_name: BENEFIT_KERNEL_MODULE_NAME,
    rule_version: ruleVersion,
    input_packet_id: inputPacketId,
  };
}

export function buildMalformedNumberError(
  group: string,
  field: string,
  inputPacketId: string,
  ruleVersion: string,
  suffix = "",
): StructuredIssue {
  return {
    code: "MALFORMED_NUMERIC_VALUE",
    message: `Malformed numeric benefit-kernel field ${group}.${field}${suffix ? ` (${suffix})` : ""}`,
    field_name: field,
    input_group: group,
    module_name: BENEFIT_KERNEL_MODULE_NAME,
    rule_version: ruleVersion,
    input_packet_id: inputPacketId,
  };
}

export function buildUnsupportedControlledRuleError(
  group: string,
  field: string,
  detail: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "UNSUPPORTED_CONTROLLED_RULE",
    message: `Unsupported controlled rule ${group}.${field}: ${detail}`,
    field_name: field,
    input_group: group,
    module_name: BENEFIT_KERNEL_MODULE_NAME,
    rule_version: ruleVersion,
    input_packet_id: inputPacketId,
  };
}

export function buildMissingConditionalPacketError(
  conditionalPacket: string,
  trigger: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MISSING_CONDITIONAL_PACKET",
    message: `Missing conditional ${conditionalPacket} packet required by trigger: ${trigger}`,
    field_name: trigger,
    input_group: conditionalPacket,
    module_name: BENEFIT_KERNEL_MODULE_NAME,
    rule_version: ruleVersion,
    input_packet_id: inputPacketId,
  };
}

export function buildInputPacketNotActiveError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "INPUT_PACKET_NOT_ACTIVE",
    message: `Active benefit_kernel input packet was not found: ${inputPacketId}`,
    module_name: BENEFIT_KERNEL_MODULE_NAME,
    rule_version: ruleVersion,
    input_packet_id: inputPacketId,
  };
}

export function isBlockingError(code: string): boolean {
  return code !== "UNSUPPORTED_INTEGRATED_FORMULA" && code !== "UNSUPPORTED_QPSA_BRANCH" && code !== "UNSUPPORTED_QDRO_BRANCH" && code !== "UNSUPPORTED_IN_PAY_BRANCH";
}

import type { StructuredIssue } from "@pbgc/shared";
import { V1_VE_OUTPUT_MODULE_NAME } from "./types";

export function buildInputPacketNotActiveError(inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "INPUT_PACKET_NOT_ACTIVE",
    message: "Active v1_ve_output input packet was not found",
    input_packet_id: inputPacketId,
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingInputGroupError(group: string, inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "MISSING_INPUT_GROUP",
    message: `Missing required V1/VE input group ${group}`,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingInputFieldError(group: string, field: string, inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "MISSING_INPUT_FIELD",
    message: `Missing required V1/VE input field ${group}.${field}`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildBlankFieldError(group: string, field: string, inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "BLANK_FIELD_VALUE",
    message: `Blank value for required V1/VE field ${group}.${field}`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMalformedNumberError(group: string, field: string, inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "MALFORMED_NUMERIC_VALUE",
    message: `Malformed numeric value for V1/VE field ${group}.${field}`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildUnsupportedControlledRuleError(field: string, value: string, inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "UNSUPPORTED_CONTROLLED_RULE",
    message: `Unsupported controlled rule value "${value}" for V1/VE field ${field}`,
    field_name: field,
    input_packet_id: inputPacketId,
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingConditionalPacketError(packetName: string, reason: string, inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "MISSING_CONDITIONAL_PACKET",
    message: `Missing conditional ${packetName} packet: ${reason}`,
    input_packet_id: inputPacketId,
    module_name: V1_VE_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function isBlockingError(error: StructuredIssue): boolean {
  const blockingCodes = new Set([
    "INPUT_PACKET_NOT_ACTIVE",
    "MISSING_INPUT_GROUP",
    "MISSING_INPUT_FIELD",
    "BLANK_FIELD_VALUE",
    "MALFORMED_NUMERIC_VALUE",
    "UNSUPPORTED_CONTROLLED_RULE",
    "MISSING_CONDITIONAL_PACKET",
    "INVALID_PACKET_TYPE",
    "UNSUPPORTED_SCHEMA_VERSION",
  ]);
  return blockingCodes.has(error.code);
}

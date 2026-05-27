import type { StructuredIssue } from "@pbgc/shared";
import { BSRS_CONFIGURATION_OUTPUT_MODULE_NAME } from "./types";

export function buildInvalidPacketTypeError(inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "INVALID_PACKET_TYPE",
    message: "Packet type must be bsrs_configuration_output",
    field_name: "packet_type",
    input_group: "packet",
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildUnsupportedSchemaVersionError(inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "UNSUPPORTED_SCHEMA_VERSION",
    message: "Only schema version 0.1.0 is supported",
    field_name: "schema_version",
    input_group: "packet",
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingInputGroupError(inputPacketId: string, group: string, ruleVersion: string): StructuredIssue {
  return {
    code: "MISSING_INPUT_GROUP",
    message: `Missing required BSRS input group: ${group}`,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingInputFieldError(inputPacketId: string, field: string, group: string, ruleVersion: string): StructuredIssue {
  return {
    code: "MISSING_INPUT_FIELD",
    message: `Missing required BSRS input field: ${group}.${field}`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildBlankFieldError(inputPacketId: string, field: string, group: string, ruleVersion: string): StructuredIssue {
  return {
    code: "BLANK_FIELD_VALUE",
    message: `BSRS field ${group}.${field} must not be a blank string`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMalformedNumberError(inputPacketId: string, field: string, group: string, ruleVersion: string): StructuredIssue {
  return {
    code: "MALFORMED_NUMERIC_VALUE",
    message: `BSRS field ${group}.${field} must be a finite non-negative number`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildUnsupportedControlledRuleError(
  inputPacketId: string,
  field: string,
  group: string,
  actualValue: string,
  supportedValues: readonly string[],
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "UNSUPPORTED_CONTROLLED_RULE",
    message: `BSRS field ${group}.${field} has unsupported value "${actualValue}". Supported: ${supportedValues.join(", ")}`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingConditionalPacketError(
  inputPacketId: string,
  packetName: string,
  triggerDescription: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MISSING_CONDITIONAL_PACKET",
    message: `${triggerDescription} BSRS output requires a reviewed ${packetName}`,
    field_name: packetName,
    input_group: "packet",
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildInputPacketNotActiveError(inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code: "INPUT_PACKET_NOT_ACTIVE",
    message: "Active bsrs_configuration_output input packet was not found",
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildTechnicalOverrideWarning(inputPacketId: string, field: string, ruleVersion: string): StructuredIssue {
  return {
    code: "TECHNICAL_OVERRIDE_APPLIED",
    message: `Technical override applied to ${field}`,
    field_name: field,
    input_group: "bsrs_projection_override_packet",
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildNullOutputFieldWarning(inputPacketId: string, field: string, ruleVersion: string): StructuredIssue {
  return {
    code: "NULL_OUTPUT_FIELD",
    message: `BSRS field ${field} resolved to null for the current branch`,
    field_name: field,
    input_group: "in_pay_packet",
    input_packet_id: inputPacketId,
    module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function isBlockingError(issue: StructuredIssue): boolean {
  return !["TECHNICAL_OVERRIDE_APPLIED", "NULL_OUTPUT_FIELD"].includes(issue.code);
}

import type { StructuredIssue } from "@pbgc/shared";
import { VALUATION_LISTINGS_OUTPUT_MODULE_NAME } from "./types";

export function buildMissingInputGroupError(
  inputPacketId: string,
  groupName: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MISSING_INPUT_GROUP",
    message: `Valuation listings packet is missing required group: ${groupName}`,
    field_name: groupName,
    input_group: "packet",
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingUpstreamOutputGroupError(
  inputPacketId: string,
  groupName: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MISSING_UPSTREAM_OUTPUT_GROUP",
    message: `Valuation listings packet is missing required upstream output group: ${groupName}`,
    field_name: groupName,
    input_group: "packet",
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildBlankFieldError(
  inputPacketId: string,
  fieldName: string,
  inputGroup: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "BLANK_FIELD_VALUE",
    message: `Valuation listings field ${fieldName} must not be blank`,
    field_name: fieldName,
    input_group: inputGroup,
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMalformedNumberError(
  inputPacketId: string,
  fieldName: string,
  inputGroup: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MALFORMED_NUMERIC_VALUE",
    message: `Valuation listings numeric field ${fieldName} contains a malformed value`,
    field_name: fieldName,
    input_group: inputGroup,
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildUnsupportedControlledRuleError(
  inputPacketId: string,
  fieldName: string,
  value: string,
  supported: readonly string[],
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "UNSUPPORTED_CONTROLLED_RULE",
    message: `Valuation listings ${fieldName} "${value}" is not supported. Supported values: ${supported.join(", ")}`,
    field_name: fieldName,
    input_group: "packet",
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingConditionalPacketError(
  inputPacketId: string,
  conditionName: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MISSING_CONDITIONAL_PACKET",
    message: `Valuation listings packet is missing required conditional data for: ${conditionName}`,
    field_name: conditionName,
    input_group: "packet",
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildInputPacketNotActiveError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "INPUT_PACKET_NOT_ACTIVE",
    message: "Active valuation_listings_output input packet was not found",
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function isBlockingError(issue: StructuredIssue): boolean {
  return (
    issue.code !== "VALUATION_LISTINGS_WARNING" &&
    issue.code !== "NULL_OUTPUT_FIELD" &&
    issue.code !== "TECHNICAL_OVERRIDE_APPLIED"
  );
}

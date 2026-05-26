import type { StructuredIssue } from "@pbgc/shared";
import { FORM_RESOLUTION_MODULE_NAME } from "./types";

export function buildMissingGroupError(
  group: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MISSING_INPUT_GROUP",
    message: `Missing required form input group: ${group}`,
    field_name: undefined,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildBlankFieldError(
  group: string,
  field: string,
  inputPacketId: string,
  ruleVersion: string,
  suffix?: string,
): StructuredIssue {
  return {
    code: "BLANK_FIELD_VALUE",
    message: `Required form field ${group}.${field} is missing or blank${suffix ? ` (${suffix})` : ""}`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMalformedBooleanError(
  group: string,
  field: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MALFORMED_BOOLEAN",
    message: `Form field ${group}.${field} must be a boolean value`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildUnsupportedRuleError(
  group: string,
  field: string,
  detail: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "UNSUPPORTED_FORM_RULE",
    message: `Unsupported form rule for ${group}.${field}: ${detail}`,
    field_name: field,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildConflictingPayStatusError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "CONFLICTING_PAY_STATUS",
    message:
      "Conflicting pay status: current_pay_status is in_pay but current_form_code or annuity_status_pay fields are inconsistent",
    field_name: "current_pay_status",
    input_group: "benefit_administration_state",
    input_packet_id: inputPacketId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingConditionalPacketError(
  trigger: string,
  group: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "MISSING_CONDITIONAL_PACKET",
    message: `Conditional ${trigger} packet is required when ${group} trigger is set`,
    field_name: undefined,
    input_group: group,
    input_packet_id: inputPacketId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildInputPacketNotActiveError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "INPUT_PACKET_NOT_ACTIVE",
    message: "Active form_resolution input packet was not found",
    field_name: undefined,
    input_group: undefined,
    input_packet_id: inputPacketId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildInvalidPacketTypeError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return {
    code: "INVALID_PACKET_TYPE",
    message: "Packet type must be form_resolution",
    field_name: "packet_type",
    input_group: undefined,
    input_packet_id: inputPacketId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function isBlockingError(issue: StructuredIssue): boolean {
  const blockingCodes = new Set([
    "MISSING_INPUT_GROUP",
    "BLANK_FIELD_VALUE",
    "MALFORMED_BOOLEAN",
    "UNSUPPORTED_FORM_RULE",
    "CONFLICTING_PAY_STATUS",
    "MISSING_CONDITIONAL_PACKET",
    "INPUT_PACKET_NOT_ACTIVE",
    "INVALID_PACKET_TYPE",
  ]);
  return blockingCodes.has(issue.code);
}

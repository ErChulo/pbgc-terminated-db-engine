import type { StructuredIssue } from "@pbgc/shared";
import { COMPENSATION_RESOLUTION_MODULE_NAME } from "./types";

export type CompensationResolutionErrorCode =
  | "BLANK_FIELD_VALUE"
  | "MISSING_INPUT_GROUP"
  | "MALFORMED_COMPENSATION_AMOUNT"
  | "NEGATIVE_COMPENSATION_AMOUNT"
  | "UNSUPPORTED_COMPENSATION_BASIS"
  | "UNSUPPORTED_AVERAGE_PERIOD"
  | "UNSUPPORTED_AVERAGE_RULE"
  | "CONDITIONAL_PACKET_MISSING"
  | "INPUT_PACKET_NOT_ACTIVE"
  | "INVALID_PACKET_TYPE";

function buildBlockingError(
  code: CompensationResolutionErrorCode,
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
    module_name: COMPENSATION_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingGroupError(
  group: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "MISSING_INPUT_GROUP",
    `Missing required compensation input group ${group}`,
    inputPacketId,
    ruleVersion,
    undefined,
    group,
  );
}

export function buildBlankFieldError(
  group: string,
  field: string,
  inputPacketId: string,
  ruleVersion: string,
  details?: string,
): StructuredIssue {
  const suffix = details ? ` (${details})` : "";
  return buildBlockingError(
    "BLANK_FIELD_VALUE",
    `Blank compensation field ${group}.${field}${suffix}`,
    inputPacketId,
    ruleVersion,
    field,
    group,
  );
}

export function buildMalformedAmountError(
  group: string,
  field: string,
  value: unknown,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "MALFORMED_COMPENSATION_AMOUNT",
    `Malformed compensation amount in ${group}.${field}: ${String(value)}`,
    inputPacketId,
    ruleVersion,
    field,
    group,
  );
}

export function buildNegativeAmountError(
  group: string,
  field: string,
  value: number,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "NEGATIVE_COMPENSATION_AMOUNT",
    `Negative compensation amount in ${group}.${field}: ${value}`,
    inputPacketId,
    ruleVersion,
    field,
    group,
  );
}

export function buildUnsupportedBasisError(
  field: string,
  value: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "UNSUPPORTED_COMPENSATION_BASIS",
    `Unsupported compensation basis code '${value}' for field ${field}`,
    inputPacketId,
    ruleVersion,
    field,
    "compensation_accrual_inputs",
  );
}

export function buildUnsupportedAveragePeriodError(
  value: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "UNSUPPORTED_AVERAGE_PERIOD",
    `Unsupported average compensation period '${value}'`,
    inputPacketId,
    ruleVersion,
    "average_compensation_period",
    "compensation_accrual_inputs",
  );
}

export function buildUnsupportedAverageRuleError(
  value: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "UNSUPPORTED_AVERAGE_RULE",
    `Unsupported average compensation rule '${value}'`,
    inputPacketId,
    ruleVersion,
    "average_compensation_rule",
    "resolved_plan_logic",
  );
}

export function buildConditionalPacketMissingError(
  triggerField: string,
  packetField: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "CONDITIONAL_PACKET_MISSING",
    `Conditional trigger ${triggerField} is set but required reviewed packet '${packetField}' is missing`,
    inputPacketId,
    ruleVersion,
    triggerField,
    "compensation_accrual_inputs",
  );
}

export function buildInputPacketNotActiveError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "INPUT_PACKET_NOT_ACTIVE",
    "Active compensation_resolution input packet was not found",
    inputPacketId,
    ruleVersion,
  );
}

export function buildInvalidPacketTypeError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "INVALID_PACKET_TYPE",
    "Packet type must be compensation_resolution",
    inputPacketId,
    ruleVersion,
    "packet_type",
  );
}

export function isBlockingError(issue: StructuredIssue): boolean {
  return (
    issue.code === "BLANK_FIELD_VALUE" ||
    issue.code === "MISSING_INPUT_GROUP" ||
    issue.code === "MALFORMED_COMPENSATION_AMOUNT" ||
    issue.code === "NEGATIVE_COMPENSATION_AMOUNT" ||
    issue.code === "UNSUPPORTED_COMPENSATION_BASIS" ||
    issue.code === "UNSUPPORTED_AVERAGE_PERIOD" ||
    issue.code === "UNSUPPORTED_AVERAGE_RULE" ||
    issue.code === "CONDITIONAL_PACKET_MISSING" ||
    issue.code === "INPUT_PACKET_NOT_ACTIVE" ||
    issue.code === "INVALID_PACKET_TYPE"
  );
}

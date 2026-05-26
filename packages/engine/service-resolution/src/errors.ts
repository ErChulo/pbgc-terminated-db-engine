import type { StructuredIssue } from "@pbgc/shared";
import { SERVICE_RESOLUTION_MODULE_NAME } from "./types";

export type ServiceResolutionErrorCode =
  | "MISSING_INPUT_GROUP"
  | "BLANK_FIELD_VALUE"
  | "MALFORMED_DATE_VALUE"
  | "INVALID_DATE_ORDERING"
  | "UNSUPPORTED_SERVICE_VALUE"
  | "INPUT_PACKET_NOT_ACTIVE"
  | "INVALID_PACKET_TYPE";

function buildBlockingError(
  code: ServiceResolutionErrorCode,
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
    module_name: SERVICE_RESOLUTION_MODULE_NAME,
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
    `Missing required service input group: ${group}`,
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
): StructuredIssue {
  return buildBlockingError(
    "BLANK_FIELD_VALUE",
    `Service input field ${group}.${field} is a blank string instead of an explicit null or controlled value`,
    inputPacketId,
    ruleVersion,
    field,
    group,
  );
}

export function buildMalformedDateError(
  group: string,
  field: string,
  value: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "MALFORMED_DATE_VALUE",
    `Service input field ${group}.${field} has malformed or impossible date value: ${value}`,
    inputPacketId,
    ruleVersion,
    field,
    group,
  );
}

export function buildInvalidDateOrderingError(
  group: string,
  earlierField: string,
  laterField: string,
  earlierValue: string,
  laterValue: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "INVALID_DATE_ORDERING",
    `Service input date ordering invalid: ${group}.${earlierField} (${earlierValue}) is after ${group}.${laterField} (${laterValue})`,
    inputPacketId,
    ruleVersion,
    `${earlierField}/${laterField}`,
    group,
  );
}

export function buildInputPacketNotActiveError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "INPUT_PACKET_NOT_ACTIVE",
    "Active service_resolution input packet was not found",
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
    "Packet type must be service_resolution",
    inputPacketId,
    ruleVersion,
    "packet_type",
  );
}

export function buildUnsupportedValueError(
  group: string,
  field: string,
  detail: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "UNSUPPORTED_SERVICE_VALUE",
    `Service input field ${group}.${field} has unsupported value: ${detail}`,
    inputPacketId,
    ruleVersion,
    field,
    group,
  );
}

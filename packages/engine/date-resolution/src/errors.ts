import type { StructuredIssue } from "@pbgc/shared";
import { DATE_RESOLUTION_MODULE_NAME } from "./types";

export type DateResolutionErrorCode =
  | "MISSING_REQUIRED_GROUP"
  | "BLANK_STRING_NOT_ALLOWED"
  | "INVALID_ISO_DATE"
  | "CONDITIONAL_PACKET_MISSING"
  | "INPUT_PACKET_NOT_ACTIVE"
  | "MISSING_PARTICIPANT_DOB";

export function buildBlockingError(
  code: DateResolutionErrorCode,
  message: string,
  inputPacketId: string,
  ruleVersion: string,
  details?: { inputGroup?: string; fieldName?: string },
): StructuredIssue {
  return {
    code,
    message,
    input_group: details?.inputGroup,
    field_name: details?.fieldName,
    input_packet_id: inputPacketId,
    module_name: DATE_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

export function buildMissingGroupError(
  groupName: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "MISSING_REQUIRED_GROUP",
    `Missing required input group: ${groupName}`,
    inputPacketId,
    ruleVersion,
    { inputGroup: groupName },
  );
}

export function buildBlankStringError(
  path: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "BLANK_STRING_NOT_ALLOWED",
    `Blank string is not allowed at ${path}`,
    inputPacketId,
    ruleVersion,
    { fieldName: path.split(".").at(-1), inputGroup: path.split(".").slice(0, -1).join(".") || undefined },
  );
}

export function buildInvalidDateError(
  path: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "INVALID_ISO_DATE",
    `Invalid ISO date at ${path}`,
    inputPacketId,
    ruleVersion,
    { fieldName: path.split(".").at(-1), inputGroup: path.split(".").slice(0, -1).join(".") || undefined },
  );
}

export function buildConditionalPacketMissingError(
  conditionalPacket: string,
  triggerField: string,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "CONDITIONAL_PACKET_MISSING",
    `Conditional packet '${conditionalPacket}' is required because trigger field '${triggerField}' is set`,
    inputPacketId,
    ruleVersion,
    { inputGroup: conditionalPacket },
  );
}

export function buildInputPacketNotActiveError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "INPUT_PACKET_NOT_ACTIVE",
    "Active date_resolution input packet was not found",
    inputPacketId,
    ruleVersion,
  );
}

export function buildMissingParticipantDobError(
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue {
  return buildBlockingError(
    "MISSING_PARTICIPANT_DOB",
    "Participant DOB is required for date resolution",
    inputPacketId,
    ruleVersion,
    { inputGroup: "participant_role_population", fieldName: "dob" },
  );
}

export function isBlockingError(error: StructuredIssue): boolean {
  const blockingCodes: ReadonlySet<string> = new Set([
    "MISSING_REQUIRED_GROUP",
    "BLANK_STRING_NOT_ALLOWED",
    "INVALID_ISO_DATE",
    "CONDITIONAL_PACKET_MISSING",
    "INPUT_PACKET_NOT_ACTIVE",
    "MISSING_PARTICIPANT_DOB",
  ]);
  return blockingCodes.has(error.code);
}

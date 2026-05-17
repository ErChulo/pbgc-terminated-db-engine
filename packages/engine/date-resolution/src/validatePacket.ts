import type { StructuredIssue } from "@pbgc/shared";
import { parseIsoDate } from "./dateMath";
import { DATE_RESOLUTION_MODULE_NAME, type DateResolutionPacket } from "./types";

const REQUIRED_GROUPS: (keyof DateResolutionPacket)[] = [
  "case_plan_timeline",
  "resolved_plan_logic",
  "participant_role_population",
  "service_employment_history",
  "benefit_administration_state",
  "actuarial_assumption_factor_set",
  "limitation_packet",
];

export function validateDateResolutionPacket(
  packet: DateResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];
  for (const group of REQUIRED_GROUPS) {
    if (packet[group] === undefined || packet[group] === null) {
      errors.push(issue("MISSING_REQUIRED_GROUP", `Missing required input group ${String(group)}`, inputPacketId, ruleVersion, String(group)));
    }
  }

  visitValues(packet, (path, value) => {
    if (value === "") {
      errors.push(issue("BLANK_STRING_NOT_ALLOWED", `Blank string is not allowed at ${path}`, inputPacketId, ruleVersion, undefined, path));
    }
    const field = path.split(".").at(-1);
    if (field && DATE_FIELD_NAMES.has(field)) {
      if (typeof value === "string" && value !== "") {
        try {
          parseIsoDate(value);
        } catch {
          errors.push(issue("INVALID_ISO_DATE", `Invalid ISO date at ${path}`, inputPacketId, ruleVersion, undefined, path));
        }
      }
    }
  });

  return errors;
}

const DATE_FIELD_NAMES = new Set(["dob", "sdob", "dote", "dod", "dopt", "dotr", "bpd", "doh", "dop", "dor", "asd", "sbcd"]);

function issue(
  code: string,
  message: string,
  inputPacketId: string,
  ruleVersion: string,
  inputGroup?: string,
  fieldName?: string,
): StructuredIssue {
  return {
    code,
    message,
    input_group: inputGroup,
    field_name: fieldName,
    input_packet_id: inputPacketId,
    module_name: DATE_RESOLUTION_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

function visitValues(value: unknown, callback: (path: string, value: unknown) => void, path = ""): void {
  if (value === null || typeof value !== "object") {
    callback(path, value);
    return;
  }
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    visitValues(child, callback, path ? `${path}.${key}` : key);
  }
}

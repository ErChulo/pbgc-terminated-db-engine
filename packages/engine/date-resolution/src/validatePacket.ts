import type { StructuredIssue } from "@pbgc/shared";
import { parseIsoDate } from "./dateMath";
import {
  buildMissingGroupError,
  buildBlankStringError,
  buildInvalidDateError,
  buildConditionalPacketMissingError,
} from "./errors";
import type { DateResolutionPacket } from "./types";

const REQUIRED_GROUPS: (keyof DateResolutionPacket)[] = [
  "case_plan_timeline",
  "resolved_plan_logic",
  "participant_role_population",
  "service_employment_history",
  "benefit_administration_state",
  "actuarial_assumption_factor_set",
  "limitation_packet",
];

const CONDITIONAL_PACKETS: {
  key: keyof DateResolutionPacket;
  triggerGroup: keyof DateResolutionPacket["limitation_packet"];
  triggerField: string;
}[] = [
  { key: "qpsa_packet", triggerGroup: "qpsa_trigger", triggerField: "qpsa_trigger" },
  { key: "death_benefit_packet", triggerGroup: "death_benefit_trigger", triggerField: "death_benefit_trigger" },
  { key: "qdro_packet", triggerGroup: "qdro_trigger", triggerField: "qdro_trigger" },
];

export function validateDateResolutionPacket(
  packet: DateResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const errors: StructuredIssue[] = [];

  // Validate required groups
  for (const group of REQUIRED_GROUPS) {
    if (packet[group] === undefined || packet[group] === null) {
      errors.push(buildMissingGroupError(String(group), inputPacketId, ruleVersion));
    }
  }

  // Validate conditional packet triggers
  const limitation = packet.limitation_packet;
  if (limitation) {
    for (const { key, triggerGroup, triggerField } of CONDITIONAL_PACKETS) {
      const triggered = limitation[triggerGroup];
      if (triggered === true && (packet[key] === undefined || packet[key] === null)) {
        errors.push(buildConditionalPacketMissingError(String(key), triggerField, inputPacketId, ruleVersion));
      }
    }
  }

  // Validate no blank strings and no malformed dates
  visitValues(packet, (path, value) => {
    if (value === "") {
      errors.push(buildBlankStringError(path, inputPacketId, ruleVersion));
    }
    const field = path.split(".").at(-1);
    if (field && DATE_FIELD_NAMES.has(field)) {
      if (typeof value === "string" && value !== "") {
        try {
          parseIsoDate(value);
        } catch {
          errors.push(buildInvalidDateError(path, inputPacketId, ruleVersion));
        }
      }
    }
  });

  return errors;
}

const DATE_FIELD_NAMES = new Set(["dob", "sdob", "dote", "dod", "dopt", "dotr", "bpd", "doh", "dop", "dor", "asd", "sbcd"]);

function visitValues(value: unknown, callback: (path: string, value: unknown) => void, path = ""): void {
  if (value === null || typeof value !== "object") {
    callback(path, value);
    return;
  }
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    visitValues(child, callback, path ? `${path}.${key}` : key);
  }
}

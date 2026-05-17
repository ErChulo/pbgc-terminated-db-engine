import type { StructuredIssue } from "@pbgc/shared";
import { canonicalDdFieldName, hasDdMapping, resolveV1FieldName } from "./ddMapping";
import { validateOverrideFieldName, validateV1VeOutputPacket } from "./validatePacket";
import { projectV1VeRow } from "./v1VeMath";
import { V1_VE_OUTPUT_MODULE_NAME, type V1VeOutputPacket, type V1VeOutputRow } from "./types";

export type ResolvedV1VeOutput = {
  row: V1VeOutputRow;
  warnings: StructuredIssue[];
};

export function resolveV1VeOutput(packet: V1VeOutputPacket, inputPacketId: string, ruleVersion: string): ResolvedV1VeOutput {
  const validationErrors = validateV1VeOutputPacket(packet, inputPacketId, ruleVersion);
  if (validationErrors.length > 0) {
    throw new Error("V1/VE packet validation must be executed before resolveV1VeOutput");
  }

  const { row, warnings } = projectV1VeRow(packet);
  const override = packet.technical_output_override_packet;
  if (override) {
    const ddFieldName = canonicalDdFieldName(override.output_column_name);
    const outputFieldName = resolveV1FieldName(ddFieldName);
    if (!validateOverrideFieldName(outputFieldName) || !hasDdMapping(outputFieldName)) {
      return { row, warnings };
    }
    (row as Record<string, string | number | boolean | null>)[outputFieldName] = override.override_value;
    warnings.push({
      code: "TECHNICAL_OVERRIDE_APPLIED",
      message: `Technical override applied to ${outputFieldName}`,
      field_name: outputFieldName,
      input_group: "technical_output_override_packet",
      input_packet_id: inputPacketId,
      module_name: V1_VE_OUTPUT_MODULE_NAME,
      rule_version: ruleVersion,
    });
  }
  return { row, warnings };
}

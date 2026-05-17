import type { StructuredIssue } from "@pbgc/shared";
import { projectBsrsConfigurationRow } from "./projectBsrsConfiguration";
import { validateBsrsConfigurationPacket } from "./validatePacket";
import { BSRS_CONFIGURATION_OUTPUT_MODULE_NAME, type BsrsConfigurationOutputPacket, type BsrsConfigurationOutputRow } from "./types";

export type ResolvedBsrsConfigurationOutput = {
  row: BsrsConfigurationOutputRow;
  warnings: StructuredIssue[];
};

export function resolveBsrsConfigurationOutput(packet: BsrsConfigurationOutputPacket, inputPacketId: string, ruleVersion: string): ResolvedBsrsConfigurationOutput {
  const validationErrors = validateBsrsConfigurationPacket(packet, inputPacketId, ruleVersion);
  if (validationErrors.length > 0) throw new Error("BSRS packet validation must be executed before resolveBsrsConfigurationOutput");

  const row = projectBsrsConfigurationRow(packet);
  const warnings: StructuredIssue[] = [];

  if (packet.bsrs_projection_override_packet) {
    const override = packet.bsrs_projection_override_packet;
    if (override.output_field_name in row) {
      (row as Record<string, string | number | boolean | null>)[override.output_field_name] = override.override_value;
      warnings.push({
        code: "TECHNICAL_OVERRIDE_APPLIED",
        message: `Technical override applied to ${override.output_field_name}`,
        field_name: override.output_field_name,
        input_group: "bsrs_projection_override_packet",
        input_packet_id: inputPacketId,
        module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
        rule_version: ruleVersion,
      });
    }
  }

  if (packet.benefit_administration_state.current_pay_status === "in_pay") {
    for (const field of ["form_code_ard", "spc_ard", "mths_ard", "lev_mb_ard"] as const) {
      if (row[field] !== null) continue;
      warnings.push({
        code: "NULL_OUTPUT_FIELD",
        message: `BSRS field ${field} resolved to null for the current branch`,
        field_name: field,
        input_group: "in_pay_packet",
        input_packet_id: inputPacketId,
        module_name: BSRS_CONFIGURATION_OUTPUT_MODULE_NAME,
        rule_version: ruleVersion,
      });
    }
  }

  if (warnings.length > 0) {
    row.bsrs_configuration_output_warning_flag = true;
    row.bsrs_configuration_output_warning_note = warnings.map((warning) => warning.message).join("; ");
  }

  return { row, warnings };
}

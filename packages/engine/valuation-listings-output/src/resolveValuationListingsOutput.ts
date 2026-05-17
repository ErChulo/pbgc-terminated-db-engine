import type { StructuredIssue } from "@pbgc/shared";
import { applyValuationListingOverride, addNullWarnings, projectValuationListingRow } from "./valuationListingsMath";
import { VALUATION_LISTINGS_OUTPUT_MODULE_NAME, type ValuationListingsOutputPacket, type ValuationListingsOutputRow } from "./types";
import { validateValuationListingsOutputPacket } from "./validatePacket";

export type ResolvedValuationListingsOutput = {
  row: ValuationListingsOutputRow;
  warnings: StructuredIssue[];
};

export function resolveValuationListingsOutput(packet: ValuationListingsOutputPacket, inputPacketId: string, ruleVersion: string): ResolvedValuationListingsOutput {
  const validationErrors = validateValuationListingsOutputPacket(packet, inputPacketId, ruleVersion);
  if (validationErrors.length > 0) throw new Error("Valuation listings packet validation must be executed before resolveValuationListingsOutput");

  const row = projectValuationListingRow(packet);
  const warnings: StructuredIssue[] = [];
  warnings.push(...applyValuationListingOverride(row, packet, inputPacketId));
  warnings.push(...addNullWarnings(row, inputPacketId));

  if (row.valuation_listings_output_warning_flag && row.valuation_listings_output_warning_note && warnings.length === 0) {
    warnings.push({
      code: "VALUATION_LISTINGS_WARNING",
      message: row.valuation_listings_output_warning_note,
      field_name: "valuation_listings_output_warning_note",
      input_group: "valuation_listings_output",
      input_packet_id: inputPacketId,
      module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
      rule_version: ruleVersion,
    });
  }

  return { row, warnings };
}

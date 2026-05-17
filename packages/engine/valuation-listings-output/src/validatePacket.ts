import type { StructuredIssue } from "@pbgc/shared";
import { VALUATION_LISTINGS_OUTPUT_MODULE_NAME, type ValuationListingsOutputPacket } from "./types";

function issue(code: string, message: string, field_name: string | undefined, inputGroup: string | undefined, inputPacketId: string, ruleVersion: string): StructuredIssue {
  return {
    code,
    message,
    field_name,
    input_group: inputGroup,
    input_packet_id: inputPacketId,
    module_name: VALUATION_LISTINGS_OUTPUT_MODULE_NAME,
    rule_version: ruleVersion,
  };
}

function required(condition: unknown, code: string, message: string, fieldName: string, inputGroup: string, inputPacketId: string, ruleVersion: string, errors: StructuredIssue[]): void {
  if (!condition) errors.push(issue(code, message, fieldName, inputGroup, inputPacketId, ruleVersion));
}

export function validateValuationListingsOutputPacket(packet: ValuationListingsOutputPacket, inputPacketId: string, ruleVersion: string): StructuredIssue[] {
  const errors: StructuredIssue[] = [];
  required(Boolean(packet.case_id), "MISSING_CASE_ID", "Valuation listings packet is missing case_id", "case_id", "packet", inputPacketId, ruleVersion, errors);
  required(Boolean(packet.subject_key), "MISSING_SUBJECT_KEY", "Valuation listings packet is missing subject_key", "subject_key", "packet", inputPacketId, ruleVersion, errors);
  required(Boolean(packet.listing_row_type), "MISSING_LISTING_ROW_TYPE", "Valuation listings packet is missing listing_row_type", "listing_row_type", "packet", inputPacketId, ruleVersion, errors);
  required(Boolean(packet.case_plan_timeline?.plan_id), "MISSING_PLAN_ID", "Valuation listings packet is missing plan_id", "case_plan_timeline", "packet", inputPacketId, ruleVersion, errors);
  required(Boolean(packet.participant_role_population?.bcv_rec_id), "MISSING_BCV_REC_ID", "Valuation listings packet is missing bcv_rec_id", "participant_role_population", "packet", inputPacketId, ruleVersion, errors);
  required(Boolean(packet.v1_ve_output_row), "MISSING_V1_ROW", "Valuation listings packet is missing v1_ve_output_row", "v1_ve_output_row", "packet", inputPacketId, ruleVersion, errors);
  return errors;
}

/**
 * BSRS conditional branch resolution.
 * Applies branch-specific rules for in-pay, survivor, QDRO, QPSA, and override-sensitive cases.
 * Determines which fields should be explicit nulls vs populated values.
 */
import type { StructuredIssue } from "@pbgc/shared";
import { buildNullOutputFieldWarning } from "./errors";
import type { BsrsConfigurationOutputPacket, BsrsConfigurationOutputRow } from "./types";

export type BranchContext = {
  isInPay: boolean;
  isSurvivor: boolean;
  isQdro: boolean;
  isQpsa: boolean;
  isSuppressed: boolean;
  hasOverride: boolean;
};

export type BranchResolutionResult = {
  explicitNulls: Set<keyof BsrsConfigurationOutputRow>;
  warnings: StructuredIssue[];
};

/**
 * Extract the branch context from a BSRS packet.
 */
export function resolveBranchContext(packet: BsrsConfigurationOutputPacket): BranchContext {
  return {
    isInPay: packet.benefit_administration_state.current_pay_status === "in_pay",
    isSurvivor: packet.statement_row_type === "survivor",
    isQdro: packet.participant_role_population.qdro_indicator === true,
    isQpsa: packet.participant_role_population.qpsa_indicator === true,
    isSuppressed: packet.statement_row_type === "suppressed",
    hasOverride: Boolean(packet.bsrs_projection_override_packet),
  };
}

/**
 * Determine which fields should be explicit nulls based on the case branch.
 *
 * Rules:
 * - In-pay branch: in_pay_packet is required; if absent, form_code_ard, spc_ard,
 *   mths_ard, lev_mb_ard are explicit nulls with warnings
 * - Survivor branch: death_benefit_packet is required; xrd_surv_mb_term comes from
 *   valuation_listings rather than v1_ve if available
 * - QDRO/QPSA: recalculation fields are set, alternate form codes are conditional
 * - Suppressed: most display fields are null
 */
export function resolveBranchNulls(
  packet: BsrsConfigurationOutputPacket,
  context: BranchContext,
  inputPacketId: string,
  ruleVersion: string,
): BranchResolutionResult {
  const explicitNulls = new Set<keyof BsrsConfigurationOutputRow>();
  const warnings: StructuredIssue[] = [];

  // In-pay branch: ARD fields depend on in_pay_packet
  if (context.isInPay) {
    if (!packet.in_pay_packet) {
      explicitNulls.add("form_code_ard");
      explicitNulls.add("spc_ard");
      explicitNulls.add("mths_ard");
      explicitNulls.add("lev_mb_ard");
      for (const field of ["form_code_ard", "spc_ard", "mths_ard", "lev_mb_ard"] as const) {
        warnings.push(buildNullOutputFieldWarning(inputPacketId, field, ruleVersion));
      }
    }
  } else {
    // Non-in-pay: ARD fields are not applicable
    explicitNulls.add("form_code_ard");
    explicitNulls.add("spc_ard");
    explicitNulls.add("mths_ard");
    explicitNulls.add("lev_mb_ard");
    explicitNulls.add("current_payment_amount");
  }

  // Suppressed row: display and statement fields are null or defaulted
  if (context.isSuppressed) {
    explicitNulls.add("display_form_code");
    explicitNulls.add("display_monthly_amount");
    explicitNulls.add("display_survivor_amount");
    explicitNulls.add("display_lump_sum_amount");
    explicitNulls.add("benefit_effective_date_for_statement");
    explicitNulls.add("recalculation_reason_code");
  }

  // Non-survivor: survivor-specific fields are not applicable
  if (!context.isSurvivor) {
    explicitNulls.add("sfname");
    explicitNulls.add("slname");
    explicitNulls.add("ssex");
    explicitNulls.add("sdob");
    explicitNulls.add("relation");
  }

  // Non-QDRO/non-QPSA: recalculation reason is null
  if (!context.isQdro && !context.isQpsa) {
    explicitNulls.add("recalculation_reason_code");
  }

  // Override: warnings are emitted by resolveBsrsConfigurationOutput.ts via buildTechnicalOverrideWarning
  // Do NOT duplicate override warnings here.

  return { explicitNulls, warnings };
}

/**
 * Apply branch resolution to a projected row, setting explicit nulls
 * for fields that are not applicable to the current branch.
 */
export function applyBranchNulls(
  row: BsrsConfigurationOutputRow,
  explicitNulls: Set<keyof BsrsConfigurationOutputRow>,
): BsrsConfigurationOutputRow {
  const result = { ...row };
  for (const field of explicitNulls) {
    result[field] = null as never;
  }
  return result;
}

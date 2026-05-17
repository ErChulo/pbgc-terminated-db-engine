import type { CompensationResolutionPacket, CompensationResolutionValues } from "./types";

export function resolveFixtureCompensationValues(packet: CompensationResolutionPacket): CompensationResolutionValues {
  const inputs = packet.compensation_accrual_inputs;
  if (inputs.frozen_accrued_benefit_indicator && !inputs.compensation_history_available_indicator) {
    return {
      compensation_resolved: null,
      average_compensation_resolved: null,
      covered_compensation_resolved: null,
    };
  }
  return {
    compensation_resolved: inputs.final_average_compensation,
    average_compensation_resolved: inputs.final_average_compensation,
    covered_compensation_resolved: inputs.covered_compensation_amount,
  };
}

import { createDeterministicId } from "@pbgc/shared";
import type { CompensationResolutionFixture, CompensationResolutionPacket } from "./types";

function blankToNull(value: string): string | null {
  return value.trim() === "" ? null : value;
}

function numericOrNull(value: string): number | null {
  const normalized = blankToNull(value);
  return normalized === null ? null : Number(normalized);
}

function booleanFromFixture(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}

export function buildCompensationPacketFromFixture(fixture: CompensationResolutionFixture): CompensationResolutionPacket {
  const subjectKey = fixture.test_case_id;
  const frozen = booleanFromFixture(fixture.frozen_accrued_benefit_indicator);
  const coveredCompensation = numericOrNull(fixture.covered_compensation_amount);
  return {
    packet_type: "compensation_resolution",
    schema_version: "0.1.0",
    case_id: "CASE-PLACEHOLDER",
    subject_type: "participant",
    subject_key: subjectKey,
    case_plan_timeline: {
      case_id: "CASE-PLACEHOLDER",
      plan_id: "PLAN-PLACEHOLDER",
      plan_anniversary: "0101",
      dopt: "2024-06-30",
      bpd: null,
      dobf: frozen ? "2011-01-01" : null,
    },
    resolved_plan_logic: {
      accrued_benefit_formula: "fixture_final_average_pay_formula",
      compensation_definition_rule: fixture.compensation_basis_code,
      average_compensation_rule: fixture.average_compensation_rule,
      covered_compensation_rule: coveredCompensation === null ? null : "reviewed_covered_compensation",
      pia_offset_rule: null,
      eligibility_service_rule: "plan_year_1000_hours",
      benefit_service_rule: "plan_year_1000_hours",
      accrual_factor_rule: null,
      short_service_factor_rule: null,
    },
    participant_role_population: {
      bcv_rec_id: createDeterministicId("bcv"),
      retstat: "terminated",
      id: subjectKey,
      role_type: "participant",
      dob: "1960-04-15",
      retirement_status_as_of_dopt: "deferred_vested",
    },
    service_employment_history: {
      doh: "1985-07-01",
      dop: "1986-01-01",
      dote: "2010-12-31",
    },
    compensation_accrual_inputs: {
      compensation_basis_code: fixture.compensation_basis_code,
      average_compensation_period: "5_year",
      compensation_history_available_indicator: booleanFromFixture(fixture.compensation_history_available_indicator),
      final_average_compensation: numericOrNull(fixture.final_average_compensation),
      covered_compensation_amount: coveredCompensation,
      frozen_accrued_benefit_indicator: frozen,
      frozen_accrued_monthly_benefit: null,
      accrued_benefit_at_dopt: null,
      vested_percentage_at_dopt: 1,
    },
    benefit_administration_state: {
      dor: null,
      asd: null,
    },
    limitation_packet: {
      bankruptcy_plan_indicator: false,
      bpd_limitation_indicator: false,
    },
    ...(frozen
      ? {
          frozen_benefit_support_packet: {
            freeze_basis_note: "Fixture frozen benefit support branch",
            frozen_accrual_date: "2011-01-01",
            frozen_benefit_support_source: "reviewed_fixture",
          },
        }
      : {}),
  };
}

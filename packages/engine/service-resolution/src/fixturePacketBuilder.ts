import { createDeterministicId } from "@pbgc/shared";
import type { ServiceResolutionFixture, ServiceResolutionPacket } from "./types";

function blankToNull(value: string): string | null {
  return value.trim() === "" ? null : value;
}

export function buildServicePacketFromFixture(fixture: ServiceResolutionFixture): ServiceResolutionPacket {
  const subjectKey = fixture.test_case_id;
  const dobf = blankToNull(fixture.dobf);
  return {
    packet_type: "service_resolution",
    schema_version: "0.1.0",
    case_id: "CASE-PLACEHOLDER",
    subject_type: "participant",
    subject_key: subjectKey,
    case_plan_timeline: {
      case_id: "CASE-PLACEHOLDER",
      plan_id: "PLAN-PLACEHOLDER",
      plan_anniversary: fixture.plan_anniversary_service_basis,
      dopt: blankToNull(fixture.dopt),
      bpd: null,
      dobf,
    },
    resolved_plan_logic: {
      participation_eligibility_rule: "fixture_participation_eligibility",
      participation_date_rule: "fixture_participation_date",
      normal_retirement_eligibility_rule: "fixture_normal_retirement",
      early_unreduced_retirement_rule: null,
      early_reduced_retirement_rule: "fixture_early_reduced",
      deferred_vested_normal_retirement_rule: "fixture_deferred_vested_normal",
      deferred_vested_early_retirement_rule: null,
      eligibility_service_rule: fixture.service_basis_code,
      vesting_service_rule: fixture.service_basis_code,
      benefit_service_rule: fixture.service_basis_code,
      accrued_benefit_formula: "fixture_accrued_benefit",
      accrual_factor_rule: fixture.service_basis_code,
      short_service_factor_rule: null,
      transfer_rule: null,
      one_year_break_in_service_rule: null,
    },
    participant_role_population: {
      bcv_rec_id: createDeterministicId("bcv"),
      retstat: fixture.dote.trim() === "" ? "active" : "terminated",
      id: subjectKey,
      role_type: "participant",
      retirement_status_as_of_dopt: fixture.dote.trim() === "" ? "active_at_dopt" : "terminated_before_dopt",
    },
    service_employment_history: {
      doh: blankToNull(fixture.doh),
      dop: blankToNull(fixture.dop),
      dote: blankToNull(fixture.dote),
      service_basis_code: fixture.service_basis_code,
      service_hours_requirement: Number(fixture.service_hours_requirement),
      service_period_basis: fixture.service_period_basis,
      plan_anniversary_service_basis: fixture.plan_anniversary_service_basis,
    },
    actuarial_assumption_factor_set: {
      retirement_age_convention: "whole_years",
    },
    limitation_packet: {
      bankruptcy_plan_indicator: false,
      bpd_limitation_indicator: false,
      ongoing_employment_contingency_indicator: false,
    },
    ...(dobf
      ? {
          frozen_accrual_packet: {
            accrual_freeze_date: dobf,
            freeze_basis_note: "Fixture DOBF supplied as reviewed freeze boundary",
          },
        }
      : {}),
  };
}

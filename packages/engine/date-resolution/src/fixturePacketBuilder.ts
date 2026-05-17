import { createDeterministicId } from "@pbgc/shared";
import type { DateResolutionPacket } from "./types";

export type DateResolutionFixture = {
  test_case_id: string;
  description: string;
  retstat: string;
  role_type: DateResolutionPacket["subject_type"];
  dob: string;
  dote: string;
  dod: string;
  dopt: string;
  plan_anniversary: string;
  normal_retirement_eligibility_rule: string;
  normal_retirement_start_rule: string;
  early_reduced_retirement_rule: string;
  expected_nrd: string;
  expected_erd: string;
  expected_rbd: string;
  expected_xra: string;
  expected_xrd: string;
};

function blankToNull(value: string): string | null {
  return value.trim() === "" ? null : value;
}

export function buildPacketFromFixture(fixture: DateResolutionFixture): DateResolutionPacket {
  const subjectKey = fixture.test_case_id;
  const roleType = fixture.role_type;
  return {
    packet_type: "date_resolution",
    schema_version: "0.1.0",
    case_id: "CASE-PLACEHOLDER",
    subject_type: roleType,
    subject_key: subjectKey,
    case_plan_timeline: {
      case_id: "CASE-PLACEHOLDER",
      plan_id: "PLAN-PLACEHOLDER",
      plan_anniversary: fixture.plan_anniversary,
      dopt: blankToNull(fixture.dopt),
      dotr: null,
      bpd: null,
    },
    resolved_plan_logic: {
      normal_retirement_eligibility_rule: fixture.normal_retirement_eligibility_rule,
      normal_retirement_start_rule: fixture.normal_retirement_start_rule,
      early_unreduced_retirement_rule: null,
      early_reduced_retirement_rule: fixture.early_reduced_retirement_rule,
      deferred_vested_normal_retirement_rule: fixture.normal_retirement_eligibility_rule,
      deferred_vested_early_retirement_rule: fixture.early_reduced_retirement_rule,
      late_retirement_rule: null,
      default_actuarial_equivalence_rule: null,
    },
    participant_role_population: {
      bcv_rec_id: createDeterministicId("bcv"),
      retstat: fixture.retstat,
      id: subjectKey,
      role_type: roleType,
      dob: blankToNull(fixture.dob),
      sdob: null,
      dod: blankToNull(fixture.dod),
      non_spouse_benf: roleType === "beneficiary",
      retirement_status_as_of_dopt: fixture.retstat,
    },
    service_employment_history: {
      doh: null,
      dop: null,
      dote: blankToNull(fixture.dote),
    },
    benefit_administration_state: {
      dor: fixture.retstat === "1" ? firstNonNull(blankToNull(fixture.expected_xrd), blankToNull(fixture.expected_nrd)) : null,
      asd: fixture.retstat === "1" ? firstNonNull(blankToNull(fixture.expected_xrd), blankToNull(fixture.expected_nrd)) : null,
      sbcd: null,
      current_pay_status: fixture.retstat === "1" ? "in_pay" : "not_in_pay",
    },
    actuarial_assumption_factor_set: {
      retirement_age_convention: "whole_years",
      required_beginning_date_method: "fixture_v0.1.0",
    },
    limitation_packet: {
      bankruptcy_plan_indicator: false,
      bpd_limitation_indicator: false,
      annuity_starting_date_limitation_indicator: false,
    },
  };
}

function firstNonNull<T>(...values: (T | null)[]): T | null {
  return values.find((value): value is T => value !== null) ?? null;
}

import { createDeterministicId } from "@pbgc/shared";
import type { FormResolutionFixture, FormResolutionPacket } from "./types";

function booleanFromFixture(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}

export function buildFormPacketFromFixture(fixture: FormResolutionFixture): FormResolutionPacket {
  const subjectKey = fixture.test_case_id;
  const inPay = fixture.current_pay_status === "in_pay";
  const qdro = booleanFromFixture(fixture.qdro_indicator);
  const qpsa = booleanFromFixture(fixture.qpsa_indicator);
  return {
    packet_type: "form_resolution",
    schema_version: "0.1.0",
    case_id: "CASE-PLACEHOLDER",
    subject_type: fixture.role_type,
    subject_key: subjectKey,
    case_plan_timeline: {
      case_id: "CASE-PLACEHOLDER",
      plan_id: "PLAN-PLACEHOLDER",
      dopt: "2024-06-30",
      bpd: null,
      dobf: null,
    },
    resolved_plan_logic: {
      normal_single_form_rule: fixture.normal_single_form_rule,
      normal_married_form_rule: fixture.normal_married_form_rule,
      form_conversion_basis_rule: "plan_actuarial_equivalence",
      pre_retirement_death_benefit_rule: fixture.pre_retirement_death_benefit_rule,
      post_retirement_death_benefit_rule: null,
      consensual_lump_sum_rule: fixture.consensual_lump_sum_rule,
      default_actuarial_equivalence_rule: "default_417e",
    },
    participant_role_population: {
      bcv_rec_id: createDeterministicId("bcv"),
      retstat: "terminated",
      id: subjectKey,
      role_type: fixture.role_type,
      mstat: fixture.mstat,
      psex: "M",
      ssex: fixture.mstat === "M" ? "F" : null,
      dod: null,
      relation: fixture.role_type === "beneficiary" ? "spouse" : null,
      non_spouse_benf: false,
      qdro_indicator: qdro,
      qpsa_indicator: qpsa,
      retirement_status_as_of_dopt: fixture.expected_rettyp || (inPay ? "in_pay" : "deferred_vested"),
      payment_status_as_of_dopt: fixture.current_pay_status,
    },
    benefit_administration_state: {
      dor: inPay ? "2020-01-01" : null,
      asd: inPay ? "2020-01-01" : null,
      sbcd: null,
      current_form_code: inPay ? "2" : null,
      current_payment_amount: inPay ? 1000 : null,
      current_pay_status: fixture.current_pay_status,
      elected_form_indicator: inPay,
      spouse_beneficiary_commencement_state: fixture.mstat === "M" ? "reviewed_spouse" : null,
    },
    actuarial_assumption_factor_set: {
      form_conversion_method: "plan_actuarial_equivalence",
      lump_sum_basis_code: null,
      annuity_basis_code: "annuity_basis_default",
    },
    limitation_packet: {
      annuity_starting_date_limitation_indicator: false,
      death_benefit_limitation_indicator: false,
      form_of_benefit_limitation_indicator: false,
      actuarial_equivalence_limitation_indicator: false,
    },
    ...(inPay
      ? {
          in_pay_packet: {
            current_form_code: "2",
            annuity_status_pay: "pay",
          },
        }
      : {}),
    ...(qpsa
      ? {
          qpsa_packet: {
            qpsa_form_code: "QPSA",
          },
        }
      : {}),
    ...(qdro
      ? {
          qdro_packet: {
            qdro_form_treatment: "separate_interest",
          },
        }
      : {}),
    ...(fixture.pre_retirement_death_benefit_rule === "qpsa"
      ? {
          death_benefit_packet: {
            death_form_code: "QPSA",
          },
        }
      : {}),
  };
}

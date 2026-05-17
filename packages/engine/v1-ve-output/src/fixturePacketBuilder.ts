import { buildPacketFromFixture as buildDatePacketFromFixture, resolveDates, type DateResolutionFixture } from "@pbgc/date-resolution";
import { buildServicePacketFromFixture, resolveService, type ServiceResolutionFixture } from "@pbgc/service-resolution";
import { buildCompensationPacketFromFixture, resolveCompensation, type CompensationResolutionFixture } from "@pbgc/compensation-resolution";
import { buildFormPacketFromFixture, resolveForms, type FormResolutionFixture } from "@pbgc/form-resolution";
import { buildBenefitPacketFromFixture, resolveBenefitKernel, type BenefitKernelFixture } from "@pbgc/benefit-kernel";
import type { V1VeFixture, V1VeOutputPacket } from "./types";

function booleanFromFixture(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}

export function buildV1VePacketFromFixture(fixture: V1VeFixture): V1VeOutputPacket {
  const datePacket = buildDatePacketFromFixture(fixture.date_fixture as DateResolutionFixture);
  const servicePacket = buildServicePacketFromFixture(fixture.service_fixture as ServiceResolutionFixture);
  const compensationPacket = buildCompensationPacketFromFixture(fixture.compensation_fixture as CompensationResolutionFixture);
  const formPacket = buildFormPacketFromFixture(fixture.form_fixture as FormResolutionFixture);
  const benefitPacket = buildBenefitPacketFromFixture(fixture.benefit_fixture as BenefitKernelFixture);

  const dateValues = resolveDates(datePacket);
  const serviceValues = resolveService(servicePacket);
  const compensationResolved = resolveCompensation(compensationPacket, `packet-${fixture.test_case_id}`, "0.1.0");
  const formResolved = resolveForms(formPacket, `packet-${fixture.test_case_id}`, "0.1.0");
  const benefitResolved = resolveBenefitKernel(benefitPacket, `packet-${fixture.test_case_id}`, "0.1.0");

  const subjectType = fixture.form_fixture.role_type;
  const subjectKey = fixture.test_case_id;

  return {
    packet_type: "v1_ve_output",
    schema_version: "0.1.0",
    case_id: "CASE-PLACEHOLDER",
    subject_type: subjectType,
    subject_key: subjectKey,
    case_plan_timeline: {
      case_id: "CASE-PLACEHOLDER",
      plan_id: "PLAN-PLACEHOLDER",
      dopt: datePacket.case_plan_timeline.dopt,
      dotr: benefitPacket.case_plan_timeline.dotr,
      bpd: datePacket.case_plan_timeline.bpd,
      dobf: benefitPacket.case_plan_timeline.dobf,
    },
    participant_role_population: {
      bcv_rec_id: datePacket.participant_role_population.bcv_rec_id,
      custid: `CUST-${fixture.test_case_id}`,
      retstat: datePacket.participant_role_population.retstat,
      id: subjectKey,
      fname: "Reviewed",
      lname: "Participant",
      sfname: null,
      slname: null,
      psex: datePacket.participant_role_population.role_type === "beneficiary" ? null : "M",
      ssex: null,
      mstat: formPacket.participant_role_population.mstat,
      dob: datePacket.participant_role_population.dob,
      sdob: null,
      dod: datePacket.participant_role_population.dod,
      relation: null,
      non_spouse_benf: datePacket.participant_role_population.non_spouse_benf,
      qdro_indicator: formPacket.participant_role_population.qdro_indicator,
      qpsa_indicator: formPacket.participant_role_population.qpsa_indicator,
      retirement_status_as_of_dopt: datePacket.participant_role_population.retirement_status_as_of_dopt,
      payment_status_as_of_dopt: formPacket.participant_role_population.payment_status_as_of_dopt,
    },
    benefit_administration_state: {
      dor: formPacket.benefit_administration_state.dor,
      asd: formPacket.benefit_administration_state.asd,
      sbcd: formPacket.benefit_administration_state.sbcd,
      current_form_code: formPacket.benefit_administration_state.current_form_code,
      current_payment_amount: formPacket.benefit_administration_state.current_payment_amount,
      current_pay_status: formPacket.benefit_administration_state.current_pay_status,
      elected_form_indicator: formPacket.benefit_administration_state.elected_form_indicator,
      spouse_beneficiary_commencement_state: formPacket.benefit_administration_state.spouse_beneficiary_commencement_state,
    },
    limitation_packet: {
      calc_indicator: "V",
      calculation_context: "termination_valuation",
      section_436_applicable_indicator: booleanFromFixture(fixture.benefit_fixture.section_436_applicable_indicator),
      phase_in_limitation_indicator: booleanFromFixture(fixture.benefit_fixture.phase_in_limitation_indicator),
      annuity_starting_date_limitation_indicator: false,
      death_benefit_limitation_indicator: false,
      form_of_benefit_limitation_indicator: false,
      actuarial_equivalence_limitation_indicator: false,
    },
    resolved_dates: {
      ...dateValues,
    },
    resolved_service_compensation: {
      ...serviceValues,
      compensation_resolved: compensationResolved.values.compensation_resolved,
      average_compensation_resolved: compensationResolved.values.average_compensation_resolved,
      covered_compensation_resolved: compensationResolved.values.covered_compensation_resolved,
    },
    resolved_forms_status: {
      rettyp: formResolved.values.rettyp,
      form_code_nsf: formResolved.values.form_code_nsf,
      form_code_nmf: formResolved.values.form_code_nmf,
      form_code_ptp: formResolved.values.form_code_ptp,
      form_code_ptp_qpsa: formResolved.values.form_code_ptp_qpsa,
      form_code_death: formResolved.values.form_code_death,
      annuity_status_pay: formResolved.values.annuity_status_pay,
      lsoption: formResolved.values.lsoption,
      bs_ind: formResolved.values.bs_ind,
      br_ind: formResolved.values.br_ind,
      ofa_indicator: formResolved.values.ofa_indicator,
    },
    benefit_kernel_output: {
      ...benefitResolved.values,
    },
  };
}

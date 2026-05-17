import { buildPacketFromFixture as buildDatePacketFromFixture, resolveDates, type DateResolutionFixture } from "@pbgc/date-resolution";
import { buildServicePacketFromFixture, resolveService, type ServiceResolutionFixture } from "@pbgc/service-resolution";
import { buildCompensationPacketFromFixture, resolveCompensation, type CompensationResolutionFixture } from "@pbgc/compensation-resolution";
import { buildFormPacketFromFixture, resolveForms, type FormResolutionFixture } from "@pbgc/form-resolution";
import { buildBenefitPacketFromFixture, resolveBenefitKernel, type BenefitKernelFixture } from "@pbgc/benefit-kernel";
import { buildV1VePacketFromFixture, resolveV1VeOutput, type V1VeFixture } from "@pbgc/v1-ve-output";
import type { ValuationListingsFixture, ValuationListingsOutputPacket, ValuationListingsRowType } from "./types";

function toV1Fixture(fixture: ValuationListingsFixture): V1VeFixture {
  return {
    test_case_id: fixture.test_case_id,
    description: fixture.description,
    date_fixture: fixture.date_fixture as DateResolutionFixture,
    service_fixture: fixture.service_fixture as ServiceResolutionFixture,
    compensation_fixture: fixture.compensation_fixture as CompensationResolutionFixture,
    form_fixture: fixture.form_fixture as FormResolutionFixture,
    benefit_fixture: fixture.benefit_fixture as BenefitKernelFixture,
  };
}

function buildListingSortKey(listingRowType: ValuationListingsRowType, bcvRecId: string): string {
  return `${listingRowType}|${bcvRecId}`;
}

export function buildValuationListingsPacketFromFixture(fixture: ValuationListingsFixture): ValuationListingsOutputPacket {
  const v1Fixture = toV1Fixture(fixture);
  const v1Packet = buildV1VePacketFromFixture(v1Fixture);
  const v1Resolved = resolveV1VeOutput(v1Packet, `packet-${fixture.test_case_id}`, "0.1.0");
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
  const listingSortKey = buildListingSortKey(fixture.listing_row_type, v1Packet.participant_role_population.bcv_rec_id);

  return {
    packet_type: "valuation_listings_output",
    schema_version: "0.1.0",
    case_id: "CASE-PLACEHOLDER",
    subject_type: v1Packet.subject_type,
    subject_key: fixture.test_case_id,
    listing_row_type: fixture.listing_row_type,
    case_plan_timeline: {
      ...v1Packet.case_plan_timeline,
      dobf: v1Packet.case_plan_timeline.dobf,
    },
    participant_role_population: {
      ...v1Packet.participant_role_population,
      role_type: v1Packet.subject_type,
    },
    service_employment_history: {
      doh: servicePacket.service_employment_history.doh,
      dop: servicePacket.service_employment_history.dop,
      dote: servicePacket.service_employment_history.dote,
    },
    compensation_accrual_inputs: {
      compensation_basis_code: compensationPacket.compensation_accrual_inputs.compensation_basis_code,
      average_compensation_period: compensationPacket.compensation_accrual_inputs.average_compensation_period,
      compensation_history_available_indicator: compensationPacket.compensation_accrual_inputs.compensation_history_available_indicator,
      final_average_compensation: compensationPacket.compensation_accrual_inputs.final_average_compensation,
      covered_compensation_amount: compensationPacket.compensation_accrual_inputs.covered_compensation_amount,
      frozen_accrued_benefit_indicator: compensationPacket.compensation_accrual_inputs.frozen_accrued_benefit_indicator,
      frozen_accrued_monthly_benefit: compensationPacket.compensation_accrual_inputs.frozen_accrued_monthly_benefit,
      accrued_benefit_at_dopt: compensationPacket.compensation_accrual_inputs.accrued_benefit_at_dopt,
      vested_percentage_at_dopt: compensationPacket.compensation_accrual_inputs.vested_percentage_at_dopt,
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
      calc_indicator: true,
      calculation_context: "termination_valuation",
      section_436_applicable_indicator: Boolean(benefitPacket.limitation_packet.section_436_applicable_indicator),
      phase_in_limitation_indicator: Boolean(benefitPacket.limitation_packet.phase_in_limitation_indicator),
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
    v1_ve_output_row: v1Resolved.row,
  };
}

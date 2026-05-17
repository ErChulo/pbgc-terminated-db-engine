import { buildValuationListingsPacketFromFixture, resolveValuationListingsOutput, type ValuationListingsFixture } from "@pbgc/valuation-listings-output";
import type { BsrsConfigurationFixture, BsrsConfigurationOutputPacket, BsrsStatementRowType, BsrsSubjectType } from "./types";

function toStatementRowType(subjectType: BsrsSubjectType, fixture: BsrsConfigurationFixture): BsrsStatementRowType {
  if (fixture.statement_row_type) return fixture.statement_row_type;
  return subjectType;
}

function buildStatementSortKey(statementRowType: BsrsStatementRowType, bcvRecId: string): string {
  return `${statementRowType}|${bcvRecId}`;
}

export function buildBsrsConfigurationPacketFromFixture(fixture: BsrsConfigurationFixture): BsrsConfigurationOutputPacket {
  const valuationFixture = fixture.valuation_fixture as ValuationListingsFixture;
  const valuationPacket = buildValuationListingsPacketFromFixture(valuationFixture);
  const valuationResolved = resolveValuationListingsOutput(valuationPacket, `packet-${fixture.test_case_id}`, "0.1.0");
  const statementRowType = toStatementRowType(valuationPacket.subject_type, fixture);
  const statementSortKey = buildStatementSortKey(statementRowType, valuationPacket.participant_role_population.bcv_rec_id);
  const currentPayStatus = valuationPacket.benefit_administration_state.current_pay_status;
  const inPay = currentPayStatus === "in_pay";

  return {
    packet_type: "bsrs_configuration_output",
    schema_version: "0.1.0",
    case_id: valuationPacket.case_id,
    subject_type: valuationPacket.subject_type,
    subject_key: fixture.test_case_id,
    statement_row_type: statementRowType,
    statement_sort_key: statementSortKey,
    case_plan_timeline: {
      ...valuationPacket.case_plan_timeline,
      plan_name: "Reviewed Plan",
    },
    participant_role_population: valuationPacket.participant_role_population,
    service_employment_history: valuationPacket.service_employment_history,
    benefit_administration_state: {
      ...valuationPacket.benefit_administration_state,
      current_monthly_benefit: valuationPacket.benefit_administration_state.current_payment_amount,
      last_payment_date: valuationPacket.resolved_dates.xrd ?? valuationPacket.resolved_dates.nrd ?? null,
    },
    limitation_packet: valuationPacket.limitation_packet,
    resolved_dates: valuationPacket.resolved_dates,
    resolved_service_compensation: valuationPacket.resolved_service_compensation,
    resolved_forms_status: {
      ...valuationPacket.resolved_forms_status,
      form_code_ard: inPay ? valuationPacket.benefit_administration_state.current_form_code : null,
      spc_ard: inPay ? `SPC-${fixture.test_case_id}` : null,
      mths_ard: inPay ? 60 : null,
      lev_mb_ard: inPay ? valuationPacket.benefit_administration_state.current_payment_amount : null,
    },
    benefit_kernel_output: valuationPacket.benefit_kernel_output,
    v1_ve_output_row: valuationPacket.v1_ve_output_row,
    valuation_listings_output_row: valuationResolved.row,
    in_pay_packet: inPay
      ? {
          form_code_ard: valuationPacket.benefit_administration_state.current_form_code ?? "ARD",
          spc_ard: `SPC-${fixture.test_case_id}`,
          mths_ard: 60,
          lev_mb_ard: valuationPacket.benefit_administration_state.current_payment_amount ?? 0,
          current_monthly_benefit: valuationPacket.benefit_administration_state.current_payment_amount,
          last_payment_date: valuationPacket.resolved_dates.xrd ?? valuationPacket.resolved_dates.nrd ?? null,
        }
      : undefined,
    qdro_packet: valuationPacket.participant_role_population.qdro_indicator
      ? {
          qdro_type: "standard",
          separate_interest_indicator: false,
          alternate_payee_name: valuationPacket.participant_role_population.fname,
          alternate_payee_dob: valuationPacket.participant_role_population.dob,
          qdro_effective_date: valuationPacket.case_plan_timeline.dopt,
        }
      : undefined,
    qpsa_packet: valuationPacket.participant_role_population.qpsa_indicator
      ? {
          qpsa_survivor_percentage: 50,
          qpsa_commencement_date: valuationPacket.case_plan_timeline.dotr,
          qpsa_form_rule: "standard",
        }
      : undefined,
    death_benefit_packet: statementRowType === "survivor"
      ? {
          survivor_type: "spouse",
          survivor_asd: valuationPacket.benefit_administration_state.asd,
          death_benefit_form: valuationPacket.resolved_forms_status.form_code_death ?? "DEATH",
          death_benefit_amount: valuationResolved.row.xrd_surv_mb_term ?? null,
      }
      : undefined,
    trace_inputs: {
      ce_track1: `CE1-${fixture.test_case_id}`,
      ce_track2: `CE2-${fixture.test_case_id}`,
      ce_track3: `CE3-${fixture.test_case_id}`,
      ce_track4: `CE4-${fixture.test_case_id}`,
      ce_track5: `CE5-${fixture.test_case_id}`,
      ce_track6: `CE6-${fixture.test_case_id}`,
      rule_trace_id: `RULE-${fixture.test_case_id}`,
      calculation_run_id: `INPUT-${fixture.test_case_id}`,
      deliverable_version: "0.1.0",
      schema_version: "0.1.0",
    },
  };
}

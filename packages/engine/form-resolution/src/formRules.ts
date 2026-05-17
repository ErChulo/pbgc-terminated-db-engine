import type { FormResolutionPacket, FormResolutionValues } from "./types";

export function resolveFormValues(packet: FormResolutionPacket): FormResolutionValues {
  const inPay = packet.benefit_administration_state.current_pay_status === "in_pay";
  const qdro = packet.participant_role_population.qdro_indicator;
  return {
    rettyp: qdro ? null : inPay ? "in_pay" : packet.participant_role_population.retirement_status_as_of_dopt,
    form_code_nsf: inPay ? null : "1",
    form_code_nmf: inPay ? null : "2",
    form_code_ptp: inPay ? packet.in_pay_packet?.current_form_code ?? packet.benefit_administration_state.current_form_code : null,
    form_code_ptp_qpsa: packet.participant_role_population.qpsa_indicator ? packet.qpsa_packet?.qpsa_form_code ?? "QPSA" : null,
    form_code_death: inPay || qdro ? null : packet.death_benefit_packet?.death_form_code ?? "QPSA",
    annuity_status_pay: inPay ? packet.in_pay_packet?.annuity_status_pay ?? "pay" : null,
    lsoption: "N",
    bs_ind: qdro ? "QDRO" : null,
    br_ind: packet.participant_role_population.role_type === "beneficiary" ? "B" : null,
    ofa_indicator: inPay ? "IN_PAY" : null,
  };
}

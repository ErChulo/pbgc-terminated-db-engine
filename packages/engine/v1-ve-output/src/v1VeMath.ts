import type { StructuredIssue } from "@pbgc/shared";
import { canonicalDdFieldName, V1_VE_OUTPUT_FIELDS } from "./ddMapping";
import type { V1VeOutputPacket, V1VeOutputRow } from "./types";

const WARNING_ON_NULL_FIELDS = new Set([
  "TERM_MB_NRD_NSF",
  "XRD_MB_TERM",
  "PVMB_TERM",
]);

export function projectV1VeRow(packet: V1VeOutputPacket): { row: V1VeOutputRow; warnings: StructuredIssue[] } {
  const row: V1VeOutputRow = {
    bcv_rec_id: packet.participant_role_population.bcv_rec_id,
    custid: packet.participant_role_population.custid,
    retstat: packet.participant_role_population.retstat,
    id: packet.participant_role_population.id,
    fname: packet.participant_role_population.fname,
    lname: packet.participant_role_population.lname,
    sfname: packet.participant_role_population.sfname,
    slname: packet.participant_role_population.slname,
    psex: packet.participant_role_population.psex,
    ssex: packet.participant_role_population.ssex,
    mstat: packet.participant_role_population.mstat,
    dob: packet.participant_role_population.dob,
    sdob: packet.participant_role_population.sdob,
    dod: packet.participant_role_population.dod,
    relation: packet.participant_role_population.relation,
    non_spouse_benf: packet.participant_role_population.non_spouse_benf,
    qdro_indicator: packet.participant_role_population.qdro_indicator,
    qpsa_indicator: packet.participant_role_population.qpsa_indicator,
    calc_indicator: packet.limitation_packet.calc_indicator,
    calculation_context: packet.limitation_packet.calculation_context,
    nrd: packet.resolved_dates.nrd,
    erd: packet.resolved_dates.erd,
    eurd: packet.resolved_dates.eurd,
    eprd: packet.resolved_dates.eprd,
    rbd: packet.resolved_dates.rbd,
    xra: packet.resolved_dates.xra,
    xrd: packet.resolved_dates.xrd,
    sxra: packet.resolved_dates.sxra,
    term_lw_xra: packet.resolved_dates.term_lw_xra,
    term_lw_anb: packet.resolved_dates.term_lw_anb,
    rettyp: packet.resolved_forms_status.rettyp,
    form_code_nsf: packet.resolved_forms_status.form_code_nsf,
    form_code_nmf: packet.resolved_forms_status.form_code_nmf,
    form_code_ptp: packet.resolved_forms_status.form_code_ptp,
    form_code_ptp_qpsa: packet.resolved_forms_status.form_code_ptp_qpsa,
    form_code_death: packet.resolved_forms_status.form_code_death,
    annuity_status_pay: packet.resolved_forms_status.annuity_status_pay,
    lsoption: packet.resolved_forms_status.lsoption,
    bs_ind: packet.resolved_forms_status.bs_ind,
    br_ind: packet.resolved_forms_status.br_ind,
    ofa_indicator: packet.resolved_forms_status.ofa_indicator,
    eligibility_service_resolved: packet.resolved_service_compensation.eligibility_service_resolved,
    vesting_service_resolved: packet.resolved_service_compensation.vesting_service_resolved,
    benefit_service_resolved: packet.resolved_service_compensation.benefit_service_resolved,
    accrual_service_resolved: packet.resolved_service_compensation.accrual_service_resolved,
    compensation_resolved: packet.resolved_service_compensation.compensation_resolved,
    average_compensation_resolved: packet.resolved_service_compensation.average_compensation_resolved,
    covered_compensation_resolved: packet.resolved_service_compensation.covered_compensation_resolved,
    ...packet.benefit_kernel_output,
  };

  const warnings = Object.entries(row)
    .filter(([field, value]) => value === null && WARNING_ON_NULL_FIELDS.has(canonicalDdFieldName(field)))
    .map(([field]) => ({
      code: "NULL_OUTPUT_FIELD",
      message: `Projected explicit null for ${field} because the reviewed branch is not populated`,
      field_name: field,
      input_group: "benefit_kernel_output",
      input_packet_id: "direct",
      module_name: "v1_ve_output" as const,
      rule_version: "0.1.0",
    }));

  return { row, warnings };
}

export function outputFieldNames(): string[] {
  return [...V1_VE_OUTPUT_FIELDS];
}

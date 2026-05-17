import { BENEFIT_KERNEL_OUTPUT_FIELDS } from "@pbgc/benefit-kernel";

const V1_VE_CORE_OUTPUT_FIELDS = [
  "bcv_rec_id",
  "custid",
  "retstat",
  "id",
  "fname",
  "lname",
  "sfname",
  "slname",
  "psex",
  "ssex",
  "mstat",
  "dob",
  "sdob",
  "dod",
  "relation",
  "non_spouse_benf",
  "qdro_indicator",
  "qpsa_indicator",
  "calc_indicator",
  "calculation_context",
  "nrd",
  "erd",
  "eurd",
  "eprd",
  "rbd",
  "xra",
  "xrd",
  "sxra",
  "term_lw_xra",
  "term_lw_anb",
  "rettyp",
  "form_code_nsf",
  "form_code_nmf",
  "form_code_ptp",
  "form_code_ptp_qpsa",
  "form_code_death",
  "annuity_status_pay",
  "lsoption",
  "bs_ind",
  "br_ind",
  "ofa_indicator",
  "eligibility_service_resolved",
  "vesting_service_resolved",
  "benefit_service_resolved",
  "accrual_service_resolved",
  "compensation_resolved",
  "average_compensation_resolved",
  "covered_compensation_resolved",
] as const;

export const V1_VE_OUTPUT_FIELDS = [...V1_VE_CORE_OUTPUT_FIELDS, ...BENEFIT_KERNEL_OUTPUT_FIELDS] as const;

const V1_VE_OUTPUT_FIELDS_WITHOUT_DD_MAPPING = new Set([
  "custid",
  "calculation_context",
  "eprd",
  "rbd",
  "eligibility_service_resolved",
  "vesting_service_resolved",
  "benefit_service_resolved",
  "accrual_service_resolved",
  "compensation_resolved",
  "average_compensation_resolved",
  "covered_compensation_resolved",
]);

export function canonicalDdFieldName(v1FieldName: string): string {
  return v1FieldName.toUpperCase();
}

export function resolveV1FieldName(ddFieldName: string): string {
  return ddFieldName.toLowerCase();
}

export function hasDdMapping(v1FieldName: string): boolean {
  return !V1_VE_OUTPUT_FIELDS_WITHOUT_DD_MAPPING.has(v1FieldName);
}

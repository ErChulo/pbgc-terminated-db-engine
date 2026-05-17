import type { Database } from "sql.js";
import type { EngineRunRecord, ModuleTrace } from "@pbgc/shared";
import type { DateResolutionOutput, DateResolutionPacket } from "@pbgc/date-resolution";
import type { BenefitKernelOutput, BenefitKernelPacket } from "@pbgc/benefit-kernel";
import type { ServiceResolutionOutput, ServiceResolutionPacket } from "@pbgc/service-resolution";
import type { CompensationResolutionOutput, CompensationResolutionPacket } from "@pbgc/compensation-resolution";
import type { FormResolutionOutput, FormResolutionPacket } from "@pbgc/form-resolution";
import type { V1VeOutputPacket, V1VeOutputRowRecord } from "@pbgc/v1-ve-output";
import type { ValuationListingsOutputPacket, ValuationListingOutputRowRecord } from "@pbgc/valuation-listings-output";
import type { BsrsConfigurationOutputPacket, BsrsConfigurationOutputRecord } from "@pbgc/bsrs-configuration-output";
import { queryAll, queryOne } from "./sqljs";

export type EngineInputPacketRecord = {
  input_packet_id: string;
  case_id: string;
  subject_key: string;
  subject_type: string;
  packet_type: "date_resolution" | "service_resolution" | "compensation_resolution" | "form_resolution" | "benefit_kernel" | "v1_ve_output" | "valuation_listings_output" | "bsrs_configuration_output";
  schema_version: string;
  packet_json: string;
  built_from_resolved_at: string | null;
  built_by: string;
  built_at: string;
  status: "active" | "superseded" | "rejected";
};

export function insertEngineInputPacket(db: Database, packet: EngineInputPacketRecord): void {
  db.run(
    `INSERT INTO engine_input_packet (
      input_packet_id, case_id, subject_key, subject_type, packet_type, schema_version,
      packet_json, built_from_resolved_at, built_by, built_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      packet.input_packet_id,
      packet.case_id,
      packet.subject_key,
      packet.subject_type,
      packet.packet_type,
      packet.schema_version,
      packet.packet_json,
      packet.built_from_resolved_at,
      packet.built_by,
      packet.built_at,
      packet.status,
    ],
  );
}

export function getEngineInputPacket(db: Database, inputPacketId: string): EngineInputPacketRecord | null {
  return queryOne(db, "SELECT * FROM engine_input_packet WHERE input_packet_id = ?", [inputPacketId]) as EngineInputPacketRecord | null;
}

export function insertEngineRun(db: Database, run: EngineRunRecord): void {
  db.run(
    `INSERT INTO engine_run (
      calculation_run_id, case_id, input_packet_id, rule_version, deliverable_version,
      run_context, started_at, completed_at, run_status, warning_count, error_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      run.calculation_run_id,
      run.case_id,
      run.input_packet_id,
      run.rule_version,
      run.deliverable_version,
      run.run_context,
      run.started_at,
      run.completed_at,
      run.run_status,
      run.warning_count,
      run.error_count,
    ],
  );
}

export function insertResolvedDatesOutput(db: Database, output: DateResolutionOutput): void {
  db.run(
    `INSERT INTO resolved_dates_output (
      resolved_dates_output_id, calculation_run_id, case_id, subject_key,
      nrd, erd, eurd, eprd, rbd, xra, xrd, sxra, term_lw_xra, term_lw_anb
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.resolved_dates_output_id,
      output.calculation_run_id,
      output.case_id,
      output.subject_key,
      output.nrd,
      output.erd,
      output.eurd,
      output.eprd,
      output.rbd,
      output.xra,
      output.xrd,
      output.sxra,
      output.term_lw_xra,
      output.term_lw_anb,
    ],
  );
}

export function listResolvedDatesOutputs(db: Database): DateResolutionOutput[] {
  return queryAll(db, "SELECT * FROM resolved_dates_output ORDER BY resolved_dates_output_id") as DateResolutionOutput[];
}

export function insertResolvedServiceOutput(db: Database, output: ServiceResolutionOutput): void {
  db.run(
    `INSERT INTO resolved_service_comp_output (
      resolved_service_comp_output_id, calculation_run_id, case_id, subject_key,
      eligibility_service_resolved, vesting_service_resolved, benefit_service_resolved, accrual_service_resolved,
      compensation_resolved, average_compensation_resolved, covered_compensation_resolved
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.resolved_service_comp_output_id,
      output.calculation_run_id,
      output.case_id,
      output.subject_key,
      output.eligibility_service_resolved,
      output.vesting_service_resolved,
      output.benefit_service_resolved,
      output.accrual_service_resolved,
      output.compensation_resolved,
      output.average_compensation_resolved,
      output.covered_compensation_resolved,
    ],
  );
}

export function listResolvedServiceOutputs(db: Database): ServiceResolutionOutput[] {
  return queryAll(db, "SELECT * FROM resolved_service_comp_output ORDER BY resolved_service_comp_output_id") as ServiceResolutionOutput[];
}

export function insertResolvedCompensationOutput(db: Database, output: CompensationResolutionOutput): void {
  const existing = queryOne(
    db,
    "SELECT * FROM resolved_service_comp_output WHERE case_id = ? AND subject_key = ? ORDER BY rowid DESC LIMIT 1",
    [output.case_id, output.subject_key],
  ) as CompensationResolutionOutput | null;
  const preserved = existing ?? output;
  db.run(
    `INSERT INTO resolved_service_comp_output (
      resolved_service_comp_output_id, calculation_run_id, case_id, subject_key,
      eligibility_service_resolved, vesting_service_resolved, benefit_service_resolved, accrual_service_resolved,
      compensation_resolved, average_compensation_resolved, covered_compensation_resolved
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.resolved_service_comp_output_id,
      output.calculation_run_id,
      output.case_id,
      output.subject_key,
      preserved.eligibility_service_resolved,
      preserved.vesting_service_resolved,
      preserved.benefit_service_resolved,
      preserved.accrual_service_resolved,
      output.compensation_resolved,
      output.average_compensation_resolved,
      output.covered_compensation_resolved,
    ],
  );
}

export function listResolvedCompensationOutputs(db: Database): CompensationResolutionOutput[] {
  return queryAll(db, "SELECT * FROM resolved_service_comp_output ORDER BY resolved_service_comp_output_id") as CompensationResolutionOutput[];
}

export function insertResolvedFormsOutput(db: Database, output: FormResolutionOutput): void {
  db.run(
    `INSERT INTO resolved_forms_output (
      resolved_forms_output_id, calculation_run_id, case_id, subject_key,
      rettyp, form_code_nsf, form_code_nmf, form_code_ptp, form_code_ptp_qpsa,
      form_code_death, annuity_status_pay, lsoption, bs_ind, br_ind, ofa_indicator
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.resolved_forms_output_id,
      output.calculation_run_id,
      output.case_id,
      output.subject_key,
      output.rettyp,
      output.form_code_nsf,
      output.form_code_nmf,
      output.form_code_ptp,
      output.form_code_ptp_qpsa,
      output.form_code_death,
      output.annuity_status_pay,
      output.lsoption,
      output.bs_ind,
      output.br_ind,
      output.ofa_indicator,
    ],
  );
}

export function listResolvedFormsOutputs(db: Database): FormResolutionOutput[] {
  return queryAll(db, "SELECT * FROM resolved_forms_output ORDER BY resolved_forms_output_id") as FormResolutionOutput[];
}

export function listFormRunsWithTrace(db: Database): Array<FormResolutionOutput & { trace_count: number }> {
  return queryAll(
    db,
    `SELECT rfo.*, COUNT(mt.module_trace_id) AS trace_count
     FROM resolved_forms_output rfo
     LEFT JOIN module_trace mt
       ON mt.calculation_run_id = rfo.calculation_run_id
      AND mt.module_name = 'form_resolution'
     GROUP BY rfo.resolved_forms_output_id
     ORDER BY rfo.resolved_forms_output_id`,
  ) as Array<FormResolutionOutput & { trace_count: number }>;
}

export function insertResolvedBenefitKernelOutput(db: Database, output: BenefitKernelOutput): void {
  db.run(
    `INSERT INTO benefit_kernel_output (
      benefit_kernel_output_id, calculation_run_id, case_id, subject_key,
      term_mb_nrd_nsf, term_surv_mb_nrd, term_surv_mb_eurd, term_surv_mb_erd,
      rbd_surv_mb_term, term_surv_mb_ard, xrd_mb_term, xrd_surv_mb_term,
      xrd_mb_qpsa_term, ls_term, ls_qpsa, xrd_mb_title_iv, nrd_mb_title_iv_nsf,
      eurd_mb_title_iv_nsf, erd_mb_title_iv_nsf, rbd_mb_title_iv, ard_mb_title_iv,
      pvmb_title_iv_no_q_no_l, pvmb_title_iv_qpsa, pvmb_title_iv_no_load, title_iv_load,
      pvmb_title_iv, xrd_mb_4022c, pvmb_4022c_no_q_no_l, pvmb_4022c_qpsa,
      pvmb_4022c_no_load, load_4022c, pvmb_4022c, pvmb_bas_ungb_no_q_no_l,
      pvmb_bas_ungb_qpsa, bnnfa_pvmb_no_load, bnnfa_load, bnnfa_pvmb,
      pvpbl_ann_rates_no_q_no_l, pvpbl_ann_rates_qpsa, pvpbl_ann_rates_no_load,
      pbl_load, pvpbl_ann_rates, pvf_lev_ann, pvf_lev_ls, pvf_qpsa_ls,
      pvmb_term_no_q_no_l, pvmb_term_qpsa, pvmb_term_no_load, term_load, pvmb_term
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.benefit_kernel_output_id,
      output.calculation_run_id,
      output.case_id,
      output.subject_key,
      output.term_mb_nrd_nsf,
      output.term_surv_mb_nrd,
      output.term_surv_mb_eurd,
      output.term_surv_mb_erd,
      output.rbd_surv_mb_term,
      output.term_surv_mb_ard,
      output.xrd_mb_term,
      output.xrd_surv_mb_term,
      output.xrd_mb_qpsa_term,
      output.ls_term,
      output.ls_qpsa,
      output.xrd_mb_title_iv,
      output.nrd_mb_title_iv_nsf,
      output.eurd_mb_title_iv_nsf,
      output.erd_mb_title_iv_nsf,
      output.rbd_mb_title_iv,
      output.ard_mb_title_iv,
      output.pvmb_title_iv_no_q_no_l,
      output.pvmb_title_iv_qpsa,
      output.pvmb_title_iv_no_load,
      output.title_iv_load,
      output.pvmb_title_iv,
      output.xrd_mb_4022c,
      output.pvmb_4022c_no_q_no_l,
      output.pvmb_4022c_qpsa,
      output.pvmb_4022c_no_load,
      output.load_4022c,
      output.pvmb_4022c,
      output.pvmb_bas_ungb_no_q_no_l,
      output.pvmb_bas_ungb_qpsa,
      output.bnnfa_pvmb_no_load,
      output.bnnfa_load,
      output.bnnfa_pvmb,
      output.pvpbl_ann_rates_no_q_no_l,
      output.pvpbl_ann_rates_qpsa,
      output.pvpbl_ann_rates_no_load,
      output.pbl_load,
      output.pvpbl_ann_rates,
      output.pvf_lev_ann,
      output.pvf_lev_ls,
      output.pvf_qpsa_ls,
      output.pvmb_term_no_q_no_l,
      output.pvmb_term_qpsa,
      output.pvmb_term_no_load,
      output.term_load,
      output.pvmb_term,
    ],
  );
}

export function listResolvedBenefitKernelOutputs(db: Database): BenefitKernelOutput[] {
  return queryAll(db, "SELECT * FROM benefit_kernel_output ORDER BY benefit_kernel_output_id") as BenefitKernelOutput[];
}

export function listBenefitKernelRunsWithTrace(db: Database): Array<BenefitKernelOutput & { trace_count: number }> {
  return queryAll(
    db,
    `SELECT bko.*, COUNT(mt.module_trace_id) AS trace_count
     FROM benefit_kernel_output bko
     LEFT JOIN module_trace mt
       ON mt.calculation_run_id = bko.calculation_run_id
      AND mt.module_name = 'benefit_kernel'
     GROUP BY bko.benefit_kernel_output_id
     ORDER BY bko.benefit_kernel_output_id`,
  ) as Array<BenefitKernelOutput & { trace_count: number }>;
}

export function insertResolvedV1VeOutput(
  db: Database,
  output: {
    v1_ve_output_row_id: string;
    calculation_run_id: string;
    case_id: string;
    plan_id: string;
    subject_key: string;
    row_json: string;
    listing_sort_key: string | null;
    adapter_version: string;
  },
): void {
  db.run(
    `INSERT INTO v1_ve_output_row (
      v1_ve_output_row_id, calculation_run_id, case_id, plan_id, subject_key,
      row_json, listing_sort_key, adapter_version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.v1_ve_output_row_id,
      output.calculation_run_id,
      output.case_id,
      output.plan_id,
      output.subject_key,
      output.row_json,
      output.listing_sort_key,
      output.adapter_version,
    ],
  );
}

export function listResolvedV1VeOutputs(db: Database): V1VeOutputRowRecord[] {
  return queryAll(db, "SELECT * FROM v1_ve_output_row ORDER BY v1_ve_output_row_id") as V1VeOutputRowRecord[];
}

export function listV1VeRunsWithTrace(db: Database): Array<V1VeOutputRowRecord & { trace_count: number }> {
  return queryAll(
    db,
    `SELECT v1.*, COUNT(mt.module_trace_id) AS trace_count
     FROM v1_ve_output_row v1
     LEFT JOIN module_trace mt
       ON mt.calculation_run_id = v1.calculation_run_id
      AND mt.module_name = 'v1_ve_output'
     GROUP BY v1.v1_ve_output_row_id
     ORDER BY v1.v1_ve_output_row_id`,
  ) as Array<V1VeOutputRowRecord & { trace_count: number }>;
}

export function insertResolvedValuationListingOutput(
  db: Database,
  output: {
    valuation_listing_output_row_id: string;
    calculation_run_id: string;
    case_id: string;
    plan_id: string;
    subject_key: string;
    listing_row_type: string;
    listing_sort_key: string;
    row_json: string;
    adapter_version: string;
  },
): void {
  db.run(
    `INSERT INTO valuation_listing_output_row (
      valuation_listing_output_row_id, calculation_run_id, case_id, plan_id, subject_key,
      listing_row_type, listing_sort_key, row_json, adapter_version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.valuation_listing_output_row_id,
      output.calculation_run_id,
      output.case_id,
      output.plan_id,
      output.subject_key,
      output.listing_row_type,
      output.listing_sort_key,
      output.row_json,
      output.adapter_version,
    ],
  );
}

export function listResolvedValuationListingOutputs(db: Database): ValuationListingOutputRowRecord[] {
  return queryAll(db, "SELECT * FROM valuation_listing_output_row ORDER BY valuation_listing_output_row_id") as ValuationListingOutputRowRecord[];
}

export function listValuationListingRunsWithTrace(db: Database): Array<ValuationListingOutputRowRecord & { trace_count: number }> {
  return queryAll(
    db,
    `SELECT vlo.*, COUNT(mt.module_trace_id) AS trace_count
     FROM valuation_listing_output_row vlo
     LEFT JOIN module_trace mt
       ON mt.calculation_run_id = vlo.calculation_run_id
      AND mt.module_name = 'valuation_listings_output'
     GROUP BY vlo.valuation_listing_output_row_id
     ORDER BY vlo.valuation_listing_output_row_id`,
  ) as Array<ValuationListingOutputRowRecord & { trace_count: number }>;
}

export function insertResolvedBsrsConfigurationOutput(
  db: Database,
  output: {
    bsrs_configuration_output_row_id: string;
    calculation_run_id: string;
    case_id: string;
    plan_id: string;
    subject_key: string;
    statement_row_type: string;
    statement_sort_key: string;
    row_json: string;
    adapter_version: string;
  },
): void {
  db.run(
    `INSERT INTO bsrs_configuration_output_row (
      bsrs_configuration_output_row_id, calculation_run_id, case_id, plan_id, subject_key,
      statement_row_type, statement_sort_key, row_json, adapter_version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      output.bsrs_configuration_output_row_id,
      output.calculation_run_id,
      output.case_id,
      output.plan_id,
      output.subject_key,
      output.statement_row_type,
      output.statement_sort_key,
      output.row_json,
      output.adapter_version,
    ],
  );
}

export function listResolvedBsrsConfigurationOutputs(db: Database): BsrsConfigurationOutputRecord[] {
  return queryAll(db, "SELECT * FROM bsrs_configuration_output_row ORDER BY bsrs_configuration_output_row_id") as BsrsConfigurationOutputRecord[];
}

export function listBsrsConfigurationRunsWithTrace(db: Database): Array<BsrsConfigurationOutputRecord & { trace_count: number }> {
  return queryAll(
    db,
    `SELECT bsr.*, COUNT(mt.module_trace_id) AS trace_count
     FROM bsrs_configuration_output_row bsr
     LEFT JOIN module_trace mt
       ON mt.calculation_run_id = bsr.calculation_run_id
      AND mt.module_name = 'bsrs_configuration_output'
     GROUP BY bsr.bsrs_configuration_output_row_id
     ORDER BY bsr.bsrs_configuration_output_row_id`,
  ) as Array<BsrsConfigurationOutputRecord & { trace_count: number }>;
}

export function insertModuleTrace(db: Database, trace: ModuleTrace): void {
  db.run(
    `INSERT INTO module_trace (
      module_trace_id, calculation_run_id, module_name, subject_key, field_name,
      rule_applied, input_fields_used_json, intermediate_values_json, output_value, warning_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      trace.module_trace_id,
      trace.calculation_run_id,
      trace.module_name,
      trace.subject_key,
      trace.field_name,
      trace.rule_applied,
      trace.input_fields_used_json,
      trace.intermediate_values_json,
      trace.output_value,
      trace.warning_note,
    ],
  );
}

export function listModuleTraces(db: Database, calculationRunId: string, moduleName: ModuleTrace["module_name"]): ModuleTrace[] {
  return queryAll(
    db,
    "SELECT * FROM module_trace WHERE calculation_run_id = ? AND module_name = ? ORDER BY module_trace_id",
    [calculationRunId, moduleName],
  ) as ModuleTrace[];
}

export function parsePacketJson<
  TPacket extends DateResolutionPacket | ServiceResolutionPacket | CompensationResolutionPacket | FormResolutionPacket | BenefitKernelPacket | V1VeOutputPacket | ValuationListingsOutputPacket | BsrsConfigurationOutputPacket =
    | DateResolutionPacket
    | ServiceResolutionPacket
    | CompensationResolutionPacket
    | FormResolutionPacket
    | BenefitKernelPacket
    | V1VeOutputPacket
    | ValuationListingsOutputPacket
    | BsrsConfigurationOutputPacket,
>(
  record: EngineInputPacketRecord,
): TPacket {
  return JSON.parse(record.packet_json) as TPacket;
}

import type { Database } from "sql.js";
import { createDeterministicId, currentTimestamp, type EngineRunRecord, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import {
  getEngineInputPacket,
  insertEngineRun,
  insertModuleTrace,
  insertResolvedBenefitKernelOutput,
  parsePacketJson,
} from "@pbgc/db";
import { buildInputPacketNotActiveError } from "./errors";
import { resolveBenefitKernel } from "./resolveBenefitKernel";
import { validateBenefitKernelPacket } from "./validatePacket";
import {
  BENEFIT_KERNEL_MODULE_NAME,
  BENEFIT_KERNEL_MODULE_VERSION,
  type BenefitKernelOutput,
  type BenefitKernelPacket,
  type BenefitKernelValues,
  type RunBenefitKernelRequest,
  type RunBenefitKernelResult,
} from "./types";

export function runBenefitKernel(db: Database, request: RunBenefitKernelRequest): RunBenefitKernelResult {
  const record = getEngineInputPacket(db, request.input_packet_id);
  const calculation_run_id = createDeterministicId("run");
  const started_at = currentTimestamp();

  if (!record || record.status !== "active" || record.packet_type !== "benefit_kernel") {
    const error = buildInputPacketNotActiveError(request.input_packet_id, request.rule_version);
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, 1));
    return failedResult(calculation_run_id, [error]);
  }

  const packet = parsePacketJson<BenefitKernelPacket>(record);
  const errors = validateBenefitKernelPacket(packet, request.input_packet_id, request.rule_version);
  if (errors.length > 0) {
    insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "failed", 0, errors.length));
    return failedResult(calculation_run_id, errors);
  }

  const { values, warnings } = resolveBenefitKernel(packet, request.input_packet_id, request.rule_version);
  const output: BenefitKernelOutput = {
    benefit_kernel_output_id: createDeterministicId("benefit-kernel"),
    calculation_run_id,
    case_id: request.case_id,
    subject_key: request.subject_key,
    ...values,
  };
  const traces = buildTraces(calculation_run_id, request.subject_key, values, warnings, packet);
  insertEngineRun(db, makeRun(request, calculation_run_id, started_at, "completed", warnings.length, 0));
  insertResolvedBenefitKernelOutput(db, output);
  for (const trace of traces) insertModuleTrace(db, trace);
  return {
    calculation_run_id,
    run_status: "completed",
    benefit_kernel_output_id: output.benefit_kernel_output_id,
    warning_count: warnings.length,
    error_count: 0,
    warnings,
    errors: [],
    output,
    traces,
  };
}

function makeRun(
  request: RunBenefitKernelRequest,
  calculation_run_id: string,
  started_at: string,
  run_status: EngineRunRecord["run_status"],
  warning_count: number,
  error_count: number,
): EngineRunRecord {
  return {
    calculation_run_id,
    case_id: request.case_id,
    input_packet_id: request.input_packet_id,
    rule_version: request.rule_version,
    deliverable_version: request.deliverable_version,
    run_context: "benefit_kernel_mvp",
    started_at,
    completed_at: currentTimestamp(),
    run_status,
    warning_count,
    error_count,
  };
}

function failedResult(calculationRunId: string, errors: StructuredIssue[]): RunBenefitKernelResult {
  return {
    calculation_run_id: calculationRunId,
    run_status: "failed",
    warning_count: 0,
    error_count: errors.length,
    warnings: [],
    errors,
    traces: [],
  };
}

function buildTraces(
  calculationRunId: string,
  subjectKey: string,
  values: BenefitKernelValues,
  warnings: StructuredIssue[],
  packet: BenefitKernelPacket,
): ModuleTrace[] {
  const warningNote = warnings.map((warning) => warning.message).join("; ") || null;
  return Object.entries(values)
    .filter(([, value]) => value !== null)
    .map(([field, value]) => ({
      module_trace_id: createDeterministicId("trace"),
      calculation_run_id: calculationRunId,
      module_name: BENEFIT_KERNEL_MODULE_NAME,
      subject_key: subjectKey,
      field_name: field,
      rule_applied: `${BENEFIT_KERNEL_MODULE_NAME}@${BENEFIT_KERNEL_MODULE_VERSION}:benefit_fixture`,
      input_fields_used_json: JSON.stringify([
        "case_plan_timeline",
        "resolved_plan_logic",
        "participant_role_population",
        "service_employment_history",
        "compensation_accrual_inputs",
        "benefit_administration_state",
        "actuarial_assumption_factor_set",
        "limitation_packet",
        "resolved_dates",
        "resolved_service_compensation",
        "resolved_forms_status",
      ]),
      intermediate_values_json: JSON.stringify({
        module_version: BENEFIT_KERNEL_MODULE_VERSION,
        branch: packet.resolved_plan_logic.accrued_benefit_formula,
        qpsa_applied: packet.participant_role_population.qpsa_indicator,
        qdro_applied: packet.participant_role_population.qdro_indicator,
        current_pay_applied: packet.benefit_administration_state.current_pay_status === "in_pay",
        limitation_applied: {
          section_436: packet.limitation_packet.section_436_applicable_indicator,
          phase_in: packet.limitation_packet.phase_in_limitation_indicator,
        },
        present_value_basis: "fixture_79_36_factor",
        downstream_adapter_execution_suppressed: true,
      }),
      output_value: String(value),
      warning_note: warningNote,
    }));
}

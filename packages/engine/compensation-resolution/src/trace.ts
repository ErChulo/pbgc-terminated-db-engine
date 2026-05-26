import { createDeterministicId } from "@pbgc/shared";
import type { ModuleTrace, StructuredIssue } from "@pbgc/shared";
import {
  COMPENSATION_RESOLUTION_MODULE_NAME,
  COMPENSATION_RESOLUTION_MODULE_VERSION,
  type CompensationResolutionPacket,
  type CompensationResolutionValues,
} from "./types";

export type TraceContext = {
  inputPacketId: string;
  caseId: string;
  subjectKey: string;
  ruleVersion: string;
  moduleVersion: string;
};

type TraceEntry = {
  fieldName: string;
  outputValue: number | null;
  ruleBranch: string;
  inputFields: string[];
  intermediateValues: Record<string, unknown>;
  warningNote: string | null;
};

function buildRuleMap(packet: CompensationResolutionPacket, context: TraceContext): Map<string, string> {
  const inputs = packet.compensation_accrual_inputs;
  const baseRule = `${COMPENSATION_RESOLUTION_MODULE_NAME}@${context.moduleVersion}`;
  const map = new Map<string, string>();

  if (inputs.frozen_accrued_benefit_indicator && !inputs.compensation_history_available_indicator) {
    const freezeBranch = `${baseRule}:frozen_benefit_support`;
    map.set("compensation_resolved", freezeBranch);
    map.set("average_compensation_resolved", freezeBranch);
    map.set("covered_compensation_resolved", freezeBranch);
  } else {
    const fapBranch = `${baseRule}:final_average_pay`;
    map.set("compensation_resolved", fapBranch);
    map.set("average_compensation_resolved", fapBranch);
    map.set("covered_compensation_resolved", `${baseRule}:covered_compensation`);
  }
  return map;
}

function buildInputFieldMap(packet: CompensationResolutionPacket): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const timeline = packet.case_plan_timeline;
  const logic = packet.resolved_plan_logic;
  const role = packet.participant_role_population;
  const inputs = packet.compensation_accrual_inputs;
  const admin = packet.benefit_administration_state;

  const sharedInputs = [
    `case_plan_timeline.plan_anniversary:${timeline.plan_anniversary}`,
    `resolved_plan_logic.compensation_definition_rule:${logic.compensation_definition_rule}`,
    `resolved_plan_logic.average_compensation_rule:${logic.average_compensation_rule}`,
    `compensation_accrual_inputs.compensation_basis_code:${inputs.compensation_basis_code}`,
    `compensation_accrual_inputs.average_compensation_period:${inputs.average_compensation_period}`,
    `compensation_accrual_inputs.compensation_history_available_indicator:${String(inputs.compensation_history_available_indicator)}`,
    `compensation_accrual_inputs.frozen_accrued_benefit_indicator:${String(inputs.frozen_accrued_benefit_indicator)}`,
  ];

  // Compensation resolved
  map.set("compensation_resolved", [
    ...sharedInputs,
    `compensation_accrual_inputs.final_average_compensation:${inputs.final_average_compensation}`,
    `compensation_accrual_inputs.vested_percentage_at_dopt:${inputs.vested_percentage_at_dopt}`,
    `benefit_administration_state.dor:${admin.dor}`,
    `participant_role_population.retirement_status_as_of_dopt:${role.retirement_status_as_of_dopt}`,
  ]);

  // Average compensation resolved
  map.set("average_compensation_resolved", [
    ...sharedInputs,
    `compensation_accrual_inputs.final_average_compensation:${inputs.final_average_compensation}`,
  ]);

  // Covered compensation resolved
  map.set("covered_compensation_resolved", [
    ...sharedInputs,
    `compensation_accrual_inputs.covered_compensation_amount:${inputs.covered_compensation_amount}`,
    `resolved_plan_logic.covered_compensation_rule:${logic.covered_compensation_rule}`,
  ]);

  return map;
}

function buildIntermediateValues(fieldName: string, packet: CompensationResolutionPacket, warnings: StructuredIssue[]): Record<string, unknown> {
  const inputs = packet.compensation_accrual_inputs;
  const logic = packet.resolved_plan_logic;
  const isFrozen = inputs.frozen_accrued_benefit_indicator && !inputs.compensation_history_available_indicator;

  return {
    module_version: COMPENSATION_RESOLUTION_MODULE_VERSION,
    branch: isFrozen
      ? "frozen_benefit_support"
      : fieldName === "covered_compensation_resolved"
        ? "fixture_covered_compensation"
        : "fixture_final_average_pay",
    compensation_basis: inputs.compensation_basis_code,
    average_compensation_rule: logic.average_compensation_rule,
    compensation_history_used: inputs.compensation_history_available_indicator,
    override_applied: false,
    covered_compensation_applied: fieldName === "covered_compensation_resolved" && !isFrozen,
    covered_compensation_rule: logic.covered_compensation_rule,
    compensation_limit_applied: false,
    frozen_benefit_support_applied: isFrozen,
    pia_offset_applied: false,
    warning_applicable: warnings.length > 0,
  };
}

function detectWarning(fieldName: string, value: number | null, packet: CompensationResolutionPacket): string | null {
  if (packet.compensation_accrual_inputs.frozen_accrued_benefit_indicator && value === null) {
    return `Frozen benefit support: ${fieldName} is explicitly null (no compensation payroll support reviewed)`;
  }
  return null;
}

export function buildCompensationTraces(
  values: CompensationResolutionValues,
  packet: CompensationResolutionPacket,
  context: TraceContext,
  warnings: StructuredIssue[],
): TraceEntry[] {
  const ruleMap = buildRuleMap(packet, context);
  const inputMap = buildInputFieldMap(packet);
  const entries: TraceEntry[] = [];

  for (const [field, value] of Object.entries(values)) {
    if (value !== null) {
      entries.push({
        fieldName: field,
        outputValue: value,
        ruleBranch: ruleMap.get(field) ?? `${COMPENSATION_RESOLUTION_MODULE_NAME}@${context.moduleVersion}:${field}`,
        inputFields: inputMap.get(field) ?? [],
        intermediateValues: buildIntermediateValues(field, packet, warnings),
        warningNote: null,
      });
    }
  }

  return entries;
}

export function collectWarnings(entries: TraceEntry[], packet: CompensationResolutionPacket): void {
  for (const entry of entries) {
    const warningNote = detectWarning(entry.fieldName, entry.outputValue, packet);
    if (warningNote) {
      entry.warningNote = warningNote;
    }
  }
}

export function writeCompensationTraceRows(
  calculationRunId: string,
  subjectKey: string,
  entries: TraceEntry[],
): ModuleTrace[] {
  return entries.map((entry) => ({
    module_trace_id: createDeterministicId("trace"),
    calculation_run_id: calculationRunId,
    module_name: COMPENSATION_RESOLUTION_MODULE_NAME,
    subject_key: subjectKey,
    field_name: entry.fieldName,
    rule_applied: entry.ruleBranch,
    input_fields_used_json: JSON.stringify(entry.inputFields),
    intermediate_values_json: JSON.stringify(entry.intermediateValues),
    output_value: entry.outputValue === null ? null : String(entry.outputValue),
    warning_note: entry.warningNote,
  }));
}

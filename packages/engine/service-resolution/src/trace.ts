import { createDeterministicId, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import {
  SERVICE_RESOLUTION_MODULE_NAME,
  SERVICE_RESOLUTION_MODULE_VERSION,
  type ServiceResolutionPacket,
  type ServiceResolutionValues,
} from "./types";

export type TraceContext = {
  inputPacketId: string;
  caseId: string;
  subjectKey: string;
  ruleVersion: string;
  moduleVersion: string;
};

export type TraceEntry = {
  fieldName: string;
  outputValue: number | null;
  ruleApplied: string;
  inputFields: Array<{ group: string; field: string; value: string | number | boolean | null }>;
  intermediateValues: Record<string, unknown>;
  warningNote: string | null;
};

export function buildServiceResolutionTraces(
  values: ServiceResolutionValues,
  packet: ServiceResolutionPacket,
  context: TraceContext,
): TraceEntry[] {
  const entries: TraceEntry[] = [];

  const allValues: Record<string, number | null> = {
    eligibility_service_resolved: values.eligibility_service_resolved,
    vesting_service_resolved: values.vesting_service_resolved,
    benefit_service_resolved: values.benefit_service_resolved,
    accrual_service_resolved: values.accrual_service_resolved,
  };

  for (const [field, value] of Object.entries(allValues)) {
    if (value === null) continue;

    const inputFields = buildInputFields(packet);
    const intermediateValues = buildIntermediateValues(packet, context.moduleVersion);
    const ruleApplied = buildRuleReference(field, context);

    entries.push({
      fieldName: field,
      outputValue: value,
      ruleApplied,
      inputFields,
      intermediateValues,
      warningNote: null,
    });
  }

  return entries;
}

function buildInputFields(
  packet: ServiceResolutionPacket,
): Array<{ group: string; field: string; value: string | number | boolean | null }> {
  const history = packet.service_employment_history;
  const timeline = packet.case_plan_timeline;
  const logic = packet.resolved_plan_logic;

  const base: Array<{ group: string; field: string; value: string | number | boolean | null }> = [
    { group: "service_employment_history", field: "doh", value: history.doh },
    { group: "service_employment_history", field: "dop", value: history.dop },
    { group: "service_employment_history", field: "dote", value: history.dote },
    { group: "service_employment_history", field: "service_basis_code", value: history.service_basis_code },
    { group: "service_employment_history", field: "service_hours_requirement", value: history.service_hours_requirement },
    { group: "service_employment_history", field: "service_period_basis", value: history.service_period_basis },
    { group: "case_plan_timeline", field: "dopt", value: timeline.dopt },
    { group: "case_plan_timeline", field: "dobf", value: timeline.dobf },
    { group: "case_plan_timeline", field: "plan_anniversary", value: timeline.plan_anniversary },
    { group: "resolved_plan_logic", field: "eligibility_service_rule", value: logic.eligibility_service_rule },
    { group: "resolved_plan_logic", field: "vesting_service_rule", value: logic.vesting_service_rule },
    { group: "resolved_plan_logic", field: "benefit_service_rule", value: logic.benefit_service_rule },
    { group: "resolved_plan_logic", field: "accrual_factor_rule", value: logic.accrual_factor_rule },
  ];

  if (timeline.dobf) {
    base.push({ group: "frozen_accrual_packet", field: "accrual_freeze_date", value: timeline.dobf });
  }

  return base;
}

function buildIntermediateValues(
  packet: ServiceResolutionPacket,
  moduleVersion: string,
): Record<string, unknown> {
  const history = packet.service_employment_history;
  const timeline = packet.case_plan_timeline;
  const serviceEndDate = history.dote ?? timeline.dopt;
  const freezeDate = timeline.dobf;

  const intermediates: Record<string, unknown> = {
    participation_date: history.dop,
    service_end_date: serviceEndDate,
    freeze_date: freezeDate,
    effective_end_date: freezeDate && serviceEndDate
      ? (new Date(`${freezeDate}T00:00:00.000Z`).getTime() < new Date(`${serviceEndDate}T00:00:00.000Z`).getTime()
          ? freezeDate
          : serviceEndDate)
      : serviceEndDate,
    freeze_applied: Boolean(freezeDate),
    break_applied: false,
    transfer_applied: false,
    segment_applied: false,
    override_applied: false,
    branch: "fixture_plan_year_inclusive",
    module_version: moduleVersion,
  };

  if (freezeDate) {
    intermediates.freeze_basis = "fixture_dobf";
  }

  return intermediates;
}

function buildRuleReference(fieldName: string, context: TraceContext): string {
  const ruleMap: Record<string, string> = {
    eligibility_service_resolved: "eligibility_service_rule",
    vesting_service_resolved: "vesting_service_rule",
    benefit_service_resolved: "benefit_service_rule",
    accrual_service_resolved: "accrual_factor_rule",
  };
  const ruleField = ruleMap[fieldName] ?? fieldName;
  return `${SERVICE_RESOLUTION_MODULE_NAME}@${context.ruleVersion}:${ruleField}`;
}

export function collectWarnings(
  entries: TraceEntry[],
  packet: ServiceResolutionPacket,
  inputPacketId: string,
  ruleVersion: string,
): StructuredIssue[] {
  const warnings: StructuredIssue[] = [];
  const history = packet.service_employment_history;

  if (!history.dote) {
    warnings.push({
      code: "ACTIVE_AT_DOPT_SERVICE_END",
      message: "Participant has no DOTE; service resolved through DOPT for the MVP fixture path",
      field_name: "dote",
      input_group: "service_employment_history",
      input_packet_id: inputPacketId,
      module_name: SERVICE_RESOLUTION_MODULE_NAME,
      rule_version: ruleVersion,
    });

    for (const entry of entries) {
      entry.warningNote = warnings.map((w) => w.message).join("; ");
    }
  }

  return warnings;
}

export function writeModuleTraceRows(
  calculationRunId: string,
  subjectKey: string,
  entries: TraceEntry[],
  packet: ServiceResolutionPacket,
  ruleVersion: string,
): ModuleTrace[] {
  return entries.map((entry) => ({
    module_trace_id: createDeterministicId("trace"),
    calculation_run_id: calculationRunId,
    module_name: SERVICE_RESOLUTION_MODULE_NAME,
    subject_key: subjectKey,
    field_name: entry.fieldName,
    rule_applied: entry.ruleApplied,
    input_fields_used_json: JSON.stringify(entry.inputFields),
    intermediate_values_json: JSON.stringify(entry.intermediateValues),
    output_value: entry.outputValue === null ? null : String(entry.outputValue),
    warning_note: entry.warningNote,
  }));
}

import type { ModuleTrace, StructuredIssue, TraceInputField } from "@pbgc/shared";
import { createDeterministicId } from "@pbgc/shared";
import {
  DATE_RESOLUTION_MODULE_NAME,
  DATE_RESOLUTION_MODULE_VERSION,
  type DateResolutionPacket,
  type DateResolutionValues,
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
  outputValue: string | number | null;
  ruleApplied: string;
  ruleBranch: string;
  inputFieldsUsed: TraceInputField[];
  intermediateValues: Record<string, unknown>;
  warningNote: string | null;
};

const BENEFICIARY_NULLABLE_FIELDS = [
  "nrd", "erd", "eurd", "eprd", "xra", "xrd", "sxra", "term_lw_xra", "term_lw_anb",
];

export function buildDateResolutionTraces(
  values: DateResolutionValues,
  packet: DateResolutionPacket,
  context: TraceContext,
): TraceEntry[] {
  const entries: TraceEntry[] = [];

  const ruleMap = buildRuleMap(packet);
  const inputMap = buildInputFieldMap(packet);

  for (const [field, value] of Object.entries(values)) {
    if (value === null && !isTraceableNullField(field, packet)) continue;

    const ruleBranch = fieldToRuleBranch(field, packet);
    const ruleApplied = ruleMap.get(field) ?? `${DATE_RESOLUTION_MODULE_NAME}@${context.moduleVersion}:${field}`;
    const inputFieldsUsed = inputMap.get(field) ?? [];
    const intermediateValues = collectIntermediateValues(field, packet);
    const warningNote = detectWarning(field, value, packet);

    entries.push({
      fieldName: field,
      outputValue: value as string | number | null,
      ruleApplied,
      ruleBranch,
      inputFieldsUsed,
      intermediateValues,
      warningNote,
    });
  }

  return entries;
}

export function writeModuleTraceRows(
  calculationRunId: string,
  subjectKey: string,
  traces: TraceEntry[],
): ModuleTrace[] {
  return traces.map((entry) => ({
    module_trace_id: createDeterministicId("trace"),
    calculation_run_id: calculationRunId,
    module_name: DATE_RESOLUTION_MODULE_NAME,
    subject_key: subjectKey,
    field_name: entry.fieldName,
    rule_applied: entry.ruleApplied,
    input_fields_used_json: JSON.stringify(entry.inputFieldsUsed),
    intermediate_values_json: JSON.stringify(entry.intermediateValues),
    output_value: entry.outputValue === null ? null : String(entry.outputValue),
    warning_note: entry.warningNote,
  }));
}

export function collectWarnings(traces: TraceEntry[], ruleVersion: string): StructuredIssue[] {
  return traces
    .filter((t) => t.warningNote !== null)
    .map((t) => ({
      code: "DATE_RESOLUTION_WARNING",
      message: t.warningNote!,
      field_name: t.fieldName,
      module_name: DATE_RESOLUTION_MODULE_NAME,
      rule_version: ruleVersion,
    }));
}

function buildRuleMap(packet: DateResolutionPacket): Map<string, string> {
  const map = new Map<string, string>();
  const logic = packet.resolved_plan_logic;
  map.set("nrd", `${logic.normal_retirement_eligibility_rule} + ${logic.normal_retirement_start_rule}`);
  map.set("erd", `${logic.early_reduced_retirement_rule}`);
  map.set("rbd", "required_beginning_date_method");
  map.set("xra", `${logic.normal_retirement_eligibility_rule}`);
  map.set("xrd", "retstat_based_on_dor_asd_or_nrd");
  map.set("term_lw_xra", `${logic.normal_retirement_eligibility_rule}`);
  map.set("term_lw_anb", `${logic.normal_retirement_eligibility_rule}`);
  return map;
}

function buildInputFieldMap(packet: DateResolutionPacket): Map<string, TraceInputField[]> {
  const map = new Map<string, TraceInputField[]>();
  const props = packet.participant_role_population;
  const ben = packet.benefit_administration_state;

  map.set("nrd", [
    { group: "participant_role_population", field: "dob", value: props.dob },
    { group: "participant_role_population", field: "role_type", value: props.role_type },
    { group: "resolved_plan_logic", field: "normal_retirement_eligibility_rule", value: packet.resolved_plan_logic.normal_retirement_eligibility_rule },
    { group: "resolved_plan_logic", field: "normal_retirement_start_rule", value: packet.resolved_plan_logic.normal_retirement_start_rule },
  ]);

  map.set("erd", [
    { group: "participant_role_population", field: "dob", value: props.dob },
    { group: "participant_role_population", field: "role_type", value: props.role_type },
    { group: "resolved_plan_logic", field: "early_reduced_retirement_rule", value: packet.resolved_plan_logic.early_reduced_retirement_rule },
  ]);

  map.set("rbd", [
    { group: "participant_role_population", field: "dob", value: props.dob },
    { group: "participant_role_population", field: "dod", value: props.dod },
    { group: "participant_role_population", field: "role_type", value: props.role_type },
    { group: "actuarial_assumption_factor_set", field: "required_beginning_date_method", value: packet.actuarial_assumption_factor_set.required_beginning_date_method },
  ]);

  map.set("xra", [
    { group: "resolved_plan_logic", field: "normal_retirement_eligibility_rule", value: packet.resolved_plan_logic.normal_retirement_eligibility_rule },
  ]);

  map.set("xrd", [
    { group: "participant_role_population", field: "retstat", value: props.retstat },
    { group: "participant_role_population", field: "role_type", value: props.role_type },
    { group: "benefit_administration_state", field: "asd", value: ben.asd },
    { group: "benefit_administration_state", field: "dor", value: ben.dor },
    { group: "resolved_dates_output", field: "nrd", value: "computed" },
  ]);

  map.set("term_lw_xra", [
    { group: "resolved_plan_logic", field: "normal_retirement_eligibility_rule", value: packet.resolved_plan_logic.normal_retirement_eligibility_rule },
  ]);

  map.set("term_lw_anb", [
    { group: "resolved_plan_logic", field: "normal_retirement_eligibility_rule", value: packet.resolved_plan_logic.normal_retirement_eligibility_rule },
  ]);

  map.set("eurd", [
    { group: "participant_role_population", field: "retstat", value: props.retstat },
  ]);

  map.set("eprd", [
    { group: "participant_role_population", field: "retstat", value: props.retstat },
  ]);

  map.set("sxra", [
    { group: "participant_role_population", field: "sdob", value: props.sdob },
  ]);

  return map;
}

function fieldToRuleBranch(field: string, packet: DateResolutionPacket): string {
  const roleType = packet.participant_role_population.role_type;
  if (roleType === "beneficiary") {
    return `date_resolution:beneficiary_path:${field}`;
  }
  const retstat = packet.participant_role_population.retstat;
  if (retstat === "1") {
    return `date_resolution:in_pay_participant_path:${field}`;
  }
  return `date_resolution:deferred_vested_participant_path:${field}`;
}

function collectIntermediateValues(
  field: string,
  packet: DateResolutionPacket,
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    module_version: DATE_RESOLUTION_MODULE_VERSION,
    role_type: packet.participant_role_population.role_type,
    retstat: packet.participant_role_population.retstat,
  };

  if (field === "nrd") {
    base.normal_retirement_eligibility_rule = packet.resolved_plan_logic.normal_retirement_eligibility_rule;
    base.normal_retirement_start_rule = packet.resolved_plan_logic.normal_retirement_start_rule;
    base.dob = packet.participant_role_population.dob;
  }

  if (field === "erd") {
    base.early_reduced_retirement_rule = packet.resolved_plan_logic.early_reduced_retirement_rule;
    base.dob = packet.participant_role_population.dob;
  }

  if (field === "rbd") {
    base.required_beginning_date_method = packet.actuarial_assumption_factor_set.required_beginning_date_method;
    base.dob = packet.participant_role_population.dob;
    base.dod = packet.participant_role_population.dod;
  }

  if (field === "xrd") {
    base.asd = packet.benefit_administration_state.asd;
    base.dor = packet.benefit_administration_state.dor;
  }

  return base;
}

function detectWarning(
  field: string,
  value: string | number | null,
  packet: DateResolutionPacket,
): string | null {
  const props = packet.participant_role_population;

  if (props.role_type === "beneficiary" && value === null) {
    if (BENEFICIARY_NULLABLE_FIELDS.includes(field)) {
      return `Beneficiary path: ${field} is not applicable and set to null`;
    }
  }

  if (field === "xrd" && props.retstat !== "1") {
    return "XRD defaults to NRD for non-in-pay participants";
  }

  if (field === "eurd" && value === null) {
    return "EURD is not resolved in the current rule version";
  }

  if (field === "sxra" && value === null && props.sdob === null) {
    return "SXRA requires spouse DOB which is not available";
  }

  return null;
}

function isTraceableNullField(field: string, packet: DateResolutionPacket): boolean {
  const props = packet.participant_role_population;
  if (props.role_type === "beneficiary") {
    return BENEFICIARY_NULLABLE_FIELDS.includes(field);
  }
  return ["eurd", "eprd", "sxra"].includes(field);
}

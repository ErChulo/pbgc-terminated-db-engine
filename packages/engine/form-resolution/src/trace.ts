import { createDeterministicId, type ModuleTrace, type StructuredIssue } from "@pbgc/shared";
import {
  FORM_RESOLUTION_MODULE_NAME,
  FORM_RESOLUTION_MODULE_VERSION,
  type FormResolutionPacket,
  type FormResolutionValues,
} from "./types";

export type TraceEntry = {
  fieldName: string;
  outputValue: string;
  ruleBranch: string;
  inputFields: string[];
  intermediateValues: Record<string, unknown>;
  warningNote: string | null;
};

export function buildFormTraces(
  calculationRunId: string,
  subjectKey: string,
  values: FormResolutionValues,
  packet: FormResolutionPacket,
): TraceEntry[] {
  const entries: TraceEntry[] = [];

  for (const [field, value] of Object.entries(values)) {
    if (value === null) continue;

    const inputFields = buildInputFieldMap(packet, field);
    const intermediateValues = buildIntermediateValues(packet, field);
    const branch = determineRuleBranch(packet, field);

    entries.push({
      fieldName: field,
      outputValue: String(value),
      ruleBranch: branch,
      inputFields,
      intermediateValues,
      warningNote: null,
    });
  }

  return entries;
}

export function collectWarnings(
  entries: TraceEntry[],
  packet: FormResolutionPacket,
): void {
  if (packet.benefit_administration_state.current_pay_status === "in_pay") {
    for (const entry of entries) {
      entry.intermediateValues.in_pay_branch = true;
    }
  }
  if (packet.participant_role_population.qdro_indicator) {
    for (const entry of entries) {
      entry.intermediateValues.qdro_branch = true;
    }
  }
  if (packet.participant_role_population.qpsa_indicator) {
    for (const entry of entries) {
      entry.intermediateValues.qpsa_branch = true;
    }
  }
}

export function toModuleTraces(
  entries: TraceEntry[],
  calculationRunId: string,
  subjectKey: string,
  warnings: StructuredIssue[],
): ModuleTrace[] {
  const warningNote = warnings.map((w) => w.message).join("; ") || null;
  return entries.map((entry) => ({
    module_trace_id: createDeterministicId("trace"),
    calculation_run_id: calculationRunId,
    module_name: FORM_RESOLUTION_MODULE_NAME,
    subject_key: subjectKey,
    field_name: entry.fieldName,
    rule_applied: `${FORM_RESOLUTION_MODULE_NAME}@${FORM_RESOLUTION_MODULE_VERSION}:${entry.ruleBranch}`,
    input_fields_used_json: JSON.stringify(entry.inputFields),
    intermediate_values_json: JSON.stringify({
      ...entry.intermediateValues,
      module_version: FORM_RESOLUTION_MODULE_VERSION,
    }),
    output_value: entry.outputValue,
    warning_note: warningNote,
  }));
}

function determineRuleBranch(packet: FormResolutionPacket, field: string): string {
  if (packet.benefit_administration_state.current_pay_status === "in_pay") {
    return "fixture_in_pay";
  }
  if (packet.participant_role_population.qdro_indicator) {
    return "fixture_qdro";
  }
  return "fixture_deferred";
}

function buildInputFieldMap(packet: FormResolutionPacket, fieldName: string): string[] {
  const sharedInputs = [
    "case_plan_timeline.case_id",
    "case_plan_timeline.plan_id",
    "case_plan_timeline.dopt",
    "resolved_plan_logic.normal_single_form_rule",
    "resolved_plan_logic.normal_married_form_rule",
    "resolved_plan_logic.pre_retirement_death_benefit_rule",
    "resolved_plan_logic.consensual_lump_sum_rule",
    "participant_role_population.role_type",
    "participant_role_population.mstat",
    "participant_role_population.qdro_indicator",
    "participant_role_population.qpsa_indicator",
    "participant_role_population.retirement_status_as_of_dopt",
    "benefit_administration_state.current_pay_status",
    "benefit_administration_state.current_form_code",
    "actuarial_assumption_factor_set.form_conversion_method",
    "limitation_packet.form_of_benefit_limitation_indicator",
    "limitation_packet.actuarial_equivalence_limitation_indicator",
  ];

  const fieldSpecific: Record<string, string[]> = {
    rettyp: [
      "participant_role_population.retirement_status_as_of_dopt",
      "benefit_administration_state.current_pay_status",
      "participant_role_population.qdro_indicator",
    ],
    form_code_nsf: [
      "benefit_administration_state.current_pay_status",
      "resolved_plan_logic.normal_single_form_rule",
    ],
    form_code_nmf: [
      "benefit_administration_state.current_pay_status",
      "resolved_plan_logic.normal_married_form_rule",
    ],
    form_code_ptp: [
      "benefit_administration_state.current_pay_status",
      "benefit_administration_state.current_form_code",
    ],
    form_code_ptp_qpsa: [
      "participant_role_population.qpsa_indicator",
    ],
    form_code_death: [
      "participant_role_population.role_type",
      "participant_role_population.dod",
      "resolved_plan_logic.pre_retirement_death_benefit_rule",
    ],
    annuity_status_pay: [
      "benefit_administration_state.current_pay_status",
    ],
    lsoption: [
      "resolved_plan_logic.consensual_lump_sum_rule",
    ],
    bs_ind: [
      "participant_role_population.qdro_indicator",
    ],
    br_ind: [
      "participant_role_population.role_type",
    ],
    ofa_indicator: [
      "benefit_administration_state.current_pay_status",
    ],
  };

  return [...sharedInputs, ...(fieldSpecific[fieldName] ?? [])];
}

function buildIntermediateValues(packet: FormResolutionPacket, fieldName: string): Record<string, unknown> {
  return {
    branch: determineRuleBranch(packet, fieldName),
    in_pay_applied: packet.benefit_administration_state.current_pay_status === "in_pay",
    qdro_applied: packet.participant_role_population.qdro_indicator,
    qpsa_applied: packet.participant_role_population.qpsa_indicator,
    death_benefit_applied: fieldName === "form_code_death",
    lump_sum_applied: fieldName === "lsoption",
    contribution_applied: false,
    pbgc_form_policy_applied: true,
  };
}

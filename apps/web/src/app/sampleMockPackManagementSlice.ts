export type SampleMockPackKind = "approved_sample" | "mock_data";
export type SampleMockPackReadiness = "ready" | "display_only";

export type SampleMockPackTemplateRef = {
  template_id: string;
  title: string;
  stage_key: string;
  relevance: "primary" | "supporting" | "informational";
};

export type SampleMockPackApprovedSampleRef = {
  file_name: string;
  label: string;
  repository_path: string;
};

export type SampleMockPackStageCoverage = {
  stage_key: string;
  label: string;
  coverage: "full" | "partial" | "planned";
  note: string;
};

export type SampleMockPack = {
  pack_id: string;
  label: string;
  kind: SampleMockPackKind;
  artifact_basis: string;
  included_stages: string[];
  readiness: SampleMockPackReadiness;
  mocked_only_notice: string;
  ordering_key: string;
  description: string;
  approved_sample_refs: SampleMockPackApprovedSampleRef[];
  template_refs: SampleMockPackTemplateRef[];
  stage_coverage: SampleMockPackStageCoverage[];
  trace_basis: {
    producing_module: "sample_mock_pack_management";
    rule_version: "0.1.0";
    pack_id: string;
  };
};

export type SampleMockPackManagementState = {
  packs: SampleMockPack[];
  selected_pack: SampleMockPack;
  boundary_notice: string;
};

export type SampleMockPackManagementInput = {
  selected_pack_id?: string;
};

const PACKS: SampleMockPack[] = [
  {
    pack_id: "approved-bsrs-samples",
    label: "Approved BSRS Samples",
    kind: "approved_sample",
    artifact_basis: "packages/tests/bsrs-configuration-output-fixtures.ts#BSRS001-BSRS002",
    included_stages: ["reconciliation_workbench", "v1_ve_output", "valuation_listings_output", "bsrs_configuration_output"],
    readiness: "ready",
    mocked_only_notice: "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is included.",
    ordering_key: "000001|approved-bsrs-samples",
    description: "Approved BSRS configuration output samples covering base-data, recalculation, optional-form, and statement scenarios. These are the primary deterministic engine output fixtures used by the reconciliation workbench.",
    approved_sample_refs: [
      { file_name: "sample-bsrs-baseData-config.txt", label: "BSRS Base Data Configuration", repository_path: "artifacts/reference/approved-samples/bsrs-config/base-data/" },
      { file_name: "sample-bsrs-recalculation-config.txt", label: "BSRS Recalculation Configuration", repository_path: "artifacts/reference/approved-samples/bsrs-config/recalculations/" },
      { file_name: "sample-bsrs-OFA_SingleAndJoint-config.txt", label: "BSRS Single & Joint Optional Form", repository_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/" },
      { file_name: "sample-bsrs-OFA_SingleLife-config.txt", label: "BSRS Single Life Optional Form", repository_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/" },
      { file_name: "sample-bsrs-OFA_QPSA-QDRO-config.txt", label: "BSRS QPSA/QDRO Optional Form", repository_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/" },
      { file_name: "sample-bsrs-statement-config.txt", label: "BSRS Statement Configuration", repository_path: "artifacts/reference/approved-samples/bsrs-config/statements/" },
    ],
    template_refs: [
      { template_id: "source_assertion_import_template", title: "Source Assertion Import Template", stage_key: "upload_import", relevance: "primary" },
      { template_id: "resolved_fact_import_template", title: "Resolved Fact Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "resolved_plan_provision_import_template", title: "Resolved Plan Provision Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "plan_summary_shell", title: "Plan Summary Shell", stage_key: "template_filling_export", relevance: "supporting" },
      { template_id: "436_evaluation", title: "436 Evaluation", stage_key: "template_filling_export", relevance: "supporting" },
    ],
    stage_coverage: [
      { stage_key: "reconciliation_workbench", label: "Reconciliation Workbench", coverage: "full", note: "All BSRS output fixtures are available for cross-slice comparison." },
      { stage_key: "v1_ve_output", label: "V1 / VE Output", coverage: "full", note: "V1 workbook samples map to BSRS fixture scenarios." },
      { stage_key: "valuation_listings_output", label: "Valuation Listings", coverage: "full", note: "Valuation listing outputs are derived from BSRS fixture packets." },
      { stage_key: "bsrs_configuration_output", label: "BSRS Configuration Output", coverage: "full", note: "Primary fixture set drives BSRS configuration output resolution." },
    ],
    trace_basis: {
      producing_module: "sample_mock_pack_management",
      rule_version: "0.1.0",
      pack_id: "approved-bsrs-samples",
    },
  },
  {
    pack_id: "alpha-mock-case-pack",
    label: "Alpha Mock Case Pack",
    kind: "mock_data",
    artifact_basis: "browser-local mocked alpha path metadata",
    included_stages: [
      "case_workspace",
      "upload_import",
      "reviewed_input_approval",
      "template_filling_export",
      "unresolved_issues",
      "sample_mock_packs",
    ],
    readiness: "ready",
    mocked_only_notice: "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is included.",
    ordering_key: "000002|alpha-mock-case-pack",
    description: "Browser-local mocked alpha-path data pack covering the full end-to-end workbench flow: case workspace, upload/import, reviewed-input approval, template filling/export, unresolved issues queue, and sample/mock pack management.",
    approved_sample_refs: [
      { file_name: "browser-local mocked alpha path metadata", label: "Mocked Alpha Path Metadata", repository_path: "browser-local" },
    ],
    template_refs: [
      { template_id: "source_assertion_import_template", title: "Source Assertion Import Template", stage_key: "upload_import", relevance: "primary" },
      { template_id: "resolved_fact_import_template", title: "Resolved Fact Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "resolved_plan_provision_import_template", title: "Resolved Plan Provision Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "plan_summary_shell", title: "Plan Summary Shell", stage_key: "template_filling_export", relevance: "primary" },
      { template_id: "actuarial_case_memo", title: "Actuarial Case Memo", stage_key: "template_filling_export", relevance: "supporting" },
    ],
    stage_coverage: [
      { stage_key: "case_workspace", label: "Case Workspace", coverage: "full", note: "Mocked workspace session with dashboard navigation." },
      { stage_key: "upload_import", label: "Upload / Import", coverage: "full", note: "Mocked external-LLM artifact preview flow." },
      { stage_key: "reviewed_input_approval", label: "Reviewed Input Approval", coverage: "full", note: "Mocked record normalization and approval decisions." },
      { stage_key: "template_filling_export", label: "Template Filling / Export", coverage: "full", note: "Fills reviewed-input CSV from approved mocked records." },
      { stage_key: "unresolved_issues", label: "Unresolved Issues Queue", coverage: "full", note: "Aggregates warnings, errors, and blocked states." },
      { stage_key: "sample_mock_packs", label: "Sample / Mock Packs", coverage: "full", note: "Pack selection and detail display." },
    ],
    trace_basis: {
      producing_module: "sample_mock_pack_management",
      rule_version: "0.1.0",
      pack_id: "alpha-mock-case-pack",
    },
  },
  {
    pack_id: "v1-workbook-samples",
    label: "V1 Workbook Samples",
    kind: "approved_sample",
    artifact_basis: "artifacts/reference/approved-samples/v1-workbooks/",
    included_stages: ["v1_ve_output", "valuation_listings_output", "form_resolution"],
    readiness: "ready",
    mocked_only_notice: "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is included.",
    ordering_key: "000003|v1-workbook-samples",
    description: "Approved V1 workbook samples (4 workbooks) covering different participant scenarios used to validate V1/VE output resolution and form-selection logic.",
    approved_sample_refs: [
      { file_name: "sample-1-v1.XLSX", label: "V1 Sample 1", repository_path: "artifacts/reference/approved-samples/v1-workbooks/" },
      { file_name: "sample-2-v1.xlsm", label: "V1 Sample 2 (macro-enabled)", repository_path: "artifacts/reference/approved-samples/v1-workbooks/" },
      { file_name: "sample-3-V1.XLSX", label: "V1 Sample 3", repository_path: "artifacts/reference/approved-samples/v1-workbooks/" },
      { file_name: "sample-4-v1.XLSX", label: "V1 Sample 4", repository_path: "artifacts/reference/approved-samples/v1-workbooks/" },
    ],
    template_refs: [
      { template_id: "source_assertion_import_template", title: "Source Assertion Import Template", stage_key: "upload_import", relevance: "primary" },
      { template_id: "resolved_fact_import_template", title: "Resolved Fact Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "436_evaluation", title: "436 Evaluation", stage_key: "template_filling_export", relevance: "supporting" },
      { template_id: "estimated_benefit_administration_analysis", title: "Estimated Benefit Administration Analysis", stage_key: "template_filling_export", relevance: "supporting" },
    ],
    stage_coverage: [
      { stage_key: "v1_ve_output", label: "V1 / VE Output", coverage: "full", note: "All 4 V1 workbooks have corresponding V1/VE output fixtures." },
      { stage_key: "valuation_listings_output", label: "Valuation Listings", coverage: "partial", note: "V1 workbooks map to valuation listing derivation." },
      { stage_key: "form_resolution", label: "Form Resolution", coverage: "partial", note: "V1 workbook form codes inform form-resolution fixtures." },
    ],
    trace_basis: {
      producing_module: "sample_mock_pack_management",
      rule_version: "0.1.0",
      pack_id: "v1-workbook-samples",
    },
  },
  {
    pack_id: "single-life-joint-scenarios",
    label: "Single Life & Joint Scenarios",
    kind: "approved_sample",
    artifact_basis: "artifacts/reference/approved-samples/bsrs-config/optional-forms/",
    included_stages: ["form_resolution", "bsrs_configuration_output", "reconciliation_workbench"],
    readiness: "ready",
    mocked_only_notice: "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is included.",
    ordering_key: "000004|single-life-joint-scenarios",
    description: "Approved optional-form samples for single-life and joint-and-survivor benefit scenarios, including spousal coverage and survivor benefit calculations relevant to BSRS configuration and form-resolution logic.",
    approved_sample_refs: [
      { file_name: "sample-bsrs-OFA_SingleLife-config.txt", label: "Single Life Optional Form", repository_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/" },
      { file_name: "sample-bsrs-OFA_SingleAndJoint-config.txt", label: "Single & Joint Optional Form", repository_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/" },
    ],
    template_refs: [
      { template_id: "source_assertion_import_template", title: "Source Assertion Import Template", stage_key: "upload_import", relevance: "primary" },
      { template_id: "resolved_fact_import_template", title: "Resolved Fact Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "resolved_plan_provision_import_template", title: "Resolved Plan Provision Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "estimated_benefit_administration_analysis", title: "Estimated Benefit Administration Analysis", stage_key: "template_filling_export", relevance: "supporting" },
      { template_id: "estimated_benefit_adjustment_analysis", title: "Estimated Benefit Adjustment Analysis", stage_key: "template_filling_export", relevance: "supporting" },
    ],
    stage_coverage: [
      { stage_key: "form_resolution", label: "Form Resolution", coverage: "full", note: "Single-life and joint optional forms directly test form-resolution logic." },
      { stage_key: "bsrs_configuration_output", label: "BSRS Configuration Output", coverage: "partial", note: "Optional-form fixture outputs are derived from BSRS fixture packets." },
      { stage_key: "reconciliation_workbench", label: "Reconciliation Workbench", coverage: "partial", note: "Cross-slice comparison results include optional-form fields." },
    ],
    trace_basis: {
      producing_module: "sample_mock_pack_management",
      rule_version: "0.1.0",
      pack_id: "single-life-joint-scenarios",
    },
  },
  {
    pack_id: "qpsa-statement-scenarios",
    label: "QPSA & Statement Scenarios",
    kind: "approved_sample",
    artifact_basis: "artifacts/reference/approved-samples/bsrs-config/",
    included_stages: ["form_resolution", "bsrs_configuration_output", "reconciliation_workbench", "valuation_listings_output"],
    readiness: "ready",
    mocked_only_notice: "No real participant, beneficiary, alternate payee, survivor, or other natural-person data is included.",
    ordering_key: "000005|qpsa-statement-scenarios",
    description: "Approved QPSA/QDRO optional-form samples and BSRS statement configuration samples. Covers qualified domestic relations order scenarios, qualified pre-retirement survivor annuity forms, and benefit-statement output requirements.",
    approved_sample_refs: [
      { file_name: "sample-bsrs-OFA_QPSA-QDRO-config.txt", label: "QPSA/QDRO Optional Form", repository_path: "artifacts/reference/approved-samples/bsrs-config/optional-forms/" },
      { file_name: "sample-bsrs-statement-config.txt", label: "BSRS Statement Configuration", repository_path: "artifacts/reference/approved-samples/bsrs-config/statements/" },
    ],
    template_refs: [
      { template_id: "source_assertion_import_template", title: "Source Assertion Import Template", stage_key: "upload_import", relevance: "primary" },
      { template_id: "resolved_fact_import_template", title: "Resolved Fact Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "resolved_plan_provision_import_template", title: "Resolved Plan Provision Import Template", stage_key: "reviewed_input_approval", relevance: "primary" },
      { template_id: "plan_summary_shell", title: "Plan Summary Shell", stage_key: "template_filling_export", relevance: "primary" },
      { template_id: "actuarial_case_memo", title: "Actuarial Case Memo", stage_key: "template_filling_export", relevance: "supporting" },
      { template_id: "436_evaluation", title: "436 Evaluation", stage_key: "template_filling_export", relevance: "informational" },
    ],
    stage_coverage: [
      { stage_key: "form_resolution", label: "Form Resolution", coverage: "full", note: "QPSA/QDRO optional forms validate form-resolution edge cases." },
      { stage_key: "bsrs_configuration_output", label: "BSRS Configuration Output", coverage: "partial", note: "Statement configuration influences BSRS output format." },
      { stage_key: "reconciliation_workbench", label: "Reconciliation Workbench", coverage: "partial", note: "Cross-slice form-code comparison results are available." },
      { stage_key: "valuation_listings_output", label: "Valuation Listings", coverage: "partial", note: "Statement data informs valuation listing output fields." },
    ],
    trace_basis: {
      producing_module: "sample_mock_pack_management",
      rule_version: "0.1.0",
      pack_id: "qpsa-statement-scenarios",
    },
  },
];

export function buildSampleMockPackManagement(input: SampleMockPackManagementInput = {}): SampleMockPackManagementState {
  const packs = [...PACKS].sort((left, right) => left.ordering_key.localeCompare(right.ordering_key));
  return {
    packs,
    selected_pack: packs.find((pack) => pack.pack_id === input.selected_pack_id) ?? packs[0],
    boundary_notice:
      "Browser-local sample and mock pack management only. Packs are committed approved or mocked metadata and do not contain real natural-person data.",
  };
}

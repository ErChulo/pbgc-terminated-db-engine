export type SampleMockPackKind = "approved_sample" | "mock_data";
export type SampleMockPackReadiness = "ready" | "display_only";

export type SampleMockPack = {
  pack_id: string;
  label: string;
  kind: SampleMockPackKind;
  artifact_basis: string;
  included_stages: string[];
  readiness: SampleMockPackReadiness;
  mocked_only_notice: string;
  ordering_key: string;
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
    trace_basis: {
      producing_module: "sample_mock_pack_management",
      rule_version: "0.1.0",
      pack_id: "alpha-mock-case-pack",
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

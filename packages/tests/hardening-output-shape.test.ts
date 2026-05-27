import { describe, expect, it } from "vitest";
import { buildPacketFromFixture, runDateResolution } from "@pbgc/date-resolution";
import { buildServicePacketFromFixture, runServiceResolution } from "@pbgc/service-resolution";
import { buildCompensationPacketFromFixture, runCompensationResolution } from "@pbgc/compensation-resolution";
import { buildFormPacketFromFixture, runFormResolution } from "@pbgc/form-resolution";
import { buildBenefitPacketFromFixture, runBenefitKernel, BENEFIT_KERNEL_OUTPUT_FIELDS } from "@pbgc/benefit-kernel";
import { buildV1VePacketFromFixture, runV1VeOutput, V1_VE_OUTPUT_FIELDS } from "@pbgc/v1-ve-output";
import {
  buildValuationListingsPacketFromFixture,
  runValuationListingsOutput,
  VALUATION_LISTINGS_OUTPUT_FIELDS,
} from "@pbgc/valuation-listings-output";
import {
  buildBsrsConfigurationPacketFromFixture,
  runBsrsConfiguration,
  BSRS_CONFIGURATION_OUTPUT_FIELDS,
  resolveBsrsConfigurationOutput,
} from "@pbgc/bsrs-configuration-output";
import {
  buildEvidenceForInventory,
  reconcileSharedFacts,
  resetDeterminismForTests,
  registerDdMappingLookup,
} from "@pbgc/shared";
import { hasDdMapping as v1HasDdMapping } from "@pbgc/v1-ve-output";
import { hasDdMapping as valuationHasDdMapping } from "@pbgc/valuation-listings-output";
import { hasDdMapping as bsrsHasDdMapping } from "@pbgc/bsrs-configuration-output";
import { closeHardeningDatabase, createHardeningDatabase, expectExactKeys, seedReviewedInputPacket } from "./hardening-helpers";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

const DATE_RESOLUTION_OUTPUT_KEYS = [
  "resolved_dates_output_id",
  "calculation_run_id",
  "case_id",
  "subject_key",
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
] as const;

const SERVICE_RESOLUTION_OUTPUT_KEYS = [
  "resolved_service_comp_output_id",
  "calculation_run_id",
  "case_id",
  "subject_key",
  "eligibility_service_resolved",
  "vesting_service_resolved",
  "benefit_service_resolved",
  "accrual_service_resolved",
  "compensation_resolved",
  "average_compensation_resolved",
  "covered_compensation_resolved",
] as const;

const FORM_RESOLUTION_OUTPUT_KEYS = [
  "resolved_forms_output_id",
  "calculation_run_id",
  "case_id",
  "subject_key",
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
] as const;

const VALUATION_LISTINGS_ROW_KEYS = [
  ...VALUATION_LISTINGS_OUTPUT_FIELDS,
  ...BENEFIT_KERNEL_OUTPUT_FIELDS,
] as const;

const BSRS_CONFIGURATION_ROW_KEYS = [
  ...BSRS_CONFIGURATION_OUTPUT_FIELDS,
] as const;

const RECONCILIATION_COMPARISON_KEYS = [
  "case_id",
  "canonical_semantic_name",
  "comparison_id",
  "dd_field_name",
  "fact_family",
  "fact_key",
  "fallback_name",
  "left_field",
  "left_slice",
  "left_source_path",
  "left_value",
  "mapping_basis",
  "producing_module",
  "reviewed_fact_context",
  "right_field",
  "right_slice",
  "right_source_path",
  "right_value",
  "rule_version",
  "status",
] as const;

const RECONCILIATION_FINDING_KEYS = [
  "canonical_semantic_name",
  "case_id",
  "category",
  "code",
  "compared_fields",
  "compared_slices",
  "compared_values",
  "dd_field_name",
  "fallback_name",
  "mapping_basis",
  "message",
  "producing_module",
  "reviewed_fact_context",
  "rule_version",
  "severity",
  "source_paths",
] as const;

describe("hardening output-shape stability", () => {
  it("keeps committed output shapes stable across the existing slices", async () => {
    const scenarios = [
      {
        fixture: parseDateResolutionFixtures()[0],
        packetType: "date_resolution",
        inputPacketId: "packet-DR001",
        buildPacket: buildPacketFromFixture,
        run: runDateResolution,
        extract: (result: any) => result.output,
        expectedKeys: DATE_RESOLUTION_OUTPUT_KEYS,
      },
      {
        fixture: parseServiceResolutionFixtures()[0],
        packetType: "service_resolution",
        inputPacketId: "packet-SR001",
        buildPacket: buildServicePacketFromFixture,
        run: runServiceResolution,
        extract: (result: any) => result.output,
        expectedKeys: SERVICE_RESOLUTION_OUTPUT_KEYS,
      },
      {
        fixture: parseCompensationResolutionFixtures()[0],
        packetType: "compensation_resolution",
        inputPacketId: "packet-CR001",
        buildPacket: buildCompensationPacketFromFixture,
        run: runCompensationResolution,
        extract: (result: any) => result.output,
        expectedKeys: SERVICE_RESOLUTION_OUTPUT_KEYS,
      },
      {
        fixture: parseFormResolutionFixtures()[0],
        packetType: "form_resolution",
        inputPacketId: "packet-FR001",
        buildPacket: buildFormPacketFromFixture,
        run: runFormResolution,
        extract: (result: any) => result.output,
        expectedKeys: FORM_RESOLUTION_OUTPUT_KEYS,
      },
      {
        fixture: parseBenefitKernelFixtures()[0],
        packetType: "benefit_kernel",
        inputPacketId: "packet-BK001",
        buildPacket: buildBenefitPacketFromFixture,
        run: runBenefitKernel,
        extract: (result: any) => result.output,
        expectedKeys: ["benefit_kernel_output_id", "calculation_run_id", "case_id", "subject_key", ...BENEFIT_KERNEL_OUTPUT_FIELDS],
      },
      {
        fixture: parseV1VeOutputFixtures()[0],
        packetType: "v1_ve_output",
        inputPacketId: "packet-VE001",
        buildPacket: buildV1VePacketFromFixture,
        run: runV1VeOutput,
        extract: (result: any) => result.output?.row,
        expectedKeys: V1_VE_OUTPUT_FIELDS,
      },
      {
        fixture: parseValuationListingsFixtures()[0],
        packetType: "valuation_listings_output",
        inputPacketId: "packet-VL001",
        buildPacket: buildValuationListingsPacketFromFixture,
        run: runValuationListingsOutput,
        extract: (result: any) => result.output?.row,
        expectedKeys: VALUATION_LISTINGS_ROW_KEYS,
      },
      {
        fixture: parseBsrsConfigurationFixtures()[0],
        packetType: "bsrs_configuration_output",
        inputPacketId: "packet-BSRS001",
        buildPacket: buildBsrsConfigurationPacketFromFixture,
        run: runBsrsConfiguration,
        extract: (result: any) => result.output?.row,
        expectedKeys: BSRS_CONFIGURATION_ROW_KEYS,
      },
    ] as const;

    for (const scenario of scenarios) {
      const db = await createHardeningDatabase();
      try {
        const packet = (scenario.buildPacket as (fixture: unknown) => any)(scenario.fixture);
        seedReviewedInputPacket(db, { ...packet, packet_type: scenario.packetType }, scenario.inputPacketId);
        const result = scenario.run(db, {
          case_id: packet.case_id,
          subject_type: packet.subject_type,
          subject_key: packet.subject_key,
          input_packet_id: scenario.inputPacketId,
          rule_version: "0.1.0",
          deliverable_version: "0.1.0",
        });

        expect(result.run_status).toBe("completed");
        const shape = scenario.extract(result);
        expect(shape).toBeTruthy();
        expectExactKeys(shape as Record<string, unknown>, scenario.expectedKeys);
      } finally {
        closeHardeningDatabase(db);
      }
    }
  });

  it("keeps cross-slice reconciliation comparison and finding payload shapes stable (T030)", () => {
    registerDdMappingLookup("v1_ve_output", v1HasDdMapping);
    registerDdMappingLookup("valuation_listings_output", valuationHasDdMapping);
    registerDdMappingLookup("bsrs_configuration_output", bsrsHasDdMapping);

    resetDeterminismForTests();
    const bsrsPacket = buildBsrsConfigurationPacketFromFixture(parseBsrsConfigurationFixtures()[0]);
    const v1Row = bsrsPacket.v1_ve_output_row;
    const valuationRow = bsrsPacket.valuation_listings_output_row;
    const bsrsRow = resolveBsrsConfigurationOutput(bsrsPacket, "packet-BSRS001", "0.1.0").row;

    const evidence = [
      ...buildEvidenceForInventory({ case_id: bsrsPacket.case_id, slice: "v1_ve_output", row: v1Row, source_path: "test" }),
      ...buildEvidenceForInventory({ case_id: bsrsPacket.case_id, slice: "valuation_listings_output", row: valuationRow, source_path: "test" }),
      ...buildEvidenceForInventory({ case_id: bsrsPacket.case_id, slice: "bsrs_configuration_output", row: bsrsRow, source_path: "test" }),
    ];

    const result = reconcileSharedFacts({ evidence });

    expect(result.comparisons.length).toBeGreaterThan(0);
    for (const comparison of result.comparisons) {
      expectExactKeys(comparison as unknown as Record<string, unknown>, RECONCILIATION_COMPARISON_KEYS);
    }

    for (const finding of result.findings) {
      expectExactKeys(finding as unknown as Record<string, unknown>, RECONCILIATION_FINDING_KEYS);
    }
  });
});

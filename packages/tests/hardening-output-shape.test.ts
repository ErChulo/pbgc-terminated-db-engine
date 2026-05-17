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
} from "@pbgc/bsrs-configuration-output";
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
});

import { describe, expect, it } from "vitest";
import { buildPacketFromFixture, validateDateResolutionPacket } from "@pbgc/date-resolution";
import { buildServicePacketFromFixture, validateServiceResolutionPacket } from "@pbgc/service-resolution";
import { buildCompensationPacketFromFixture, validateCompensationResolutionPacket } from "@pbgc/compensation-resolution";
import { buildFormPacketFromFixture, validateFormResolutionPacket } from "@pbgc/form-resolution";
import {
  buildBenefitPacketFromFixture,
  runBenefitKernel,
} from "@pbgc/benefit-kernel";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput } from "@pbgc/valuation-listings-output";
import { buildBsrsConfigurationPacketFromFixture, runBsrsConfiguration } from "@pbgc/bsrs-configuration-output";
import {
  listBenefitKernelRunsWithTrace,
  listModuleTraces,
  listResolvedBenefitKernelOutputs,
  listResolvedBsrsConfigurationOutputs,
  listResolvedValuationListingOutputs,
  listResolvedV1VeOutputs,
} from "@pbgc/db";
import { resetDeterminismForTests } from "@pbgc/shared";
import { closeHardeningDatabase, createHardeningDatabase, seedReviewedInputPacket } from "./hardening-helpers";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("hardening reviewed-input boundary", () => {
  it("rejects malformed reviewed packets before deterministic resolution begins", () => {
    resetDeterminismForTests();

    const datePacket = { ...buildPacketFromFixture(parseDateResolutionFixtures()[0]), case_plan_timeline: null } as any;
    expect(validateDateResolutionPacket(datePacket, "packet-DR001", "0.1.0").map((issue) => issue.code)).toContain("MISSING_REQUIRED_GROUP");

    const servicePacket = { ...buildServicePacketFromFixture(parseServiceResolutionFixtures()[0]), resolved_plan_logic: {} } as any;
    expect(validateServiceResolutionPacket(servicePacket, "packet-SR001", "0.1.0").map((issue) => issue.code)).toContain("BLANK_FIELD_VALUE");

    const compensationPacket = { ...buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]), compensation_accrual_inputs: {} } as any;
    expect(validateCompensationResolutionPacket(compensationPacket, "packet-CR001", "0.1.0").map((issue) => issue.code)).toContain("BLANK_FIELD_VALUE");

    const formPacket = { ...buildFormPacketFromFixture(parseFormResolutionFixtures()[0]), actuarial_assumption_factor_set: {} } as any;
    expect(validateFormResolutionPacket(formPacket, "packet-FR001", "0.1.0").map((issue) => issue.code)).toContain("MISSING_INPUT_FIELD");
  });

  it("blocks rejected engine input packets before output rows or traces are persisted", async () => {
    const scenarios = [
      {
        fixture: parseBenefitKernelFixtures()[0],
        inputPacketId: "packet-BK001",
        packetType: "benefit_kernel" as const,
        buildPacket: buildBenefitPacketFromFixture,
        run: runBenefitKernel,
        moduleName: "benefit_kernel" as const,
        listOutputs: listResolvedBenefitKernelOutputs,
        listRunsWithTrace: listBenefitKernelRunsWithTrace,
      },
      {
        fixture: parseV1VeOutputFixtures()[0],
        inputPacketId: "packet-VE001",
        packetType: "v1_ve_output" as const,
        buildPacket: buildV1VePacketFromFixture,
        run: runV1VeOutput,
        moduleName: "v1_ve_output" as const,
        listOutputs: listResolvedV1VeOutputs,
      },
      {
        fixture: parseValuationListingsFixtures()[0],
        inputPacketId: "packet-VL001",
        packetType: "valuation_listings_output" as const,
        buildPacket: buildValuationListingsPacketFromFixture,
        run: runValuationListingsOutput,
        moduleName: "valuation_listings_output" as const,
        listOutputs: listResolvedValuationListingOutputs,
      },
      {
        fixture: parseBsrsConfigurationFixtures()[0],
        inputPacketId: "packet-BSRS001",
        packetType: "bsrs_configuration_output" as const,
        buildPacket: buildBsrsConfigurationPacketFromFixture,
        run: runBsrsConfiguration,
        moduleName: "bsrs_configuration_output" as const,
        listOutputs: listResolvedBsrsConfigurationOutputs,
      },
    ] as const;

    for (const scenario of scenarios) {
      const db = await createHardeningDatabase();
      try {
        const packet = (scenario.buildPacket as (fixture: unknown) => any)(scenario.fixture);
        seedReviewedInputPacket(db, { ...packet, packet_type: scenario.packetType }, scenario.inputPacketId, "rejected");

        const result = scenario.run(db, {
          case_id: packet.case_id,
          subject_type: packet.subject_type,
          subject_key: packet.subject_key,
          input_packet_id: scenario.inputPacketId,
          rule_version: "0.1.0",
          deliverable_version: "0.1.0",
        });

        expect(result.run_status).toBe("failed");
        expect(result.error_count).toBe(1);
        expect(result.errors.map((issue) => issue.code)).toContain("INPUT_PACKET_NOT_ACTIVE");
        expect(scenario.listOutputs(db)).toHaveLength(0);
        if ("listRunsWithTrace" in scenario) {
          expect(scenario.listRunsWithTrace(db)).toHaveLength(0);
        }
        expect(listModuleTraces(db, result.calculation_run_id, scenario.moduleName)).toHaveLength(0);
      } finally {
        closeHardeningDatabase(db);
      }
    }
  });
});

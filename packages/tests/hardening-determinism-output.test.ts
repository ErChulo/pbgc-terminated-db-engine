import { describe, expect, it } from "vitest";
import { buildBenefitPacketFromFixture, runBenefitKernel } from "@pbgc/benefit-kernel";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput } from "@pbgc/valuation-listings-output";
import { buildBsrsConfigurationPacketFromFixture, runBsrsConfiguration } from "@pbgc/bsrs-configuration-output";
import { closeHardeningDatabase, createHardeningDatabase, seedReviewedInputPacket } from "./hardening-helpers";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";
import { compareRepeatedRuns } from "./hardening-helpers";

describe("hardening deterministic output slices", () => {
  it("keeps benefit_kernel and downstream adapter runs identical across repeated executions", async () => {
    const scenarios = [
      {
        name: "benefit_kernel",
        fixture: parseBenefitKernelFixtures()[0],
        packetType: "benefit_kernel" as const,
        buildPacket: buildBenefitPacketFromFixture,
        run: runBenefitKernel,
        inputPacketPrefix: "packet-BK001",
      },
      {
        name: "v1_ve_output",
        fixture: parseV1VeOutputFixtures()[0],
        packetType: "v1_ve_output" as const,
        buildPacket: buildV1VePacketFromFixture,
        run: runV1VeOutput,
        inputPacketPrefix: "packet-VE001",
      },
      {
        name: "valuation_listings_output",
        fixture: parseValuationListingsFixtures()[0],
        packetType: "valuation_listings_output" as const,
        buildPacket: buildValuationListingsPacketFromFixture,
        run: runValuationListingsOutput,
        inputPacketPrefix: "packet-VL001",
      },
      {
        name: "bsrs_configuration_output",
        fixture: parseBsrsConfigurationFixtures()[0],
        packetType: "bsrs_configuration_output" as const,
        buildPacket: buildBsrsConfigurationPacketFromFixture,
        run: runBsrsConfiguration,
        inputPacketPrefix: "packet-BSRS001",
      },
    ] as const;

    for (const scenario of scenarios) {
      const [first, second] = await compareRepeatedRuns(async () => {
        const db = await createHardeningDatabase();
        try {
          const packet = (scenario.buildPacket as (fixture: unknown) => any)(scenario.fixture);
          seedReviewedInputPacket(db, { ...packet, packet_type: scenario.packetType }, scenario.inputPacketPrefix);
          return scenario.run(db, {
            case_id: packet.case_id,
            subject_type: packet.subject_type,
            subject_key: packet.subject_key,
            input_packet_id: scenario.inputPacketPrefix,
            rule_version: "0.1.0",
            deliverable_version: "0.1.0",
          });
        } finally {
          closeHardeningDatabase(db);
        }
      });

      expect(second).toEqual(first);
    }
  });
});

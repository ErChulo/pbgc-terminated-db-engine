import { describe, expect, it } from "vitest";
import { buildBenefitPacketFromFixture, runBenefitKernel } from "@pbgc/benefit-kernel";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput } from "@pbgc/valuation-listings-output";
import { buildBsrsConfigurationPacketFromFixture, runBsrsConfiguration } from "@pbgc/bsrs-configuration-output";
import { closeHardeningDatabase, createHardeningDatabase, seedReviewedInputPacket } from "./hardening-helpers";
import { expectAdapterIsolation, ADAPTER_OUTPUT_TABLES } from "./hardening-adapter-helpers";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("hardening adapter exclusion boundaries", () => {
  it("confirms the ADAPTER_OUTPUT_TABLES list covers all known output adapters", () => {
    expect(ADAPTER_OUTPUT_TABLES).toContain("benefit_kernel_output");
    expect(ADAPTER_OUTPUT_TABLES).toContain("v1_ve_output_row");
    expect(ADAPTER_OUTPUT_TABLES).toContain("valuation_listing_output_row");
    expect(ADAPTER_OUTPUT_TABLES).toContain("bsrs_configuration_output_row");
  });

  it("isolates benefit_kernel to its own table without affecting downstream adapter tables", async () => {
    const db = await createHardeningDatabase();
    try {
      const fixture = parseBenefitKernelFixtures()[0];
      const packet = buildBenefitPacketFromFixture(fixture);
      seedReviewedInputPacket(db, { ...packet, packet_type: "benefit_kernel" }, "packet-BK001");

      const result = runBenefitKernel(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: "packet-BK001",
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("completed");
      expectAdapterIsolation(db, "benefit_kernel_output");
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("isolates v1_ve_output to its own table", async () => {
    const db = await createHardeningDatabase();
    try {
      const fixture = parseV1VeOutputFixtures()[0];
      const packet = buildV1VePacketFromFixture(fixture);
      seedReviewedInputPacket(db, { ...packet, packet_type: "v1_ve_output" }, "packet-VE001");

      const result = runV1VeOutput(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: "packet-VE001",
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("completed");
      expectAdapterIsolation(db, "v1_ve_output_row");
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("isolates valuation_listings_output to its own table", async () => {
    const db = await createHardeningDatabase();
    try {
      const fixture = parseValuationListingsFixtures()[0];
      const packet = buildValuationListingsPacketFromFixture(fixture);
      seedReviewedInputPacket(db, { ...packet, packet_type: "valuation_listings_output" }, "packet-VL001");

      const result = runValuationListingsOutput(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: "packet-VL001",
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("completed");
      expectAdapterIsolation(db, "valuation_listing_output_row");
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("isolates bsrs_configuration_output to its own table", async () => {
    const db = await createHardeningDatabase();
    try {
      const fixture = parseBsrsConfigurationFixtures()[0];
      const packet = buildBsrsConfigurationPacketFromFixture(fixture);
      seedReviewedInputPacket(db, { ...packet, packet_type: "bsrs_configuration_output" }, "packet-BSRS001");

      const result = runBsrsConfiguration(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: "packet-BSRS001",
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("completed");
      expectAdapterIsolation(db, "bsrs_configuration_output_row");
    } finally {
      closeHardeningDatabase(db);
    }
  });
});

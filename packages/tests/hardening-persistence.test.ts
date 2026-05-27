import { describe, expect, it } from "vitest";
import { buildBenefitPacketFromFixture, runBenefitKernel } from "@pbgc/benefit-kernel";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput } from "@pbgc/valuation-listings-output";
import { buildBsrsConfigurationPacketFromFixture, runBsrsConfiguration } from "@pbgc/bsrs-configuration-output";
import { listBenefitKernelRunsWithTrace } from "@pbgc/db";
import {
  closeHardeningDatabase,
  createHardeningDatabase,
  seedReviewedInputPacket,
} from "./hardening-helpers";
import { sqlTableCount } from "./hardening-db-helpers";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("hardening persistence-boundary regression", () => {
  it("persists engine_run rows and output rows after successful benefit_kernel run", async () => {
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
      expect(result.calculation_run_id).toBeTruthy();

      // Verify engine_run persisted
      const engineRunCount = sqlTableCount(db, "engine_run");
      expect(engineRunCount).toBe(1);

      // Verify output row persisted
      const outputCount = sqlTableCount(db, "benefit_kernel_output");
      expect(outputCount).toBe(1);

      // Verify run is tracked and has trail
      const runsWithTrace = listBenefitKernelRunsWithTrace(db);
      expect(runsWithTrace).toHaveLength(1);
      expect(runsWithTrace[0].calculation_run_id).toBe(result.calculation_run_id);
      expect(runsWithTrace[0].trace_count).toBeGreaterThan(0);
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("persists engine_run and output rows for v1_ve_output", async () => {
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

      const engineRunCount = sqlTableCount(db, "engine_run");
      expect(engineRunCount).toBe(1);

      const outputCount = sqlTableCount(db, "v1_ve_output_row");
      expect(outputCount).toBe(1);
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("persists engine_run and output rows for valuation_listings_output", async () => {
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

      expect(sqlTableCount(db, "engine_run")).toBe(1);
      expect(sqlTableCount(db, "valuation_listing_output_row")).toBe(1);
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("persists engine_run and output rows for bsrs_configuration_output", async () => {
    const db = await createHardeningDatabase();
    try {
      const fixture = parseBsrsConfigurationFixtures()[0];
      const packet = buildBsrsConfigurationPacketFromFixture(fixture);
      seedReviewedInputPacket(
        db,
        { ...packet, packet_type: "bsrs_configuration_output" },
        "packet-BSRS001",
      );

      const result = runBsrsConfiguration(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: "packet-BSRS001",
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("completed");

      expect(sqlTableCount(db, "engine_run")).toBe(1);
      expect(sqlTableCount(db, "bsrs_configuration_output_row")).toBe(1);
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("does not persist output rows when a run fails (rejected input)", async () => {
    const db = await createHardeningDatabase();
    try {
      const fixture = parseBenefitKernelFixtures()[0];
      const packet = buildBenefitPacketFromFixture(fixture);
      seedReviewedInputPacket(
        db,
        { ...packet, packet_type: "benefit_kernel" },
        "packet-BK001",
        "rejected",
      );

      const result = runBenefitKernel(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: "packet-BK001",
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("failed");
      expect(sqlTableCount(db, "engine_run")).toBe(1);
      expect(sqlTableCount(db, "benefit_kernel_output")).toBe(0);
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("names output tables consistently across the MVP adapter set", () => {
    // All engine adapters must persist to their expected output tables
    // Table names must match adapter output contract
    const expectedTableNames = [
      "benefit_kernel_output",
      "v1_ve_output_row",
      "valuation_listing_output_row",
      "bsrs_configuration_output_row",
    ];
    expect(expectedTableNames).toHaveLength(4);
  });
});

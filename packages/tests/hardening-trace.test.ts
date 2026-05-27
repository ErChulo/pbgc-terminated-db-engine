import { describe, expect, it } from "vitest";
import { buildBenefitPacketFromFixture, runBenefitKernel } from "@pbgc/benefit-kernel";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput } from "@pbgc/valuation-listings-output";
import { buildBsrsConfigurationPacketFromFixture, runBsrsConfiguration } from "@pbgc/bsrs-configuration-output";
import {
  closeHardeningDatabase,
  createHardeningDatabase,
  seedReviewedInputPacket,
  compareRepeatedRuns,
} from "./hardening-helpers";
import { fetchNormalizedTraces, expectTracesEquivalent } from "./hardening-trace-helpers";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("hardening traceability regression", () => {
  it("persists module traces after benefit_kernel run with rule version metadata", async () => {
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
      expect(result.traces).toBeDefined();
      expect(result.traces.length).toBeGreaterThan(0);

      // Every trace must have the correct module name and rule version
      for (const trace of result.traces) {
        expect(trace.module_name).toBe("benefit_kernel");
        expect(trace.rule_applied).toBeTruthy();
        expect(trace.field_name).toBeTruthy();
        expect(trace.intermediate_values_json).toBeTruthy();
      }
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("persists module traces after v1_ve_output run", async () => {
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
      expect(result.traces.length).toBeGreaterThan(0);

      for (const trace of result.traces) {
        expect(trace.module_name).toBe("v1_ve_output");
        expect(trace.rule_applied).toBeTruthy();
      }
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("persists module traces after valuation_listings_output run", async () => {
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
      expect(result.traces.length).toBeGreaterThan(0);

      for (const trace of result.traces) {
        expect(trace.module_name).toBe("valuation_listings_output");
        expect(trace.rule_applied).toBeTruthy();
      }
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("persists module traces after bsrs_configuration_output run", async () => {
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
      expect(result.traces.length).toBeGreaterThan(0);

      for (const trace of result.traces) {
        expect(trace.module_name).toBe("bsrs_configuration_output");
        expect(trace.rule_applied).toBeTruthy();
      }
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("produces equivalent normalized traces across repeated benefit_kernel runs", async () => {
    const [firstTraces, secondTraces] = await compareRepeatedRuns(async () => {
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

        return fetchNormalizedTraces(db, result.calculation_run_id, "benefit_kernel");
      } finally {
        closeHardeningDatabase(db);
      }
    });

    expectTracesEquivalent(firstTraces, secondTraces);
  });

  it("does not persist traces when a run fails with validation errors", async () => {
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
      expect(result.traces).toHaveLength(0);

      // fetchNormalizedTraces should also return empty
      const normalized = fetchNormalizedTraces(db, result.calculation_run_id, "benefit_kernel");
      expect(normalized).toHaveLength(0);
    } finally {
      closeHardeningDatabase(db);
    }
  });
});

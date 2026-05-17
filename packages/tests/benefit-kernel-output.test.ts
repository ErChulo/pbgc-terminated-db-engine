import { describe, expect, it } from "vitest";
import { buildBenefitPacketFromFixture, resolveBenefitKernel, runBenefitKernel } from "@pbgc/benefit-kernel";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";

describe("benefit_kernel deterministic outputs", () => {
  it("matches committed expected outputs for BK001", () => {
    resetDeterminismForTests();
    const fixture = parseBenefitKernelFixtures().find((row) => row.test_case_id === "BK001");
    if (!fixture) throw new Error("Missing BK001 fixture");
    const result = resolveBenefitKernel(buildBenefitPacketFromFixture(fixture), "packet-BK001", "0.1.0");
    expect(result.values.term_mb_nrd_nsf).toBe(2500);
    expect(result.values.xrd_mb_term).toBe(2500);
    expect(result.values.pvmb_term).toBe(198400);
    expect(result.warnings).toHaveLength(0);
  });

  it("returns explicit null outputs and warnings for BK002 and BK003", () => {
    resetDeterminismForTests();
    const fixtures = parseBenefitKernelFixtures();
    const integrated = resolveBenefitKernel(buildBenefitPacketFromFixture(fixtures[1]), "packet-BK002", "0.1.0");
    expect(integrated.values.term_mb_nrd_nsf).toBeNull();
    expect(integrated.values.xrd_mb_term).toBeNull();
    expect(integrated.values.pvmb_term).toBeNull();
    expect(integrated.warnings.map((warning) => warning.code)).toContain("UNSUPPORTED_INTEGRATED_FORMULA");

    const qpsa = resolveBenefitKernel(buildBenefitPacketFromFixture(fixtures[2]), "packet-BK003", "0.1.0");
    expect(qpsa.values.term_mb_nrd_nsf).toBeNull();
    expect(qpsa.values.xrd_mb_term).toBeNull();
    expect(qpsa.values.pvmb_term).toBeNull();
    expect(qpsa.warnings.map((warning) => warning.code)).toContain("UNSUPPORTED_QPSA_BRANCH");
  });
});

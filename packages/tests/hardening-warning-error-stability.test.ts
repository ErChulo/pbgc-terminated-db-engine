import { describe, expect, it } from "vitest";
import { buildFormPacketFromFixture, resolveForms } from "@pbgc/form-resolution";
import { buildBenefitPacketFromFixture, resolveBenefitKernel } from "@pbgc/benefit-kernel";
import { buildV1VePacketFromFixture, runV1VeOutput } from "@pbgc/v1-ve-output";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput } from "@pbgc/valuation-listings-output";
import { buildBsrsConfigurationPacketFromFixture, runBsrsConfiguration } from "@pbgc/bsrs-configuration-output";
import { buildPacketFromFixture, validateDateResolutionPacket } from "@pbgc/date-resolution";
import { buildServicePacketFromFixture, validateServiceResolutionPacket } from "@pbgc/service-resolution";
import { buildCompensationPacketFromFixture, validateCompensationResolutionPacket } from "@pbgc/compensation-resolution";
import { buildFormPacketFromFixture as buildFormValidationPacket, validateFormResolutionPacket } from "@pbgc/form-resolution";
import { closeHardeningDatabase, compareRepeatedRuns, createHardeningDatabase, seedReviewedInputPacket } from "./hardening-helpers";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseV1VeOutputFixtures } from "./v1-ve-output-fixtures";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";

describe("hardening warning and error payload stability", () => {
  it("keeps warning payloads stable across repeated runs", async () => {
    const warningScenarios: Array<() => Promise<unknown>> = [
      async () => resolveForms(buildFormPacketFromFixture(parseFormResolutionFixtures()[1]), "packet-FR002", "0.1.0"),
      async () => resolveBenefitKernel(buildBenefitPacketFromFixture(parseBenefitKernelFixtures()[1]), "packet-BK002", "0.1.0"),
      async () => {
        const db = await createHardeningDatabase();
        try {
          const packet = buildV1VePacketFromFixture(parseV1VeOutputFixtures()[1]);
          seedReviewedInputPacket(db, { ...packet, packet_type: "v1_ve_output" }, "packet-VE002");
          return runV1VeOutput(db, {
            case_id: packet.case_id,
            subject_type: packet.subject_type,
            subject_key: packet.subject_key,
            input_packet_id: "packet-VE002",
            rule_version: "0.1.0",
            deliverable_version: "0.1.0",
          });
        } finally {
          closeHardeningDatabase(db);
        }
      },
      async () => {
        const db = await createHardeningDatabase();
        try {
          const packet = buildValuationListingsPacketFromFixture(parseValuationListingsFixtures()[1]);
          seedReviewedInputPacket(db, { ...packet, packet_type: "valuation_listings_output" }, "packet-VL002");
          return runValuationListingsOutput(db, {
            case_id: packet.case_id,
            subject_type: packet.subject_type,
            subject_key: packet.subject_key,
            input_packet_id: "packet-VL002",
            rule_version: "0.1.0",
            deliverable_version: "0.1.0",
          });
        } finally {
          closeHardeningDatabase(db);
        }
      },
      async () => {
        const db = await createHardeningDatabase();
        try {
          const packet = buildBsrsConfigurationPacketFromFixture(parseBsrsConfigurationFixtures()[1]);
          seedReviewedInputPacket(db, { ...packet, packet_type: "bsrs_configuration_output" }, "packet-BSRS002");
          return runBsrsConfiguration(db, {
            case_id: packet.case_id,
            subject_type: packet.subject_type,
            subject_key: packet.subject_key,
            input_packet_id: "packet-BSRS002",
            rule_version: "0.1.0",
            deliverable_version: "0.1.0",
          });
        } finally {
          closeHardeningDatabase(db);
        }
      },
    ];

    for (const runScenario of warningScenarios) {
      const [first, second] = await compareRepeatedRuns(runScenario);
      expect(second).toEqual(first);
    }
  });

  it("keeps error payloads stable across repeated rejected-input validations", async () => {
    const [dateErrorsFirst, dateErrorsSecond] = await compareRepeatedRuns(() =>
      validateDateResolutionPacket({ ...buildPacketFromFixture(parseDateResolutionFixtures()[0]), case_plan_timeline: null } as any, "packet-DR001", "0.1.0"),
    );
    expect(dateErrorsSecond).toEqual(dateErrorsFirst);

    const [serviceErrorsFirst, serviceErrorsSecond] = await compareRepeatedRuns(() =>
      validateServiceResolutionPacket({ ...buildServicePacketFromFixture(parseServiceResolutionFixtures()[0]), resolved_plan_logic: {} } as any, "packet-SR001", "0.1.0"),
    );
    expect(serviceErrorsSecond).toEqual(serviceErrorsFirst);

    const [compErrorsFirst, compErrorsSecond] = await compareRepeatedRuns(() =>
      validateCompensationResolutionPacket({ ...buildCompensationPacketFromFixture(parseCompensationResolutionFixtures()[0]), compensation_accrual_inputs: {} } as any, "packet-CR001", "0.1.0"),
    );
    expect(compErrorsSecond).toEqual(compErrorsFirst);

    const [formErrorsFirst, formErrorsSecond] = await compareRepeatedRuns(() =>
      validateFormResolutionPacket({ ...buildFormValidationPacket(parseFormResolutionFixtures()[0]), actuarial_assumption_factor_set: {} } as any, "packet-FR001", "0.1.0"),
    );
    expect(formErrorsSecond).toEqual(formErrorsFirst);
  });
});

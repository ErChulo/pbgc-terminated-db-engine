import { describe, expect, it } from "vitest";
import { buildBsrsConfigurationPacketFromFixture, type BsrsConfigurationOutputRequest } from "@pbgc/bsrs-configuration-output";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("bsrs_configuration_output contract shape", () => {
  it("builds reviewed BSRS packets with required input and output groups", () => {
    resetDeterminismForTests();
    const packet = buildBsrsConfigurationPacketFromFixture(parseBsrsConfigurationFixtures()[0]);
    expect(packet.packet_type).toBe("bsrs_configuration_output");
    expect(packet.schema_version).toBe("0.1.0");
    expect(packet.case_plan_timeline).toHaveProperty("plan_id");
    expect(packet.participant_role_population).toHaveProperty("bcv_rec_id");
    expect(packet.service_employment_history).toHaveProperty("doh");
    expect(packet.resolved_dates).toHaveProperty("xrd");
    expect(packet.resolved_service_compensation).toHaveProperty("benefit_service_resolved");
    expect(packet.resolved_forms_status).toHaveProperty("rettyp");
    expect(packet.benefit_kernel_output).toHaveProperty("pvmb_term");
    expect(packet.v1_ve_output_row).toHaveProperty("term_mb_nrd_nsf");
    expect(packet.valuation_listings_output_row).toHaveProperty("listing_sort_key");
    expect(packet.trace_inputs).toHaveProperty("rule_trace_id");
  });

  it("uses the approved run request fields and versions", () => {
    const request: BsrsConfigurationOutputRequest = {
      case_id: "CASE-PLACEHOLDER",
      subject_type: "participant",
      subject_key: "BSRS001",
      input_packet_id: "packet-BSRS001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    };
    expect(Object.keys(request)).toEqual([
      "case_id",
      "subject_type",
      "subject_key",
      "input_packet_id",
      "rule_version",
      "deliverable_version",
    ]);
  });
});

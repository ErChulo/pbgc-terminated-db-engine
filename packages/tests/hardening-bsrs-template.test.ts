import { describe, expect, it } from "vitest";
import {
  buildBsrsConfigurationPacketFromFixture,
  runBsrsConfiguration,
  BSRS_CONFIGURATION_OUTPUT_FIELDS,
} from "@pbgc/bsrs-configuration-output";
import { closeHardeningDatabase, createHardeningDatabase, seedReviewedInputPacket } from "./hardening-helpers";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

const BSRS_REQUIRED_STATEMENT_FIELDS = [
  "case_id",
  "plan_id",
  "bcv_rec_id",
  "retstat",
  "id",
  "fname",
  "lname",
  "mstat",
  "dob",
  "nrd",
  "xra",
  "xrd",
  "form_code_nsf",
  "xrd_mb_term",
  "statement_row_type",
  "statement_sort_key",
  "statement_population_indicator",
  "statement_type_code",
  "statement_status_code",
] as const;

describe("hardening BSRS template and guidance alignment", () => {
  it("includes all required BSRS statement fields in the output field list", () => {
    const outputFieldSet = new Set<string>(BSRS_CONFIGURATION_OUTPUT_FIELDS);

    for (const required of BSRS_REQUIRED_STATEMENT_FIELDS) {
      expect(
        outputFieldSet.has(required),
        `Required BSRS statement field "${required}" missing from output field list`,
      ).toBe(true);
    }
  });

  it("produces a completed BSRS output row with expected statement metadata", async () => {
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
      expect(result.output).toBeDefined();
      const row = result.output!.row;

      // Verify required statement-level metadata
      expect(row.statement_row_type).toBe("participant");
      expect(row.statement_population_indicator).toBeTruthy();
      expect(row.statement_type_code).toBeTruthy();
      expect(row.statement_status_code).toBeTruthy();
      expect(row.deliverable_version).toBe("0.1.0");
      expect(row.schema_version).toBe("0.1.0");

      // Verify display fields
      expect(row.display_form_code).toBeTruthy();
      expect(typeof row.display_monthly_amount).toBe("number");
      expect(row.display_monthly_amount).toBeGreaterThan(0);
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("includes BSRS-specific ce_track fields in the output", async () => {
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
      const row = result.output!.row;

      // CE track inputs from trace_inputs should be forwarded to output
      for (let i = 1; i <= 6; i++) {
        const field = `ce_track${i}` as keyof typeof row;
        expect(row[field], `Missing ce_track${i} in BSRS output`).toBeTruthy();
      }
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("preserves BSRS rule_trace_id, calculation_run_id, and deliverable_version in output", async () => {
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
      const row = result.output!.row;

      expect(row.rule_trace_id).toBeTruthy();
      expect(row.calculation_run_id).toBe(result.calculation_run_id);
      expect(row.deliverable_version).toBe("0.1.0");
      expect(row.schema_version).toBe("0.1.0");
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("includes BSRS configuration trace and warning metadata in output", async () => {
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
      const row = result.output!.row;

      expect(row.bsrs_configuration_output_rule_trace).toBeTruthy();
      expect(typeof row.bsrs_configuration_output_warning_flag).toBe("boolean");
      // warning_note can be null if no warnings
    } finally {
      closeHardeningDatabase(db);
    }
  });

  it("BSRS OUTPUT_FIELDS count is stable — no unintentional regressions", () => {
    expect(BSRS_CONFIGURATION_OUTPUT_FIELDS.length).toBeGreaterThanOrEqual(85);
  });
});

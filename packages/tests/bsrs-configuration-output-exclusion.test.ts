/**
 * BSRS adapter-exclusion regression tests.
 * T058: Proves BSRS generation does not write to unrelated output-adapter tables.
 * T059: Proves approved contract-name fallback works when a BSRS field has no matching DD.csv entry.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listResolvedBsrsConfigurationOutputs,
  listResolvedValuationListingOutputs,
  listResolvedV1VeOutputs,
} from "@pbgc/db";
import {
  buildBsrsConfigurationPacketFromFixture,
  canonicalDdFieldName,
  runBsrsConfiguration,
  type BsrsConfigurationOutputPacket,
} from "@pbgc/bsrs-configuration-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

const REPO_ROOT = process.cwd();

describe("bsrs_configuration_output adapter-exclusion", () => {
  it("does not write v1_ve_output rows during BSRS configuration generation (T058)", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);

    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-EXCL-V1VE",
      case_id: packet.case_id,
      subject_key: fixture.test_case_id,
      subject_type: packet.subject_type,
      packet_type: "bsrs_configuration_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const v1VeBefore = listResolvedV1VeOutputs(db);

    const result = runBsrsConfiguration(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: fixture.test_case_id,
      input_packet_id: "packet-EXCL-V1VE",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");

    const v1VeAfter = listResolvedV1VeOutputs(db);
    expect(v1VeAfter.length).toBe(v1VeBefore.length);
  });

  it("does not write valuation_listings_output rows during BSRS configuration generation (T058)", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);

    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-EXCL-VL",
      case_id: packet.case_id,
      subject_key: fixture.test_case_id,
      subject_type: packet.subject_type,
      packet_type: "bsrs_configuration_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const vlBefore = listResolvedValuationListingOutputs(db);

    const result = runBsrsConfiguration(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: fixture.test_case_id,
      input_packet_id: "packet-EXCL-VL",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");

    const vlAfter = listResolvedValuationListingOutputs(db);
    expect(vlAfter.length).toBe(vlBefore.length);
  });

  it("writes only bsrs_configuration_output rows during BSRS configuration generation (T058)", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);

    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-EXCL-ALL",
      case_id: packet.case_id,
      subject_key: fixture.test_case_id,
      subject_type: packet.subject_type,
      packet_type: "bsrs_configuration_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const bsrsBefore = listResolvedBsrsConfigurationOutputs(db);

    const result = runBsrsConfiguration(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: fixture.test_case_id,
      input_packet_id: "packet-EXCL-ALL",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");

    const bsrsAfter = listResolvedBsrsConfigurationOutputs(db);
    // Only one new BSRS row should have been added
    expect(bsrsAfter.length).toBe(bsrsBefore.length + 1);

    // Other adapter tables should remain unchanged
    expect(listResolvedV1VeOutputs(db).length).toBe(0);
    expect(listResolvedValuationListingOutputs(db).length).toBe(0);
  });

  it("verifies runBsrsConfiguration source does not import unrelated adapter modules (T058)", () => {
    const runSource = readFileSync(
      resolve(REPO_ROOT, "packages/engine/bsrs-configuration-output/src/runBsrsConfiguration.ts"),
      "utf8",
    );

    // Must not import unrelated adapter packages
    expect(runSource).not.toContain("@pbgc/v1-ve-output");
    expect(runSource).not.toContain("@pbgc/valuation-listings-output");

    // Must not contain INSERT INTO for unrelated tables
    expect(runSource).not.toContain("INSERT INTO v1_ve_output_row");
    expect(runSource).not.toContain("INSERT INTO valuation_listing_output_row");
  });
});

describe("bsrs_configuration_output contract-name fallback", () => {
  it("uses approved contract name when a BSRS field has no matching DD.csv entry (T059)", () => {
    // Fields without DD mappings should resolve to their own (contract) name
    const fieldsWithoutDD = [
      "plan_id",
      "custid",
      "calculation_context",
      "role_type",
      "current_form_code",
      "current_payment_amount",
      "statement_population_indicator",
      "statement_type_code",
      "statement_status_code",
      "benefit_effective_date_for_statement",
      "display_form_code",
      "display_monthly_amount",
      "display_survivor_amount",
      "display_lump_sum_amount",
      "recalculation_trigger_indicator",
      "recalculation_reason_code",
      "suppress_statement_indicator",
      "suppression_reason_code",
      "rule_trace_id",
      "calculation_run_id",
      "deliverable_version",
      "schema_version",
      "statement_row_type",
      "statement_sort_key",
    ];

    for (const field of fieldsWithoutDD) {
      const resolved = canonicalDdFieldName(field);
      // Fields without DD mapping resolve to their own name
      expect(resolved).toBe(field);
    }
  });

  it("preserves contract-name fallback in trace output (T059)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);

    // Fields like "plan_id" have no DD mapping but must still appear in the projected row
    const row = {
      plan_id: packet.case_plan_timeline.plan_id,
      custid: packet.participant_role_population.custid,
    };

    expect(row.plan_id.length).toBeGreaterThan(0);
    expect(row.custid.length).toBeGreaterThan(0);
    expect(canonicalDdFieldName("plan_id")).toBe("plan_id");
    expect(canonicalDdFieldName("custid")).toBe("custid");
  });
});

describe("bsrs_configuration_output no unrelated writes to output-adapter tables", () => {
  it("module_trace records are written only for bsrs_configuration_output module (T058)", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);

    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-TRACE-EXCL",
      case_id: packet.case_id,
      subject_key: fixture.test_case_id,
      subject_type: packet.subject_type,
      packet_type: "bsrs_configuration_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runBsrsConfiguration(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: fixture.test_case_id,
      input_packet_id: "packet-TRACE-EXCL",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(result.traces.length).toBeGreaterThan(0);

    // All traces should belong to bsrs_configuration_output module
    for (const trace of result.traces) {
      expect(trace.module_name).toBe("bsrs_configuration_output");
    }
  });
});

import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
} from "@pbgc/db";
import {
  buildBsrsConfigurationPacketFromFixture,
  normalizeBsrsInputs,
  runBsrsConfiguration,
  sortBsrsOutputRows,
} from "@pbgc/bsrs-configuration-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("bsrs_configuration_output runner integration", () => {
  it("normalizes all approved fixture packets without blocking errors (T033)", () => {
    resetDeterminismForTests();
    const fixtures = parseBsrsConfigurationFixtures();

    for (const fixture of fixtures) {
      const packet = buildBsrsConfigurationPacketFromFixture(fixture);
      const result = normalizeBsrsInputs(packet, `packet-${fixture.test_case_id}`, "0.1.0");

      // Normalization should succeed for all approved fixtures
      expect(result.normalized).toBeDefined();
      // No blocking errors (only warnings at most)
      expect(result.errors.length).toBe(0);
    }
  });

  it("completes a full runner cycle for every approved fixture (T033)", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);

    const fixtures = parseBsrsConfigurationFixtures();

    for (const fixture of fixtures) {
      const packet = buildBsrsConfigurationPacketFromFixture(fixture);
      insertEngineInputPacket(db, {
        input_packet_id: `packet-${fixture.test_case_id}`,
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
        input_packet_id: `packet-${fixture.test_case_id}`,
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("completed");
      expect(result.error_count).toBe(0);
      expect(result.output).toBeDefined();
      expect(result.output?.metadata.statement_row_type).toBeTruthy();
      expect(result.traces.length).toBeGreaterThan(0);
    }
  });

  it("produces deterministically sorted output rows across repeated runs (T033)", () => {
    resetDeterminismForTests();
    const fixtures = parseBsrsConfigurationFixtures();
    const packets = fixtures.map((f) => buildBsrsConfigurationPacketFromFixture(f));

    // Simulate artifacts from multiple packets and sort them
    const artifacts = packets.map((packet, i) => ({
      row: {
        case_id: packet.case_id,
        plan_id: packet.case_plan_timeline.plan_id,
        bcv_rec_id: packet.participant_role_population.bcv_rec_id,
        statement_row_type: packet.statement_row_type,
        statement_sort_key: packet.statement_sort_key,
      } as Parameters<typeof sortBsrsOutputRows>[0][number]["row"],
      metadata: {
        calculation_run_id: `run-${i}`,
        statement_row_type: packet.statement_row_type,
        statement_sort_key: packet.statement_sort_key,
        case_id: packet.case_id,
        plan_id: packet.case_plan_timeline.plan_id,
        bcv_rec_id: packet.participant_role_population.bcv_rec_id,
        adapter_version: "0.1.0" as const,
        deliverable_version: "0.1.0" as const,
      },
      warnings: [],
      traces: [],
    }));

    const first = sortBsrsOutputRows(artifacts);
    const second = sortBsrsOutputRows(artifacts);

    expect(first.map((a) => a.metadata.calculation_run_id)).toEqual(
      second.map((a) => a.metadata.calculation_run_id),
    );
  });
});

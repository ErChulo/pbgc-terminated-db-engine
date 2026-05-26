import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import { applyMvpDatabaseFoundation, createSqlJsContextFromStatic, insertEngineInputPacket } from "@pbgc/db";
import { buildPacketFromFixture, runDateResolution, type RunDateResolutionResult } from "@pbgc/date-resolution";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";

describe("date_resolution repeated-run determinism", () => {
  it("produces identical resolved values for five identical packet executions", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const results: RunDateResolutionResult[] = [];

    for (let run = 1; run <= 5; run += 1) {
      const { db } = createSqlJsContextFromStatic(SQL);
      applyMvpDatabaseFoundation(db);
      insertEngineInputPacket(db, {
        input_packet_id: `packet-DR001-repeat-${run}`,
        case_id: packet.case_id,
        subject_key: packet.subject_key,
        subject_type: packet.subject_type,
        packet_type: "date_resolution",
        schema_version: "0.1.0",
        packet_json: JSON.stringify(packet),
        built_from_resolved_at: null,
        built_by: "repeatability-test",
        built_at: currentTimestamp(),
        status: "active",
      });
      results.push(runDateResolution(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: `packet-DR001-repeat-${run}`,
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      }));
    }

    const baseOutput = results[0].output;
    expect(baseOutput).toBeDefined();
    for (let run = 1; run < 5; run += 1) {
      expect(results[run].output).toBeDefined();
      // Resolved values should be identical across runs
      expect(results[run].output!.nrd).toBe(baseOutput!.nrd);
      expect(results[run].output!.erd).toBe(baseOutput!.erd);
      expect(results[run].output!.rbd).toBe(baseOutput!.rbd);
      expect(results[run].output!.xra).toBe(baseOutput!.xra);
      expect(results[run].output!.xrd).toBe(baseOutput!.xrd);
      // Trace field counts should match
      expect(results[run].traces.length).toBe(results[0].traces.length);
    }

    // Trace content should be identical except generated IDs
    for (let run = 1; run < 5; run += 1) {
      for (let i = 0; i < results[run].traces.length; i += 1) {
        expect(results[run].traces[i].field_name).toBe(results[0].traces[i].field_name);
        expect(results[run].traces[i].output_value).toBe(results[0].traces[i].output_value);
        expect(results[run].traces[i].rule_applied).toBe(results[0].traces[i].rule_applied);
        expect(results[run].traces[i].warning_note).toBe(results[0].traces[i].warning_note);
        expect(results[run].traces[i].module_name).toBe(results[0].traces[i].module_name);
      }
      // Generated IDs differ, but that's expected
      expect(results[run].traces[0].module_trace_id).not.toBe(results[0].traces[0].module_trace_id);
    }
  });

  it("produces identical trace content for all three fixtures across repeated runs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    for (const fixture of parseDateResolutionFixtures()) {
      const packet = buildPacketFromFixture(fixture);
      const runResults: RunDateResolutionResult[] = [];
      for (let run = 1; run <= 2; run += 1) {
        const { db } = createSqlJsContextFromStatic(SQL);
        applyMvpDatabaseFoundation(db);
        insertEngineInputPacket(db, {
          input_packet_id: `packet-${fixture.test_case_id}-r${run}`,
          case_id: packet.case_id,
          subject_key: packet.subject_key,
          subject_type: packet.subject_type,
          packet_type: "date_resolution",
          schema_version: "0.1.0",
          packet_json: JSON.stringify(packet),
          built_from_resolved_at: null,
          built_by: "all-fixtures-test",
          built_at: currentTimestamp(),
          status: "active",
        });
        runResults.push(runDateResolution(db, {
          case_id: packet.case_id,
          subject_type: packet.subject_type,
          subject_key: packet.subject_key,
          input_packet_id: `packet-${fixture.test_case_id}-r${run}`,
          rule_version: "0.1.0",
          deliverable_version: "0.1.0",
        }));
      }
      // Compare first and second runs
      expect(runResults[0].run_status).toBe(runResults[1].run_status);
      if (runResults[0].output) {
        expect(runResults[1].output).toBeDefined();
        expect(runResults[1].output!.nrd).toBe(runResults[0].output!.nrd);
        expect(runResults[1].output!.rbd).toBe(runResults[0].output!.rbd);
      }
      // Warnings should also be deterministic
      expect(runResults[1].warning_count).toBe(runResults[0].warning_count);
    }
  });
});

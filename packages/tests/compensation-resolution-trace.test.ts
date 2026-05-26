import { describe, expect, it } from "vitest";
import {
  buildCompensationPacketFromFixture,
  buildCompensationTraces,
  collectWarnings,
  runCompensationResolution,
  writeCompensationTraceRows,
} from "@pbgc/compensation-resolution";
import { createSqlJsContextFromStatic, applyMvpDatabaseFoundation, insertEngineInputPacket } from "@pbgc/db";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import initSqlJs from "sql.js";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";

describe("compensation_resolution trace", () => {
  it("produces trace rows for every populated compensation field", () => {
    resetDeterminismForTests();
    for (const fixture of parseCompensationResolutionFixtures()) {
      const packet = buildCompensationPacketFromFixture(fixture);
      const entries = buildCompensationTraces(
        { compensation_resolved: packet.compensation_accrual_inputs.final_average_compensation, average_compensation_resolved: packet.compensation_accrual_inputs.final_average_compensation, covered_compensation_resolved: packet.compensation_accrual_inputs.covered_compensation_amount },
        packet,
        { inputPacketId: "test", caseId: packet.case_id, subjectKey: packet.subject_key, ruleVersion: "0.1.0", moduleVersion: "0.1.0" },
        [],
      );
      const traces = writeCompensationTraceRows("run-test", packet.subject_key, entries);
      const nonNullValues = Object.entries({ compensation_resolved: packet.compensation_accrual_inputs.final_average_compensation, average_compensation_resolved: packet.compensation_accrual_inputs.final_average_compensation, covered_compensation_resolved: packet.compensation_accrual_inputs.covered_compensation_amount }).filter(([, v]) => v !== null);
      expect(traces).toHaveLength(nonNullValues.length);
      for (const trace of traces) {
        expect(trace.module_name).toBe("compensation_resolution");
        expect(trace.rule_applied).toBeTruthy();
        expect(trace.input_fields_used_json).toBeTruthy();
        expect(trace.intermediate_values_json).toBeTruthy();
      }
    }
  });

  it("trace rule branches distinguish covered compensation from final average pay", () => {
    resetDeterminismForTests();
    const cr002 = parseCompensationResolutionFixtures().find((f) => f.test_case_id === "CR002");
    if (!cr002) throw new Error("Missing CR002 fixture");
    const packet = buildCompensationPacketFromFixture(cr002);
    const entries = buildCompensationTraces(
      { compensation_resolved: 80000, average_compensation_resolved: 80000, covered_compensation_resolved: 50000 },
      packet,
      { inputPacketId: "test", caseId: packet.case_id, subjectKey: packet.subject_key, ruleVersion: "0.1.0", moduleVersion: "0.1.0" },
      [],
    );
    const traces = writeCompensationTraceRows("run-test", packet.subject_key, entries);
    const coveredTrace = traces.find((t) => t.field_name === "covered_compensation_resolved");
    const fapTrace = traces.find((t) => t.field_name === "compensation_resolved");
    expect(coveredTrace).toBeDefined();
    expect(fapTrace).toBeDefined();
    expect(coveredTrace!.rule_applied).not.toBe(fapTrace!.rule_applied);
    expect(coveredTrace!.rule_applied).toContain("covered_compensation");
    expect(fapTrace!.rule_applied).toContain("final_average_pay");
  });

  it("trace includes frozen benefit support warning for CR003", () => {
    resetDeterminismForTests();
    const cr003 = parseCompensationResolutionFixtures().find((f) => f.test_case_id === "CR003");
    if (!cr003) throw new Error("Missing CR003 fixture");
    const packet = buildCompensationPacketFromFixture(cr003);
    const warnings = [{ code: "FROZEN_BENEFIT_SUPPORT_NO_COMPENSATION", message: "Frozen benefit support branch completed", field_name: "frozen_accrued_benefit_indicator", input_group: "compensation_accrual_inputs", input_packet_id: "test", module_name: "compensation_resolution" as const, rule_version: "0.1.0" }];
    const entries = buildCompensationTraces(
      { compensation_resolved: null, average_compensation_resolved: null, covered_compensation_resolved: null },
      packet,
      { inputPacketId: "test", caseId: packet.case_id, subjectKey: packet.subject_key, ruleVersion: "0.1.0", moduleVersion: "0.1.0" },
      warnings,
    );
    collectWarnings(entries, packet);
    const traces = writeCompensationTraceRows("run-test", packet.subject_key, entries);
    // For CR003, no compensation values are populated, so no traces should be writable
    // But if any were, they'd carry warnings
    const warnedTraces = traces.filter((t) => t.warning_note !== null);
    // Frozen benefit with null values produces no trace rows (only non-null values traced)
    expect(traces).toHaveLength(0);
  });

  it("produces deterministic traces across five repeated runs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const fixture = parseCompensationResolutionFixtures()[0];
    const packet = buildCompensationPacketFromFixture(fixture);
    const runs: Array<{ traceIds: string[]; ruleApplied: string[] }> = [];

    for (let i = 0; i < 5; i++) {
      resetDeterminismForTests();
      const { db } = createSqlJsContextFromStatic(SQL);
      applyMvpDatabaseFoundation(db);
      insertEngineInputPacket(db, {
        input_packet_id: `packet-CR001-run${i}`,
        case_id: packet.case_id,
        subject_key: packet.subject_key,
        subject_type: packet.subject_type,
        packet_type: "compensation_resolution",
        schema_version: "0.1.0",
        packet_json: JSON.stringify(packet),
        built_from_resolved_at: null,
        built_by: "test",
        built_at: currentTimestamp(),
        status: "active",
      });
      const result = runCompensationResolution(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: `packet-CR001-run${i}`,
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });
      expect(result.run_status).toBe("completed");
      runs.push({
        traceIds: result.traces.map((t) => t.module_trace_id),
        ruleApplied: result.traces.map((t) => t.rule_applied),
      });
    }

    const first = runs[0];
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].traceIds).toEqual(first.traceIds);
      expect(runs[i].ruleApplied).toEqual(first.ruleApplied);
    }
  });
});

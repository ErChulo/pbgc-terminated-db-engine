import { describe, expect, it } from "vitest";
import { buildServicePacketFromFixture, buildServiceResolutionTraces, collectWarnings, resolveService, runServiceResolution, writeModuleTraceRows } from "@pbgc/service-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";
import initSqlJs from "sql.js";
import { applyMvpDatabaseFoundation, createSqlJsContextFromStatic, insertEngineInputPacket } from "@pbgc/db";
import { currentTimestamp } from "@pbgc/shared";

describe("service_resolution US3 — trace", () => {
  describe("T043 — trace completeness for populated service fields", () => {
    it("produces trace entries for every populated service field", () => {
      resetDeterminismForTests();
      for (const fixture of parseServiceResolutionFixtures()) {
        const packet = buildServicePacketFromFixture(fixture);
        const values = resolveService(packet);
        const entries = buildServiceResolutionTraces(values, packet, {
          inputPacketId: `packet-${fixture.test_case_id}`,
          caseId: "CASE-PLACEHOLDER",
          subjectKey: fixture.test_case_id,
          ruleVersion: "0.1.0",
          moduleVersion: "0.1.0",
        });
        expect(entries.length).toBeGreaterThan(0);
        const fieldNames = entries.map((e) => e.fieldName).sort();
        expect(fieldNames).toContain("eligibility_service_resolved");
        expect(fieldNames).toContain("vesting_service_resolved");
        expect(fieldNames).toContain("benefit_service_resolved");
        expect(fieldNames).toContain("accrual_service_resolved");
      }
    });

    it("each trace entry has input field references covering service history and timeline", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      const values = resolveService(packet);
      const entries = buildServiceResolutionTraces(values, packet, {
        inputPacketId: "packet-test",
        caseId: "CASE-PLACEHOLDER",
        subjectKey: "SR001",
        ruleVersion: "0.1.0",
        moduleVersion: "0.1.0",
      });
      for (const entry of entries) {
        const groups = entry.inputFields.map((f) => f.group);
        expect(groups).toContain("service_employment_history");
        expect(groups).toContain("case_plan_timeline");
        expect(groups).toContain("resolved_plan_logic");
        expect(entry.ruleApplied).toContain("service_resolution@0.1.0:");
        expect(entry.intermediateValues).toHaveProperty("participation_date");
        expect(entry.intermediateValues).toHaveProperty("service_end_date");
        expect(entry.intermediateValues).toHaveProperty("branch");
      }
    });

    it("trace includes rule-applied field matching the service rule", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      const values = resolveService(packet);
      const entries = buildServiceResolutionTraces(values, packet, {
        inputPacketId: "packet-test",
        caseId: "CASE-PLACEHOLDER",
        subjectKey: "SR001",
        ruleVersion: "0.1.0",
        moduleVersion: "0.1.0",
      });
      const ruleRefs = entries.map((e) => e.ruleApplied);
      expect(ruleRefs).toContain("service_resolution@0.1.0:eligibility_service_rule");
      expect(ruleRefs).toContain("service_resolution@0.1.0:vesting_service_rule");
      expect(ruleRefs).toContain("service_resolution@0.1.0:benefit_service_rule");
      expect(ruleRefs).toContain("service_resolution@0.1.0:accrual_factor_rule");
    });
  });

  describe("T044 — repeated-run determinism", () => {
    it("produces identical trace content across five repeated runs", async () => {
      resetDeterminismForTests();
      const SQL = await initSqlJs();
      const { db } = createSqlJsContextFromStatic(SQL);
      applyMvpDatabaseFoundation(db);
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);

      const runs: Array<{ values: Record<string, number | null>; traceCount: number; fieldNames: string[] }> = [];
      for (let i = 0; i < 5; i++) {
        const inputPacketId = `packet-SR001-run${i}`;
        insertEngineInputPacket(db, {
          input_packet_id: inputPacketId,
          case_id: packet.case_id,
          subject_key: packet.subject_key,
          subject_type: packet.subject_type,
          packet_type: "service_resolution",
          schema_version: "0.1.0",
          packet_json: JSON.stringify(packet),
          built_from_resolved_at: null,
          built_by: "test",
          built_at: currentTimestamp(),
          status: "active",
        });
        const result = runServiceResolution(db, {
          case_id: packet.case_id,
          subject_type: "participant",
          subject_key: packet.subject_key,
          input_packet_id: inputPacketId,
          rule_version: "0.1.0",
          deliverable_version: "0.1.0",
        });
        expect(result.run_status).toBe("completed");
        runs.push({
          values: {
            eligibility_service_resolved: result.output?.eligibility_service_resolved ?? null,
            vesting_service_resolved: result.output?.vesting_service_resolved ?? null,
            benefit_service_resolved: result.output?.benefit_service_resolved ?? null,
            accrual_service_resolved: result.output?.accrual_service_resolved ?? null,
          },
          traceCount: result.traces.length,
          fieldNames: result.traces.map((t) => t.field_name).sort(),
        });
      }

      const first = runs[0];
      for (let i = 1; i < runs.length; i++) {
        expect(runs[i].values).toEqual(first.values);
        expect(runs[i].traceCount).toBe(first.traceCount);
        expect(runs[i].fieldNames).toEqual(first.fieldNames);
      }
    });
  });

  describe("T045 — active-at-DOPT warning trace", () => {
    it("traces warning for SR003 active-at-DOPT fixture", () => {
      resetDeterminismForTests();
      const fixtures = parseServiceResolutionFixtures();
      const sr003 = fixtures.find((f) => f.test_case_id === "SR003")!;
      const packet = buildServicePacketFromFixture(sr003);
      const values = resolveService(packet);
      const entries = buildServiceResolutionTraces(values, packet, {
        inputPacketId: "packet-SR003",
        caseId: "CASE-PLACEHOLDER",
        subjectKey: "SR003",
        ruleVersion: "0.1.0",
        moduleVersion: "0.1.0",
      });
      collectWarnings(entries, packet, "packet-SR003", "0.1.0");

      // All entries should have the warning note since SR003 has no DOTE
      for (const entry of entries) {
        expect(entry.warningNote).toBe("Participant has no DOTE; service resolved through DOPT for the MVP fixture path");
      }
    });

    it("does not produce warning for SR001 with explicit DOTE", () => {
      resetDeterminismForTests();
      const fixtures = parseServiceResolutionFixtures();
      const sr001 = fixtures.find((f) => f.test_case_id === "SR001")!;
      const packet = buildServicePacketFromFixture(sr001);
      const values = resolveService(packet);
      const entries = buildServiceResolutionTraces(values, packet, {
        inputPacketId: "packet-SR001",
        caseId: "CASE-PLACEHOLDER",
        subjectKey: "SR001",
        ruleVersion: "0.1.0",
        moduleVersion: "0.1.0",
      });
      collectWarnings(entries, packet, "packet-SR001", "0.1.0");

      for (const entry of entries) {
        expect(entry.warningNote).toBeNull();
      }
    });
  });
});

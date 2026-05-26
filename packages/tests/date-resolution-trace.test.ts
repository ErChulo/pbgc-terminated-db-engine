import { describe, expect, it } from "vitest";
import { buildPacketFromFixture, resolveDates, buildDateResolutionTraces, writeModuleTraceRows, collectWarnings } from "@pbgc/date-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";

describe("date_resolution module trace coverage", () => {
  it("produces trace rows for every populated resolved date", () => {
    resetDeterminismForTests();
    for (const fixture of parseDateResolutionFixtures()) {
      const packet = buildPacketFromFixture(fixture);
      const values = resolveDates(packet);
      const traceEntries = buildDateResolutionTraces(values, packet, {
        inputPacketId: `packet-${fixture.test_case_id}`,
        caseId: packet.case_id,
        subjectKey: packet.subject_key,
        ruleVersion: "0.1.0",
        moduleVersion: "0.1.0",
      });
      const traces = writeModuleTraceRows(`run-${fixture.test_case_id}`, packet.subject_key, traceEntries);
      expect(traces.length).toBeGreaterThan(0);

      for (const trace of traces) {
        expect(trace.module_name).toBe("date_resolution");
        expect(trace.subject_key).toBe(packet.subject_key);
        expect(trace.rule_applied).toBeTruthy();
        expect(trace.input_fields_used_json).toBeTruthy();
        expect(trace.intermediate_values_json).toBeTruthy();
      }

      const nonNullFields = Object.entries(values).filter(([, v]) => v !== null);
      for (const [field] of nonNullFields) {
        expect(traces.some((t) => t.field_name === field)).toBe(true);
      }
    }
  });

  it("produces warning notes for beneficiary null fields", () => {
    resetDeterminismForTests();
    const fixtures = parseDateResolutionFixtures();
    const beneficiaryFixture = fixtures.find((f) => f.role_type === "beneficiary");
    if (!beneficiaryFixture) throw new Error("No beneficiary fixture found");
    const packet = buildPacketFromFixture(beneficiaryFixture);
    const values = resolveDates(packet);
    const traceEntries = buildDateResolutionTraces(values, packet, {
      inputPacketId: "packet-BEN",
      caseId: packet.case_id,
      subjectKey: packet.subject_key,
      ruleVersion: "0.1.0",
      moduleVersion: "0.1.0",
    });
    const warnings = collectWarnings(traceEntries, "0.1.0");
    const beneficiaryNullWarnings = warnings.filter(
      (w) => w.code === "DATE_RESOLUTION_WARNING" && w.message.includes("Beneficiary path"),
    );
    expect(beneficiaryNullWarnings.length).toBeGreaterThan(0);
    expect(beneficiaryNullWarnings[0].field_name).toBeTruthy();
  });

  it("produces trace with rule branch metadata", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const values = resolveDates(packet);
    const traceEntries = buildDateResolutionTraces(values, packet, {
      inputPacketId: "packet-test",
      caseId: packet.case_id,
      subjectKey: packet.subject_key,
      ruleVersion: "0.1.0",
      moduleVersion: "0.1.0",
    });
    for (const entry of traceEntries) {
      expect(entry.ruleBranch).toBeTruthy();
      expect(entry.ruleBranch).toMatch(/date_resolution:(beneficiary_path|in_pay_participant_path|deferred_vested_participant_path):/);
    }
  });

  it("includes input field references in traces", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const values = resolveDates(packet);
    const traceEntries = buildDateResolutionTraces(values, packet, {
      inputPacketId: "packet-test",
      caseId: packet.case_id,
      subjectKey: packet.subject_key,
      ruleVersion: "0.1.0",
      moduleVersion: "0.1.0",
    });
    const traces = writeModuleTraceRows("run-test", packet.subject_key, traceEntries);
    for (const trace of traces) {
      const inputs = JSON.parse(trace.input_fields_used_json) as Array<Record<string, unknown>>;
      expect(inputs.length).toBeGreaterThan(0);
      for (const input of inputs) {
        expect(input).toHaveProperty("group");
        expect(input).toHaveProperty("field");
      }
    }
  });

  it("produces trace rows for traceable null fields (eurd, eprd, sxra)", () => {
    resetDeterminismForTests();
    const fixture = parseDateResolutionFixtures()[0];
    const packet = buildPacketFromFixture(fixture);
    const values = resolveDates(packet);
    const traceEntries = buildDateResolutionTraces(values, packet, {
      inputPacketId: "packet-test",
      caseId: packet.case_id,
      subjectKey: packet.subject_key,
      ruleVersion: "0.1.0",
      moduleVersion: "0.1.0",
    });
    const traces = writeModuleTraceRows("run-test", packet.subject_key, traceEntries);
    // eurd IS a traceable null field for participant paths — it produces a trace row
    const eurdTrace = traces.filter((t) => t.field_name === "eurd");
    expect(eurdTrace.length).toBeGreaterThan(0);
    expect(eurdTrace[0].output_value).toBeNull();
    expect(eurdTrace[0].warning_note).toBe("EURD is not resolved in the current rule version");
  });
});

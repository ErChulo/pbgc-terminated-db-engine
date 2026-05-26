import { describe, expect, it } from "vitest";
import { buildFormPacketFromFixture, buildFormTraces, collectWarnings, toModuleTraces, resolveForms } from "@pbgc/form-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";

describe("form_resolution trace (US3)", () => {
  it("produces trace entries for all populated form output fields (T049)", () => {
    resetDeterminismForTests();
    const fixture = parseFormResolutionFixtures()[0]; // FR001 - deferred vested
    const packet = buildFormPacketFromFixture(fixture);
    const { values, warnings } = resolveForms(packet, "packet-FR001", "0.1.0");
    const entries = buildFormTraces("run-001", "FR001", values, packet);
    collectWarnings(entries, packet);
    const traces = toModuleTraces(entries, "run-001", "FR001", warnings);

    expect(traces.length).toBeGreaterThanOrEqual(5);
    const fieldNames = traces.map((t) => t.field_name).sort();
    expect(fieldNames).toContain("rettyp");
    expect(fieldNames).toContain("form_code_nsf");
    expect(fieldNames).toContain("form_code_nmf");
    expect(fieldNames).toContain("form_code_death");
    expect(fieldNames).toContain("lsoption");

    for (const trace of traces) {
      expect(trace.module_name).toBe("form_resolution");
      expect(trace.rule_applied).toContain("form_resolution@0.1.0:");
      expect(trace.input_fields_used_json).toBeTruthy();
      expect(trace.intermediate_values_json).toBeTruthy();
      const iv = JSON.parse(trace.intermediate_values_json);
      expect(iv.module_version).toBe("0.1.0");
    }
  });

  it("produces identical trace decisions across five repeated runs (T050)", () => {
    resetDeterminismForTests();
    const fixture = parseFormResolutionFixtures()[0];
    const packet = buildFormPacketFromFixture(fixture);
    const runs: string[] = [];

    for (let i = 0; i < 5; i++) {
      resetDeterminismForTests();
      const { values, warnings } = resolveForms(packet, "packet-FR001", "0.1.0");
      const entries = buildFormTraces("run-repeat", "FR001", values, packet);
      collectWarnings(entries, packet);
      const traces = toModuleTraces(entries, "run-repeat", "FR001", warnings);
      const snapshot = JSON.stringify(
        traces.map((t) => ({
          field: t.field_name,
          value: t.output_value,
          rule: t.rule_applied,
          iv: t.intermediate_values_json,
        })),
      );
      runs.push(snapshot);
    }

    for (let i = 1; i < runs.length; i++) {
      expect(runs[i]).toBe(runs[0]);
    }
  });

  it("includes warning branch indicators for in-pay and QDRO branches (T051)", () => {
    resetDeterminismForTests();
    const fixtures = parseFormResolutionFixtures();

    // FR002 - in_pay
    const inPayPacket = buildFormPacketFromFixture(fixtures[1]);
    const { values: inPayValues, warnings: inPayWarnings } = resolveForms(inPayPacket, "packet-FR002", "0.1.0");
    const inPayEntries = buildFormTraces("run-inpay", "FR002", inPayValues, inPayPacket);
    collectWarnings(inPayEntries, inPayPacket);
    const inPayTraces = toModuleTraces(inPayEntries, "run-inpay", "FR002", inPayWarnings);

    expect(inPayWarnings.map((w) => w.code)).toContain("IN_PAY_FORM_REVIEWED");
    for (const trace of inPayTraces) {
      const iv = JSON.parse(trace.intermediate_values_json);
      expect(iv.in_pay_applied).toBe(true);
      expect(iv.in_pay_branch).toBe(true);
    }

    // FR003 - QDRO
    const qdroPacket = buildFormPacketFromFixture(fixtures[2]);
    const { values: qdroValues, warnings: qdroWarnings } = resolveForms(qdroPacket, "packet-FR003", "0.1.0");
    const qdroEntries = buildFormTraces("run-qdro", "FR003", qdroValues, qdroPacket);
    collectWarnings(qdroEntries, qdroPacket);
    const qdroTraces = toModuleTraces(qdroEntries, "run-qdro", "FR003", qdroWarnings);

    expect(qdroWarnings.map((w) => w.code)).toContain("QDRO_FORM_REVIEWED");
    for (const trace of qdroTraces) {
      const iv = JSON.parse(trace.intermediate_values_json);
      expect(iv.qdro_applied).toBe(true);
      expect(iv.qdro_branch).toBe(true);
    }
  });

  it("produces no trace entries for null output values", () => {
    resetDeterminismForTests();
    const fixtures = parseFormResolutionFixtures();
    // FR003 QDRO - rettyp is null
    const packet = buildFormPacketFromFixture(fixtures[2]);
    const { values, warnings } = resolveForms(packet, "packet-FR003", "0.1.0");
    const entries = buildFormTraces("run-nulls", "FR003", values, packet);
    collectWarnings(entries, packet);
    const traces = toModuleTraces(entries, "run-nulls", "FR003", warnings);
    const fieldNames = traces.map((t) => t.field_name);
    expect(fieldNames).not.toContain("rettyp");
  });
});

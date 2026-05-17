import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
  listResolvedFormsOutputs,
} from "@pbgc/db";
import { buildFormPacketFromFixture, runFormResolution } from "@pbgc/form-resolution";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";

describe("form_resolution sql.js persistence", () => {
  it("persists engine_run, resolved form output, and trace without downstream outputs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseFormResolutionFixtures()[0];
    const packet = buildFormPacketFromFixture(fixture);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-FR001",
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "form_resolution",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const result = runFormResolution(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-FR001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(result.run_status).toBe("completed");
    expect(result.warning_count).toBe(0);
    expect(result.error_count).toBe(0);

    const outputs = listResolvedFormsOutputs(db);
    expect(outputs).toHaveLength(1);
    expect(outputs[0]).toMatchObject({
      resolved_forms_output_id: result.resolved_forms_output_id,
      rettyp: "deferred_vested",
      form_code_nsf: "1",
      form_code_nmf: "2",
      form_code_death: "QPSA",
      lsoption: "N",
    });

    const traces = listModuleTraces(db, result.calculation_run_id, "form_resolution");
    expect(traces.map((trace) => trace.field_name).sort()).toEqual([
      "form_code_death",
      "form_code_nmf",
      "form_code_nsf",
      "lsoption",
      "rettyp",
    ]);
    expect(result.output).not.toHaveProperty("monthly_benefit");
  });
});

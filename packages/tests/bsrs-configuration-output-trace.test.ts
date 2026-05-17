import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
} from "@pbgc/db";
import { buildBsrsConfigurationPacketFromFixture, runBsrsConfiguration } from "@pbgc/bsrs-configuration-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("bsrs_configuration_output traceability", () => {
  it("produces trace rows for populated outputs and repeated runs", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBsrsConfigurationFixtures()[1];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    const inputPacketId = "packet-BSRS002";

    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "bsrs_configuration_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "test",
      built_at: currentTimestamp(),
      status: "active",
    });

    const first = runBsrsConfiguration(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });
    const second = runBsrsConfiguration(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    expect(first.run_status).toBe("completed");
    expect(second.run_status).toBe("completed");
    expect(listModuleTraces(db, first.calculation_run_id, "bsrs_configuration_output").length).toBeGreaterThan(0);
    expect(listModuleTraces(db, second.calculation_run_id, "bsrs_configuration_output").length).toBeGreaterThan(0);

    const populatedTrace = listModuleTraces(db, first.calculation_run_id, "bsrs_configuration_output").find((trace) => trace.field_name === "statement_population_indicator");
    expect(populatedTrace?.intermediate_values_json).toContain('"dd_field_name":"statement_population_indicator"');
    const ddTrace = listModuleTraces(db, first.calculation_run_id, "bsrs_configuration_output").find((trace) => trace.field_name === "bcv_rec_id");
    expect(ddTrace?.intermediate_values_json).toContain('"dd_field_name":"BCV_REC_ID"');
  });
});

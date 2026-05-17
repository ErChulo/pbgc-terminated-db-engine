import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  BSRS_CONFIGURATION_OUTPUT_FIELDS,
  canonicalDdFieldName,
  hasDdMapping,
  buildBsrsConfigurationPacketFromFixture,
  runBsrsConfiguration,
} from "@pbgc/bsrs-configuration-output";
import initSqlJs from "sql.js";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listModuleTraces,
} from "@pbgc/db";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("bsrs_configuration_output DD mapping", () => {
  it("keeps DD-backed BSRS fields covered by DD.csv canonical names", () => {
    const ddCsv = readFileSync(resolve(process.cwd(), "artifacts/mappings/DD.csv"), "utf8");
    const ddFields = new Set(
      ddCsv
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.split(",")[0]?.replace(/^"/, "").replace(/"$/, "").trim())
        .filter((field): field is string => Boolean(field)),
    );

    for (const field of BSRS_CONFIGURATION_OUTPUT_FIELDS) {
      if (!hasDdMapping(field)) continue;
      expect(ddFields.has(canonicalDdFieldName(field))).toBe(true);
    }
  });

  it("falls back to the approved BSRS contract field name when DD.csv has no mapping", async () => {
    expect(hasDdMapping("statement_population_indicator")).toBe(false);
    expect(canonicalDdFieldName("statement_population_indicator")).toBe("statement_population_indicator");

    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const packet = buildBsrsConfigurationPacketFromFixture(parseBsrsConfigurationFixtures()[0]);
    insertEngineInputPacket(db, {
      input_packet_id: "packet-BSRS001",
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

    const result = runBsrsConfiguration(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: "packet-BSRS001",
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });

    const trace = listModuleTraces(db, result.calculation_run_id, "bsrs_configuration_output").find((item) => item.field_name === "statement_population_indicator");
    expect(trace?.intermediate_values_json).toContain('"dd_field_name":"statement_population_indicator"');
  });
});

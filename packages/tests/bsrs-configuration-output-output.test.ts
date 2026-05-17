import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listResolvedBsrsConfigurationOutputs,
} from "@pbgc/db";
import {
  BSRS_CONFIGURATION_OUTPUT_FIELDS,
  buildBsrsConfigurationPacketFromFixture,
  canonicalDdFieldName,
  hasDdMapping,
  runBsrsConfiguration,
} from "@pbgc/bsrs-configuration-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("bsrs_configuration_output deterministic outputs", () => {
  it("keeps emitted DD-backed BSRS fields covered by DD.csv canonical names", () => {
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

  it("matches committed expected outputs for the reviewed participant and survivor paths", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
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

    expect(result.run_status).toBe("completed");
    expect(result.output?.row.statement_population_indicator).toBe("Y");
    expect(result.output?.row.bsrs_configuration_output_warning_flag).toBe(false);
    expect(result.warning_count).toBe(0);

    const outputs = listResolvedBsrsConfigurationOutputs(db);
    expect(outputs).toHaveLength(1);
    expect(JSON.parse(outputs[0].row_json)).toMatchObject({
      statement_population_indicator: "Y",
      statement_sort_key: packet.statement_sort_key,
    });
  });
});

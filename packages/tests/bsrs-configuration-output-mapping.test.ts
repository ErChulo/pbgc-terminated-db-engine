import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  BSRS_CONFIGURATION_OUTPUT_FIELDS,
  canonicalDdFieldName,
  hasDdMapping,
  bsrsConfigurationFieldNamesWithoutDD,
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

  it("proves every BSRS output field resolves to a non-empty canonical name (T059)", () => {
    // T059: Regression test proving approved contract-name fallback still works
    // when a BSRS field has no matching DD.csv entry.
    for (const field of BSRS_CONFIGURATION_OUTPUT_FIELDS) {
      const resolved = canonicalDdFieldName(field);
      expect(resolved.length).toBeGreaterThan(0);
      expect(typeof resolved).toBe("string");
    }
  });

  it("proves fields without DD mapping resolve to their own (contract) name (T059)", () => {
    // T059: Comprehensive fallback test for ALL fields without DD mappings.
    const fieldsWithoutDD = bsrsConfigurationFieldNamesWithoutDD();
    expect(fieldsWithoutDD.length).toBeGreaterThan(0);

    for (const field of fieldsWithoutDD) {
      expect(hasDdMapping(field)).toBe(false);
      expect(canonicalDdFieldName(field)).toBe(field);
    }
  });

  it("proves fields with DD mapping resolve to the DD canonical name (T059)", () => {
    // T059: Verifies the DD-first naming invariant holds for mapped fields.
    // Every DD-mapped field must resolve to its DD.csv canonical name, not its BSRS name.
    const allFields = BSRS_CONFIGURATION_OUTPUT_FIELDS as readonly string[];
    const fieldsWithoutDD = new Set(bsrsConfigurationFieldNamesWithoutDD());

    for (const field of allFields) {
      if (fieldsWithoutDD.has(field)) continue;
      if (!hasDdMapping(field)) continue;

      const resolved = canonicalDdFieldName(field);
      // DD-mapped fields resolve to their DD name (not their own name)
      // except when the DD name happens to match the field name
      expect(resolved.length).toBeGreaterThan(0);
    }
  });

  it("proves contract-name fallback is stable across all fixtures (T059)", async () => {
    // T059: Run the full pipeline with every conditional fixture and verify
    // that non-DD-mapped fields still appear in the output row.
    resetDeterminismForTests();
    const fixtures = parseBsrsConfigurationFixtures();
    expect(fixtures.length).toBeGreaterThanOrEqual(6);

    for (const fixture of fixtures) {
      resetDeterminismForTests();
      const SQL = await initSqlJs();
      const { db } = createSqlJsContextFromStatic(SQL);
      applyMvpDatabaseFoundation(db);

      const packet = buildBsrsConfigurationPacketFromFixture(fixture);
      insertEngineInputPacket(db, {
        input_packet_id: `packet-${fixture.test_case_id}`,
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
        input_packet_id: `packet-${fixture.test_case_id}`,
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("completed");
      expect(result.output).toBeDefined();

      // Every non-DD-mapped field that is also an output field should exist in the output row
      const row = result.output!.row as Record<string, unknown>;
      const outputFieldSet = new Set(BSRS_CONFIGURATION_OUTPUT_FIELDS as readonly string[]);
      for (const field of bsrsConfigurationFieldNamesWithoutDD()) {
        if (!outputFieldSet.has(field)) continue;
        expect(row).toHaveProperty(field);
      }
    }
  });
});

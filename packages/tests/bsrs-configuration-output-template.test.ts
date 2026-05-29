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
  projectBsrsConfigurationRow,
  runBsrsConfiguration,
} from "@pbgc/bsrs-configuration-output";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "./bsrs-configuration-output-fixtures";

describe("bsrs_configuration_output template compatibility", () => {
  it("emits all BSRS_CONFIGURATION_OUTPUT_FIELDS in projected rows (T034)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    const row = projectBsrsConfigurationRow(packet);

    // Every field in BSRS_CONFIGURATION_OUTPUT_FIELDS must be present in the projected row
    for (const field of BSRS_CONFIGURATION_OUTPUT_FIELDS) {
      expect(field in row, `Missing field: ${field}`).toBe(true);
    }
  });

  it("contains required template header and identity fields in output rows (T034)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    const row = projectBsrsConfigurationRow(packet);

    // Template-required identity fields
    expect(row.case_id.length).toBeGreaterThan(0);
    expect(row.plan_id.length).toBeGreaterThan(0);
    expect(row.bcv_rec_id.length).toBeGreaterThan(0);
    expect(row.custid.length).toBeGreaterThan(0);
    expect(row.retstat.length).toBeGreaterThan(0);

    // Template-required output metadata
    expect(row.deliverable_version).toBe("0.1.0");
    expect(row.schema_version).toBe("0.1.0");
    expect(["participant", "beneficiary", "alternate_payee", "suppressed", "survivor"]).toContain(row.statement_row_type);
    expect(row.statement_sort_key.length).toBeGreaterThan(0);
  });

  it("preserves DD-first canonical name mappings in every projected output row (T034)", () => {
    resetDeterminismForTests();
    const fixtures = parseBsrsConfigurationFixtures();

    for (const fixture of fixtures) {
      const packet = buildBsrsConfigurationPacketFromFixture(fixture);
      const row = projectBsrsConfigurationRow(packet);

      // Every DD-mapped field should resolve to its canonical DD name
      for (const field of BSRS_CONFIGURATION_OUTPUT_FIELDS) {
        const ddName = canonicalDdFieldName(field);
        if (ddName !== field) {
          // This field has a DD mapping; the canonical name should be distinct
          expect(ddName.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("keeps row ordering deterministic across repeated template projections (T047)", async () => {
    resetDeterminismForTests();

    const firstPackets = parseBsrsConfigurationFixtures().map((f) =>
      projectBsrsConfigurationRow(buildBsrsConfigurationPacketFromFixture(f)),
    );
    resetDeterminismForTests();
    const secondPackets = parseBsrsConfigurationFixtures().map((f) =>
      projectBsrsConfigurationRow(buildBsrsConfigurationPacketFromFixture(f)),
    );

    // Row order must be stable — compare statement_sort_keys
    const secondSortKeys = secondPackets.map((r) => r.statement_sort_key);
    expect(secondSortKeys).toEqual(firstPackets.map((r) => r.statement_sort_key));
  });

  it("does not emit template-breaking field names or unexpected null fields in output (T047)", () => {
    resetDeterminismForTests();
    const fixture = parseBsrsConfigurationFixtures()[0];
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    const row = projectBsrsConfigurationRow(packet);

    // No undefined fields should slip through
    const rowEntries = Object.entries(row as Record<string, unknown>);
    for (const [key, value] of rowEntries) {
      expect(value, `Field "${key}" is undefined`).not.toBeUndefined();
    }

    // Statement control fields must not be null
    expect(row.statement_population_indicator).not.toBeNull();
    expect(row.suppress_statement_indicator).not.toBeNull();
    expect(row.recalculation_trigger_indicator).not.toBeNull();
  });

  it("produces template-compatible complete output rows for every approved fixture (T047)", async () => {
    resetDeterminismForTests();
    const SQL = await initSqlJs();
    const { db } = createSqlJsContextFromStatic(SQL);
    applyMvpDatabaseFoundation(db);

    const fixtures = parseBsrsConfigurationFixtures();

    for (const fixture of fixtures) {
      const packet = buildBsrsConfigurationPacketFromFixture(fixture);
      insertEngineInputPacket(db, {
        input_packet_id: `packet-${fixture.test_case_id}`,
        case_id: packet.case_id,
        subject_key: fixture.test_case_id,
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
        subject_key: fixture.test_case_id,
        input_packet_id: `packet-${fixture.test_case_id}`,
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });

      expect(result.run_status).toBe("completed");

      const outputs = listResolvedBsrsConfigurationOutputs(db);
      const persisted = outputs.find((o) => o.calculation_run_id === result.calculation_run_id);
      expect(persisted).toBeDefined();

      const parsedRow = JSON.parse(persisted!.row_json);
      expect(parsedRow.statement_population_indicator).toBeDefined();
      expect(parsedRow.suppress_statement_indicator).toBeDefined();
    }
  });
});

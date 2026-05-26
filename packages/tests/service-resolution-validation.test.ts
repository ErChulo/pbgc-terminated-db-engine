import initSqlJs from "sql.js";
import { describe, expect, it } from "vitest";
import {
  applyMvpDatabaseFoundation,
  createSqlJsContextFromStatic,
  insertEngineInputPacket,
  listResolvedServiceOutputs,
} from "@pbgc/db";
import {
  buildServicePacketFromFixture,
  runServiceResolution,
  validateServiceResolutionPacket,
  type ServiceResolutionPacket,
} from "@pbgc/service-resolution";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";

describe("service_resolution US2 — reject invalid packets", () => {
  describe("T034 — missing required groups", () => {
    it("rejects a packet with a null required group", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (packet as any).service_employment_history = null;
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "BLANK_FIELD_VALUE" && e.input_group === "service_employment_history")).toBe(true);
    });

    it("rejects a packet with multiple missing groups", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (packet as any).service_employment_history = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (packet as any).resolved_plan_logic = null;
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      const groups = errors.filter((e) => e.input_group !== undefined).map((e) => e.input_group);
      expect(groups).toContain("service_employment_history");
      expect(groups).toContain("resolved_plan_logic");
    });

    it("rejects a packet with a non-object group value", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (packet as any).service_employment_history = "not_an_object";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("T035 — blank strings instead of explicit nulls", () => {
    it("rejects blank string for required date field", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      packet.case_plan_timeline.dopt = "  ";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "BLANK_FIELD_VALUE" && e.field_name === "dopt")).toBe(true);
    });

    it("rejects blank string for required string field", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      packet.service_employment_history.service_basis_code = "";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "BLANK_FIELD_VALUE" && e.field_name === "service_basis_code")).toBe(true);
    });

    it("rejects blank string in participant role population field", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      packet.participant_role_population.retstat = "";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "BLANK_FIELD_VALUE" && e.field_name === "retstat")).toBe(true);
    });
  });

  describe("T036 — malformed dates and invalid date ordering", () => {
    it("rejects a malformed date with impossible month", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      packet.service_employment_history.doh = "1985-13-01";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "MALFORMED_DATE_VALUE" && e.field_name === "doh")).toBe(true);
    });

    it("rejects a malformed date with wrong format", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      packet.service_employment_history.dop = "1986/01/01";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "MALFORMED_DATE_VALUE" && e.field_name === "dop")).toBe(true);
    });

    it("rejects a date string that is not a real date", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      packet.service_employment_history.dote = "2010-02-30";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "MALFORMED_DATE_VALUE" && e.field_name === "dote")).toBe(true);
    });

    it("rejects DOH after DOP date ordering", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      packet.service_employment_history.doh = "2000-01-01";
      packet.service_employment_history.dop = "1990-01-01";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "INVALID_DATE_ORDERING")).toBe(true);
    });

    it("rejects DOP after DOTE date ordering", () => {
      resetDeterminismForTests();
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      packet.service_employment_history.dop = "2020-01-01";
      packet.service_employment_history.dote = "2010-12-31";
      const errors = validateServiceResolutionPacket(packet, "packet-test", "0.1.0");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.code === "INVALID_DATE_ORDERING")).toBe(true);
    });
  });

  describe("T037 — failed-run no-output persistence", () => {
    it("does not create service output rows for a failed validation run", async () => {
      resetDeterminismForTests();
      const SQL = await initSqlJs();
      const { db } = createSqlJsContextFromStatic(SQL);
      applyMvpDatabaseFoundation(db);
      const fixture = parseServiceResolutionFixtures()[0];
      const packet = buildServicePacketFromFixture(fixture);
      // Corrupt the packet to trigger validation failure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (packet as any).service_employment_history = null;
      insertEngineInputPacket(db, {
        input_packet_id: "packet-fail",
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
        input_packet_id: "packet-fail",
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      });
      expect(result.run_status).toBe("failed");
      expect(result.error_count).toBeGreaterThan(0);
      const outputs = listResolvedServiceOutputs(db);
      expect(outputs).toHaveLength(0);
    });
  });
});

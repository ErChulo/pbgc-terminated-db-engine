import { applyMvpDatabaseFoundation, createSqlJsContext, insertEngineInputPacket } from "@pbgc/db";
import { buildServicePacketFromFixture, runServiceResolution, type RunServiceResolutionResult } from "@pbgc/service-resolution";
import { currentTimestamp } from "@pbgc/shared";
import { parseServiceResolutionFixtures } from "../../../../packages/tests/service-resolution-fixtures";

export type ServiceResolutionAppState = {
  results: RunServiceResolutionResult[];
};

export async function runFixtureServiceResolution(): Promise<ServiceResolutionAppState> {
  const { db } = await createSqlJsContext();
  applyMvpDatabaseFoundation(db);
  const results: RunServiceResolutionResult[] = [];
  for (const fixture of parseServiceResolutionFixtures()) {
    const packet = buildServicePacketFromFixture(fixture);
    const inputPacketId = `packet-${fixture.test_case_id}`;
    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "service_resolution",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "browser-fixture",
      built_at: currentTimestamp(),
      status: "active",
    });
    const result = runServiceResolution(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    });
    results.push(result);
  }
  return { results };
}

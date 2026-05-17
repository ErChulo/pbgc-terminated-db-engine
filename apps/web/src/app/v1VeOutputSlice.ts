import { applyMvpDatabaseFoundation, createSqlJsContext, insertEngineInputPacket } from "@pbgc/db";
import { buildV1VePacketFromFixture, runV1VeOutput, type V1VeOutputResult } from "@pbgc/v1-ve-output";
import { currentTimestamp } from "@pbgc/shared";
import { parseV1VeOutputFixtures } from "../../../../packages/tests/v1-ve-output-fixtures";

export type V1VeOutputAppState = {
  results: V1VeOutputResult[];
};

export async function runFixtureV1VeOutputResolution(): Promise<V1VeOutputAppState> {
  const { db } = await createSqlJsContext();
  applyMvpDatabaseFoundation(db);
  const results: V1VeOutputResult[] = [];
  for (const fixture of parseV1VeOutputFixtures()) {
    const packet = buildV1VePacketFromFixture(fixture);
    const inputPacketId = `packet-${fixture.test_case_id}`;
    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "v1_ve_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "browser-fixture",
      built_at: currentTimestamp(),
      status: "active",
    });
    results.push(runV1VeOutput(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    }));
  }
  return { results };
}

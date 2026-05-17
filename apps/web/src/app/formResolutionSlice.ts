import { applyMvpDatabaseFoundation, createSqlJsContext, insertEngineInputPacket, listResolvedFormsOutputs } from "@pbgc/db";
import { buildFormPacketFromFixture, runFormResolution, type RunFormResolutionResult } from "@pbgc/form-resolution";
import { currentTimestamp } from "@pbgc/shared";
import { parseFormResolutionFixtures } from "../../../../packages/tests/form-resolution-fixtures";

export type FormResolutionAppState = {
  results: RunFormResolutionResult[];
};

export async function runFixtureFormResolution(): Promise<FormResolutionAppState> {
  const { db } = await createSqlJsContext();
  applyMvpDatabaseFoundation(db);
  const results: RunFormResolutionResult[] = [];
  for (const fixture of parseFormResolutionFixtures()) {
    const packet = buildFormPacketFromFixture(fixture);
    const inputPacketId = `packet-${fixture.test_case_id}`;
    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "form_resolution",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "browser-fixture",
      built_at: currentTimestamp(),
      status: "active",
    });
    results.push(runFormResolution(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    }));
  }
  listResolvedFormsOutputs(db);
  return { results };
}

import { applyMvpDatabaseFoundation, createSqlJsContext, insertEngineInputPacket, listResolvedDatesOutputs } from "@pbgc/db";
import { buildPacketFromFixture, runDateResolution, type RunDateResolutionResult } from "@pbgc/date-resolution";
import { currentTimestamp } from "@pbgc/shared";
import { parseDateResolutionFixtures } from "../../../../packages/tests/date-resolution-fixtures";

export type DateResolutionAppState = {
  results: RunDateResolutionResult[];
};

export async function runFixtureDateResolution(): Promise<DateResolutionAppState> {
  const { db } = await createSqlJsContext();
  applyMvpDatabaseFoundation(db);
  const results: RunDateResolutionResult[] = [];
  for (const fixture of parseDateResolutionFixtures()) {
    const packet = buildPacketFromFixture(fixture);
    const inputPacketId = `packet-${fixture.test_case_id}`;
    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "date_resolution",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "browser-fixture",
      built_at: currentTimestamp(),
      status: "active",
    });
    results.push(runDateResolution(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    }));
  }
  listResolvedDatesOutputs(db);
  return { results };
}

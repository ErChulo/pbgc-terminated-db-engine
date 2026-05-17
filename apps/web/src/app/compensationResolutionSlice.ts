import { applyMvpDatabaseFoundation, createSqlJsContext, insertEngineInputPacket, listResolvedCompensationOutputs } from "@pbgc/db";
import {
  buildCompensationPacketFromFixture,
  runCompensationResolution,
  type RunCompensationResolutionResult,
} from "@pbgc/compensation-resolution";
import { currentTimestamp } from "@pbgc/shared";
import { parseCompensationResolutionFixtures } from "../../../../packages/tests/compensation-resolution-fixtures";

export type CompensationResolutionAppState = {
  results: RunCompensationResolutionResult[];
};

export async function runFixtureCompensationResolution(): Promise<CompensationResolutionAppState> {
  const { db } = await createSqlJsContext();
  applyMvpDatabaseFoundation(db);
  const results: RunCompensationResolutionResult[] = [];
  for (const fixture of parseCompensationResolutionFixtures()) {
    const packet = buildCompensationPacketFromFixture(fixture);
    const inputPacketId = `packet-${fixture.test_case_id}`;
    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "compensation_resolution",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "browser-fixture",
      built_at: currentTimestamp(),
      status: "active",
    });
    results.push(runCompensationResolution(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    }));
  }
  listResolvedCompensationOutputs(db);
  return { results };
}

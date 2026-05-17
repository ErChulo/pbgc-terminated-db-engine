import { applyMvpDatabaseFoundation, createSqlJsContext, insertEngineInputPacket } from "@pbgc/db";
import { buildBsrsConfigurationPacketFromFixture, runBsrsConfiguration, type BsrsConfigurationOutputResult } from "@pbgc/bsrs-configuration-output";
import { currentTimestamp } from "@pbgc/shared";
import { parseBsrsConfigurationFixtures } from "../../../../packages/tests/bsrs-configuration-output-fixtures";

export type BsrsConfigurationOutputAppState = {
  results: BsrsConfigurationOutputResult[];
};

export async function runFixtureBsrsConfigurationOutputResolution(): Promise<BsrsConfigurationOutputAppState> {
  const { db } = await createSqlJsContext();
  applyMvpDatabaseFoundation(db);
  const results: BsrsConfigurationOutputResult[] = [];
  for (const fixture of parseBsrsConfigurationFixtures()) {
    const packet = buildBsrsConfigurationPacketFromFixture(fixture);
    const inputPacketId = `packet-${fixture.test_case_id}`;
    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "bsrs_configuration_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "browser-fixture",
      built_at: currentTimestamp(),
      status: "active",
    });
    results.push(
      runBsrsConfiguration(db, {
        case_id: packet.case_id,
        subject_type: packet.subject_type,
        subject_key: packet.subject_key,
        input_packet_id: inputPacketId,
        rule_version: "0.1.0",
        deliverable_version: "0.1.0",
      }),
    );
  }
  return { results };
}

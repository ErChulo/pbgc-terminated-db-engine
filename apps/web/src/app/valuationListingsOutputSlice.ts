import { applyMvpDatabaseFoundation, createSqlJsContext, insertEngineInputPacket } from "@pbgc/db";
import { buildValuationListingsPacketFromFixture, runValuationListingsOutput, type ValuationListingsOutputResult } from "@pbgc/valuation-listings-output";
import { currentTimestamp } from "@pbgc/shared";
import { parseValuationListingsFixtures } from "../../../../packages/tests/valuation-listings-output-fixtures";

export type ValuationListingsOutputAppState = {
  results: ValuationListingsOutputResult[];
};

export async function runFixtureValuationListingsOutputResolution(): Promise<ValuationListingsOutputAppState> {
  const { db } = await createSqlJsContext();
  applyMvpDatabaseFoundation(db);
  const results: ValuationListingsOutputResult[] = [];
  for (const fixture of parseValuationListingsFixtures()) {
    const packet = buildValuationListingsPacketFromFixture(fixture);
    const inputPacketId = `packet-${fixture.test_case_id}`;
    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "valuation_listings_output",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "browser-fixture",
      built_at: currentTimestamp(),
      status: "active",
    });
    results.push(
      runValuationListingsOutput(db, {
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

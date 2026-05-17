import { applyMvpDatabaseFoundation, createSqlJsContext, insertEngineInputPacket, listResolvedBenefitKernelOutputs } from "@pbgc/db";
import { buildBenefitPacketFromFixture, runBenefitKernel, type RunBenefitKernelResult } from "@pbgc/benefit-kernel";
import { currentTimestamp } from "@pbgc/shared";
import { parseBenefitKernelFixtures } from "../../../../packages/tests/benefit-kernel-fixtures";

export type BenefitKernelAppState = {
  results: RunBenefitKernelResult[];
};

export async function runFixtureBenefitKernelResolution(): Promise<BenefitKernelAppState> {
  const { db } = await createSqlJsContext();
  applyMvpDatabaseFoundation(db);
  const results: RunBenefitKernelResult[] = [];
  for (const fixture of parseBenefitKernelFixtures()) {
    const packet = buildBenefitPacketFromFixture(fixture);
    const inputPacketId = `packet-${fixture.test_case_id}`;
    insertEngineInputPacket(db, {
      input_packet_id: inputPacketId,
      case_id: packet.case_id,
      subject_key: packet.subject_key,
      subject_type: packet.subject_type,
      packet_type: "benefit_kernel",
      schema_version: "0.1.0",
      packet_json: JSON.stringify(packet),
      built_from_resolved_at: null,
      built_by: "browser-fixture",
      built_at: currentTimestamp(),
      status: "active",
    });
    results.push(runBenefitKernel(db, {
      case_id: packet.case_id,
      subject_type: packet.subject_type,
      subject_key: packet.subject_key,
      input_packet_id: inputPacketId,
      rule_version: "0.1.0",
      deliverable_version: "0.1.0",
    }));
  }
  listResolvedBenefitKernelOutputs(db);
  return { results };
}

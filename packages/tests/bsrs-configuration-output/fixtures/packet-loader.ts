/**
 * BSRS fixture packet loader.
 * Provides helpers to load and validate fixture packets for tests.
 */
import {
  buildBsrsConfigurationPacketFromFixture,
  type BsrsConfigurationFixture,
  type BsrsConfigurationOutputPacket,
} from "@pbgc/bsrs-configuration-output";
import { parseBsrsConfigurationFixtures } from "../../bsrs-configuration-output-fixtures";

export function loadBsrsFixturePackets(): BsrsConfigurationOutputPacket[] {
  const fixtures: BsrsConfigurationFixture[] = parseBsrsConfigurationFixtures();
  return fixtures.map((fixture) => buildBsrsConfigurationPacketFromFixture(fixture));
}

export function loadBsrsFixtureByName(testCaseId: string): { fixture: BsrsConfigurationFixture; packet: BsrsConfigurationOutputPacket } | null {
  const fixtures: BsrsConfigurationFixture[] = parseBsrsConfigurationFixtures();
  const fixture = fixtures.find((f: BsrsConfigurationFixture) => f.test_case_id === testCaseId);
  if (!fixture) return null;
  return { fixture, packet: buildBsrsConfigurationPacketFromFixture(fixture) };
}

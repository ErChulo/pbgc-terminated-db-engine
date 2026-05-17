import initSqlJs from "sql.js";
import type { Database } from "sql.js";
import { expect } from "vitest";
import { applyMvpDatabaseFoundation, createSqlJsContextFromStatic, insertEngineInputPacket } from "@pbgc/db";
import { currentTimestamp, resetDeterminismForTests } from "@pbgc/shared";

export type ReviewedInputPacket = {
  packet_type: string;
  schema_version: string;
  case_id: string;
  subject_type: string;
  subject_key: string;
  [key: string]: unknown;
};

export async function createHardeningDatabase(): Promise<Database> {
  resetDeterminismForTests();
  const SQL = await initSqlJs();
  const { db } = createSqlJsContextFromStatic(SQL);
  applyMvpDatabaseFoundation(db);
  return db;
}

export function closeHardeningDatabase(db: Database): void {
  (db as unknown as { close: () => void }).close();
}

export function seedReviewedInputPacket(
  db: Database,
  packet: ReviewedInputPacket,
  inputPacketId: string,
  status: "active" | "rejected" = "active",
): void {
  insertEngineInputPacket(db, {
    input_packet_id: inputPacketId,
    case_id: packet.case_id,
    subject_key: packet.subject_key,
    subject_type: packet.subject_type,
    packet_type: packet.packet_type as never,
    schema_version: packet.schema_version,
    packet_json: JSON.stringify(packet),
    built_from_resolved_at: null,
    built_by: "hardening-test",
    built_at: currentTimestamp(),
    status,
  });
}

export async function compareRepeatedRuns<T>(runner: () => T | Promise<T>): Promise<[T, T]> {
  const first = await runner();
  const second = await runner();
  return [first, second];
}

export function expectExactKeys(value: Record<string, unknown>, expectedKeys: readonly string[]): void {
  expect([...new Set(Object.keys(value))].sort()).toEqual([...new Set(expectedKeys)].sort());
}

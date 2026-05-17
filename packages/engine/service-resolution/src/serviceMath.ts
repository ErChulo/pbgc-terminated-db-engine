import type { ServiceResolutionPacket } from "./types";

export function resolvePlanYearService(packet: ServiceResolutionPacket): number {
  const participationDate = requireDate(packet.service_employment_history.dop, "dop");
  const serviceEndDate = selectServiceEndDate(packet);
  const startYear = participationDate.getUTCFullYear();
  const endYear = serviceEndDate.getUTCFullYear();
  return Math.max(0, endYear - startYear + 1);
}

function selectServiceEndDate(packet: ServiceResolutionPacket): Date {
  const historyEnd = packet.service_employment_history.dote ?? packet.case_plan_timeline.dopt;
  const freezeDate = packet.case_plan_timeline.dobf;
  const candidates = [historyEnd, freezeDate].filter((value): value is string => value !== null).map((value) => requireDate(value, "service_end"));
  if (candidates.length === 0) throw new Error("service_resolution requires dote, dopt, or dobf to resolve service");
  return candidates.reduce((earliest, date) => (date.getTime() < earliest.getTime() ? date : earliest));
}

function requireDate(value: string | null, field: string): Date {
  if (value === null) throw new Error(`service_resolution missing ${field}`);
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`service_resolution invalid ${field}`);
  return date;
}

export function parseIsoDate(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid ISO date: ${value}`);
  }
  return date;
}

export function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addYears(dateText: string, years: number): string {
  const date = parseIsoDate(dateText);
  date.setUTCFullYear(date.getUTCFullYear() + years);
  return formatIsoDate(date);
}

export function addMonths(dateText: string, months: number): string {
  const date = parseIsoDate(dateText);
  date.setUTCMonth(date.getUTCMonth() + months);
  return formatIsoDate(date);
}

export function firstOfMonthOnOrAfter(dateText: string): string {
  const date = parseIsoDate(dateText);
  if (date.getUTCDate() === 1) return formatIsoDate(date);
  return formatIsoDate(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)));
}

export function firstOfMonthContaining(dateText: string): string {
  const date = parseIsoDate(dateText);
  return formatIsoDate(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)));
}

export function firstOfMonthNextFollowing(dateText: string): string {
  const date = parseIsoDate(dateText);
  return formatIsoDate(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)));
}

export function fixedAgeFromRule(rule: string): number {
  const match = /^age_(\d+)$/.exec(rule);
  if (!match) throw new Error(`Unsupported age rule: ${rule}`);
  return Number(match[1]);
}

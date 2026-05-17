let counter = 0;
let clock: (() => string) | null = null;

export function createDeterministicId(prefix: string): string {
  counter += 1;
  return `${prefix}-${String(counter).padStart(6, "0")}`;
}

export function currentTimestamp(): string {
  return clock ? clock() : new Date().toISOString();
}

export function resetDeterminismForTests(timestamp = "2026-05-16T00:00:00.000Z"): void {
  counter = 0;
  clock = () => timestamp;
}

export function restoreRuntimeDeterminism(): void {
  clock = null;
}

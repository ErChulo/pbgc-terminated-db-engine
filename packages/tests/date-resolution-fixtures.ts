import fixtureCsv from "./date_resolution_test_cases_v0.1.0.csv?raw";
import type { DateResolutionFixture } from "@pbgc/date-resolution";

export function parseDateResolutionFixtures(csv = fixtureCsv): DateResolutionFixture[] {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as DateResolutionFixture;
  });
}

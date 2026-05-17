import fixtureCsv from "./service_resolution_test_cases_v0.1.0.csv?raw";
import type { ServiceResolutionFixture } from "@pbgc/service-resolution";

export function parseServiceResolutionFixtures(csv = fixtureCsv): ServiceResolutionFixture[] {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as ServiceResolutionFixture;
  });
}

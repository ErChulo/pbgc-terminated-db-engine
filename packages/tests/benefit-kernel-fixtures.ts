import fixtureCsv from "./benefit_kernel_test_cases_v0.1.0.csv?raw";
import type { BenefitKernelFixture } from "@pbgc/benefit-kernel";

export function parseBenefitKernelFixtures(csv = fixtureCsv): BenefitKernelFixture[] {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as BenefitKernelFixture;
  });
}

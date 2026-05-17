import fixtureCsv from "./valuation_listings_output_test_cases_v0.1.0.csv?raw";
import type { ValuationListingsFixture } from "@pbgc/valuation-listings-output";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";

type FixtureRow = {
  test_case_id: string;
  description: string;
  v1_ve_fixture_index: string;
  listing_row_type: ValuationListingsFixture["listing_row_type"];
};

export function parseValuationListingsFixtures(csv = fixtureCsv): ValuationListingsFixture[] {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  const rows = lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as FixtureRow;
  });

  const dates = parseDateResolutionFixtures();
  const services = parseServiceResolutionFixtures();
  const compensations = parseCompensationResolutionFixtures();
  const forms = parseFormResolutionFixtures();
  const benefits = parseBenefitKernelFixtures();

  return rows.map((row) => {
    const index = Number(row.v1_ve_fixture_index);
    return {
      test_case_id: row.test_case_id,
      description: row.description,
      listing_row_type: row.listing_row_type,
      date_fixture: dates[index],
      service_fixture: services[index],
      compensation_fixture: compensations[index],
      form_fixture: forms[index],
      benefit_fixture: benefits[index],
    };
  });
}

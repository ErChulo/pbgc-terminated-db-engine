import fixtureCsv from "./bsrs_configuration_output_test_cases_v0.1.0.csv?raw";
import type { BsrsConfigurationFixture, BsrsStatementRowType } from "@pbgc/bsrs-configuration-output";
import type { ValuationListingsFixture } from "@pbgc/valuation-listings-output";
import { parseValuationListingsFixtures } from "./valuation-listings-output-fixtures";

type FixtureRow = {
  test_case_id: string;
  description: string;
  valuation_listings_fixture_index: string;
  statement_row_type: BsrsStatementRowType | "";
};

export function parseBsrsConfigurationFixtures(csv = fixtureCsv): BsrsConfigurationFixture[] {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  const rows = lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as FixtureRow;
  });

  const valuationFixtures = parseValuationListingsFixtures() as ValuationListingsFixture[];
  return rows.map((row) => {
    const index = Number(row.valuation_listings_fixture_index);
    return {
      test_case_id: row.test_case_id,
      description: row.description,
      statement_row_type: row.statement_row_type || undefined,
      valuation_fixture: valuationFixtures[index],
    };
  });
}

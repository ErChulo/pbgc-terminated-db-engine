import type { V1VeFixture } from "@pbgc/v1-ve-output";
import { parseBenefitKernelFixtures } from "./benefit-kernel-fixtures";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";

export function parseV1VeOutputFixtures(): V1VeFixture[] {
  const dates = parseDateResolutionFixtures();
  const services = parseServiceResolutionFixtures();
  const compensations = parseCompensationResolutionFixtures();
  const forms = parseFormResolutionFixtures();
  const benefits = parseBenefitKernelFixtures();

  return [
    {
      test_case_id: "VE001",
      description: "Deferred vested reviewed V1/VE path",
      date_fixture: dates[0],
      service_fixture: services[0],
      compensation_fixture: compensations[0],
      form_fixture: forms[0],
      benefit_fixture: benefits[0],
    },
    {
      test_case_id: "VE002",
      description: "In-pay supported with null benefit branch V1/VE path",
      date_fixture: dates[1],
      service_fixture: services[1],
      compensation_fixture: compensations[1],
      form_fixture: forms[1],
      benefit_fixture: benefits[1],
    },
  ];
}

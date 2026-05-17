import { describe, expect, it } from "vitest";
import { buildPacketFromFixture, resolveDates } from "@pbgc/date-resolution";
import { buildServicePacketFromFixture, resolveService } from "@pbgc/service-resolution";
import { buildCompensationPacketFromFixture, resolveCompensation } from "@pbgc/compensation-resolution";
import { buildFormPacketFromFixture, resolveForms } from "@pbgc/form-resolution";
import { compareRepeatedRuns } from "./hardening-helpers";
import { parseDateResolutionFixtures } from "./date-resolution-fixtures";
import { parseServiceResolutionFixtures } from "./service-resolution-fixtures";
import { parseCompensationResolutionFixtures } from "./compensation-resolution-fixtures";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";

describe("hardening deterministic core slices", () => {
  it("keeps date, service, compensation, and form resolutions identical across repeated runs", async () => {
    for (const fixture of parseDateResolutionFixtures()) {
      const [first, second] = await compareRepeatedRuns(() => resolveDates(buildPacketFromFixture(fixture)));
      expect(second).toEqual(first);
    }

    for (const fixture of parseServiceResolutionFixtures()) {
      const [first, second] = await compareRepeatedRuns(() => resolveService(buildServicePacketFromFixture(fixture)));
      expect(second).toEqual(first);
    }

    for (const fixture of parseCompensationResolutionFixtures()) {
      const [first, second] = await compareRepeatedRuns(() =>
        resolveCompensation(buildCompensationPacketFromFixture(fixture), `packet-${fixture.test_case_id}`, "0.1.0"),
      );
      expect(second).toEqual(first);
    }

    for (const fixture of parseFormResolutionFixtures()) {
      const [first, second] = await compareRepeatedRuns(() => resolveForms(buildFormPacketFromFixture(fixture), `packet-${fixture.test_case_id}`, "0.1.0"));
      expect(second).toEqual(first);
    }
  });
});

import { describe, expect, it } from "vitest";
import { buildFormPacketFromFixture, resolveForms } from "@pbgc/form-resolution";
import { resetDeterminismForTests } from "@pbgc/shared";
import { parseFormResolutionFixtures } from "./form-resolution-fixtures";

describe("form_resolution deterministic outputs", () => {
  it("matches committed expected outputs for FR001, FR002, and FR003", () => {
    resetDeterminismForTests();
    for (const fixture of parseFormResolutionFixtures()) {
      const result = resolveForms(buildFormPacketFromFixture(fixture), `packet-${fixture.test_case_id}`, "0.1.0");
      expect(result.values.rettyp ?? "").toBe(fixture.expected_rettyp);
      expect(result.values.form_code_nsf ?? "").toBe(fixture.expected_form_code_nsf);
      expect(result.values.form_code_nmf ?? "").toBe(fixture.expected_form_code_nmf);
      expect(result.values.form_code_death ?? "").toBe(fixture.expected_form_code_death);
      expect(result.values.lsoption ?? "").toBe(fixture.expected_lsoption);
    }
  });

  it("handles in-pay and QDRO branches without benefit amounts or output adapters", () => {
    resetDeterminismForTests();
    const fixtures = parseFormResolutionFixtures();
    const inPay = resolveForms(buildFormPacketFromFixture(fixtures[1]), "packet-FR002", "0.1.0");
    expect(inPay.values.rettyp).toBe("in_pay");
    expect(inPay.values.annuity_status_pay).toBe("pay");
    expect(inPay.values.form_code_ptp).toBe("2");
    expect(inPay.values.form_code_death).toBeNull();
    expect(inPay.warnings.map((warning) => warning.code)).toContain("IN_PAY_FORM_REVIEWED");

    const qdro = resolveForms(buildFormPacketFromFixture(fixtures[2]), "packet-FR003", "0.1.0");
    expect(qdro.values.rettyp).toBeNull();
    expect(qdro.values.bs_ind).toBe("QDRO");
    expect(qdro.values.form_code_death).toBeNull();
    expect(qdro.warnings.map((warning) => warning.code)).toContain("QDRO_FORM_REVIEWED");
    expect(Object.keys(qdro.values)).not.toContain("present_value");
  });
});

import { addMonths, addYears, firstOfMonthContaining, firstOfMonthNextFollowing, firstOfMonthOnOrAfter, fixedAgeFromRule } from "./dateMath";
import type { DateResolutionPacket, DateResolutionValues } from "./types";

export function resolveDates(packet: DateResolutionPacket): DateResolutionValues {
  const role = packet.participant_role_population.role_type;
  const dob = packet.participant_role_population.dob;
  if (role === "beneficiary") {
    return {
      nrd: null,
      erd: null,
      eurd: null,
      eprd: null,
      rbd: resolveBeneficiaryRbd(packet),
      xra: null,
      xrd: null,
      sxra: null,
      term_lw_xra: null,
      term_lw_anb: null,
    };
  }
  if (!dob) throw new Error("Participant DOB is required for date resolution");

  const nra = fixedAgeFromRule(packet.resolved_plan_logic.normal_retirement_eligibility_rule);
  const earlyAge = fixedAgeFromRule(packet.resolved_plan_logic.early_reduced_retirement_rule);
  const nrd = applyStartRule(addYears(dob, nra), packet.resolved_plan_logic.normal_retirement_start_rule);
  const erd = firstOfMonthOnOrAfter(addYears(dob, earlyAge));
  const inPayDate = packet.benefit_administration_state.asd ?? packet.benefit_administration_state.dor;
  const xrd = packet.participant_role_population.retstat === "1" && inPayDate ? inPayDate : nrd;

  return {
    nrd,
    erd,
    eurd: null,
    eprd: null,
    rbd: resolveParticipantRbd(packet),
    xra: nra,
    xrd,
    sxra: null,
    term_lw_xra: nra,
    term_lw_anb: nra,
  };
}

function applyStartRule(dateText: string, startRule: string): string {
  if (startRule === "first_of_month_on_or_after") return firstOfMonthOnOrAfter(dateText);
  if (startRule === "first_of_month_next_following") return firstOfMonthNextFollowing(dateText);
  throw new Error(`Unsupported normal retirement start rule: ${startRule}`);
}

function resolveParticipantRbd(packet: DateResolutionPacket): string | null {
  const dob = packet.participant_role_population.dob;
  if (!dob) return null;
  if (dob >= "1960-01-01") return firstOfMonthContaining(addYears(dob, 72));
  return firstOfMonthNextFollowing(addMonths(addYears(dob, 70), 6));
}

function resolveBeneficiaryRbd(packet: DateResolutionPacket): string | null {
  const dod = packet.participant_role_population.dod;
  if (!dod) return null;
  return firstOfMonthNextFollowing(addMonths(addYears(dod, 1), 10));
}

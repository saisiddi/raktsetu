// Pure helpers for the self-check on /eligibility. Nothing here stores or sends
// anything, and none of it replaces screening at the blood centre.
import { DONATION_GAP_DAYS } from "./config";

// Whole blood limits from "H. CRITERIA FOR BLOOD DONATION" in the Drugs and
// Cosmetics (Second Amendment) Rules, 2020, G.S.R. 166(E) dated 11 March 2020.
// The sentences these come from are shown to the user, see
// eligibility.checker.quotes in locales/en.json.
export const DONOR_LIMITS = {
  minAge: 18, // "Minimum age 18 years"
  maxAge: 65, // "Maximum age 65 years"
  maxFirstTimeAge: 60, // "First time donor shall not be over 60 years of age"
  minWeightKg: 45, // "350 ml- 45 kg"
};

// A "yes" to any of these means "wait". We don't work out the waiting periods
// ourselves, the quoted criteria are shown next to each question.
export const HEALTH_QUESTIONS = [
  "unwell",
  "antibiotics",
  "tattoo",
  "surgery",
  "pregnancy",
];

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// Works in UTC so adding days never shifts across a timezone or DST change.
function parseDate(value) {
  const match = DATE_PATTERN.exec(value ?? "");
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Date.UTC rolls 2026-02-30 over into March, so compare it back.
  return date.toISOString().startsWith(value) ? date : null;
}

/** "YYYY-MM-DD" of the last donation plus the configured gap, or null. */
export function getNextEligibleDate(lastDonation, gapDays = DONATION_GAP_DAYS) {
  const date = parseDate(lastDonation);
  if (!date) return null;
  date.setUTCDate(date.getUTCDate() + gapDays);
  return date.toISOString().slice(0, 10);
}

/**
 * Returns { field: errorCode } for every answer that is missing or unusable.
 * `lastDonation` is optional, an empty value means "never donated".
 */
export function validateAnswers(answers, today) {
  const errors = {};

  if (!/^\d+$/.test(String(answers.age ?? "").trim())) errors.age = "age";

  const weight = Number(answers.weight);
  if (!Number.isFinite(weight) || weight <= 0) errors.weight = "weight";

  const { lastDonation } = answers;
  if (lastDonation) {
    // ISO dates compare correctly as strings.
    if (!parseDate(lastDonation) || lastDonation > today) {
      errors.lastDonation = "lastDonation";
    }
  }

  for (const question of HEALTH_QUESTIONS) {
    if (answers[question] !== "yes" && answers[question] !== "no") {
      errors[question] = "answer";
    }
  }

  return errors;
}

/**
 * Takes answers that already passed validateAnswers() and returns
 * { mayBeEligible, reasons, nextEligibleDate }.
 */
export function checkEligibility(answers, today) {
  const age = Number(answers.age);
  const reasons = [];

  if (age < DONOR_LIMITS.minAge || age > DONOR_LIMITS.maxAge) {
    reasons.push("age");
  } else if (!answers.lastDonation && age > DONOR_LIMITS.maxFirstTimeAge) {
    reasons.push("firstTimeAge");
  }

  if (Number(answers.weight) < DONOR_LIMITS.minWeightKg) {
    reasons.push("weight");
  }

  const nextEligibleDate = getNextEligibleDate(answers.lastDonation);
  if (nextEligibleDate && today < nextEligibleDate) {
    reasons.push("donationGap");
  }

  reasons.push(...HEALTH_QUESTIONS.filter((q) => answers[q] === "yes"));

  return {
    mayBeEligible: reasons.length === 0,
    reasons,
    nextEligibleDate,
  };
}

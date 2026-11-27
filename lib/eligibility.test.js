import { describe, expect, it } from "vitest";
import en from "@/locales/en.json";
import { DONATION_GAP_DAYS, DONATION_GAP_DAYS_FEMALE } from "./config";
import {
  DONOR_LIMITS,
  HEALTH_QUESTIONS,
  SEX_OPTIONS,
  checkEligibility,
  getGapDays,
  getNextEligibleDate,
  validateAnswers,
} from "./eligibility";

const TODAY = "2026-11-20";

const noToAll = Object.fromEntries(HEALTH_QUESTIONS.map((q) => [q, "no"]));

function answers(overrides = {}) {
  return {
    age: "30",
    weight: "60",
    lastDonation: "",
    sex: "male",
    ...noToAll,
    ...overrides,
  };
}

// A last donation date that was exactly `days` days before TODAY.
function daysAgo(days) {
  return getNextEligibleDate(TODAY, -days);
}

describe("getNextEligibleDate", () => {
  it("adds DONATION_GAP_DAYS by default", () => {
    const next = getNextEligibleDate("2026-11-01");
    const diff = Date.parse(next) - Date.parse("2026-11-01");
    expect(diff / 86_400_000).toBe(DONATION_GAP_DAYS);
  });

  it("uses the gap it is given", () => {
    expect(getNextEligibleDate("2026-11-01", 90)).toBe("2027-01-30");
    expect(getNextEligibleDate("2026-11-01", 1)).toBe("2026-11-02");
  });

  it("crosses a leap day", () => {
    expect(getNextEligibleDate("2028-02-28", 1)).toBe("2028-02-29");
    expect(getNextEligibleDate("2027-02-28", 1)).toBe("2027-03-01");
  });

  it.each([
    "",
    undefined,
    null,
    "20-11-2026",
    "2026-02-30",
    "2026-13-01",
    "2026-11-01T10:00:00Z",
  ])("returns null for %s", (value) => {
    expect(getNextEligibleDate(value)).toBeNull();
  });
});

describe("validateAnswers", () => {
  it("accepts a complete form without a last donation date", () => {
    expect(validateAnswers(answers(), TODAY)).toEqual({});
  });

  it("flags every field of an empty form except the optional date", () => {
    expect(Object.keys(validateAnswers({}, TODAY))).toEqual([
      "age",
      "weight",
      ...HEALTH_QUESTIONS,
    ]);
  });

  it.each(["", "abc", "-20", "17.5"])("rejects age %s", (age) => {
    expect(validateAnswers(answers({ age }), TODAY).age).toBe("age");
  });

  it.each(["", "abc", "0", "-50"])("rejects weight %s", (weight) => {
    expect(validateAnswers(answers({ weight }), TODAY).weight).toBe("weight");
  });

  it("accepts a decimal weight", () => {
    expect(validateAnswers(answers({ weight: "52.5" }), TODAY)).toEqual({});
  });

  it("accepts today as the last donation date", () => {
    expect(validateAnswers(answers({ lastDonation: TODAY }), TODAY)).toEqual(
      {}
    );
  });

  it.each(["2026-11-21", "2026-02-30", "yesterday"])(
    "rejects last donation date %s",
    (lastDonation) => {
      const errors = validateAnswers(answers({ lastDonation }), TODAY);
      expect(errors.lastDonation).toBe("lastDonation");
    }
  );
});

describe("checkEligibility", () => {
  it("may be eligible when nothing is flagged", () => {
    expect(checkEligibility(answers(), TODAY)).toEqual({
      mayBeEligible: true,
      reasons: [],
      nextEligibleDate: null,
      gapDays: DONATION_GAP_DAYS,
    });
  });

  it.each([
    [17, ["age"]],
    [18, []],
    [60, []],
    [61, ["firstTimeAge"]],
    [66, ["age"]],
  ])("first-time donor aged %i", (age, reasons) => {
    const result = checkEligibility(answers({ age: String(age) }), TODAY);
    expect(result.reasons).toEqual(reasons);
  });

  it.each([
    [61, []],
    [65, []],
    [66, ["age"]],
  ])("repeat donor aged %i", (age, reasons) => {
    const result = checkEligibility(
      answers({ age: String(age), lastDonation: "2025-01-01" }),
      TODAY
    );
    expect(result.reasons).toEqual(reasons);
  });

  it("checks the minimum weight", () => {
    expect(
      checkEligibility(answers({ weight: "44.9" }), TODAY).reasons
    ).toEqual(["weight"]);
    expect(checkEligibility(answers({ weight: "45" }), TODAY).reasons).toEqual(
      []
    );
  });

  it("asks to wait one day before the gap is over", () => {
    const lastDonation = daysAgo(DONATION_GAP_DAYS - 1);
    const result = checkEligibility(answers({ lastDonation }), TODAY);
    expect(result.mayBeEligible).toBe(false);
    expect(result.reasons).toEqual(["donationGap"]);
    expect(result.nextEligibleDate).toBe("2026-11-21");
  });

  it("allows the day the gap is over", () => {
    const lastDonation = daysAgo(DONATION_GAP_DAYS);
    const result = checkEligibility(answers({ lastDonation }), TODAY);
    expect(result.mayBeEligible).toBe(true);
    expect(result.nextEligibleDate).toBe(TODAY);
  });

  it.each(HEALTH_QUESTIONS)("a yes to %s means wait", (question) => {
    const result = checkEligibility(answers({ [question]: "yes" }), TODAY);
    expect(result.mayBeEligible).toBe(false);
    expect(result.reasons).toEqual([question]);
  });

  it("lists every reason that applies", () => {
    const result = checkEligibility(
      answers({ age: "16", weight: "40", surgery: "yes" }),
      TODAY
    );
    expect(result.reasons).toEqual(["age", "weight", "surgery"]);
  });
});

describe("donation gap by sex", () => {
  it("uses 90 days for male and 120 for everyone else", () => {
    expect(getGapDays("male")).toBe(90);
    expect(getGapDays("female")).toBe(120);
    expect(getGapDays("unsaid")).toBe(120);
    expect(getGapDays(undefined)).toBe(120);
    expect(DONATION_GAP_DAYS_FEMALE).toBeGreaterThan(DONATION_GAP_DAYS);
  });

  it.each([
    ["female", 90, false],
    ["female", 119, false],
    ["female", 120, true],
    ["unsaid", 119, false],
    ["unsaid", 120, true],
    ["male", 89, false],
    ["male", 90, true],
  ])("%s, %i days after donating: eligible %s", (sex, days, expected) => {
    const lastDonation = daysAgo(days);
    const result = checkEligibility(answers({ sex, lastDonation }), TODAY);
    expect(result.mayBeEligible).toBe(expected);
    expect(result.gapDays).toBe(getGapDays(sex));
    expect(result.nextEligibleDate).toBe(
      getNextEligibleDate(lastDonation, getGapDays(sex))
    );
  });

  it("asks for sex only when there is a last donation date", () => {
    expect(validateAnswers(answers({ sex: "" }), TODAY)).toEqual({});
    expect(
      validateAnswers(answers({ sex: "", lastDonation: TODAY }), TODAY)
    ).toEqual({ sex: "sex" });
    for (const sex of SEX_OPTIONS) {
      expect(
        validateAnswers(answers({ sex, lastDonation: TODAY }), TODAY)
      ).toEqual({});
    }
  });

  it("has a label for every option", () => {
    for (const sex of SEX_OPTIONS) {
      expect(en.eligibility.checker.sexOptions[sex]).toBeTruthy();
    }
    expect(en.eligibility.checker.errors.sex).toBeTruthy();
  });
});

describe("locale strings", () => {
  const checker = en.eligibility.checker;

  it("has a question, quote and reason for every health question", () => {
    for (const question of HEALTH_QUESTIONS) {
      expect(checker.questions[question]).toBeTruthy();
      expect(checker.quotes[question].length).toBeGreaterThan(0);
      expect(checker.reasons[question]).toBeTruthy();
    }
  });

  it("quotes the same numbers the code checks", () => {
    const age = checker.quotes.age.join(" ");
    expect(age).toContain(`Minimum age ${DONOR_LIMITS.minAge} years`);
    expect(age).toContain(`Maximum age ${DONOR_LIMITS.maxAge} years`);
    expect(age).toContain(`over ${DONOR_LIMITS.maxFirstTimeAge} years`);
    expect(checker.quotes.weight[0]).toContain(
      `350 ml- ${DONOR_LIMITS.minWeightKg} kg`
    );
  });
});

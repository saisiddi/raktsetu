"use client";

import { useState, useSyncExternalStore } from "react";
import { t } from "@/lib/i18n";
import {
  HEALTH_QUESTIONS,
  SEX_OPTIONS,
  checkEligibility,
  validateAnswers,
} from "@/lib/eligibility";

const NUMBER_FIELDS = [
  { name: "age", quotes: "age", inputMode: "numeric" },
  { name: "weight", quotes: "weight", inputMode: "decimal" },
];

const FIELD_ORDER = [
  "age",
  "weight",
  "lastDonation",
  "sex",
  ...HEALTH_QUESTIONS,
];

const SOURCES = ["gazette", "eraktkosh"];

const initialAnswers = Object.fromEntries(
  FIELD_ORDER.map((field) => [field, ""])
);

const INPUT_CLASS =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand";

const subscribe = () => () => {};

function describedBy(field, error) {
  return error ? `${field}-quote ${field}-error` : `${field}-quote`;
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    dateStyle: "long",
    timeZone: "UTC",
  });
}

// Official wording, kept word for word in the locale file.
function Quote({ id, name }) {
  return (
    <blockquote
      id={id}
      className="mt-1 border-l-4 border-gray-300 pl-3 text-xs leading-5 text-gray-600"
    >
      {t(`eligibility.checker.quotes.${name}`).map((line) => (
        <p key={line}>{line}</p>
      ))}
    </blockquote>
  );
}

function FieldError({ field, error }) {
  if (!error) return null;
  return (
    <p id={`${field}-error`} className="mt-1 text-sm text-brand-dark">
      {t(`eligibility.checker.errors.${error}`)}
    </p>
  );
}

export default function EligibilityChecker() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  // False in the server HTML. Submitting before React has loaded would put the
  // answers in the URL, so the button stays disabled until then.
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    // An old result must not sit next to new answers.
    setResult(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { elements } = e.currentTarget;
    const today = new Date().toLocaleDateString("en-CA");
    const nextErrors = validateAnswers(answers, today);
    // A half typed date reads as "", which would count as never donated.
    if (elements.namedItem("lastDonation").validity.badInput) {
      nextErrors.lastDonation = "lastDonation";
    }
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setResult(null);
      const target = elements.namedItem(firstInvalid);
      // Radio groups come back as a list, focus the first option.
      (target instanceof RadioNodeList ? target[0] : target).focus();
      return;
    }
    setResult(checkEligibility(answers, today));
  }

  return (
    <section className="mt-8" aria-labelledby="checker-title">
      <h2 id="checker-title" className="text-xl font-bold text-gray-900">
        {t("eligibility.checker.title")}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {t("eligibility.checker.intro")}
      </p>
      <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
        {t("eligibility.checker.disclaimer")}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
        {NUMBER_FIELDS.map(({ name, quotes, inputMode }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700"
            >
              {t(`eligibility.checker.fields.${name}`)}
            </label>
            <input
              id={name}
              name={name}
              type="number"
              inputMode={inputMode}
              min="0"
              step="any"
              value={answers[name]}
              onChange={handleChange}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={describedBy(name, errors[name])}
              className={INPUT_CLASS}
            />
            <FieldError field={name} error={errors[name]} />
            <Quote id={`${name}-quote`} name={quotes} />
          </div>
        ))}

        <div>
          <label
            htmlFor="lastDonation"
            className="block text-sm font-medium text-gray-700"
          >
            {t("eligibility.checker.fields.lastDonation")}
          </label>
          <input
            id="lastDonation"
            name="lastDonation"
            type="date"
            value={answers.lastDonation}
            onChange={handleChange}
            aria-invalid={Boolean(errors.lastDonation)}
            aria-describedby={describedBy("lastDonation", errors.lastDonation)}
            className={INPUT_CLASS}
          />
          <FieldError field="lastDonation" error={errors.lastDonation} />
          <Quote id="lastDonation-quote" name="interval" />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-gray-700">
            {t("eligibility.checker.fields.sex")}
          </legend>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {SEX_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name="sex"
                  value={option}
                  checked={answers.sex === option}
                  onChange={handleChange}
                  aria-describedby={errors.sex ? "sex-error" : undefined}
                  className="h-4 w-4 accent-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
                />
                {t(`eligibility.checker.sexOptions.${option}`)}
              </label>
            ))}
          </div>
          <FieldError field="sex" error={errors.sex} />
        </fieldset>

        {HEALTH_QUESTIONS.map((question) => (
          <fieldset key={question}>
            <legend className="text-sm font-medium text-gray-700">
              {t(`eligibility.checker.questions.${question}`)}
            </legend>
            <Quote id={`${question}-quote`} name={question} />
            <div className="mt-2 flex gap-6">
              {["yes", "no"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    name={question}
                    value={option}
                    checked={answers[question] === option}
                    onChange={handleChange}
                    aria-describedby={describedBy(question, errors[question])}
                    className="h-4 w-4 accent-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
                  />
                  {t(`eligibility.checker.options.${option}`)}
                </label>
              ))}
            </div>
            <FieldError field={question} error={errors[question]} />
          </fieldset>
        ))}

        <button
          type="submit"
          disabled={!ready}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand disabled:opacity-60"
        >
          {t("eligibility.checker.submit")}
        </button>
      </form>

      {/* Always mounted so screen readers announce the result when it appears. */}
      <div role="status">
        {result && (
          <div className="mt-6 rounded-lg border border-gray-300 bg-gray-50 p-4">
            <p className="text-lg font-bold text-gray-900">
              {t(
                result.mayBeEligible
                  ? "eligibility.checker.result.mayBeEligible"
                  : "eligibility.checker.result.wait"
              )}
            </p>

            {result.reasons.length > 0 && (
              <>
                <p className="mt-2 text-sm text-gray-700">
                  {t("eligibility.checker.result.reasonsTitle")}
                </p>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
                  {result.reasons.map((reason) => (
                    <li key={reason}>
                      {t(`eligibility.checker.reasons.${reason}`)}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.nextEligibleDate && (
              <>
                <p className="mt-3 text-sm font-medium text-gray-900">
                  {t("eligibility.checker.result.nextDate", {
                    days: result.gapDays,
                    date: formatDate(result.nextEligibleDate),
                  })}
                </p>
                <Quote name="interval" />
              </>
            )}

            <p className="mt-3 text-sm text-gray-700">
              {t("eligibility.checker.result.limits")}
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {t("eligibility.checker.disclaimer")}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>{t("eligibility.checker.sourcesIntro")}</p>
        <ul className="mt-2 space-y-1">
          {SOURCES.map((source) => (
            <li key={source}>
              <a
                href={t(`eligibility.checker.sources.${source}.url`)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-dark underline focus:outline-2 focus:outline-offset-2 focus:outline-brand"
              >
                {t(`eligibility.checker.sources.${source}.name`)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

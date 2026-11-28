"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import { DONATION_GAP_DAYS } from "@/lib/config";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  name: "",
  bloodGroup: "",
  city: "",
  available: true,
  consent: false,
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = t("donate.errors.name");
  if (!form.bloodGroup) errors.bloodGroup = t("donate.errors.bloodGroup");
  if (!form.city.trim()) errors.city = t("donate.errors.city");
  if (!form.consent) errors.consent = t("donate.errors.consent");
  return errors;
}

export default function DonatePage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field) {
    return (e) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("donate.title")}</h1>
      <p className="mt-2 text-gray-700">{t("donate.subtitle")}</p>
      <p className="mt-4 text-sm text-gray-600">
        {t("donate.availabilityNote", { days: DONATION_GAP_DAYS })}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <TextField
          id="name"
          label={t("donate.fields.name")}
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <SelectField
          id="bloodGroup"
          label={t("donate.fields.bloodGroup")}
          options={BLOOD_GROUPS}
          value={form.bloodGroup}
          onChange={handleChange("bloodGroup")}
          error={errors.bloodGroup}
        />

        <TextField
          id="city"
          label={t("donate.fields.city")}
          value={form.city}
          onChange={handleChange("city")}
          error={errors.city}
        />

        <div className="flex items-center gap-2">
          <input
            id="available"
            type="checkbox"
            checked={form.available}
            onChange={handleChange("available")}
            className="h-4 w-4 rounded border-gray-300 text-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          />
          <label htmlFor="available" className="text-sm text-gray-700">
            {t("donate.fields.available")}
          </label>
        </div>

        <div>
          <div className="flex items-start gap-2">
            <input
              id="consent"
              type="checkbox"
              checked={form.consent}
              onChange={handleChange("consent")}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "consent-error" : undefined}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            />
            <label htmlFor="consent" className="text-sm text-gray-700">
              {t("donate.fields.consent")}
            </label>
          </div>
          {errors.consent && (
            <p id="consent-error" className="mt-1 text-sm text-brand-dark">
              {errors.consent}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
        >
          {t("donate.submit")}
        </button>

        {submitted && (
          <p
            role="status"
            className="text-center text-sm font-medium text-brand-dark"
          >
            {t("donate.demoModeNotice")}
          </p>
        )}
      </form>
    </div>
  );
}

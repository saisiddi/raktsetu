"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";

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

export default function DonateForm() {
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
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {t("donate.fields.name")}
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-brand-dark">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="bloodGroup"
          className="block text-sm font-medium text-gray-700"
        >
          {t("donate.fields.bloodGroup")}
        </label>
        <select
          id="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange("bloodGroup")}
          aria-invalid={Boolean(errors.bloodGroup)}
          aria-describedby={errors.bloodGroup ? "bloodGroup-error" : undefined}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
        >
          <option value="">—</option>
          {BLOOD_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        {errors.bloodGroup && (
          <p id="bloodGroup-error" className="mt-1 text-sm text-brand-dark">
            {errors.bloodGroup}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          {t("donate.fields.city")}
        </label>
        <input
          id="city"
          type="text"
          value={form.city}
          onChange={handleChange("city")}
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? "city-error" : undefined}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
        />
        {errors.city && (
          <p id="city-error" className="mt-1 text-sm text-brand-dark">
            {errors.city}
          </p>
        )}
      </div>

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
  );
}


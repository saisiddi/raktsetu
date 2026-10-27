"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import { REQUEST_EXPIRY_HOURS } from "@/lib/config";
import AntiScamBanner from "@/components/AntiScamBanner";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  bloodGroup: "",
  units: "",
  hospitalName: "",
  city: "",
  neededBy: "",
};

function validateField(field, value) {
  switch (field) {
    case "bloodGroup":
      if (!value) return t("request.errors.bloodGroup");
      break;
    case "units":
      if (!value || Number(value) < 1) return t("request.errors.units");
      break;
    case "hospitalName":
      if (!value.trim()) return t("request.errors.hospitalName");
      break;
    case "city":
      if (!value.trim()) return t("request.errors.city");
      break;
    case "neededBy":
      if (!value || new Date(value) <= new Date().setHours(0, 0, 0, 0))
        return t("request.errors.neededBy");
      break;
  }
  return undefined;
}

function validate(form) {
  const errors = {};
  for (const field of Object.keys(initialForm)) {
    const err = validateField(field, form[field]);
    if (err) errors[field] = err;
  }
  return errors;
}

function setFieldError(setErrors, field, value) {
  const err = validateField(field, value);
  setErrors((prev) => {
    const next = { ...prev };
    if (err) next[field] = err;
    else delete next[field];
    return next;
  });
}

export default function RequestPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
      if (!(field in errors)) return;
      setFieldError(setErrors, field, value);
    };
  }

  function handleBlur(field) {
    return () => setFieldError(setErrors, field, form[field]);
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
      <h1 className="text-3xl font-bold text-gray-900">{t("request.title")}</h1>
      <p className="mt-2 text-gray-700">{t("request.subtitle")}</p>

      <p className="mt-4 text-sm font-medium text-gray-700">
        {t("request.expiryNotice", { hours: REQUEST_EXPIRY_HOURS })}
      </p>

      <div className="mt-4">
        <AntiScamBanner
          title={t("home.antiScam.title")}
          body={t("request.antiScamWarning")}
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label
            htmlFor="bloodGroup"
            className="block text-sm font-medium text-gray-700"
          >
            {t("request.fields.bloodGroup")}
          </label>
          <select
            id="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange("bloodGroup")}
            onBlur={handleBlur("bloodGroup")}
            aria-invalid={Boolean(errors.bloodGroup)}
            aria-describedby={
              errors.bloodGroup ? "bloodGroup-error" : undefined
            }
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
            htmlFor="units"
            className="block text-sm font-medium text-gray-700"
          >
            {t("request.fields.units")}
          </label>
          <input
            id="units"
            type="number"
            min="1"
            value={form.units}
            onChange={handleChange("units")}
            onBlur={handleBlur("units")}
            aria-invalid={Boolean(errors.units)}
            aria-describedby={errors.units ? "units-error" : undefined}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          />
          {errors.units && (
            <p id="units-error" className="mt-1 text-sm text-brand-dark">
              {errors.units}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="hospitalName"
            className="block text-sm font-medium text-gray-700"
          >
            {t("request.fields.hospitalName")}
          </label>
          <input
            id="hospitalName"
            type="text"
            value={form.hospitalName}
            onChange={handleChange("hospitalName")}
            onBlur={handleBlur("hospitalName")}
            aria-invalid={Boolean(errors.hospitalName)}
            aria-describedby={
              errors.hospitalName ? "hospitalName-error" : undefined
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          />
          {errors.hospitalName && (
            <p id="hospitalName-error" className="mt-1 text-sm text-brand-dark">
              {errors.hospitalName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            {t("request.fields.city")}
          </label>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={handleChange("city")}
            onBlur={handleBlur("city")}
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

        <div>
          <label
            htmlFor="neededBy"
            className="block text-sm font-medium text-gray-700"
          >
            {t("request.fields.neededBy")}
          </label>
          <input
            id="neededBy"
            type="date"
            value={form.neededBy}
            onChange={handleChange("neededBy")}
            onBlur={handleBlur("neededBy")}
            aria-invalid={Boolean(errors.neededBy)}
            aria-describedby={errors.neededBy ? "neededBy-error" : undefined}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          />
          {errors.neededBy && (
            <p id="neededBy-error" className="mt-1 text-sm text-brand-dark">
              {errors.neededBy}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600">
          {t("request.fields.contactNote")}
        </p>

        <button
          type="submit"
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
        >
          {t("request.submit")}
        </button>

        {submitted && (
          <p
            role="status"
            className="text-center text-sm font-medium text-brand-dark"
          >
            {t("request.demoModeNotice")}
          </p>
        )}
      </form>
    </div>
  );
}

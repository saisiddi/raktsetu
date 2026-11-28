"use client";

import { useState } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { REQUEST_EXPIRY_HOURS } from "@/lib/config";
import AntiScamBanner from "@/components/AntiScamBanner";
import ReportButton from "@/components/ReportButton";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";

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
      if (!value || value < new Date().toLocaleDateString("en-CA"))
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

      <p className="mt-2 text-sm text-gray-700">
        {t("request.emergencyNote")}{" "}
        <Link
          href="/emergency"
          className="font-medium text-brand-dark underline focus:outline-2 focus:outline-offset-2 focus:outline-brand"
        >
          {t("request.emergencyLink")}
        </Link>
      </p>

      <p className="mt-4 text-sm font-medium text-gray-700">
        {t("request.expiryNotice", { hours: REQUEST_EXPIRY_HOURS })}
      </p>

      <div className="mt-4">
        <AntiScamBanner
          title={t("home.antiScam.title")}
          body={t("request.antiScamWarning")}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <ReportButton targetName={t("report.requestTarget")} />
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <SelectField
          id="bloodGroup"
          label={t("request.fields.bloodGroup")}
          options={BLOOD_GROUPS}
          value={form.bloodGroup}
          onChange={handleChange("bloodGroup")}
          onBlur={handleBlur("bloodGroup")}
          error={errors.bloodGroup}
        />

        <TextField
          id="units"
          label={t("request.fields.units")}
          type="number"
          min="1"
          value={form.units}
          onChange={handleChange("units")}
          onBlur={handleBlur("units")}
          error={errors.units}
        />

        <TextField
          id="hospitalName"
          label={t("request.fields.hospitalName")}
          value={form.hospitalName}
          onChange={handleChange("hospitalName")}
          onBlur={handleBlur("hospitalName")}
          error={errors.hospitalName}
        />

        <TextField
          id="city"
          label={t("request.fields.city")}
          value={form.city}
          onChange={handleChange("city")}
          onBlur={handleBlur("city")}
          error={errors.city}
        />

        <TextField
          id="neededBy"
          label={t("request.fields.neededBy")}
          type="date"
          value={form.neededBy}
          onChange={handleChange("neededBy")}
          onBlur={handleBlur("neededBy")}
          error={errors.neededBy}
        />

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

"use client";

import { useId, useState } from "react";
import { t } from "@/lib/i18n";

export default function ReportButton({ targetName }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const detailsId = useId();
  const legendId = useId();

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p role="status" className="mt-3 text-sm text-brand-dark">
        {t("report.demoModeNotice")}
      </p>
    );
  }

  return (
    <div className="mt-3 w-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("report.labelFor", { name: targetName })}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-brand"
      >
        {t("report.button")}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-3 space-y-3 p-3 border border-gray-200 rounded-md bg-gray-50"
          noValidate
        >
          <fieldset aria-labelledby={legendId}>
            <legend id={legendId} className="sr-only">
              {t("report.reasonLabel")}
            </legend>
            <div className="space-y-2">
              {["scam", "spam", "abuse"].map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={value}
                    checked={reason === value}
                    onChange={() => setReason(value)}
                    className="h-4 w-4 text-brand focus:ring-brand border-gray-300"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    {t(`report.reasons.${value}`)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor={detailsId}
              className="block text-sm font-medium text-gray-700"
            >
              {t("report.detailsLabel")}
            </label>
            <textarea
              id={detailsId}
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
              placeholder={t("report.detailsPlaceholder")}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!reason}
              className="flex-1 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            >
              {t("report.submit")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            >
              {t("report.cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

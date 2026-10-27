"use client";

import { useState, useId } from "react";
import { t } from "@/lib/i18n";

const REASONS = [
  { value: "scam", label: "report.scam" },
  { value: "spam", label: "report.spam" },
  { value: "abuse", label: "report.abuse" },
];

export default function ReportButton({ targetLabel }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("scam");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const detailsId = useId();
  const fieldsetId = useId();

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p role="status" className="text-sm font-medium text-brand-dark">
        {t("report.demoNotice")}
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={
          targetLabel
            ? `${t("report.label")} ${targetLabel}`
            : t("report.label")
        }
        aria-expanded={open}
        className="text-sm text-gray-600 hover:text-brand-dark underline"
      >
        {t("report.label")}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-3 w-full space-y-3 p-3 border border-gray-200 rounded-md bg-gray-50"
        >
          <fieldset id={fieldsetId}>
            <legend className="text-sm font-medium text-gray-700">
              {t("report.reason")}
            </legend>
            <div
              className="mt-1 space-y-1"
              role="radiogroup"
              aria-labelledby={fieldsetId}
            >
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="text-brand focus:ring-brand"
                  />
                  <span className="text-sm text-gray-700">{t(r.label)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor={detailsId}
              className="block text-sm font-medium text-gray-700"
            >
              {t("report.details")}
            </label>
            <textarea
              id={detailsId}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
            >
              {t("report.submit")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            >
              {t("report.cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

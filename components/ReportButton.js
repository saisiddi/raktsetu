"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";

const REASONS = [
  { value: "scam", label: "reportScam" },
  { value: "spam", label: "reportSpam" },
  { value: "abuse", label: "reportAbuse" },
];

export default function ReportButton({
  namespace = "donors",
  targetType,
  targetId,
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("scam");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  const tk = (key) => t(`${namespace}.${key}`);

  if (submitted) {
    return (
      <p role="status" className="text-sm font-medium text-brand-dark">
        {tk("reportDemoNotice")}
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={tk("report")}
        aria-expanded={open}
        className="text-sm text-gray-600 hover:text-brand-dark underline"
      >
        {tk("report")}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-2 space-y-3 p-3 border border-gray-200 rounded-md bg-gray-50"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {tk("reportReason")}
            </label>
            <div
              className="mt-1 space-y-1"
              role="radiogroup"
              aria-label={tk("reportReason")}
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
                  <span className="text-sm text-gray-700">{tk(r.label)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="reportDetails"
              className="block text-sm font-medium text-gray-700"
            >
              {tk("reportDetails")}
            </label>
            <textarea
              id="reportDetails"
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
              {tk("reportSubmit")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            >
              {tk("cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

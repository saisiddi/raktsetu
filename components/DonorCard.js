"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import ReportButton from "./ReportButton";

export default function DonorCard({ donor }) {
  const [requested, setRequested] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        {/* h2 preserves valid sequentially-descending heading hierarchy under the page h1 */}
        <h2 className="font-semibold text-gray-900">{donor.firstName}</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            donor.available
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {donor.available
            ? t("donors.availableBadge")
            : t("donors.unavailableBadge")}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-700">{donor.bloodGroup}</p>
      <p className="mt-1 text-sm text-gray-600">{donor.city}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        {/* aria-label provides distinguishing donor context for screen readers */}
        <button
          type="button"
          disabled={!donor.available}
          onClick={() => setRequested(true)}
          aria-label={t("donors.requestContactFor", { name: donor.firstName })}
          className="flex-1 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          {t("donors.requestContact")}
        </button>
      </div>

      <ReportButton targetLabel={donor.firstName} />

      {requested && (
        <p role="status" className="mt-2 text-sm text-brand-dark">
          {t("donors.demoModeNotice")}
        </p>
      )}
    </div>
  );
}

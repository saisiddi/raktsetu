"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { t } from "@/lib/i18n";
import BloodBankCard from "@/components/BloodBankCard";

// Leaflet touches `window`, so the map is only ever loaded in the browser.
const BloodBankMap = dynamic(() => import("@/components/BloodBankMap"), {
  ssr: false,
  loading: () => (
    <p className="mt-6 text-sm text-gray-600" role="status">
      {t("bloodBanks.mapLoading")}
    </p>
  ),
});

export default function BloodBankSearch({ banks }) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [view, setView] = useState("list");

  const states = useMemo(
    () => [...new Set(banks.map((b) => b.state))].sort(),
    [banks]
  );

  const citiesForState = useMemo(() => {
    const scoped = state ? banks.filter((b) => b.state === state) : banks;
    return [...new Set(scoped.map((b) => b.city))].sort();
  }, [banks, state]);

  const filtered = banks.filter(
    (b) => (!state || b.state === state) && (!city || b.city === city)
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label
            htmlFor="state-filter"
            className="block text-sm font-medium text-gray-700"
          >
            {t("bloodBanks.filterStateLabel")}
          </label>
          <select
            id="state-filter"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setCity("");
            }}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            <option value="">{t("bloodBanks.allStates")}</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="city-filter"
            className="block text-sm font-medium text-gray-700"
          >
            {t("bloodBanks.filterCityLabel")}
          </label>
          <select
            id="city-filter"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            <option value="">{t("bloodBanks.allCities")}</option>
            {citiesForState.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        role="group"
        aria-label={t("bloodBanks.viewToggleLabel")}
        className="mt-4 inline-flex overflow-hidden rounded-md border border-gray-300"
      >
        {["list", "map"].map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={view === mode}
            onClick={() => setView(mode)}
            className={`px-4 py-2 text-sm font-medium focus:outline-2 focus:outline-offset-2 focus:outline-brand ${
              view === mode
                ? "bg-brand text-white"
                : "bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            {t(mode === "list" ? "bloodBanks.listView" : "bloodBanks.mapView")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-gray-600">
          {t("bloodBanks.noResults")}
        </p>
      ) : view === "map" ? (
        <BloodBankMap banks={filtered} />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bank) => (
            <BloodBankCard key={bank.id} bank={bank} />
          ))}
        </div>
      )}
    </div>
  );
}

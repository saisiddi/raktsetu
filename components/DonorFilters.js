"use client";

import { useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { t } from "@/lib/i18n";
import { BLOOD_COMPATIBILITY } from "@/lib/bloodCompatibility";
import defaultDonors from "@/data/donors.demo.json";
import DonorCard from "@/components/DonorCard";
import EmptyState from "@/components/EmptyState";

function normalizeBloodGroup(val) {
  if (!val) return "";
  const trimmed = val.trim();
  // If URL had '+' unencoded, searchParams may parse it as a space: e.g. "O "
  if (val.endsWith(" ") && !val.endsWith("+")) {
    return (val.slice(0, -1) + "+").toUpperCase();
  }
  return trimmed.toUpperCase();
}

export default function DonorFilters({
  donors = defaultDonors,
  onFilterChange,
  children,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bloodGroup = normalizeBloodGroup(searchParams.get("bloodGroup") || "");
  const canDonateTo = normalizeBloodGroup(
    searchParams.get("canDonateTo") || ""
  );
  const city = searchParams.get("city") || "";
  const availableOnly =
    searchParams.get("available") === "true" ||
    searchParams.get("availableOnly") === "true";

  const updateUrl = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();
      if (newFilters.bloodGroup) params.set("bloodGroup", newFilters.bloodGroup);
      if (newFilters.canDonateTo) params.set("canDonateTo", newFilters.canDonateTo);
      if (newFilters.city) params.set("city", newFilters.city);
      if (newFilters.availableOnly) params.set("available", "true");

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router]
  );

  const handleBloodGroupChange = (val) => {
    const nextFilters = { bloodGroup: val, canDonateTo, city, availableOnly };
    updateUrl(nextFilters);
    onFilterChange?.(nextFilters);
  };

  const handleCanDonateToChange = (val) => {
    const nextFilters = { bloodGroup, canDonateTo: val, city, availableOnly };
    updateUrl(nextFilters);
    onFilterChange?.(nextFilters);
  };

  const handleCityChange = (val) => {
    const nextFilters = { bloodGroup, canDonateTo, city: val, availableOnly };
    updateUrl(nextFilters);
    onFilterChange?.(nextFilters);
  };

  const handleAvailableOnlyChange = (checked) => {
    const nextFilters = { bloodGroup, canDonateTo, city, availableOnly: checked };
    updateUrl(nextFilters);
    onFilterChange?.(nextFilters);
  };

  const clearFilters = () => {
    const nextFilters = {
      bloodGroup: "",
      canDonateTo: "",
      city: "",
      availableOnly: false,
    };
    updateUrl(nextFilters);
    onFilterChange?.(nextFilters);
  };

  const bloodGroups = useMemo(
    () => BLOOD_COMPATIBILITY.map((entry) => entry.group),
    []
  );

  const cities = useMemo(
    () => [...new Set(donors.map((d) => d.city))].filter(Boolean).sort(),
    [donors]
  );

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      if (
        bloodGroup &&
        donor.bloodGroup.toUpperCase() !== bloodGroup.toUpperCase()
      ) {
        return false;
      }
      if (canDonateTo) {
        const entry = BLOOD_COMPATIBILITY.find(
          (item) => item.group === donor.bloodGroup
        );
        if (
          !entry ||
          !entry.donateTo.some(
            (g) => g.toUpperCase() === canDonateTo.toUpperCase()
          )
        ) {
          return false;
        }
      }
      if (city && donor.city.toLowerCase() !== city.toLowerCase()) {
        return false;
      }
      if (availableOnly && !donor.available) {
        return false;
      }
      return true;
    });
  }, [donors, bloodGroup, canDonateTo, city, availableOnly]);

  const hasActiveFilters = Boolean(
    bloodGroup || canDonateTo || city || availableOnly
  );

  const resultAnnouncement =
    filteredDonors.length === 1
      ? t("donors.resultCountSingular")
      : t("donors.resultCountPlural", { count: filteredDonors.length });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <div>
          <label
            htmlFor="blood-group-filter"
            className="block text-sm font-medium text-gray-700"
          >
            {t("donors.filterBloodGroupLabel")}
          </label>
          <select
            id="blood-group-filter"
            name="bloodGroup"
            value={bloodGroup}
            onChange={(e) => handleBloodGroupChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            <option value="">{t("donors.allBloodGroups")}</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="can-donate-to-filter"
            className="block text-sm font-medium text-gray-700"
          >
            {t("donors.canDonateToLabel")}
          </label>
          <select
            id="can-donate-to-filter"
            name="canDonateTo"
            value={canDonateTo}
            onChange={(e) => handleCanDonateToChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            <option value="">{t("donors.allRecipients")}</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="city-filter"
            className="block text-sm font-medium text-gray-700"
          >
            {t("donors.filterCityLabel")}
          </label>
          <select
            id="city-filter"
            name="city"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            <option value="">{t("donors.allCities")}</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <input
            id="available-only-filter"
            name="available"
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => handleAvailableOnlyChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          />
          <label
            htmlFor="available-only-filter"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            {t("donors.availableOnly")}
          </label>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-brand hover:text-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            {t("donors.clearFilters")}
          </button>
        )}
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {resultAnnouncement}
      </div>

      {typeof children === "function" ? (
        children({ filteredDonors, clearFilters, hasActiveFilters })
      ) : filteredDonors.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={
              hasActiveFilters
                ? t("donors.noResultsTitle")
                : t("donors.emptyTitle")
            }
            message={
              hasActiveFilters
                ? t("donors.noResults")
                : t("donors.emptyMessage")
            }
            actionLabel={
              hasActiveFilters
                ? t("donors.clearFilters")
                : t("donors.emptyAction")
            }
            actionHref={hasActiveFilters ? undefined : "/blood-banks"}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDonors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      )}
    </div>
  );
}

import { t } from "@/lib/i18n";
import Skeleton from "@/components/Skeleton";

function BloodBankCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-6 w-3/5" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-1.5 h-4 w-1/2" />
      <Skeleton className="mt-2.5 h-4 w-2/3" />
    </div>
  );
}

export default function Loading() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-12"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Loading blood banks...</span>

      <h1 className="text-3xl font-bold text-gray-900">
        {t("bloodBanks.title")}
      </h1>
      <p className="mt-2 max-w-2xl text-gray-700">{t("bloodBanks.subtitle")}</p>

      <div className="mt-6 rounded-lg border-2 border-brand bg-brand-light p-4">
        <h2 className="font-semibold text-brand-dark">
          {t("bloodBanks.eraktkoshCardTitle")}
        </h2>
        <p className="mt-1 text-sm text-gray-800">
          {t("bloodBanks.eraktkoshCardBody")}
        </p>
        <span className="mt-3 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">
          {t("bloodBanks.eraktkoshCardCta")}
        </span>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-1 h-10 w-full rounded-md" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="mt-1 h-10 w-full rounded-md" />
          </div>
        </div>

        <Skeleton className="mt-4 h-9 w-40 rounded-md" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BloodBankCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

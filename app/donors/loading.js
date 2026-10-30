import { t } from "@/lib/i18n";
import Skeleton from "@/components/Skeleton";

function DonorCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-4 w-12" />
      <Skeleton className="mt-1.5 h-4 w-24" />
      <Skeleton className="mt-3 h-9 w-full rounded-md" />
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
      <span className="sr-only">Loading donors...</span>

      <h1 className="text-3xl font-bold text-gray-900">{t("donors.title")}</h1>
      <p className="mt-2 max-w-2xl text-gray-700">{t("donors.subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <DonorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

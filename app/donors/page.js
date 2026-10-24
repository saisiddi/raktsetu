import { t } from "@/lib/i18n";
import donors from "@/data/donors.demo.json";
import DonorCard from "@/components/DonorCard";
import EmptyState from "@/components/EmptyState";

export const metadata = {
  title: "Donors — RaktSetu",
};

export default function DonorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("donors.title")}</h1>
      <p className="mt-2 max-w-2xl text-gray-700">{t("donors.subtitle")}</p>

      {donors.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={t("donors.emptyTitle")}
            message={t("donors.emptyMessage")}
            actionLabel={t("donors.emptyAction")}
            actionHref="/blood-banks"
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {donors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      )}
    </div>
  );
}

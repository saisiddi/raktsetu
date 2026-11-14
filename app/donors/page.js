import { Suspense } from "react";
import { t } from "@/lib/i18n";
import donors from "@/data/donors.demo.json";
import DonorFilters from "@/components/DonorFilters";

export const metadata = {
  title: "Donors — RaktSetu",
};

export default function DonorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("donors.title")}</h1>
      <p className="mt-2 max-w-2xl text-gray-700">{t("donors.subtitle")}</p>

      <div className="mt-8">
        <Suspense fallback={null}>
          <DonorFilters donors={donors} />
        </Suspense>
      </div>
    </div>
  );
}

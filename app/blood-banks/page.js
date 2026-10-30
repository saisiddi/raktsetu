import { t } from "@/lib/i18n";
import banks from "@/data/blood-banks.demo.json";
import BloodBankSearch from "@/components/BloodBankSearch";

export const metadata = {
  title: "Blood Banks — RaktSetu",
  description:
    "Search verified blood banks across India by state and city, view locations on map, and check real-time stock.",
};

export default function BloodBanksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
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
        <a
          href="https://www.eraktkosh.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
        >
          {t("bloodBanks.eraktkoshCardCta")}
        </a>
      </div>

      <div className="mt-8">
        <BloodBankSearch banks={banks} />
      </div>
    </div>
  );
}

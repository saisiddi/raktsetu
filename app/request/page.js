import { t } from "@/lib/i18n";
import { REQUEST_EXPIRY_HOURS } from "@/lib/config";
import AntiScamBanner from "@/components/AntiScamBanner";
import RequestForm from "@/components/RequestForm";

export const metadata = {
  title: "Request Blood — RaktSetu",
  description:
    "Post a verified urgent blood request to reach nearby compatible voluntary donors.",
};

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("request.title")}</h1>
      <p className="mt-2 text-gray-700">{t("request.subtitle")}</p>

      <p className="mt-4 text-sm font-medium text-gray-700">
        {t("request.expiryNotice", { hours: REQUEST_EXPIRY_HOURS })}
      </p>

      <div className="mt-4">
        <AntiScamBanner
          title={t("home.antiScam.title")}
          body={t("request.antiScamWarning")}
        />
      </div>

      <RequestForm />
    </div>
  );
}

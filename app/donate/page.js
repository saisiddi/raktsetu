import { t } from "@/lib/i18n";
import { DONATION_GAP_DAYS } from "@/lib/config";
import DonateForm from "@/components/DonateForm";

export const metadata = {
  title: "Donate Blood — RaktSetu",
  description:
    "Register as a volunteer blood donor. Your contact info stays masked and private.",
};

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("donate.title")}</h1>
      <p className="mt-2 text-gray-700">{t("donate.subtitle")}</p>
      <p className="mt-4 text-sm text-gray-600">
        {t("donate.availabilityNote", { days: DONATION_GAP_DAYS })}
      </p>

      <DonateForm />
    </div>
  );
}

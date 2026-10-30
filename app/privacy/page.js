import { t } from "@/lib/i18n";
import { REQUEST_EXPIRY_HOURS, DONATION_GAP_DAYS } from "@/lib/config";

export const metadata = {
  title: "Privacy — RaktSetu",
  description:
    "Read about RaktSetu's privacy principles, masked contact model, and data protection practices.",
};

export default function PrivacyPage() {
  const principles = t("privacy.principles", {
    hours: REQUEST_EXPIRY_HOURS,
    days: DONATION_GAP_DAYS,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("privacy.title")}</h1>
      <p className="mt-2 text-gray-700">{t("privacy.intro")}</p>

      <ol className="mt-8 space-y-6">
        {principles.map((principle, index) => (
          <li key={principle.title}>
            <h2 className="font-semibold text-brand">
              {index + 1}. {principle.title}
            </h2>
            <p className="mt-1 text-gray-700">{principle.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

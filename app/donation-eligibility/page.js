import { t } from "@/lib/i18n";

export const metadata = {
  title: "Blood Donation Eligibility — RaktSetu",
};

const GUIDANCE_ITEMS = [
  "generalHealth",
  "medicalHistory",
  "procedures",
  "previousDonations",
];

export default function EligibilityPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {t("eligibility.title")}
      </h1>

      <p className="mt-2 text-gray-700">{t("eligibility.introduction")}</p>

      <section className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
        <h2 className="font-semibold text-amber-900">
          {t("eligibility.disclaimerTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          {t("eligibility.disclaimer")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          {t("eligibility.guidanceTitle")}
        </h2>

        <p className="mt-2 text-gray-700">
          {t("eligibility.guidanceIntroduction")}
        </p>

        <ul className="mt-4 space-y-4">
          {GUIDANCE_ITEMS.map((item) => (
            <li key={item}>
              <h3 className="font-semibold text-gray-900">
                {t(`eligibility.cards.${item}.title`)}
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {t(`eligibility.cards.${item}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          {t("eligibility.screeningTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {t("eligibility.screeningDescription")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          {t("eligibility.resourcesTitle")}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {t("eligibility.resourcesDescription")}
        </p>

        <ul className="mt-4 space-y-4">
          {["eraktkosh", "indianredcross"].map((resource) => (
            <li key={resource}>
              <a
                href={t(`eligibility.resources.${resource}.url`)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-dark underline"
              >
                {t(`eligibility.resources.${resource}.name`)}
              </a>

              <p className="mt-1 text-sm text-gray-600">
                {t(`eligibility.resources.${resource}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
        {t("eligibility.finalNote")}
      </p>
    </main>
  );
}

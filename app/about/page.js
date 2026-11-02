import { t } from "@/lib/i18n";

export const metadata = {
  title: "About — RaktSetu",
  description:
    "Learn about RaktSetu, an open-source, privacy-first platform connecting blood donors and recipients across India.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("about.title")}</h1>
      <p className="mt-4 text-gray-700">{t("about.mission")}</p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        {t("about.maintainerTitle")}
      </h2>
      <p className="mt-2 text-gray-700">{t("about.maintainerBody")}</p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        {t("about.contributeTitle")}
      </h2>
      <p className="mt-2 text-gray-700">{t("about.contributeBody")}</p>
    </div>
  );
}

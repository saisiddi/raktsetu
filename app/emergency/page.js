import Link from "next/link";
import { t } from "@/lib/i18n";

export const metadata = {
  title: t("emergency.metaTitle"),
  description: t("emergency.metaDescription"),
};

// Only official Government of India sources. The links themselves live in
// locales/en.json so the maintainer can review them in one place.
const RESOURCES = ["eraktkosh", "stock", "licensed", "mohfw"];

const CHECKLIST = ["bloodGroup", "units", "hospital", "requisition"];

export default function EmergencyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {t("emergency.title")}
      </h1>
      <p className="mt-2 text-gray-700">{t("emergency.intro")}</p>

      <section className="mt-8" aria-labelledby="emergency-links">
        <h2 id="emergency-links" className="text-xl font-bold text-gray-900">
          {t("emergency.resourcesTitle")}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t("emergency.resourcesDescription")}
        </p>

        <ul className="mt-4 space-y-4">
          {RESOURCES.map((resource) => {
            const url = t(`emergency.resources.${resource}.url`);
            return (
              <li key={resource}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-dark underline focus:outline-2 focus:outline-offset-2 focus:outline-brand"
                >
                  {t(`emergency.resources.${resource}.name`)}
                  <span className="sr-only">
                    {" "}
                    {t("emergency.opensInNewTab")}
                  </span>
                </a>
                {/* Showing the real domain lets people see the link is official. */}
                <p className="mt-0.5 text-xs text-gray-600">
                  {new URL(url).hostname}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {t(`emergency.resources.${resource}.description`)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="emergency-checklist">
        <h2
          id="emergency-checklist"
          className="text-xl font-bold text-gray-900"
        >
          {t("emergency.checklistTitle")}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t("emergency.checklistDescription")}
        </p>
        <ul className="mt-4 space-y-2">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2 text-gray-700">
              <span aria-hidden="true" className="text-brand">
                &#10003;
              </span>
              <span>{t(`emergency.checklist.${item}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4">
        <h2 className="font-semibold text-amber-900">
          {t("emergency.safetyTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          {t("emergency.safetyNote")}
        </p>
      </section>

      <div className="mt-8">
        <Link
          href="/request"
          className="inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
        >
          {t("emergency.requestCta")}
        </Link>
      </div>
    </div>
  );
}

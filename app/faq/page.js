import Link from "next/link";
import { t } from "@/lib/i18n";
import { REQUEST_EXPIRY_HOURS, DONATION_GAP_DAYS } from "@/lib/config";

export const metadata = {
  title: t("faq.metaTitle"),
  description: t("faq.metaDescription"),
};

export default function FaqPage() {
  // The expiry window and donation gap come from lib/config.js, so the
  // answers never repeat a number that someone could later change.
  const items = t("faq.items", {
    hours: REQUEST_EXPIRY_HOURS,
    days: DONATION_GAP_DAYS,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("faq.title")}</h1>
      <p className="mt-2 text-gray-700">{t("faq.intro")}</p>

      {/* <details> gives keyboard and screen reader support with no JavaScript. */}
      <div className="mt-8 divide-y divide-gray-200 rounded-lg border border-gray-200">
        {items.map((item) => (
          <details key={item.question} className="group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="shrink-0 text-brand transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 leading-6 text-gray-700">{item.answer}</p>
          </details>
        ))}
      </div>

      <section className="mt-8" aria-labelledby="faq-more">
        <h2 id="faq-more" className="text-xl font-bold text-gray-900">
          {t("faq.moreTitle")}
        </h2>
        <p className="mt-2 text-sm text-gray-700">{t("faq.moreBody")}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/emergency"
            className="inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
          >
            {t("faq.emergencyLink")}
          </Link>
          <a
            href={`${t("site.repoUrl")}/discussions`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            {t("faq.githubLink")}
            <span className="sr-only"> {t("faq.opensInNewTab")}</span>
          </a>
        </div>
      </section>
    </div>
  );
}

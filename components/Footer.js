import Link from "next/link";
import { t } from "@/lib/i18n";
import { FOUNDING_YEAR } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm text-gray-600 sm:flex-row sm:justify-between">
        <p>
          &copy; {FOUNDING_YEAR} {t("site.name")} &middot; {t("site.license")}
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          <Link
            href="/emergency"
            className="font-medium text-brand hover:text-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            {t("footer.emergencyLink")}
          </Link>
          <Link
            href="/faq"
            className="font-medium text-brand hover:text-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            {t("footer.faqLink")}
          </Link>
          <a
            href={t("site.repoUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand hover:text-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            {t("footer.repoLink")}
          </a>
        </nav>
      </div>
    </footer>
  );
}

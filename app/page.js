import Link from "next/link";
import { t } from "@/lib/i18n";
import { REQUEST_EXPIRY_HOURS } from "@/lib/config";
import FeatureCard from "@/components/FeatureCard";
import AntiScamBanner from "@/components/AntiScamBanner";

export const metadata = {
  title: "RaktSetu — Privacy-first blood donor & recipient connect platform",
  description:
    "Find nearby blood banks, post verified urgent blood requests, and connect with opt-in donors through masked, in-app contact.",
};

export default function Home() {
  const features = t("home.features.items");
  const steps = t("home.howItWorks.steps", { hours: REQUEST_EXPIRY_HOURS });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-brand sm:text-5xl">
          {t("home.heroTitle")}
        </h1>
        <p className="mt-3 text-xl font-medium text-gray-800">
          {t("home.heroTagline")}
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-gray-700">
          {t("home.heroProblem")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/blood-banks"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
          >
            {features[0].title}
          </Link>
          <Link
            href="/request"
            className="rounded-md border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand-light focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            {features[1].title}
          </Link>
          <Link
            href="/donate"
            className="rounded-md border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand-light focus:outline-2 focus:outline-offset-2 focus:outline-brand"
          >
            {features[2].title}
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {t("home.features.title")}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {t("home.howItWorks.title")}
        </h2>
        <ol className="mx-auto mt-6 max-w-2xl list-decimal space-y-3 pl-6 text-gray-700">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-16 max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-bold text-gray-900">
          {t("home.privacySection.title")}
        </h2>
        <p className="mt-2 text-gray-700">{t("home.privacySection.body")}</p>
      </section>

      <section className="mx-auto mt-8 max-w-2xl">
        <AntiScamBanner
          title={t("home.antiScam.title")}
          body={t("home.antiScam.body")}
        />
      </section>

      <section className="mx-auto mt-16 max-w-2xl text-center">
        <h2 className="text-xl font-bold text-gray-900">
          {t("home.contributeSection.title")}
        </h2>
        <p className="mt-2 text-gray-700">{t("home.contributeSection.body")}</p>
        <a
          href={t("site.repoUrl")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
        >
          {t("home.contributeSection.cta")}
        </a>
      </section>
    </div>
  );
}

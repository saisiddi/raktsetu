"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { supabaseConfig, isSupabaseConfigured } from "@/lib/supabaseClient";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-brand";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-gray-700">{t("auth.comingSoon")}</p>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage(t("auth.errors.missingFields"));
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabaseConfig.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(t("auth.errors.signInFailed"));
      return;
    }
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {t("auth.signIn.title")}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {t("auth.fields.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {t("auth.fields.password")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-brand-dark">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? t("auth.signIn.submitting") : t("auth.signIn.submit")}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-700">
        {t("auth.signIn.noAccount")}{" "}
        <Link href="/sign-up" className="font-medium text-brand-dark underline">
          {t("auth.signIn.signUpLink")}
        </Link>
      </p>
    </div>
  );
}

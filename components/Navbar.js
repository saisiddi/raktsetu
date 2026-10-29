"use client";

import { useState } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/sign-in", key: "nav.signIn" },
  { href: "/blood-banks", key: "nav.bloodBanks" },
  { href: "/request", key: "nav.request" },
  { href: "/donate", key: "nav.donate" },
  { href: "/donors", key: "nav.donors" },
  { href: "/compatibility", key: "nav.compatibility" },
  { href: "/about", key: "nav.about" },
  { href: "/privacy", key: "nav.privacy" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav
        aria-label="Primary"
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3"
      >
        <Link href="/" className="text-xl font-bold text-brand">
          {t("site.name")}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-nav-links"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium focus:outline-2 focus:outline-offset-2 focus:outline-brand sm:hidden"
        >
          {open ? t("nav.close") : t("nav.menu")}
        </button>

        <ul
          id="primary-nav-links"
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 top-full z-10 w-full flex-col gap-1 border-b border-gray-200 bg-white px-4 py-2 sm:static sm:z-auto sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:border-0 sm:bg-transparent sm:p-0`}
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:text-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand"
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={t("site.repoUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md bg-brand px-3 py-2 text-center text-sm font-semibold text-white hover:bg-brand-dark focus:outline-2 focus:outline-offset-2 focus:outline-brand-dark"
            >
              {t("site.contributeCta")}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

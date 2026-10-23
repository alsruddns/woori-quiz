"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isLocale, localeNames, publishedLocales, uiMessages, type Locale } from "@/lib/i18n";
import { quizPath, quizPathForLocale, SITE_ORIGIN } from "@/lib/urls";

type Service = { id: "portal" | "calculator" | "tools" | "moneyBook" | "docs" | "quiz"; href: string };

export function SiteHeader({ locale: rawLocale, logoHref, backHref, activeService = "quiz" }: { locale: string; logoHref: string; backHref?: string; activeService?: Service["id"] }) {
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = uiMessages[locale];
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const services: Service[] = [
    { id: "portal", href: `/${locale}` },
    { id: "calculator", href: `${SITE_ORIGIN}/${locale}/calculators` },
    { id: "tools", href: `${SITE_ORIGIN}/${locale}/tools` },
    { id: "moneyBook", href: `${SITE_ORIGIN}/${locale}/money` },
    { id: "docs", href: `${SITE_ORIGIN}/${locale}/docs` },
    { id: "quiz", href: quizPath(locale) },
  ];

  function renderServices(className: string) {
    return services.map(({ id, href }) => {
      const current = id === activeService;
      const label = t[id];
      return <a key={id} href={href} className={`${className}${current ? " active" : ""}`} aria-current={current ? "page" : undefined} target={current ? undefined : "_blank"} rel={current ? undefined : "noopener noreferrer"} onClick={() => setMenuOpen(false)}>{label}</a>;
    });
  }

  return <header className="topbar">
    <Link className="brand" href={logoHref} aria-label="woori.today">
      <Image src="/_assets/quiz/woori-logo.png" alt="woori.today" width={140} height={33} priority unoptimized />
    </Link>
    <nav className="family desktop-family" aria-label={t.familySites}>{renderServices("family-link")}</nav>
    <div className="header-controls">
      {backHref && <Link className="back-link" href={backHref}>{t.back}</Link>}
      <button className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-family-nav" aria-label={menuOpen ? t.closeMenu : t.openMenu} onClick={() => setMenuOpen((open) => !open)}>
        <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
      </button>
      <label className="language-control">
        <span className="sr-only">{t.language}</span>
        <select aria-label={t.language} value={locale} onChange={(event) => router.push(quizPathForLocale(window.location.pathname, event.target.value as Locale))} className="language">
          {publishedLocales.map((code) => <option value={code} key={code}>{localeNames[code]}</option>)}
        </select>
      </label>
    </div>
    {menuOpen && <nav id="mobile-family-nav" className="mobile-family" aria-label={t.familySites}>{renderServices("mobile-family-link")}</nav>}
  </header>;
}

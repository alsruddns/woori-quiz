import { uiMessages, isLocale } from "@/lib/i18n";

export function SiteFooter({ locale: rawLocale }: { locale: string }) {
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = uiMessages[locale];
  return <footer className="footer">
    <div className="brand"><span className="brand-mark">Q</span><span>woori.quiz</span></div>
    <div>{t.footerTagline}</div>
    <nav>
      <a href="#privacy">{t.privacy}</a>
      <a href="#terms">{t.guidelines}</a>
      <a href="mailto:krdd125@gmail.com">{t.contact}</a>
    </nav>
    <small>{t.copyright}</small>
  </footer>;
}

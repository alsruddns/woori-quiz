import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeView } from "@/components/HomeView";
import { isLocale, locales, messages } from "@/lib/i18n";
import { quizAlternates, quizPath } from "@/lib/urls";
import { getListLocalizationQuality } from "@/lib/localization-quality";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const quality = getListLocalizationQuality(locale);
  const indexableLocales = locales.filter((item) => getListLocalizationQuality(item).indexable);
  return { title: `${messages[locale].title} | woori.today`, description: messages[locale].subtitle, alternates: { canonical: quizPath(locale), languages: quizAlternates(indexableLocales) }, robots: { index: quality.indexable, follow: true }, openGraph: { url: quizPath(locale), title: messages[locale].title, description: messages[locale].subtitle, type: "website" } };
}
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomeView locale={locale}/>;
}

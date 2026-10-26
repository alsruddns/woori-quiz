import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeView } from "@/components/HomeView";
import { isPublishedLocale, messages, publishedLocales } from "@/lib/i18n";
import { quizAlternates, quizPath } from "@/lib/urls";
import { getIndexableListLocales, getListLocalizationQuality } from "@/lib/localization-quality";

export const ensureStatic = "navigation";
export const generateStaticParams = () => publishedLocales.map((locale) => ({ locale }));
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isPublishedLocale(locale)) return {};
  const quality = await getListLocalizationQuality(locale);
  const indexableLocales = await getIndexableListLocales();
  return { title: messages[locale].title, description: messages[locale].subtitle, alternates: { canonical: quizPath(locale), languages: quizAlternates(indexableLocales) }, robots: { index: quality.indexable, follow: true }, openGraph: { url: quizPath(locale), title: messages[locale].title, description: messages[locale].subtitle, type: "website" } };
}
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isPublishedLocale(locale)) notFound();
  if (!(await getListLocalizationQuality(locale)).complete) notFound();
  return <HomeView locale={locale}/>;
}

import { siteMetadata } from "@/lib/site-metadata";
import { isPublishedLocale } from "@/lib/i18n";
import "../../globals.css";
import "../../navigation.css";
import "../../discovery.css";

export const metadata = siteMetadata;

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const language = isPublishedLocale(locale) ? locale : "en";
  return <html lang={language}><body>{children}</body></html>;
}

import type { Locale } from "@/lib/i18n";
import { advertisementLabel } from "@/lib/content-copy";

export function AdSlot({ locale }: { locale: Locale }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;
  return <aside className="ad-slot" aria-label={advertisementLabel[locale]} />;
}

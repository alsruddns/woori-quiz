import { siteMetadata } from "@/lib/site-metadata";
import "../globals.css";
import "../navigation.css";
import "../discovery.css";

export const metadata = siteMetadata;

export default function DefaultRootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}

import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  assetPrefix: "/_assets/quiz",
  // Legacy paths only redirect to the locale-first public URL. App links and SEO use quizPath.
  async redirects() {
    return [
      { source: "/quiz/:locale", destination: "/:locale/quiz", permanent: true },
      { source: "/quiz/:locale/quiz/:slug", destination: "/:locale/quiz/:slug", permanent: true },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};
export default nextConfig;

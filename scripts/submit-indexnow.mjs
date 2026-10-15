const siteOrigin = process.env.INDEXNOW_SITE_ORIGIN ?? "https://www.woori.today";
const sitemapUrl = process.env.INDEXNOW_SITEMAP_URL ?? `${siteOrigin}/quiz-sitemap.xml`;
const endpoint = "https://api.indexnow.org/IndexNow";

async function readSitemapUrls() {
  const response = await fetch(sitemapUrl);
  if (!response.ok) throw new Error(`Could not load sitemap: HTTP ${response.status}`);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url.trim());
  if (!urls.length) throw new Error("The sitemap contains no URLs.");
  if (urls.some((url) => !/^https:\/\/www\.woori\.today\/(?:[a-z]{2}(?:-[a-z]{2})?\/quiz)(?:\/[^/]+)?$/.test(url))) {
    throw new Error("The sitemap contains a URL outside the locale-first quiz routes.");
  }
  return [...new Set(urls)];
}

const urlList = await readSitemapUrls();
if (process.env.INDEXNOW_DRY_RUN === "true") {
  console.log(JSON.stringify({ urlCount: urlList.length, urlList }, null, 2));
} else {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) throw new Error("INDEXNOW_KEY is required unless INDEXNOW_DRY_RUN=true.");
  const keyLocation = `${siteOrigin}/${key}.txt`;
  const keyResponse = await fetch(keyLocation);
  if (!keyResponse.ok || (await keyResponse.text()).trim() !== key) {
    throw new Error("IndexNow key file is not reachable or does not match INDEXNOW_KEY.");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(siteOrigin).host, key, keyLocation, urlList }),
  });
  if (!response.ok) throw new Error(`IndexNow submission failed: HTTP ${response.status}`);
  console.log(`Submitted ${urlList.length} locale-first URLs to IndexNow.`);
}

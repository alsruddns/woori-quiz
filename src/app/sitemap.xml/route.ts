import { NextResponse } from "next/server";
import { locales } from "../../lib/i18n";
import { quizzes } from "../../lib/registry";
import { quizUrl } from "../../lib/urls";

export function GET() {
  const publicQuizzes = quizzes.filter((quiz) => quiz.isPublic);
  const urls = [
    ...locales.map((locale) => quizUrl(locale)),
    ...locales.flatMap((locale) => publicQuizzes.map((quiz) => quizUrl(locale, quiz.slug))),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

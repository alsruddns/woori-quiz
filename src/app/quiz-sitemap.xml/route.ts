import { NextResponse } from "next/server";
import { locales } from "../../lib/i18n";
import { quizzes } from "../../lib/registry";
export function GET(){const base="https://woori.today/quiz";const urls=[...locales.map(locale=>`${base}/${locale}`),...locales.flatMap(locale=>quizzes.filter(q=>q.isPublic).map(q=>`${base}/${locale}/quiz/${q.slug}`))];const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url}</loc></url>`).join("")}</urlset>`;return new NextResponse(xml,{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600"}});}


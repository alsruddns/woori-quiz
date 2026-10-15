import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeView } from "@/components/HomeView";
import { isLocale, locales, messages } from "@/lib/i18n";
export const generateStaticParams=()=>locales.map(locale=>({locale}));
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return {};return {title:`${messages[locale].title} | woori.today`,description:messages[locale].subtitle,alternates:{canonical:`/quiz/${locale}`}};}
export default async function LocaleHome({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <HomeView locale={locale}/>;}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizView } from "@/components/QuizView";
import { getQuiz, quizzes } from "@/lib/registry";
import { isLocale, locales } from "@/lib/i18n";
import { quizAlternates, quizPath } from "@/lib/urls";
import { quizSeoCopy } from "@/lib/quiz-copy";
type Props={params:Promise<{locale:string;slug:string}>};
export function generateStaticParams(){return locales.flatMap(locale=>quizzes.filter(q=>q.isPublic).map(q=>({locale,slug:q.slug})));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale,slug}=await params;if(!isLocale(locale))return {};const quiz=getQuiz(slug);if(!quiz)return {};const seo=quizSeoCopy(locale,quiz);return {title:{absolute:seo.title},description:seo.description,alternates:{canonical:quizPath(locale,slug),languages:quizAlternates(locales,slug)},openGraph:{url:quizPath(locale,slug),title:seo.title,description:seo.description,type:"website"}};}
export default async function QuizPage({params}:Props){const {locale,slug}=await params;if(!isLocale(locale)||!getQuiz(slug))notFound();return <QuizView locale={locale} slug={slug}/>;}

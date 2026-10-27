import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { QuizView } from "@/components/QuizView";
import { getQuiz, quizzes } from "@/lib/registry";
import { isPublishedLocale, publishedLocales } from "@/lib/i18n";
import { quizAlternates, quizPath } from "@/lib/urls";
import { quizSeoCopy } from "@/lib/quiz-copy";
import { getIndexableQuizLocales, getQuizLocalizationQuality } from "@/lib/localization-quality";
import { loadLocaleCatalogForServer } from "@/lib/locale-catalog";
import { QuizLearningCards } from "@/components/QuizLearningCards";
export const ensureStatic = "navigation";
type Props={params:Promise<{locale:string;slug:string}>};
export function generateStaticParams(){return publishedLocales.flatMap(locale=>quizzes.filter(q=>q.isPublic).map(q=>({locale,slug:q.slug})));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale,slug}=await params;if(!isPublishedLocale(locale))return {robots:{index:false,follow:false}};await loadLocaleCatalogForServer(locale);const quiz=getQuiz(slug);if(!quiz)return {};const [seo,quality,indexableLocales]=await Promise.all([Promise.resolve(quizSeoCopy(locale,quiz)),getQuizLocalizationQuality(locale,quiz),getIndexableQuizLocales(slug)]);return {title:{absolute:seo.title},description:seo.description,alternates:{canonical:quizPath(locale,slug),languages:quizAlternates(indexableLocales,slug)},robots:{index:quality.indexable,follow:true},openGraph:{url:quizPath(locale,slug),title:seo.title,description:seo.description,type:"website"}};}
export default function QuizPage({params}:Props){return <Suspense fallback={<main className="quiz-route-pending" aria-busy="true"/>}><QuizPageContent params={params}/></Suspense>;}
async function QuizPageContent({params}:Props){const {locale,slug}=await params;const quiz=getQuiz(slug);if(!isPublishedLocale(locale)||!quiz)notFound();if(!(await getQuizLocalizationQuality(locale,quiz)).complete)notFound();return <QuizView locale={locale} slug={slug} learningContent={<QuizLearningCards locale={locale} quiz={quiz}/>}/>;}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizView } from "@/components/QuizView";
import { getQuiz, quizzes } from "@/lib/registry";
import { isLocale, locales } from "@/lib/i18n";
type Props={params:Promise<{locale:string;slug:string}>};
export function generateStaticParams(){return locales.flatMap(locale=>quizzes.filter(q=>q.isPublic).map(q=>({locale,slug:q.slug})));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale,slug}=await params;if(!isLocale(locale))return {};const quiz=getQuiz(slug);if(!quiz)return {};return {title:`${quiz.title} | woori.today Quiz`,description:quiz.summary,alternates:{canonical:`/quiz/${locale}/quiz/${slug}`},openGraph:{title:quiz.title,description:quiz.summary,type:"website"}};}
export default async function QuizPage({params}:Props){const {locale,slug}=await params;if(!isLocale(locale)||!getQuiz(slug))notFound();return <QuizView locale={locale} slug={slug}/>;}

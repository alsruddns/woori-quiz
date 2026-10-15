import type { Locale } from "../../i18n";
import type { QuestionLocaleCopy, QuizQuestion } from "../types";

const regionCodes = [
  "BE","EG","CA","AU","BR","AR","CL","PE","MX","CU",
  "FR","DE","DK","ES","PT","NO","SE","FI","PL","GR",
  "KE","ET","GH","MA","NG","TH","VN","ID","NP","MN",
  "NZ","IE","AT","CZ","HU","RO","IS","TR","PK","BD",
] as const;

export type GeographyPhrases = {
  capital: (country: string) => string;
  capitalWhy: (city: string, country: string) => string;
};

export function capitalCopy(question: QuizQuestion, locale: Locale, phrases: GeographyPhrases): QuestionLocaleCopy | undefined {
  const match = /^geography-x-capital-(\d+)$/.exec(question.id);
  if (!match) return undefined;
  const index = Number(match[1]) - 1;
  const region = regionCodes[index];
  if (!region) throw new Error(`Unknown capital question: ${question.id}`);
  const country = new Intl.DisplayNames([locale], { type: "region" }).of(region);
  if (!country) throw new Error(`Unknown region: ${region}`);
  const city = question.options[question.answer];
  return {
    question: phrases.capital(country), options: [...question.options],
    explanation: phrases.capitalWhy(city, country),
  };
}

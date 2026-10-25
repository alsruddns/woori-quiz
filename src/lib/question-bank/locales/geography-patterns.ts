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

export type FeaturePhrases = {
  names: readonly string[];
  question: (name: string) => string;
  explanation: (name: string, continent: string) => string;
};

const continentCodes: Record<string, string> = {
  Africa: "002", Asia: "142", Europe: "150", "North America": "021",
  "South America": "005", Australia: "AU", Antarctica: "AQ",
};

const stableContinentNames: Partial<Record<Locale, Record<string, string>>> = {
  zh: { Africa: "非洲", Asia: "亚洲", Europe: "欧洲", "North America": "北美洲", "South America": "南美洲", Australia: "澳大利亚", Antarctica: "南极洲" },
  "zh-tw": { Africa: "非洲", Asia: "亞洲", Europe: "歐洲", "North America": "北美洲", "South America": "南美洲", Australia: "澳大利亞", Antarctica: "南極洲" },
};

export function localizedContinentName(option: string, locale: Locale, labels: Pick<Intl.DisplayNames, "of">): string {
  const code = continentCodes[option];
  if (!code) return option;
  const label = labels.of(code);
  // Some Intl implementations return the unknown region code itself. Never render
  // the internal M.49 identifier as quiz copy; use a stable human-readable label.
  if (label && label !== code && !/^\d{3}$/.test(label)) return label;
  return stableContinentNames[locale]?.[option] ?? option;
}

export function featureCopy(question: QuizQuestion, locale: Locale, phrases: FeaturePhrases): QuestionLocaleCopy | undefined {
  const match = /^geography-x-feature-(\d+)$/.exec(question.id);
  if (!match) return undefined;
  const index = Number(match[1]) - 1;
  const name = phrases.names[index];
  if (!name || phrases.names.length !== 10) throw new Error(`Invalid feature: ${question.id}`);
  const labels = new Intl.DisplayNames([locale], { type: "region" });
  const options = question.options.map((option) => localizedContinentName(option, locale, labels));
  return { question: phrases.question(name), options, explanation: phrases.explanation(name, options[question.answer]) };
}

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

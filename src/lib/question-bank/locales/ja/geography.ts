import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country}の首都はどこですか？`, capitalWhy: (city,country) => `${country}の首都は${city}です。` };

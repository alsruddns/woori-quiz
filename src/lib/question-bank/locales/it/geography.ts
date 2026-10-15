import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Qual è la capitale di ${country}?`, capitalWhy: (city,country) => `${city} è la capitale di ${country}.` };

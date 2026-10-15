import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Qual é a capital de ${country}?`, capitalWhy: (city,country) => `${city} é a capital de ${country}.` };

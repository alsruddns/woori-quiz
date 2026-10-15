import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Apa ibu kota ${country}?`, capitalWhy: (city,country) => `${city} adalah ibu kota ${country}.` };

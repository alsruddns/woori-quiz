import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Was ist die Hauptstadt von ${country}?`, capitalWhy: (city,country) => `${city} ist die Hauptstadt von ${country}.` };

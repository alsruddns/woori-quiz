import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Thủ đô của ${country} là gì?`, capitalWhy: (city,country) => `${city} là thủ đô của ${country}.` };

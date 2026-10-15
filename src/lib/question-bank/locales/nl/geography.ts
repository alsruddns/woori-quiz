import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Wat is de hoofdstad van ${country}?`, capitalWhy: (city,country) => `${city} is de hoofdstad van ${country}.` };

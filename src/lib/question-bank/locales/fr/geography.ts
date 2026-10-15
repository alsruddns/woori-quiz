import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Quelle est la capitale de ${country} ?`, capitalWhy: (city,country) => `${city} est la capitale de ${country}.` };

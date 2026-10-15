import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `¿Cuál es la capital de ${country}?`, capitalWhy: (city,country) => `${city} es la capital de ${country}.` };

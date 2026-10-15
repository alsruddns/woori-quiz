import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country} की राजधानी क्या है?`, capitalWhy: (city,country) => `${city}, ${country} की राजधानी है।` };

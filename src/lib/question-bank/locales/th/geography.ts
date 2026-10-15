import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `เมืองหลวงของ${country}คือเมืองใด?`, capitalWhy: (city,country) => `${city}เป็นเมืองหลวงของ${country}` };

import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country}的首都是哪裡？`, capitalWhy: (city,country) => `${country}的首都是${city}。` };

import type { GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country}의 수도는 어디인가요?`, capitalWhy: (city,country) => `${country}의 수도는 ${city}입니다.` };

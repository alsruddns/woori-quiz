import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country}의 수도는 어디인가요?`, capitalWhy: (city,country) => `${country}의 수도는 ${city}입니다.` };
export const featurePhrases: FeaturePhrases = {
  names: ["사하라 사막","안데스 산맥","알프스 산맥","그레이트 배리어 리프","아마존강","도나우강","나일강","고비 사막","바이칼호","로키 산맥"],
  question: (name) => `${name}은 주로 어느 대륙에 있나요?`, explanation: (name,continent) => `${name}은 주로 ${continent}에 있습니다.`,
};

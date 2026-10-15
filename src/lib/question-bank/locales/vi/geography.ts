import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Thủ đô của ${country} là gì?`, capitalWhy: (city,country) => `${city} là thủ đô của ${country}.` };
export const featurePhrases: FeaturePhrases = {
  names: ["sa mạc Sahara","dãy Andes","dãy Alps","Rạn san hô Great Barrier","sông Amazon","sông Danube","sông Nile","sa mạc Gobi","hồ Baikal","dãy Rocky"],
  question: (name) => `${name} chủ yếu nằm ở châu lục nào?`, explanation: (name,continent) => `${name} chủ yếu nằm ở ${continent}.`,
};

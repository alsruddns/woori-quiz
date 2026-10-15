import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Quelle est la capitale de ${country} ?`, capitalWhy: (city,country) => `${city} est la capitale de ${country}.` };
export const featurePhrases: FeaturePhrases = {
  names: ["le désert du Sahara","les Andes","les Alpes","la Grande Barrière de corail","le fleuve Amazone","le Danube","le Nil","le désert de Gobi","le lac Baïkal","les montagnes Rocheuses"],
  question: (name) => `Sur quel continent se trouve principalement ${name} ?`, explanation: (name,continent) => `${name} se trouve principalement en ${continent}.`,
};

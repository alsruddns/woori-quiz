import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Qual é a capital de ${country}?`, capitalWhy: (city,country) => `${city} é a capital de ${country}.` };
export const featurePhrases: FeaturePhrases = {
  names: ["o deserto do Saara","a Cordilheira dos Andes","os Alpes","a Grande Barreira de Corais","o rio Amazonas","o rio Danúbio","o rio Nilo","o deserto de Gobi","o lago Baikal","as Montanhas Rochosas"],
  question: (name) => `Em qual continente fica principalmente ${name}?`, explanation: (name,continent) => `${name} fica principalmente em ${continent}.`,
};

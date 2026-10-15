import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Wat is de hoofdstad van ${country}?`, capitalWhy: (city,country) => `${city} is de hoofdstad van ${country}.` };
export const featurePhrases: FeaturePhrases = {
  names: ["de Sahara","de Andes","de Alpen","het Groot Barrièrerif","de Amazone","de Donau","de Nijl","de Gobiwoestijn","het Baikalmeer","de Rocky Mountains"],
  question: (name) => `Op welk continent ligt ${name} hoofdzakelijk?`, explanation: (name,continent) => `${name} ligt hoofdzakelijk in ${continent}.`,
};

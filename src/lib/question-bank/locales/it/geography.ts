import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Qual è la capitale di ${country}?`, capitalWhy: (city,country) => `${city} è la capitale di ${country}.` };
export const featurePhrases: FeaturePhrases = {
  names: ["il deserto del Sahara","le Ande","le Alpi","la Grande Barriera Corallina","il Rio delle Amazzoni","il Danubio","il Nilo","il deserto del Gobi","il lago Bajkal","le Montagne Rocciose"],
  question: (name) => `In quale continente si trova principalmente ${name}?`, explanation: (name,continent) => `${name} si trova principalmente in ${continent}.`,
};

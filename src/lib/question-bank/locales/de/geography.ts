import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Was ist die Hauptstadt von ${country}?`, capitalWhy: (city,country) => `${city} ist die Hauptstadt von ${country}.` };
export const featurePhrases: FeaturePhrases = {
  names: ["die Sahara","die Anden","die Alpen","das Great Barrier Reef","der Amazonas","die Donau","der Nil","die Wüste Gobi","der Baikalsee","die Rocky Mountains"],
  question: (name) => `Auf welchem Kontinent liegt ${name} hauptsächlich?`, explanation: (name,continent) => `${name} liegt hauptsächlich in ${continent}.`,
};

import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `¿Cuál es la capital de ${country}?`, capitalWhy: (city,country) => `${city} es la capital de ${country}.` };
export const featurePhrases: FeaturePhrases = {
  names: ["el desierto del Sahara","los Andes","los Alpes","la Gran Barrera de Coral","el río Amazonas","el río Danubio","el río Nilo","el desierto de Gobi","el lago Baikal","las Montañas Rocosas"],
  question: (name) => `¿En qué continente se encuentra principalmente ${name}?`, explanation: (name,continent) => `${name} se encuentra principalmente en ${continent}.`,
};

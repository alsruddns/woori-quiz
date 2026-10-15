import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `Apa ibu kota ${country}?`, capitalWhy: (city,country) => `${city} adalah ibu kota ${country}.` };
export const featurePhrases: FeaturePhrases = {
  names: ["Gurun Sahara","Pegunungan Andes","Pegunungan Alpen","Terumbu Karang Penghalang Besar","Sungai Amazon","Sungai Donau","Sungai Nil","Gurun Gobi","Danau Baikal","Pegunungan Rocky"],
  question: (name) => `Di benua manakah ${name} terutama berada?`, explanation: (name,continent) => `${name} terutama berada di ${continent}.`,
};

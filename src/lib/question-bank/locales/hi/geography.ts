import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country} की राजधानी क्या है?`, capitalWhy: (city,country) => `${city}, ${country} की राजधानी है।` };
export const featurePhrases: FeaturePhrases = {
  names: ["सहारा मरुस्थल","एंडीज पर्वतमाला","आल्प्स पर्वतमाला","ग्रेट बैरियर रीफ","अमेज़न नदी","डेन्यूब नदी","नील नदी","गोबी मरुस्थल","बैकाल झील","रॉकी पर्वतमाला"],
  question: (name) => `${name} मुख्यतः किस महाद्वीप में है?`, explanation: (name,continent) => `${name} मुख्यतः ${continent} में है।`,
};

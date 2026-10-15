import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country}的首都是哪裡？`, capitalWhy: (city,country) => `${country}的首都是${city}。` };
export const featurePhrases: FeaturePhrases = {
  names: ["撒哈拉沙漠","安地斯山脈","阿爾卑斯山脈","大堡礁","亞馬遜河","多瑙河","尼羅河","戈壁沙漠","貝加爾湖","洛磯山脈"],
  question: (name) => `${name}主要位於哪個洲？`, explanation: (name,continent) => `${name}主要位於${continent}。`,
};

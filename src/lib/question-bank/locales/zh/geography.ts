import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country}的首都是哪里？`, capitalWhy: (city,country) => `${country}的首都是${city}。` };
export const featurePhrases: FeaturePhrases = {
  names: ["撒哈拉沙漠","安第斯山脉","阿尔卑斯山脉","大堡礁","亚马孙河","多瑙河","尼罗河","戈壁沙漠","贝加尔湖","落基山脉"],
  question: (name) => `${name}主要位于哪个大洲？`, explanation: (name,continent) => `${name}主要位于${continent}。`,
};

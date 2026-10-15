import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `${country}の首都はどこですか？`, capitalWhy: (city,country) => `${country}の首都は${city}です。` };
export const featurePhrases: FeaturePhrases = {
  names: ["サハラ砂漠","アンデス山脈","アルプス山脈","グレートバリアリーフ","アマゾン川","ドナウ川","ナイル川","ゴビ砂漠","バイカル湖","ロッキー山脈"],
  question: (name) => `${name}は主にどの大陸にありますか？`, explanation: (name,continent) => `${name}は主に${continent}にあります。`,
};

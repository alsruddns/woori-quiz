import type { FeaturePhrases, GeographyPhrases } from "../geography-patterns";
export const phrases: GeographyPhrases = { capital: (country) => `เมืองหลวงของ${country}คือเมืองใด?`, capitalWhy: (city,country) => `${city}เป็นเมืองหลวงของ${country}` };
export const featurePhrases: FeaturePhrases = {
  names: ["ทะเลทรายสะฮารา","เทือกเขาแอนดีส","เทือกเขาแอลป์","เกรตแบร์ริเออร์รีฟ","แม่น้ำแอมะซอน","แม่น้ำดานูบ","แม่น้ำไนล์","ทะเลทรายโกบี","ทะเลสาบไบคาล","เทือกเขาร็อกกี"],
  question: (name) => `${name} อยู่ในทวีปใดเป็นหลัก?`, explanation: (name,continent) => `${name} อยู่ใน${continent}เป็นหลัก`,
};

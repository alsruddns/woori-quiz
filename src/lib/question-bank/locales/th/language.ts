import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `คำภาษาอังกฤษ “${word}” หมายความว่าอย่างไร?`, explanation: (word, meaning) => `“${word}” หมายถึง “${meaning}”` };

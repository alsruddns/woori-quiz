import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `英语单词“${word}”是什么意思？`, explanation: (word, meaning) => `“${word}”的意思是“${meaning}”。` };

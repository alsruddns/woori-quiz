import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `英文單字「${word}」是什麼意思？`, explanation: (word, meaning) => `「${word}」的意思是「${meaning}」。` };

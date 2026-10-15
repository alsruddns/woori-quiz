import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `Từ tiếng Anh “${word}” có nghĩa là gì?`, explanation: (word, meaning) => `“${word}” có nghĩa là “${meaning}”.` };

import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `O que significa a palavra inglesa “${word}”?`, explanation: (word, meaning) => `“${word}” significa “${meaning}”.` };

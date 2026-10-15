import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `Was bedeutet das englische Wort „${word}“?`, explanation: (word, meaning) => `„${word}“ bedeutet „${meaning}“.` };

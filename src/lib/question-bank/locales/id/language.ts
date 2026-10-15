import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `Apa arti kata bahasa Inggris “${word}”?`, explanation: (word, meaning) => `“${word}” berarti “${meaning}”.` };

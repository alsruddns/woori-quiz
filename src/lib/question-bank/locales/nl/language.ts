import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `Wat betekent het Engelse woord ‘${word}’?`, explanation: (word, meaning) => `‘${word}’ betekent ‘${meaning}’.` };

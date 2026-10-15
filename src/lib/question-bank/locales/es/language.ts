import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `¿Qué significa la palabra inglesa «${word}»?`, explanation: (word, meaning) => `«${word}» significa «${meaning}».` };

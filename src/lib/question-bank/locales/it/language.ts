import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `Che cosa significa la parola inglese «${word}»?`, explanation: (word, meaning) => `«${word}» significa «${meaning}».` };

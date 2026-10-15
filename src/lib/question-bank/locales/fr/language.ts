import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `Que signifie le mot anglais « ${word} » ?`, explanation: (word, meaning) => `« ${word} » signifie « ${meaning} ».` };

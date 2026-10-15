import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `अंग्रेज़ी शब्द “${word}” का अर्थ क्या है?`, explanation: (word, meaning) => `“${word}” का अर्थ “${meaning}” है।` };

import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `英単語「${word}」の意味は何ですか？`, explanation: (word, meaning) => `「${word}」の意味は「${meaning}」です。` };

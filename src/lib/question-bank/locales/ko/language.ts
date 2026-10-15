import type { VocabularyPhrases } from "../language-patterns";
export const phrases: VocabularyPhrases = { prompt: (word) => `영어 단어 “${word}”의 뜻은 무엇인가요?`, explanation: (word, meaning) => `“${word}”의 뜻은 “${meaning}”입니다.` };

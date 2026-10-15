import type { QuestionLocaleCopy, QuizQuestion } from "../types";

export type VocabularyPhrases = {
  prompt: (word: string) => string;
  explanation: (word: string, meaning: string) => string;
};

/** English words and English definition choices are the material being tested. */
export function vocabularyCopy(question: QuizQuestion, phrases: VocabularyPhrases): QuestionLocaleCopy | undefined {
  if (!/^language-x-vocab-\d+$/.test(question.id)) return undefined;
  const word = /“([^”]+)”/.exec(question.question)?.[1];
  if (!word) throw new Error(`Invalid vocabulary question: ${question.id}`);
  return {
    question: phrases.prompt(word),
    options: [...question.options],
    explanation: phrases.explanation(word, question.options[question.answer]),
  };
}

import type { QuestionLocaleCopy, QuizQuestion } from "../types";

export type BrainPhrases = {
  prompt: (terms: string) => string;
  explanation: [string, string, string, string, string];
};

export function brainPatternCopy(question: QuizQuestion, phrases: BrainPhrases): QuestionLocaleCopy | undefined {
  const match = /^brain-x-pattern-(\d+)$/.exec(question.id);
  if (!match) return undefined;
  const index = Number(match[1]) - 1;
  const terms = question.question.match(/\d+(?:, \d+){3}/)?.[0];
  if (!terms || index < 0 || index >= 60) throw new Error(`Invalid brain pattern: ${question.id}`);
  return {
    question: phrases.prompt(terms),
    options: [...question.options],
    explanation: phrases.explanation[Math.floor(index / 12)],
  };
}

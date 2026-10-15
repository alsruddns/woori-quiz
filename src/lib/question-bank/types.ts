import type { Difficulty } from "../registry";

export type QuestionLocaleCopy = { question: string; options: string[]; explanation: string };
export type QuizQuestion = {
  id: string;
  category: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  tags?: string[];
  localizations?: Partial<Record<import("../i18n").Locale, QuestionLocaleCopy>>;
};

export function makeQuestion(
  id: string, category: string, difficulty: Difficulty, question: string,
  answerText: string, distractors: readonly string[], explanation: string,
  tags: readonly string[] = [category],
): QuizQuestion {
  const options = [answerText, ...distractors].slice(0, 4);
  return { id, category, difficulty, question, options, answer: 0, explanation, tags: [...tags] };
}

export function seededDistractors(correct: string, candidates: readonly string[], count = 3): string[] {
  return [...new Set(candidates)].filter((value) => value !== correct).slice(0, count);
}

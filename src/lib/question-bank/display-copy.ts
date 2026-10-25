import type { QuizQuestion } from "./types";

/** Resolve display strings independently from the numeric answer index. */
export function resolveQuestionCopy(question: QuizQuestion, locale: string): Pick<QuizQuestion, "question" | "options" | "explanation"> {
  const copy = question.localizations?.[locale as keyof NonNullable<QuizQuestion["localizations"]>];
  if (!copy) return question;
  const codeLike = (value: string, source: string) => /^\d{1,6}$/.test(value.trim()) && value.trim() !== source.trim();
  const validOptions = Array.isArray(copy.options) && copy.options.length === question.options.length && copy.options.every((value, index) =>
    typeof value === "string" && value.trim().length > 0 && !codeLike(value, question.options[index] ?? ""));
  return {
    question: typeof copy.question === "string" && copy.question.trim() && !codeLike(copy.question, question.question) ? copy.question : question.question,
    options: validOptions ? copy.options : question.options,
    explanation: typeof copy.explanation === "string" && copy.explanation.trim() && !codeLike(copy.explanation, question.explanation) ? copy.explanation : question.explanation,
  };
}

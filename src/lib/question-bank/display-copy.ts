import type { QuizQuestion } from "./types";

/** Resolve display strings independently from the numeric answer index. */
export function resolveQuestionCopy(question: QuizQuestion, locale: string): Pick<QuizQuestion, "question" | "options" | "explanation"> {
  const copy = question.localizations?.[locale as keyof NonNullable<QuizQuestion["localizations"]>];
  if (!copy) return question;
  const hasUnresolvedGeographyCode = (value: string) => question.id.startsWith("geography-x-feature-") && /(?:^|\D)(?:002|005|021|142|150)(?:$|\D)/.test(value);
  const validOptions = Array.isArray(copy.options) && copy.options.length === question.options.length && copy.options.every((value) =>
    typeof value === "string" && value.trim().length > 0 && !hasUnresolvedGeographyCode(value));
  return {
    question: typeof copy.question === "string" && copy.question.trim() && !hasUnresolvedGeographyCode(copy.question) ? copy.question : question.question,
    options: validOptions ? copy.options : question.options,
    explanation: typeof copy.explanation === "string" && copy.explanation.trim() && !hasUnresolvedGeographyCode(copy.explanation) ? copy.explanation : question.explanation,
  };
}

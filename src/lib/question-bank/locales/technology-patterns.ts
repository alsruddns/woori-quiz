import type { QuestionLocaleCopy, QuizQuestion } from "../types";

export type TechnologyPhrases = {
  meanings: readonly string[];
  prompt: (term: string) => string;
  explanation: (term: string, meaning: string) => string;
};

export function technologyCopy(
  question: QuizQuestion, source: readonly QuizQuestion[], phrases: TechnologyPhrases,
): QuestionLocaleCopy | undefined {
  if (!/^it-x-concept-\d+$/.test(question.id)) return undefined;
  const originals = source.filter((item) => /^it-x-concept-\d+$/.test(item.id));
  const answerToIndex = new Map(originals.map((item) => [item.options[item.answer], Number(item.id.split("-").at(-1)) - 1]));
  if (phrases.meanings.length !== 40 || answerToIndex.size !== 40) throw new Error("Invalid technology meanings");
  const term = question.question.replace(/^What is the primary purpose or meaning of /, "").replace(/\?$/, "");
  const options = question.options.map((option) => {
    const index = answerToIndex.get(option);
    if (index === undefined) throw new Error(`Unknown technology choice: ${option}`);
    return phrases.meanings[index];
  });
  const answer = options[question.answer];
  return { question: phrases.prompt(term), options, explanation: phrases.explanation(term, answer) };
}

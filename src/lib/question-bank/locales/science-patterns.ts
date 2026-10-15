import type { QuestionLocaleCopy, QuizQuestion } from "../types";

export type SciencePhrases = { answers: readonly string[]; facts: readonly string[] };

/** Each localized fact contains one blank; filling it forms the explanation. */
export function scienceCopy(question: QuizQuestion, source: readonly QuizQuestion[], phrases: SciencePhrases): QuestionLocaleCopy | undefined {
  const match = /^science-x-(\d+)$/.exec(question.id);
  if (!match) return undefined;
  const index = Number(match[1]) - 1;
  if (phrases.answers.length !== 40 || phrases.facts.length !== 40) throw new Error("Invalid science copy coverage");
  const originals = source.filter((item) => /^science-x-\d+$/.test(item.id));
  const answerToIndex = new Map(originals.map((item) => [item.options[item.answer], Number(item.id.split("-").at(-1)) - 1]));
  if (answerToIndex.size !== 40) throw new Error("Invalid science answer set");
  const options = question.options.map((option) => {
    const answerIndex = answerToIndex.get(option);
    if (answerIndex === undefined) throw new Error(`Unknown science choice: ${option}`);
    return phrases.answers[answerIndex];
  });
  const fact = phrases.facts[index];
  if (!fact || !fact.includes("___")) throw new Error(`Missing science fact: ${question.id}`);
  return { question: fact, options, explanation: fact.replace("___", options[question.answer]) };
}

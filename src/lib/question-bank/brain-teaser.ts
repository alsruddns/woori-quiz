import type { QuizQuestion } from "./types";

const puzzles: Array<[number[], number, string]> = [];
// Each item is a different rule family or parameterization; answer values are calculated below.
for (let n = 1; n <= 12; n++) puzzles.push([[n, n + 3, n + 6, n + 9], n + 12, "Each term increases by 3."]);
for (let n = 2; n <= 13; n++) puzzles.push([[n, n * 2, n * 4, n * 8], n * 16, "Each term doubles the previous term."]);
for (let n = 1; n <= 12; n++) puzzles.push([[n * n, (n + 1) ** 2, (n + 2) ** 2, (n + 3) ** 2], (n + 4) ** 2, "The sequence contains consecutive square numbers."]);
for (let n = 1; n <= 12; n++) puzzles.push([[n, n + 2, n + 6, n + 12], n + 20, "The increments are consecutive even numbers: +2, +4, +6, then +8."]);
for (let n = 1; n <= 12; n++) puzzles.push([[n, n * 2 + 1, n * 4 + 2, n * 8 + 5], n * 16 + 10, "Each term doubles the previous term and adds 1, then 0 alternately."]);
export const brainQuestions: QuizQuestion[] = puzzles.map(([terms, answer, explanation], i) => {
  const prompt = `What number comes next: ${terms.join(", ")}, __?`;
  const distractors = [...new Set([answer - 2, answer - 1, answer + 1, answer + 2, answer * 2])].filter((x) => x !== answer).slice(0, 3).map(String);
  return { id: `brain-x-pattern-${i + 1}`, category: "brain", difficulty: i % 10 < 3 ? "easy" : i % 10 < 7 ? "medium" : i % 10 < 9 ? "hard" : "expert", question: prompt, options: [String(answer), ...distractors], answer: 0, explanation, tags: ["brain", "number-pattern"] };
});

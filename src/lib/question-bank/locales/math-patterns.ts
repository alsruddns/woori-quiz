import type { QuestionLocaleCopy, QuizQuestion } from "../types";

export type MathPhrases = {
  sum: (a: number, b: number) => string;
  sumWhy?: (a: number, b: number, answer: number) => string;
  product: (a: number, b: number) => string;
  productWhy?: (a: number, b: number, answer: number) => string;
  equation: (a: number, b: number, c: number) => string;
  equationWhy: (a: number, b: number, answer: number) => string;
  percent: (percent: number, amount: number) => string;
  percentWhy: (amount: number, percent: number, answer: number) => string;
  sequence: (terms: string) => string;
  sequenceWhy: (factor: number, answer: number) => string;
  combination: (count: number) => string;
  combinationWhy: (count: number, answer: number) => string;
};

/** The generated math questions use numeric options, so only their prose changes. */
export function mathPatternCopy(question: QuizQuestion, phrases: MathPhrases): QuestionLocaleCopy | undefined {
  const match = /^math-x-(sum|product|equation|percent|sequence-square|combination)-(\d+)$/.exec(question.id);
  if (!match) return undefined;
  const [, kind, rawIndex] = match;
  const i = Number(rawIndex);
  let prompt: string;
  let explanation: string;
  if (kind === "sum") {
    const a = 11 + i * 3, b = 7 + i;
    prompt = phrases.sum(a, b);
    explanation = phrases.sumWhy?.(a, b, a + b) ?? `${a} + ${b} = ${a + b}.`;
  } else if (kind === "product") {
    const a = i + 6, b = i + 4;
    prompt = phrases.product(a, b);
    explanation = phrases.productWhy?.(a, b, a * b) ?? `${a} × ${b} = ${a * b}.`;
  } else if (kind === "equation") {
    const a = i + 2, b = i, c = a * (i + 3) + b;
    prompt = phrases.equation(a, b, c);
    explanation = phrases.equationWhy(a, b, i + 3);
  } else if (kind === "percent") {
    const n = i + 2;
    prompt = phrases.percent(n * 5, n * 20);
    explanation = phrases.percentWhy(n * 20, n * 5, n * n);
  } else if (kind === "sequence-square") {
    const n = i + 3;
    prompt = phrases.sequence([1, 4, 9, 16].map((x) => x * n).join(", "));
    explanation = phrases.sequenceWhy(n, 25 * n);
  } else {
    const n = i + 3;
    prompt = phrases.combination(n);
    explanation = phrases.combinationWhy(n, n * (n - 1) / 2);
  }
  return { question: prompt, options: [...question.options], explanation };
}

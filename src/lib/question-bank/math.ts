import { makeQuestion, seededDistractors, type QuizQuestion } from "./types";

const out: QuizQuestion[] = [];
const add = (id: string, difficulty: QuizQuestion["difficulty"], prompt: string, value: number, why: string, pool: number[]) => {
  const answer = String(value);
  const distractors = seededDistractors(answer, pool.map(String));
  while (distractors.length < 3) distractors.push(String(value + distractors.length + 1));
  const tag = id.startsWith("sum-") || id.startsWith("product-") ? "arithmetic"
    : id.startsWith("sequence-") ? "sequence"
      : id.startsWith("combination-") ? "combinations" : "equations";
  out.push(makeQuestion(`math-x-${id}`, "math", difficulty, prompt, answer, distractors, why, ["math", tag]));
};

// Arithmetic is generated from checked integer operations, not hand-entered answer keys.
for (let i = 1; i <= 24; i++) {
  const a = 11 + i * 3, b = 7 + i;
  add(`sum-${i}`, i % 4 === 0 ? "medium" : "easy", `What is ${a} + ${b}?`, a + b,
    `${a} + ${b} = ${a + b}.`, [a + b - 1, a + b + 1, a + b + 10, a - b]);
  add(`product-${i}`, i % 3 === 0 ? "hard" : "medium", `What is ${i + 6} × ${i + 4}?`, (i + 6) * (i + 4),
    `${i + 6} × ${i + 4} = ${(i + 6) * (i + 4)}.`, [(i + 5) * (i + 4), (i + 6) * (i + 3), (i + 7) * (i + 4), (i + 6) * (i + 4) + 2]);
  add(`equation-${i}`, i % 5 === 0 ? "expert" : "hard", `Solve for x: ${i + 2}x + ${i} = ${(i + 2) * (i + 3) + i}.`, i + 3,
    `Subtract ${i}, then divide by ${i + 2}: x = ${i + 3}.`, [i + 2, i + 4, i + 5, i + 1]);
  const n = i + 2;
  add(`percent-${i}`, "medium", `What is ${n * 5}% of ${n * 20}?`, n * n,
    `${n * 20} ? ${n * 5} ? 100 = ${n * n}.`, [n * n - n, n * n + n, n * 20, n * n * 2]);
}

for (let i = 1; i <= 12; i++) {
  const n = i + 3;
  add(`sequence-square-${i}`, i < 4 ? "easy" : "hard", `What is the next term: ${[1, 4, 9, 16].map((x) => x * n).join(", ")}, __?`, 25 * n,
    `These are ${n} times consecutive squares; the next is 5² × ${n} = ${25 * n}.`, [24 * n, 26 * n, 36 * n, 20 * n]);
  const choose = (n: number, k: number) => { let r = 1; for (let j = 1; j <= k; j++) r = r * (n - j + 1) / j; return r; };
  const ways = choose(n, 2);
  add(`combination-${i}`, "expert", `How many different pairs can be chosen from ${n} distinct objects?`, ways,
    `The count is C(${n}, 2) = ${n} × ${n - 1} ÷ 2 = ${ways}.`, [ways - 1, ways + 1, n * 2, n * (n - 1)]);
}

export const mathQuestions = out;

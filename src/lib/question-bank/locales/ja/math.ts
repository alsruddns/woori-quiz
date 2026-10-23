import type { MathPhrases } from "../math-patterns";

export const phrases: MathPhrases = {
  sum: (a, b) => `${a} + ${b} はいくつですか？`,
  sumWhy: (a, b, answer) => `${a} + ${b} = ${answer} です。`,
  product: (a, b) => `${a} × ${b} はいくつですか？`,
  productWhy: (a, b, answer) => `${a} × ${b} = ${answer} です。`,
  equation: (a, b, c) => `${a}x + ${b} = ${c} を解いて、x を求めてください。`,
  equationWhy: (a, b, x) => `両辺から ${b} を引き、${a} で割ると x = ${x} です。`,
  percent: (percent, amount) => `${amount} の ${percent}% はいくつですか？`,
  percentWhy: (amount, percent, answer) => `${amount} × ${percent} ÷ 100 = ${answer} です。`,
  sequence: (terms) => `数列 ${terms}, __ の次の数は何ですか？`,
  sequenceWhy: (factor, answer) => `数列の各項は ${factor} の倍数です。次の項は 25 × ${factor} = ${answer} です。`,
  combination: (count) => `${count} 個から 2 個を選ぶ組み合わせは何通りですか？`,
  combinationWhy: (count, answer) => `${count}C2 = ${count} × (${count} − 1) ÷ 2 = ${answer} です。`,
};

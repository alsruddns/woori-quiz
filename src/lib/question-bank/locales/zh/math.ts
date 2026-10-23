import type { MathPhrases } from "../math-patterns";

export const phrases: MathPhrases = {
  sum: (a, b) => `${a} + ${b} 等于多少？`,
  sumWhy: (a, b, answer) => `${a} + ${b} = ${answer}。`,
  product: (a, b) => `${a} × ${b} 等于多少？`,
  productWhy: (a, b, answer) => `${a} × ${b} = ${answer}。`,
  equation: (a, b, c) => `解方程：${a}x + ${b} = ${c}，求 x。`,
  equationWhy: (a, b, x) => `等式两边先减去 ${b}，再除以 ${a}，得到 x = ${x}。`,
  percent: (percent, amount) => `${amount} 的 ${percent}% 是多少？`,
  percentWhy: (amount, percent, answer) => `${amount} × ${percent} ÷ 100 = ${answer}。`,
  sequence: (terms) => `数列 ${terms}, __ 的下一个数是多少？`,
  sequenceWhy: (factor, answer) => `数列各项都是 ${factor} 的倍数。下一项是 25 × ${factor} = ${answer}。`,
  combination: (count) => `从 ${count} 个物品中选出 2 个，有多少种组合？`,
  combinationWhy: (count, answer) => `${count}C2 = ${count} × (${count} − 1) ÷ 2 = ${answer}。`,
};

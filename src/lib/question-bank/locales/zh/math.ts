import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `${a} + ${b} 等于多少？`, product: (a,b) => `${a} × ${b} 等于多少？`,
  equation: (a,b,c) => `求方程 ${a}x + ${b} = ${c} 中 x 的值。`, equationWhy: (a,b,x) => `先减去 ${b}，再除以 ${a}，得到 x = ${x}。`,
  percent: (p,n) => `${n} 的 ${p}% 是多少？`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}。`,
  sequence: (s) => `数列 ${s}, __ 的下一项是多少？`, sequenceWhy: (n,x) => `各项是连续平方数的 ${n} 倍。下一项是 5² × ${n} = ${x}。`,
  combination: (n) => `从 ${n} 个不同物品中选出两个，有多少种选法？`, combinationWhy: (n,x) => `组合数为 C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}。`,
};

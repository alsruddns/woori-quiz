import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `${a} + ${b} 等於多少？`, sumWhy: (a,b,result) => `將 ${a} 加上 ${b}，結果是 ${result}。`,
  product: (a,b) => `${a} × ${b} 等於多少？`, productWhy: (a,b,result) => `將 ${a} 乘以 ${b}，結果是 ${result}。`,
  equation: (a,b,c) => `求方程式 ${a}x + ${b} = ${c} 中 x 的值。`, equationWhy: (a,b,x) => `先減去 ${b}，再除以 ${a}，可得 x = ${x}。`,
  percent: (p,n) => `${n} 的 ${p}% 是多少？`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}。`,
  sequence: (s) => `數列 ${s}, __ 的下一項是多少？`, sequenceWhy: (n,x) => `每項是連續平方數的 ${n} 倍。下一項是 5² × ${n} = ${x}。`,
  combination: (n) => `從 ${n} 個不同物品中選出兩個，有多少種選法？`, combinationWhy: (n,x) => `組合數為 C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}。`,
};

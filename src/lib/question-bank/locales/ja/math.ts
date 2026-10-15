import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `${a} + ${b} はいくつですか？`, product: (a,b) => `${a} × ${b} はいくつですか？`,
  equation: (a,b,c) => `${a}x + ${b} = ${c} を満たす x を求めてください。`, equationWhy: (a,b,x) => `${b} を引き、${a} で割ると x = ${x} です。`,
  percent: (p,n) => `${n} の ${p}% はいくつですか？`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x} です。`,
  sequence: (s) => `数列 ${s}, __ の次の数は何ですか？`, sequenceWhy: (n,x) => `連続する平方数を ${n} 倍した数列です。次は 5² × ${n} = ${x} です。`,
  combination: (n) => `異なる ${n} 個の物から 2 個を選ぶ方法は何通りですか？`, combinationWhy: (n,x) => `組合せの数は C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x} です。`,
};

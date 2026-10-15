import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `Berapakah ${a} + ${b}?`, product: (a,b) => `Berapakah ${a} × ${b}?`,
  equation: (a,b,c) => `Tentukan x dalam persamaan ${a}x + ${b} = ${c}.`, equationWhy: (a,b,x) => `Kurangi ${b}, lalu bagi dengan ${a}: x = ${x}.`,
  percent: (p,n) => `Berapakah ${p}% dari ${n}?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}.`,
  sequence: (s) => `Berapakah suku berikutnya dalam deret ${s}, __?`, sequenceWhy: (n,x) => `Suku-sukunya adalah kuadrat berurutan dikali ${n}. Berikutnya 5² × ${n} = ${x}.`,
  combination: (n) => `Ada berapa cara memilih dua benda dari ${n} benda berbeda?`, combinationWhy: (n,x) => `Banyaknya kombinasi adalah C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}.`,
};

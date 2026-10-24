import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `${a} + ${b} bằng bao nhiêu?`, sumWhy: (a,b,result) => `${a} cộng ${b} bằng ${result}.`,
  product: (a,b) => `${a} × ${b} bằng bao nhiêu?`, productWhy: (a,b,result) => `${a} nhân ${b} bằng ${result}.`,
  equation: (a,b,c) => `Tìm x trong phương trình ${a}x + ${b} = ${c}.`, equationWhy: (a,b,x) => `Trừ ${b}, rồi chia cho ${a}: x = ${x}.`,
  percent: (p,n) => `${p}% của ${n} là bao nhiêu?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}.`,
  sequence: (s) => `Số tiếp theo trong dãy ${s}, __ là gì?`, sequenceWhy: (n,x) => `Các số là bình phương liên tiếp nhân với ${n}. Số tiếp theo là 5² × ${n} = ${x}.`,
  combination: (n) => `Có bao nhiêu cách chọn hai vật từ ${n} vật khác nhau?`, combinationWhy: (n,x) => `Số cách là C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}.`,
};

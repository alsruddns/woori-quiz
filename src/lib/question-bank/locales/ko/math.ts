import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `${a} + ${b}는 얼마인가요?`, product: (a,b) => `${a} × ${b}는 얼마인가요?`,
  equation: (a,b,c) => `${a}x + ${b} = ${c}에서 x를 구하세요.`, equationWhy: (a,b,x) => `${b}를 빼고 ${a}로 나누면 x = ${x}입니다.`,
  percent: (p,n) => `${n}의 ${p}%는 얼마인가요?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}입니다.`,
  sequence: (s) => `수열 ${s}, __에서 다음 항은 무엇인가요?`, sequenceWhy: (n,x) => `연속된 제곱수에 ${n}을 곱한 수열입니다. 다음 항은 5² × ${n} = ${x}입니다.`,
  combination: (n) => `서로 다른 물건 ${n}개에서 두 개를 고르는 방법은 몇 가지인가요?`, combinationWhy: (n,x) => `조합의 수는 C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}입니다.`,
};

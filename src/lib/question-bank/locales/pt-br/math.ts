import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `Quanto é ${a} + ${b}?`, product: (a,b) => `Quanto é ${a} × ${b}?`,
  equation: (a,b,c) => `Resolva ${a}x + ${b} = ${c} para encontrar x.`, equationWhy: (a,b,x) => `Subtraia ${b} e divida por ${a}: x = ${x}.`,
  percent: (p,n) => `Quanto é ${p}% de ${n}?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}.`,
  sequence: (s) => `Qual é o próximo termo da sequência ${s}, __?`, sequenceWhy: (n,x) => `São quadrados consecutivos multiplicados por ${n}. O próximo é 5² × ${n} = ${x}.`,
  combination: (n) => `De quantas maneiras é possível escolher dois objetos entre ${n} diferentes?`, combinationWhy: (n,x) => `O total de combinações é C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}.`,
};

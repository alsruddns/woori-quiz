import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `Quanto fa ${a} + ${b}?`, product: (a,b) => `Quanto fa ${a} × ${b}?`,
  equation: (a,b,c) => `Risolvi ${a}x + ${b} = ${c} per trovare x.`, equationWhy: (a,b,x) => `Sottrai ${b} e dividi per ${a}: x = ${x}.`,
  percent: (p,n) => `Quanto fa il ${p}% di ${n}?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}.`,
  sequence: (s) => `Qual è il termine successivo della sequenza ${s}, __?`, sequenceWhy: (n,x) => `Sono quadrati consecutivi moltiplicati per ${n}. Segue 5² × ${n} = ${x}.`,
  combination: (n) => `In quanti modi si possono scegliere due oggetti tra ${n} oggetti distinti?`, combinationWhy: (n,x) => `Il numero di combinazioni è C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}.`,
};

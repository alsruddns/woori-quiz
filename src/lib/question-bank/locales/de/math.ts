import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `Wie viel ist ${a} + ${b}?`, product: (a,b) => `Wie viel ist ${a} × ${b}?`,
  equation: (a,b,c) => `Löse ${a}x + ${b} = ${c} nach x auf.`, equationWhy: (a,b,x) => `Ziehe ${b} ab und teile durch ${a}: x = ${x}.`,
  percent: (p,n) => `Wie viel sind ${p}% von ${n}?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}.`,
  sequence: (s) => `Welche Zahl folgt in der Reihe ${s}, __?`, sequenceWhy: (n,x) => `Die Glieder sind aufeinanderfolgende Quadratzahlen mal ${n}. Es folgt 5² × ${n} = ${x}.`,
  combination: (n) => `Auf wie viele Arten lassen sich zwei aus ${n} verschiedenen Gegenständen auswählen?`, combinationWhy: (n,x) => `Die Anzahl ist C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}.`,
};

import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `Hoeveel is ${a} + ${b}?`, product: (a,b) => `Hoeveel is ${a} × ${b}?`,
  equation: (a,b,c) => `Los ${a}x + ${b} = ${c} op voor x.`, equationWhy: (a,b,x) => `Trek ${b} af en deel door ${a}: x = ${x}.`,
  percent: (p,n) => `Hoeveel is ${p}% van ${n}?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}.`,
  sequence: (s) => `Wat is de volgende term in de reeks ${s}, __?`, sequenceWhy: (n,x) => `Dit zijn opeenvolgende kwadraten maal ${n}. Daarna komt 5² × ${n} = ${x}.`,
  combination: (n) => `Op hoeveel manieren kun je twee voorwerpen kiezen uit ${n} verschillende voorwerpen?`, combinationWhy: (n,x) => `Het aantal combinaties is C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}.`,
};

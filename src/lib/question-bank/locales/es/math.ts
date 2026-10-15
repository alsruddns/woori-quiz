import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `¿Cuánto es ${a} + ${b}?`, product: (a,b) => `¿Cuánto es ${a} × ${b}?`,
  equation: (a,b,c) => `Resuelve ${a}x + ${b} = ${c} para x.`, equationWhy: (a,b,x) => `Resta ${b} y divide entre ${a}: x = ${x}.`,
  percent: (p,n) => `¿Cuánto es el ${p}% de ${n}?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}.`,
  sequence: (s) => `¿Qué número sigue en la secuencia ${s}, __?`, sequenceWhy: (n,x) => `Son cuadrados consecutivos multiplicados por ${n}. Sigue 5² × ${n} = ${x}.`,
  combination: (n) => `¿De cuántas formas se pueden elegir dos objetos entre ${n} distintos?`, combinationWhy: (n,x) => `El número de combinaciones es C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}.`,
};

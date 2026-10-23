import type { MathPhrases } from "../math-patterns";

export const phrases: MathPhrases = {
  sum: (a, b) => `¿Cuánto es ${a} + ${b}?`,
  sumWhy: (a, b, answer) => `La suma es ${a} + ${b} = ${answer}.`,
  product: (a, b) => `¿Cuánto es ${a} × ${b}?`,
  productWhy: (a, b, answer) => `El producto es ${a} × ${b} = ${answer}.`,
  equation: (a, b, c) => `Resuelve ${a}x + ${b} = ${c} para hallar x.`,
  equationWhy: (a, b, x) => `Resta ${b} y divide entre ${a}: x = ${x}.`,
  percent: (percent, amount) => `¿Cuánto es el ${percent}% de ${amount}?`,
  percentWhy: (amount, percent, answer) => `${amount} × ${percent} ÷ 100 = ${answer}.`,
  sequence: (terms) => `¿Qué número sigue en la secuencia ${terms}, __?`,
  sequenceWhy: (factor, answer) => `Son cuadrados consecutivos multiplicados por ${factor}. El siguiente es 25 × ${factor} = ${answer}.`,
  combination: (count) => `¿De cuántas formas se pueden elegir dos objetos de entre ${count}?`,
  combinationWhy: (count, answer) => `El número de combinaciones es C(${count}, 2) = ${count} × ${count - 1} ÷ 2 = ${answer}.`,
};

import type { MathPhrases } from "../math-patterns";

export const phrases: MathPhrases = {
  sum: (a, b) => `Wie viel ist ${a} + ${b}?`,
  sumWhy: (a, b, answer) => `Die Summe ist ${a} + ${b} = ${answer}.`,
  product: (a, b) => `Wie viel ist ${a} × ${b}?`,
  productWhy: (a, b, answer) => `Das Produkt ist ${a} × ${b} = ${answer}.`,
  equation: (a, b, c) => `Löse ${a}x + ${b} = ${c} nach x auf.`,
  equationWhy: (a, b, x) => `Ziehe ${b} ab und teile durch ${a}: x = ${x}.`,
  percent: (percent, amount) => `Wie viel sind ${percent}% von ${amount}?`,
  percentWhy: (amount, percent, answer) => `${amount} × ${percent} ÷ 100 = ${answer}.`,
  sequence: (terms) => `Welche Zahl folgt in der Reihe ${terms}, __?`,
  sequenceWhy: (factor, answer) => `Es sind aufeinanderfolgende Quadratzahlen mal ${factor}. Die nächste Zahl ist 25 × ${factor} = ${answer}.`,
  combination: (count) => `Wie viele Kombinationen aus zwei Objekten gibt es bei ${count} Objekten?`,
  combinationWhy: (count, answer) => `Die Anzahl der Kombinationen ist C(${count}, 2) = ${count} × (${count} - 1) ÷ 2 = ${answer}.`,
};

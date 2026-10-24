import type { MathPhrases } from "../math-patterns";

export const phrases: MathPhrases = {
  sum: (a, b) => `Quanto é ${a} + ${b}?`,
  sumWhy: (a, b, answer) => `A soma é ${a} + ${b} = ${answer}.`,
  product: (a, b) => `Quanto é ${a} × ${b}?`,
  productWhy: (a, b, answer) => `O produto é ${a} × ${b} = ${answer}.`,
  equation: (a, b, c) => `Resolva ${a}x + ${b} = ${c} para encontrar x.`,
  equationWhy: (a, b, x) => `Subtraia ${b} e divida por ${a}: x = ${x}.`,
  percent: (percent, amount) => `Quanto é ${percent}% de ${amount}?`,
  percentWhy: (amount, percent, answer) => `${amount} × ${percent} ÷ 100 = ${answer}.`,
  sequence: (terms) => `Qual é o próximo termo da sequência ${terms}, __?`,
  sequenceWhy: (factor, answer) => `São quadrados consecutivos multiplicados por ${factor}. O próximo é 25 × ${factor} = ${answer}.`,
  combination: (count) => `De quantas maneiras é possível escolher dois objetos entre ${count}?`,
  combinationWhy: (count, answer) => `O total de combinações é C(${count}, 2) = ${count} × (${count} - 1) ÷ 2 = ${answer}.`,
};

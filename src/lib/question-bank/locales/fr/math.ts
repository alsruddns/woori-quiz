import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `Combien font ${a} + ${b} ?`, sumWhy: (a,b,result) => `${a} plus ${b} égalent ${result}.`,
  product: (a,b) => `Combien font ${a} × ${b} ?`, productWhy: (a,b,result) => `${a} multiplié par ${b} égale ${result}.`,
  equation: (a,b,c) => `Résolvez ${a}x + ${b} = ${c} pour trouver x.`, equationWhy: (a,b,x) => `Soustrayez ${b}, puis divisez par ${a} : x = ${x}.`,
  percent: (p,n) => `Combien font ${p} % de ${n} ?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}.`,
  sequence: (s) => `Quel est le terme suivant de la suite ${s}, __ ?`, sequenceWhy: (n,x) => `Ce sont des carrés consécutifs multipliés par ${n}. Le suivant est 5² × ${n} = ${x}.`,
  combination: (n) => `De combien de façons peut-on choisir deux objets parmi ${n} objets distincts ?`, combinationWhy: (n,x) => `Le nombre de combinaisons est C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}.`,
};

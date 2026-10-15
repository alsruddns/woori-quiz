import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `${a} + ${b} कितना है?`, product: (a,b) => `${a} × ${b} कितना है?`,
  equation: (a,b,c) => `समीकरण ${a}x + ${b} = ${c} में x ज्ञात करें।`, equationWhy: (a,b,x) => `${b} घटाएँ, फिर ${a} से भाग दें: x = ${x}।`,
  percent: (p,n) => `${n} का ${p}% कितना है?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}।`,
  sequence: (s) => `श्रृंखला ${s}, __ में अगली संख्या क्या है?`, sequenceWhy: (n,x) => `ये लगातार वर्ग संख्याओं को ${n} से गुणा करने पर मिलती हैं। अगली संख्या 5² × ${n} = ${x} है।`,
  combination: (n) => `${n} अलग वस्तुओं में से दो चुनने के कितने तरीके हैं?`, combinationWhy: (n,x) => `संयोजनों की संख्या C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x} है।`,
};

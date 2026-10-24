import type { MathPhrases } from "../math-patterns";
export const phrases: MathPhrases = {
  sum: (a,b) => `${a} + ${b} เท่ากับเท่าไร?`, sumWhy: (a,b,result) => `ผลบวกของ ${a} กับ ${b} คือ ${result}`,
  product: (a,b) => `${a} × ${b} เท่ากับเท่าไร?`, productWhy: (a,b,result) => `ผลคูณของ ${a} กับ ${b} คือ ${result}`,
  equation: (a,b,c) => `หาค่า x จากสมการ ${a}x + ${b} = ${c}`, equationWhy: (a,b,x) => `ลบ ${b} แล้วหารด้วย ${a} จะได้ x = ${x}`,
  percent: (p,n) => `${p}% ของ ${n} เท่ากับเท่าไร?`, percentWhy: (n,p,x) => `${n} × ${p} ÷ 100 = ${x}`,
  sequence: (s) => `จำนวนถัดไปในลำดับ ${s}, __ คืออะไร?`, sequenceWhy: (n,x) => `แต่ละพจน์เป็นจำนวนกำลังสองเรียงกันคูณ ${n} พจน์ถัดไปคือ 5² × ${n} = ${x}`,
  combination: (n) => `เลือกของ 2 ชิ้นจากของที่ต่างกัน ${n} ชิ้นได้กี่วิธี?`, combinationWhy: (n,x) => `จำนวนวิธีคือ C(${n}, 2) = ${n} × ${n-1} ÷ 2 = ${x}`,
};

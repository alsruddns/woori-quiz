import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `数列 ${s}, __ の次の数は何ですか？`, explanation: [
  "各項は前の項より 3 大きくなります。", "各項は前の項の 2 倍です。", "連続する整数の平方数が並んでいます。",
  "増加量は +2、+4、+6、+8 と続きます。", "前の項を 2 倍し、1 と 0 を交互に足します。",
] };

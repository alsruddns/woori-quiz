import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `數列 ${s}, __ 的下一項是多少？`, explanation: [
  "每一項都比前一項大 3。", "每一項都是前一項的兩倍。", "這是連續整數的平方數列。",
  "相鄰兩項的差依序是 +2、+4、+6、+8。", "每次將前一項乘以 2，再交替加上 1 和 0。",
] };

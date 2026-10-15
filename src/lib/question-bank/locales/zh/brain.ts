import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `数列 ${s}, __ 的下一项是多少？`, explanation: [
  "每一项都比前一项大 3。", "每一项都是前一项的两倍。", "这是连续整数的平方数列。",
  "相邻两项之差依次为 +2、+4、+6、+8。", "每次将前一项乘以 2，再交替加 1 和 0。",
] };

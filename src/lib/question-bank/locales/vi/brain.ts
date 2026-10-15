import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `Số tiếp theo trong dãy ${s}, __ là gì?`, explanation: [
  "Mỗi số tăng thêm 3 so với số trước.", "Mỗi số gấp đôi số đứng trước.", "Đây là bình phương của các số nguyên liên tiếp.",
  "Các mức tăng lần lượt là +2, +4, +6 và +8.", "Nhân đôi số trước rồi cộng luân phiên 1 và 0.",
] };

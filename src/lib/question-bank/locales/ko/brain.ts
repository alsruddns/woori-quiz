import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `수열 ${s}, __에서 다음 숫자는 무엇인가요?`, explanation: [
  "각 항은 앞의 항보다 3씩 큽니다.", "각 항은 앞의 항의 두 배입니다.", "연속된 정수의 제곱으로 이루어진 수열입니다.",
  "증가량이 +2, +4, +6, +8로 이어집니다.", "앞의 항을 두 배로 만든 뒤 1과 0을 번갈아 더합니다.",
] };

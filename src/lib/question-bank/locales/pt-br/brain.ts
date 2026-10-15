import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `Qual é o próximo número da sequência ${s}, __?`, explanation: [
  "Cada termo aumenta em 3.", "Cada termo é o dobro do anterior.", "São os quadrados de números inteiros consecutivos.",
  "As diferenças são +2, +4, +6 e +8.", "Dobre o termo anterior e some 1 ou 0 alternadamente.",
] };

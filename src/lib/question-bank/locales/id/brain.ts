import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `Berapa angka berikutnya dalam deret ${s}, __?`, explanation: [
  "Setiap suku bertambah 3.", "Setiap suku dua kali suku sebelumnya.", "Deret ini berisi kuadrat bilangan bulat berurutan.",
  "Selisihnya berturut-turut +2, +4, +6, dan +8.", "Gandakan suku sebelumnya, lalu tambahkan 1 dan 0 secara bergantian.",
] };

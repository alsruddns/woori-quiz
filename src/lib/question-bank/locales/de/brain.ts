import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `Welche Zahl folgt in der Reihe ${s}, __?`, explanation: [
  "Jedes Glied ist um 3 größer als das vorherige.", "Jedes Glied ist doppelt so groß wie das vorherige.", "Die Reihe besteht aus Quadraten aufeinanderfolgender ganzer Zahlen.",
  "Die Abstände lauten nacheinander +2, +4, +6 und +8.", "Verdopple jeweils das vorige Glied und addiere abwechselnd 1 und 0.",
] };

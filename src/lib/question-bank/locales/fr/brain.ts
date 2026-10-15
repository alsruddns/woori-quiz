import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `Quel nombre suit dans la suite ${s}, __ ?`, explanation: [
  "Chaque terme augmente de 3.", "Chaque terme est le double du précédent.", "Il s'agit des carrés d'entiers consécutifs.",
  "Les écarts successifs sont +2, +4, +6 et +8.", "On double le terme précédent, puis on ajoute alternativement 1 et 0.",
] };

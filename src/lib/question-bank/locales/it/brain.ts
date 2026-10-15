import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `Qual è il numero successivo nella sequenza ${s}, __?`, explanation: [
  "Ogni termine aumenta di 3.", "Ogni termine è il doppio del precedente.", "Sono quadrati di numeri interi consecutivi.",
  "Gli incrementi successivi sono +2, +4, +6 e +8.", "Si raddoppia il termine precedente e si aggiungono alternativamente 1 e 0.",
] };

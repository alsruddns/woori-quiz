import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `Welk getal volgt in de reeks ${s}, __?`, explanation: [
  "Elke term is 3 groter dan de vorige.", "Elke term is het dubbele van de vorige.", "De reeks bestaat uit kwadraten van opeenvolgende gehele getallen.",
  "De verschillen zijn achtereenvolgens +2, +4, +6 en +8.", "Verdubbel de vorige term en tel afwisselend 1 en 0 erbij op.",
] };

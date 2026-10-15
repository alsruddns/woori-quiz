import type { BrainPhrases } from "../brain-patterns";
export const phrases: BrainPhrases = { prompt: (s) => `¿Qué número sigue en la secuencia ${s}, __?`, explanation: [
  "Cada término aumenta en 3.", "Cada término es el doble del anterior.", "Son cuadrados de números enteros consecutivos.",
  "Las diferencias sucesivas son +2, +4, +6 y +8.", "Se duplica el término anterior y se suma 1 o 0 de forma alterna.",
] };

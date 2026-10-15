export type MathQuestion = { prompt: string; answer: number; options: number[]; explanation: string };
const shuffle = <T,>(values: T[]) => [...values].sort(() => Math.random() - 0.5);
export function generateMathQuestion(kind: string, difficulty: "easy" | "medium" | "hard" | "expert" = "medium"): MathQuestion {
  const max = difficulty === "easy" ? 20 : difficulty === "medium" ? 100 : difficulty === "hard" ? 500 : 2000;
  let a = 1 + Math.floor(Math.random() * max), b = 1 + Math.floor(Math.random() * max), answer = 0, prompt = "";
  switch (kind) {
    case "addition-quiz": answer = a + b; prompt = `${a} + ${b} = ?`; break;
    case "subtraction-quiz": if (b > a) [a, b] = [b, a]; answer = a - b; prompt = `${a} − ${b} = ?`; break;
    case "multiplication-quiz": case "multiplication-table-quiz": a = 1 + Math.floor(Math.random() * 12); b = 1 + Math.floor(Math.random() * 12); answer = a * b; prompt = `${a} × ${b} = ?`; break;
    case "division-quiz": answer = a; b = 1 + Math.floor(Math.random() * 12); a = answer * b; prompt = `${a} ÷ ${b} = ?`; break;
    case "fraction-quiz": { const denominator = [2, 4, 5, 10][Math.floor(Math.random() * 4)]; a = 1 + Math.floor(Math.random() * 9); b = 1 + Math.floor(Math.random() * 9); answer = Number(((a + b) / denominator).toFixed(1)); prompt = `${a}/${denominator} + ${b}/${denominator} = ? (decimal)`; break; }
    case "percentage-quiz": a = 10 * (1 + Math.floor(Math.random() * 10)); b = 10 * (1 + Math.floor(Math.random() * 9)); answer = a * b / 100; prompt = `${b}% of ${a} = ?`; break;
    case "equation-quiz": a = 1 + Math.floor(Math.random() * 20); b = 1 + Math.floor(Math.random() * 20); answer = a; prompt = `x + ${b} = ${a + b}. What is x?`; break;
    case "mental-math-quiz": case "arithmetic-challenge": { const op = ["+", "−", "×"][Math.floor(Math.random() * 3)]; if (op === "×") { a = 1 + Math.floor(Math.random() * 12); b = 1 + Math.floor(Math.random() * 12); answer = a * b; } else if (op === "−") { if (b > a) [a, b] = [b, a]; answer = a - b; } else answer = a + b; prompt = `${a} ${op} ${b} = ?`; break; }
    default: answer = a + b; prompt = `${a} + ${b} = ?`;
  }
  const options = new Set<number>([answer]); const step = Number.isInteger(answer) ? 1 : 0.1;
  while (options.size < 4) { const candidate = Number((answer + (Math.floor(Math.random() * 11) - 5) * step).toFixed(1)); if (Number.isFinite(candidate) && candidate >= 0) options.add(candidate); }
  return { prompt, answer, options: shuffle([...options]), explanation: `The correct answer is ${answer}.` };
}

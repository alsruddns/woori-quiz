import { describe, expect, it } from "vitest";
import { resolveQuestionCopy } from "../src/lib/question-bank/display-copy";
import type { QuizQuestion } from "../src/lib/question-bank/types";

const sample: QuizQuestion = {
  id: "zh-test-1", category: "general", difficulty: "easy",
  question: "Which planet is known as the Red Planet?",
  options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1,
  explanation: "Iron-rich dust gives Mars its red appearance.",
  localizations: { zh: { question: "哪颗行星被称为红色星球？", options: ["金星", "火星", "木星", "水星"], explanation: "富含铁的尘埃使火星呈现红色。" } },
};

describe("question display copy", () => {
  it("keeps translated choice text separate from the numeric answer index", () => {
    expect(resolveQuestionCopy(sample, "zh")).toEqual({
      question: "哪颗行星被称为红色星球？", options: ["金星", "火星", "木星", "水星"], explanation: "富含铁的尘埃使火星呈现红色。",
    });
    expect(sample.answer).toBe(1);
  });

  it("falls back to source text when a locale field contains an internal numeric code", () => {
    const damaged = { ...sample, id: "geography-x-feature-1", localizations: { zh: { question: "142", options: ["002", "142", "150", "021"], explanation: "002" } } };
    expect(resolveQuestionCopy(damaged, "zh")).toEqual({ question: sample.question, options: sample.options, explanation: sample.explanation });
  });

  it("preserves numeric answer choices when they match the source options", () => {
    const numeric = { ...sample, options: ["142", "002", "003", "004"], localizations: { zh: { question: "哪一个？", options: ["142", "002", "003", "004"], explanation: "答案是 002。" } } };
    expect(resolveQuestionCopy(numeric, "zh").options).toEqual(numeric.options);
  });

  it("does not treat arbitrary digits as internal codes in numerical quizzes", () => {
    const numeric = { ...sample, question: "Round 2,000 to the nearest hundred", options: ["1,900", "2,000", "2,100", "2,200"], answer: 1, localizations: { zh: { question: "将2000四舍五入到最接近的百位", options: ["1900", "2000", "2100", "2200"], explanation: "2000 已经是整百数。" } } };
    expect(resolveQuestionCopy(numeric, "zh").options).toEqual(["1900", "2000", "2100", "2200"]);
  });
});

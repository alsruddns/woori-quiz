import { describe, expect, it } from "vitest";
import copies from "../src/lib/question-bank/locales/ru/question-bank.json";
import { questionBank } from "../src/lib/question-bank";
import { loadQuestionBankForCategory, selectQuestionsForCategory } from "../src/lib/question-bank/select-questions";
import { localeExpansionTargets, locales, publishedLocales } from "../src/lib/i18n";

describe("Russian question bank draft", () => {
  it("covers all source questions while the incomplete locale stays unpublished", () => {
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));
    const preservedRussianTokens = new Set(["CO₂", "H₂O", "NaCl", "O", "Au", "Na", "Fe", "Java", "C", "JavaScript", "Swift", "SQL", "HTML", "CSS", "PNG", ".png", ".mp3", ".csv", ".exe"]);
    expect(Object.keys(copies)).toHaveLength(questionBank.length);
    expect(Object.keys(copies).sort()).toEqual([...sourceById.keys()].sort());
    expect(localeExpansionTargets).toContain("ru");
    expect(locales).not.toContain("ru");
    expect(publishedLocales).not.toContain("ru");

    const batchArtifacts: string[] = [];
    const untranslatedOptions: string[] = [];
    for (const [id, copy] of Object.entries(copies)) {
      const source = sourceById.get(id)!;
      expect(copy.question.trim(), `${id} question`).not.toBe("");
      expect(copy.explanation.trim(), `${id} explanation`).not.toBe("");
      expect(copy.options, `${id} option count`).toHaveLength(source.options.length);
      expect(new Set(copy.options).size, `${id} duplicate options`).toBe(copy.options.length);
      for (const value of [copy.question, ...copy.options, copy.explanation]) {
        expect(value, `${id} has no Unicode replacement characters`).not.toContain("\uFFFD");
        expect(value, `${id} has no unresolved question-mark placeholders`).not.toMatch(/\?(?!\s*$)/);
        if (/ZZQB\d{4}ZZ|[\r\n]/.test(value)) batchArtifacts.push(`${id}: ${JSON.stringify(value)}`);
      }
      if (source.category === "language") expect(copy.options, `${id} preserves English quiz material`).toEqual(source.options);
      else copy.options.forEach((option, index) => {
        if (option === source.options[index] && !preservedRussianTokens.has(option) && !/^[-+]?\d/.test(option)) {
          untranslatedOptions.push(`${id}: ${option}`);
        }
      });
      expect(`${copy.question} ${copy.explanation}`, `${id} has Russian text`).toMatch(/[\u0400-\u04FF]/);
      expect(JSON.stringify(copy), `${id} has no unresolved batch marker`).not.toMatch(/ZZQB\d{4}ZZ/);
    }
    expect(batchArtifacts, "Russian copy has no batch artifacts or embedded line breaks").toEqual([]);
    expect(untranslatedOptions, "Russian answer choices are translated except for scientific and technical tokens").toEqual([]);
    expect(copies["general-007"].options).toEqual(["Атлантический океан", "Индийский", "Северный Ледовитый океан", "Тихий океан"]);
    expect(copies["general-010"].options).toEqual(["Железо", "Медь", "Ртуть", "Алюминий"]);
    expect(copies["geography-029"].options[0]).toBe("Тихий океан");
    expect(copies["history-033"].options[1]).toBe("Иоганн Гутенберг");
    expect(copies["language-051"].explanation).toContain("Brief означает");
    expect(copies["language-057"].question).toContain("предложении");
    expect(copies["language-059"].explanation).toContain("Glance означает");
    expect(copies["technology-061"].question).toContain("аббревиатура CPU");
    expect(copies["technology-062"].options).toEqual(["Java", "C", "JavaScript", "Swift"]);
    expect(copies["technology-069"].options[0]).toContain("доменные имена");
    expect(copies["brain-073"].question).toContain("Лаззи");
    expect(copies["brain-073"].question).not.toContain("Ленивцы");
    expect(copies["nonsense-083"].question).toContain("У чего есть горлышко");
    expect(copies["nonsense-086"].question).toContain("У чего есть один глаз");
    expect(copies["general-x-10"].options[0]).toBe("Железо");
    expect(copies["general-x-20"].options[0]).toBe("Сливки");
    expect(copies["general-x-24"].options[0]).toBe("Стая");
    expect(copies["general-x-37"].question).toContain("смычковый инструмент");
    expect(copies["general-x-40"].question).toContain("текст, вырезанный");
    expect(copies["general-x-55"].question).toContain("сбережение денег");
    expect(copies["general-x-68"].options[0]).toBe("Безопасно переходить дорогу");
    expect(copies["general-x-72"].options[0]).toBe("Вона");
    expect(copies["math-x-percent-1"].explanation).toBe("60 × 15 ÷ 100 = 9.");
    expect(copies["general-x-82"].options[0]).toBe("Секунда");
    expect(copies["general-x-87"].question).toContain("с помощью огнетушителя");
    expect(copies["nonsense-x-3"].question).toContain("может звонить");
    expect(copies["nonsense-x-6"].question).toContain("имеет русло");
    expect(copies["nonsense-x-15"].question).toContain("одной ножке");
    expect(copies["nonsense-x-17"].options[0]).toBe("Конверт");
    expect(copies["nonsense-x-18"].question).toContain("корешок");
    expect(copies["nonsense-x-28"].question).toContain("слове «момент»");
    expect(copies["nonsense-x-29"].explanation).toContain("чайник");
    expect(copies["nonsense-x-30"].options[0]).toBe("Нос");
    expect(copies["nonsense-x-31"].options[0]).toBe("Нос");
    expect(copies["nonsense-x-35"].options[0]).toBe("Кастрюля");
    expect(copies["nonsense-x-41"].question).toContain("остриё");
    expect(copies["nonsense-x-47"].question).toContain("клавиатура и экран");
    expect(copies["nonsense-x-48"].question).not.toContain("страницы");
    for (const [id, copy] of Object.entries(copies)) {
      if (id.startsWith("math-x-equation-")) expect(copy.question, id).toMatch(/^Решите уравнение:/);
      if (id.startsWith("math-x-sum-") || id.startsWith("math-x-product-")) {
        expect(copy.question, id).toMatch(/^Сколько будет/);
      }
      if (id.startsWith("math-x-percent-")) expect(copy.question, id).toMatch(/^Сколько составляет/);
      if (id.startsWith("math-x-sequence-square-")) {
        expect(copy.question, id).toContain("член последовательности");
        expect(copy.explanation, id).toContain("произведение");
        expect(copy.explanation, id).toContain("× 5² =");
      }
    }
    expect(copies["history-x-1"].question).toMatch(/^В каком году/);
    expect(copies["history-x-5"].question).toContain("Вояджер-1");
    expect(copies["history-x-15"].question).toContain("перемирие в Корейской войне");
    expect(copies["history-x-22"].question).toMatch(/^Где был построен/);
    expect(copies["history-x-24"].question).toMatch(/^Кто построил/);
    expect(copies["history-x-39"].question).toMatch(/^В каком году/);
    expect(copies["science-x-1"].options[0]).toBe("O");
    expect(copies["science-x-2"].options[0]).toBe("Au");
    expect(copies["science-x-3"].options[0]).toBe("Na");
    expect(copies["science-x-4"].options[0]).toBe("Fe");
    expect(copies["science-x-5"].options[0]).toBe("C");
    expect(copies["science-x-26"].options[0]).toBe("Зрачок");
    expect(copies["science-x-27"].options[1]).toBe("C");
    expect(copies["science-x-28"].options[0]).toBe("Кожа");
    expect(copies["geography-x-feature-4"].question).toContain("Большой Барьерный риф");
    expect(copies["it-x-concept-1"].question).toContain("CPU");
    expect(copies["it-x-concept-29"].question).toContain("межсетевого экрана");
    expect(copies["it-x-concept-37"].question).toContain("интерпретатора");
    expect(copies["it-x-concept-40"].explanation).toContain("сколько данных канал может передать");
    for (const [id, copy] of Object.entries(copies)) {
      if (!id.startsWith("language-x-vocab-")) continue;
      const sourceQuestion = sourceById.get(id)!.question;
      const term = sourceQuestion.match(/[“"]([^”"]+)[”"]/ )?.[1];
      expect(term, `${id} source vocabulary term`).toBeTruthy();
      expect(copy.question, `${id} asks about the English term`).toContain(term);
      expect(copy.explanation.toLowerCase(), `${id} explains the English term`).toContain(term!.toLowerCase());
    }
  });

  it("loads Russian copy through the quiz question loader and preserves scoring after shuffling", async () => {
    const russianPool = await loadQuestionBankForCategory("all", "ru");
    expect(russianPool).toHaveLength(questionBank.length);
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));

    for (const localized of russianPool) {
      const source = sourceById.get(localized.id)!;
      expect(localized.localizations?.ru).toEqual(copies[localized.id as keyof typeof copies]);
      expect(localized.answer).toBe(source.answer);
    }

    const selected = selectQuestionsForCategory(russianPool, { count: 120, seed: 20261024 });
    expect(selected).toHaveLength(120);
    for (const localized of selected) {
      const source = sourceById.get(localized.id)!;
      const translated = copies[localized.id as keyof typeof copies];
      const sourceIndexes = localized.options.map((option) => source.options.indexOf(option));
      expect(localized.answer).toBe(sourceIndexes.indexOf(source.answer));
      expect(localized.localizations?.ru?.options).toEqual(sourceIndexes.map((index) => translated.options[index]));
      expect(localized.localizations?.ru?.options[localized.answer]).toBe(translated.options[source.answer]);
    }
  });
});

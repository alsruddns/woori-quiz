import { locales, type Locale, type TargetLocale } from "../../i18n";
import type { QuestionLocaleCopy, QuizQuestion } from "../types";
import { mathPatternCopy } from "./math-patterns";
import { brainPatternCopy } from "./brain-patterns";
import { capitalCopy, featureCopy } from "./geography-patterns";
import { vocabularyCopy } from "./language-patterns";
import { technologyCopy } from "./technology-patterns";
import { historyCopy } from "./history-patterns";
import { scienceCopy } from "./science-patterns";

const mathPhrases = {
  ko: () => import("./ko/math"), ja: () => import("./ja/math"), zh: () => import("./zh/math"),
  es: () => import("./es/math"), "pt-br": () => import("./pt-br/math"), de: () => import("./de/math"),
  fr: () => import("./fr/math"), vi: () => import("./vi/math"), id: () => import("./id/math"),
  th: () => import("./th/math"), "zh-tw": () => import("./zh-tw/math"), it: () => import("./it/math"),
  nl: () => import("./nl/math"), hi: () => import("./hi/math"),
};

const brainPhrases = {
  ko: () => import("./ko/brain"), ja: () => import("./ja/brain"), zh: () => import("./zh/brain"),
  es: () => import("./es/brain"), "pt-br": () => import("./pt-br/brain"), de: () => import("./de/brain"),
  fr: () => import("./fr/brain"), vi: () => import("./vi/brain"), id: () => import("./id/brain"),
  th: () => import("./th/brain"), "zh-tw": () => import("./zh-tw/brain"), it: () => import("./it/brain"),
  nl: () => import("./nl/brain"), hi: () => import("./hi/brain"),
};

const geographyPhrases = {
  ko: () => import("./ko/geography"), ja: () => import("./ja/geography"), zh: () => import("./zh/geography"),
  es: () => import("./es/geography"), "pt-br": () => import("./pt-br/geography"), de: () => import("./de/geography"),
  fr: () => import("./fr/geography"), vi: () => import("./vi/geography"), id: () => import("./id/geography"),
  th: () => import("./th/geography"), "zh-tw": () => import("./zh-tw/geography"), it: () => import("./it/geography"),
  nl: () => import("./nl/geography"), hi: () => import("./hi/geography"),
};

const languagePhrases = {
  ko: () => import("./ko/language"), ja: () => import("./ja/language"), zh: () => import("./zh/language"),
  es: () => import("./es/language"), "pt-br": () => import("./pt-br/language"), de: () => import("./de/language"),
  fr: () => import("./fr/language"), vi: () => import("./vi/language"), id: () => import("./id/language"),
  th: () => import("./th/language"), "zh-tw": () => import("./zh-tw/language"), it: () => import("./it/language"),
  nl: () => import("./nl/language"), hi: () => import("./hi/language"),
};

const technologyPhrases = {
  ko: () => import("./ko/technology"), ja: () => import("./ja/technology"), zh: () => import("./zh/technology"),
  es: () => import("./es/technology"), "pt-br": () => import("./pt-br/technology"), de: () => import("./de/technology"),
  fr: () => import("./fr/technology"), vi: () => import("./vi/technology"), id: () => import("./id/technology"),
  th: () => import("./th/technology"), "zh-tw": () => import("./zh-tw/technology"), it: () => import("./it/technology"),
  nl: () => import("./nl/technology"), hi: () => import("./hi/technology"),
};

const historyPhrases = {
  ko: () => import("./ko/history"), ja: () => import("./ja/history"), zh: () => import("./zh/history"),
  es: () => import("./es/history"), "pt-br": () => import("./pt-br/history"), de: () => import("./de/history"),
  fr: () => import("./fr/history"), vi: () => import("./vi/history"), id: () => import("./id/history"),
  th: () => import("./th/history"), "zh-tw": () => import("./zh-tw/history"), it: () => import("./it/history"),
  nl: () => import("./nl/history"), hi: () => import("./hi/history"),
};

const sciencePhrases = {
  ko: () => import("./ko/science"), ja: () => import("./ja/science"), zh: () => import("./zh/science"),
  es: () => import("./es/science"), "pt-br": () => import("./pt-br/science"), de: () => import("./de/science"),
  fr: () => import("./fr/science"), vi: () => import("./vi/science"), id: () => import("./id/science"),
  th: () => import("./th/science"), "zh-tw": () => import("./zh-tw/science"), it: () => import("./it/science"),
  nl: () => import("./nl/science"), hi: () => import("./hi/science"),
};

export async function generatedCopiesForLocale(
  questions: readonly QuizQuestion[], locale: TargetLocale,
): Promise<Map<string, QuestionLocaleCopy>> {
  const copies = new Map<string, QuestionLocaleCopy>();
  if (locale === "en") return copies;
  if (locale === "ru") {
    const { default: questionCopies } = await import("./ru/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "tr") {
    const { default: questionCopies } = await import("./tr/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "pl") {
    const { default: questionCopies } = await import("./pl/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "fil") {
    const { default: questionCopies } = await import("./fil/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "bn") {
    const { default: questionCopies } = await import("./bn/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "sv") {
    const { default: questionCopies } = await import("./sv/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "cs") {
    const { default: questionCopies } = await import("./cs/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "ms") {
    const { default: questionCopies } = await import("./ms/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "uk") {
    const { default: questionCopies } = await import("./uk/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (locale === "ro") {
    const { default: questionCopies } = await import("./ro/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
    return copies;
  }
  if (!(locales as readonly string[]).includes(locale)) return copies;
  const activeLocale = locale as Exclude<Locale, "ru" | "tr" | "pl" | "fil" | "bn" | "uk" | "ms" | "sv" | "cs" | "ro">;
  if (activeLocale === "en") return copies;
  if (questions.some((q) => q.id.startsWith("math-x-"))) {
    const { phrases } = await mathPhrases[activeLocale]();
    for (const question of questions) {
      const copy = mathPatternCopy(question, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("brain-x-pattern-"))) {
    const { phrases } = await brainPhrases[activeLocale]();
    for (const question of questions) {
      const copy = brainPatternCopy(question, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("geography-x-"))) {
    const { phrases, featurePhrases } = await geographyPhrases[activeLocale]();
    for (const question of questions) {
      const copy = capitalCopy(question, activeLocale, phrases) ?? featureCopy(question, activeLocale, featurePhrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("language-x-vocab-"))) {
    const { phrases } = await languagePhrases[activeLocale]();
    for (const question of questions) {
      const copy = vocabularyCopy(question, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("it-x-concept-"))) {
    const { phrases } = await technologyPhrases[activeLocale]();
    for (const question of questions) {
      const copy = technologyCopy(question, questions, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("history-x-"))) {
    const { phrases } = await historyPhrases[activeLocale]();
    for (const question of questions) {
      const copy = historyCopy(question, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("science-x-"))) {
    const { phrases } = await sciencePhrases[activeLocale]();
    for (const question of questions) {
      const copy = scienceCopy(question, questions, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (locale === "ko") {
    const [{ legacyKoreanCopies }, { generalKoreanCopy }, { nonsenseKoreanCopy }] = await Promise.all([
      import("./ko/legacy"), import("./ko/general-knowledge"), import("./ko/nonsense"),
    ]);
    for (const question of questions) {
      const copy = legacyKoreanCopies[question.id] ?? generalKoreanCopy(question) ?? nonsenseKoreanCopy(question);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (activeLocale === "ja" || activeLocale === "zh" || activeLocale === "es" || activeLocale === "pt-br" || activeLocale === "de" || activeLocale === "fr" || activeLocale === "vi" || activeLocale === "id" || activeLocale === "th" || activeLocale === "zh-tw" || activeLocale === "it" || activeLocale === "nl" || activeLocale === "hi") {
    const { default: questionCopies } = activeLocale === "ja"
      ? await import("./ja/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
      : activeLocale === "zh"
        ? await import("./zh/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
        : activeLocale === "es"
          ? await import("./es/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
          : activeLocale === "pt-br"
            ? await import("./pt-br/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
            : activeLocale === "de"
              ? await import("./de/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
              : activeLocale === "fr"
                ? await import("./fr/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                : activeLocale === "vi"
                  ? await import("./vi/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                  : activeLocale === "id"
                    ? await import("./id/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                    : activeLocale === "th"
                      ? await import("./th/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                      : activeLocale === "zh-tw"
                        ? await import("./zh-tw/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                        : activeLocale === "it"
                          ? await import("./it/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                          : activeLocale === "nl"
                            ? await import("./nl/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                            : await import("./hi/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
  }
  return copies;
}

import type { Locale } from "../../i18n";
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
  questions: readonly QuizQuestion[], locale: Locale,
): Promise<Map<string, QuestionLocaleCopy>> {
  const copies = new Map<string, QuestionLocaleCopy>();
  if (locale === "en") return copies;
  if (questions.some((q) => q.id.startsWith("math-x-"))) {
    const { phrases } = await mathPhrases[locale]();
    for (const question of questions) {
      const copy = mathPatternCopy(question, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("brain-x-pattern-"))) {
    const { phrases } = await brainPhrases[locale]();
    for (const question of questions) {
      const copy = brainPatternCopy(question, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("geography-x-"))) {
    const { phrases, featurePhrases } = await geographyPhrases[locale]();
    for (const question of questions) {
      const copy = capitalCopy(question, locale, phrases) ?? featureCopy(question, locale, featurePhrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("language-x-vocab-"))) {
    const { phrases } = await languagePhrases[locale]();
    for (const question of questions) {
      const copy = vocabularyCopy(question, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("it-x-concept-"))) {
    const { phrases } = await technologyPhrases[locale]();
    for (const question of questions) {
      const copy = technologyCopy(question, questions, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("history-x-"))) {
    const { phrases } = await historyPhrases[locale]();
    for (const question of questions) {
      const copy = historyCopy(question, phrases);
      if (copy) copies.set(question.id, copy);
    }
  }
  if (questions.some((q) => q.id.startsWith("science-x-"))) {
    const { phrases } = await sciencePhrases[locale]();
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
  if (locale === "ja" || locale === "zh" || locale === "es" || locale === "pt-br" || locale === "de" || locale === "fr" || locale === "vi" || locale === "id" || locale === "th" || locale === "zh-tw" || locale === "it" || locale === "nl" || locale === "hi") {
    const { default: questionCopies } = locale === "ja"
      ? await import("./ja/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
      : locale === "zh"
        ? await import("./zh/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
        : locale === "es"
          ? await import("./es/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
          : locale === "pt-br"
            ? await import("./pt-br/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
            : locale === "de"
              ? await import("./de/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
              : locale === "fr"
                ? await import("./fr/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                : locale === "vi"
                  ? await import("./vi/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                  : locale === "id"
                    ? await import("./id/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                    : locale === "th"
                      ? await import("./th/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                      : locale === "zh-tw"
                        ? await import("./zh-tw/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                        : locale === "it"
                          ? await import("./it/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                          : locale === "nl"
                            ? await import("./nl/question-bank.json") as { default: Record<string, QuestionLocaleCopy> }
                            : await import("./hi/question-bank.json") as { default: Record<string, QuestionLocaleCopy> };
    for (const question of questions) {
      const copy = questionCopies[question.id];
      if (copy) copies.set(question.id, copy);
    }
  }
  return copies;
}

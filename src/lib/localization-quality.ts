import type { Locale } from "./i18n";
import { detailCopy, discoveryCopy, locales, messages, uiMessages } from "./i18n";
import { categoryDescription, serviceGuide } from "./content-copy";
import { hasQuizTermTranslations, localizeMathPrompt, quizCategoryName } from "./quiz-copy";
import { categories, quizzes, type Quiz } from "./registry";
import { generateMathQuestion } from "./math";
import { questionCategoryForQuiz, questionCopyResultForLocale, questionTagForQuiz, type QuizQuestion } from "./question-bank/core";
import { loadQuestionBankForCategory } from "./question-bank/select-questions";

export const LOCALIZATION_INDEX_THRESHOLD = {
  questionRate: 0.95,
  choiceRate: 0.95,
  explanationRate: 0.9,
} as const;

export type LocalizationQuality = {
  complete: boolean;
  indexable: boolean;
  titleTranslated: boolean;
  descriptionTranslated: boolean;
  resultTranslated: boolean;
  questionRate: number;
  choiceRate: number;
  explanationRate: number;
  questionCount: number;
  translatedQuestionCount: number;
  choiceCount: number;
  translatedChoiceCount: number;
  explanationCount: number;
  translatedExplanationCount: number;
};

export type QuestionLocalizationGap = {
  questionId: string;
  category: string;
  englishQuestion: string;
  englishChoices: string[];
  englishExplanation: string;
  missing: Array<"question" | "choices" | "explanation">;
  missingChoiceIndexes: number[];
};

const poolCache = new Map<string, Promise<QuizQuestion[]>>();
const qualityCache = new Map<string, Promise<LocalizationQuality>>();

function isNeutral(value: string): boolean {
  return /^[\s\p{N}\p{S}\p{P}]+$/u.test(value);
}

function isPreservedChoice(question: QuizQuestion, value: string): boolean {
  if (isNeutral(value)) return true;
  if (question.category === "geography" && question.id.includes("capital")) return true;
  if (question.category === "history" && /^(?:\d{3,4}(?:\s?(?:BCE|CE|BC|AD))?|Ancient (?:Greece|Rome)|China|The Inca)$/i.test(value)) return true;
  if (question.category === "science" && /^(?:[A-Z][a-z]?|DNA|pH|ATP|UVB|Mohs scale)$/.test(value)) return true;
  if (question.category === "technology" && /^(?:Java|JavaScript|TypeScript|SQL|Git|HTTP(?:S)?|HTML|CSS|TCP|IP|DNS|API|JSON|Linux|Windows|React|Next\.js|CPU|RAM|SSD)$/i.test(value)) return true;
  return false;
}

function differentFromEnglish(value: string, english: string): boolean {
  return value.trim().length > 0 && value.trim() !== english.trim();
}

function hasLocalizedLabel(locale: Locale, key: string, value: string, english: string): boolean {
  if (differentFromEnglish(value, english)) return true;
  const sharedLabels: Partial<Record<Locale, Record<string, string>>> = {
    es: { title: "Quiz" }, "pt-br": { title: "Quiz" }, de: { title: "Quiz" },
    fr: { title: "Quiz", question: "Question", contact: "Contact", score: "Score" },
    it: { title: "Quiz", home: "Home", privacy: "Privacy" },
    nl: { title: "Quiz", home: "Home", privacy: "Privacy", contact: "Contact", score: "Score" },
  };
  return sharedLabels[locale]?.[key] === value;
}

function resultCopyIsLocalized(locale: Locale): boolean {
  if (locale === "en") return true;
  const fields = [
    messages[locale].result, messages[locale].score, messages[locale].retry,
    uiMessages[locale].correct, uiMessages[locale].incorrect, uiMessages[locale].accuracy,
    detailCopy[locale].correctCount, detailCopy[locale].incorrectCount,
    detailCopy[locale].newSet, detailCopy[locale].otherQuizzes,
    serviceGuide[locale].scoreLow, serviceGuide[locale].scoreMid, serviceGuide[locale].scoreHigh,
  ];
  const english = [
    messages.en.result, messages.en.score, messages.en.retry,
    uiMessages.en.correct, uiMessages.en.incorrect, uiMessages.en.accuracy,
    detailCopy.en.correctCount, detailCopy.en.incorrectCount,
    detailCopy.en.newSet, detailCopy.en.otherQuizzes,
    serviceGuide.en.scoreLow, serviceGuide.en.scoreMid, serviceGuide.en.scoreHigh,
  ];
  const keys = ["result", "score", "retry", "correct", "incorrect", "accuracy", "correctCount", "incorrectCount", "newSet", "otherQuizzes", "scoreLow", "scoreMid", "scoreHigh"];
  return fields.every((value, index) => hasLocalizedLabel(locale, keys[index], value, english[index]));
}

function listPageIsLocalized(locale: Locale): boolean {
  if (locale === "en") return true;
  const ui = uiMessages[locale];
  const base = uiMessages.en;
  const messagesLocalized = [
    messages[locale].title, messages[locale].subtitle, messages[locale].search,
    messages[locale].today, messages[locale].categories, messages[locale].popular,
    messages[locale].play, messages[locale].question, messages[locale].next,
    messages[locale].submit, messages[locale].result, messages[locale].retry,
    messages[locale].home, messages[locale].related, messages[locale].score, messages[locale].footer,
  ].every((value, index) => hasLocalizedLabel(locale, [
    "title", "subtitle", "search", "today", "categories", "popular", "play", "question",
    "next", "submit", "result", "retry", "home", "related", "score", "footer",
  ][index], value, [
    messages.en.title, messages.en.subtitle, messages.en.search, messages.en.today,
    messages.en.categories, messages.en.popular, messages.en.play, messages.en.question,
    messages.en.next, messages.en.submit, messages.en.result, messages.en.retry,
    messages.en.home, messages.en.related, messages.en.score, messages.en.footer,
  ][index]));
  const discoveryLocalized = [
    discoveryCopy[locale].intro, discoveryCopy[locale].quickStart,
    discoveryCopy[locale].searchResults, discoveryCopy[locale].browseCategories,
    discoveryCopy[locale].clearSearch,
  ].every((value, index) => differentFromEnglish(value, [
    discoveryCopy.en.intro, discoveryCopy.en.quickStart, discoveryCopy.en.searchResults,
    discoveryCopy.en.browseCategories, discoveryCopy.en.clearSearch,
  ][index]));
  const categoriesLocalized = categories.every((category) => {
    const label = quizCategoryName(locale, category);
    const englishLabel = quizCategoryName("en", category);
    return Boolean(label) && (differentFromEnglish(label, englishLabel ?? category) || label === "IT");
  }) && categories.every((category) => differentFromEnglish(categoryDescription(locale, category), categoryDescription("en", category)));
  const quizzesLocalized = quizzes.filter((quiz) => quiz.isPublic).every((quiz) =>
    hasQuizTermTranslations(locale, [quiz.slug])
    && differentFromEnglish(categoryDescription(locale, quiz.category), categoryDescription("en", quiz.category)),
  );
  const footerLocalized = [ui.footerTagline, ui.privacy, ui.guidelines, ui.contact]
    .every((value, index) => hasLocalizedLabel(locale, ["footerTagline", "privacy", "guidelines", "contact"][index], value, [base.footerTagline, base.privacy, base.guidelines, base.contact][index]));
  return messagesLocalized && discoveryLocalized && categoriesLocalized && quizzesLocalized && footerLocalized && resultCopyIsLocalized(locale);
}

export function getListLocalizationQuality(locale: Locale): { complete: boolean; indexable: boolean } {
  const complete = listPageIsLocalized(locale);
  return { complete, indexable: complete };
}

export function getIndexableListLocales(): Locale[] {
  return locales.filter((locale) => getListLocalizationQuality(locale).indexable);
}

function getPool(category: string, locale: Locale): Promise<QuizQuestion[]> {
  const key = `${locale}:${category}`;
  let pool = poolCache.get(key);
  if (!pool) {
    pool = loadQuestionBankForCategory(category, locale);
    poolCache.set(key, pool);
  }
  return pool;
}

async function questionsForQuiz(quiz: Quiz, locale: Locale): Promise<QuizQuestion[]> {
  if (quiz.mode !== "bank") return [];
  const category = questionCategoryForQuiz(quiz.slug, quiz.category);
  const sourceCategory = category === "all" ? "all" : category;
  const pool = await getPool(sourceCategory, locale);
  const tag = questionTagForQuiz(quiz.slug);
  const matches = pool.filter((question) =>
    (category === "all" || question.category === category || question.tags?.includes(category))
    && (!tag || question.tags?.includes(tag)),
  );
  const eligible = matches.filter((question) => quiz.difficulty.includes(question.difficulty));
  const count = typeof quiz.count === "number" ? quiz.count : 10;
  if (tag && eligible.length < count) {
    return pool.filter((question) =>
      (category === "all" || question.category === category || question.tags?.includes(category))
      && quiz.difficulty.includes(question.difficulty),
    );
  }
  return eligible;
}

export async function getQuizQuestionPoolIds(quiz: Quiz): Promise<string[]> {
  return (await questionsForQuiz(quiz, "en")).map((question) => question.id);
}

function rate(translated: number, total: number): number {
  return total === 0 ? 1 : translated / total;
}

const dynamicMathPromptSamples: Record<string, string[]> = {
  "addition-quiz": ["3 + 4 = ?"],
  "subtraction-quiz": ["8 − 3 = ?"],
  "multiplication-quiz": ["3 × 4 = ?"],
  "multiplication-table-quiz": ["3 × 4 = ?"],
  "division-quiz": ["12 ÷ 3 = ?"],
  "fraction-quiz": ["1/2 + 1/2 = ? (decimal)"],
  "percentage-quiz": ["20% of 50 = ?"],
  "equation-quiz": ["x + 3 = 8. What is x?"],
  "mental-math-quiz": ["3 + 4 = ?", "8 − 3 = ?", "3 × 4 = ?"],
  "arithmetic-challenge": ["3 + 4 = ?", "8 − 3 = ?", "3 × 4 = ?"],
};

export async function getQuizLocalizationQuality(locale: Locale, quiz: Quiz): Promise<LocalizationQuality> {
  const cacheKey = `${locale}:${quiz.slug}`;
  let pending = qualityCache.get(cacheKey);
  if (!pending) {
    pending = (async () => {
      const titleTranslated = locale === "en" || hasQuizTermTranslations(locale, [quiz.slug]);
      const descriptionTranslated = locale === "en" || differentFromEnglish(categoryDescription(locale, quiz.category), categoryDescription("en", quiz.category));
      const resultTranslated = resultCopyIsLocalized(locale);

      if (quiz.mode !== "bank") {
        let questionRate = 1;
        if (quiz.mode === "dynamic" && locale !== "en") {
          let translatedPrompts = 0;
          const samples = dynamicMathPromptSamples[quiz.slug] ?? [generateMathQuestion(quiz.slug).prompt];
          for (const prompt of samples) {
            const localizedPrompt = localizeMathPrompt(locale, prompt);
            const sharedDecimalLabel = prompt.includes("(decimal)") && (locale === "es" || locale === "pt-br");
            if (differentFromEnglish(localizedPrompt, prompt) || isNeutral(prompt) || sharedDecimalLabel) translatedPrompts++;
          }
          questionRate = translatedPrompts / samples.length;
        }
        const complete = titleTranslated && descriptionTranslated && resultTranslated
          && questionRate >= LOCALIZATION_INDEX_THRESHOLD.questionRate;
        return {
          complete, indexable: locale === "en" || complete,
          titleTranslated, descriptionTranslated, resultTranslated,
          questionRate, choiceRate: 1, explanationRate: 1,
          questionCount: 0, translatedQuestionCount: 0, choiceCount: 0,
          translatedChoiceCount: 0, explanationCount: 0, translatedExplanationCount: 0,
        };
      }

      const questions = await questionsForQuiz(quiz, locale);
      let translatedQuestionCount = 0;
      let choiceCount = 0;
      let translatedChoiceCount = 0;
      let explanationCount = 0;
      let translatedExplanationCount = 0;
      for (const question of questions) {
        const result = questionCopyResultForLocale(question, locale);
        if (!result.questionIsFallback || isNeutral(result.value.question)) translatedQuestionCount++;
        const copy = result.value;
        question.options.forEach((original, index) => {
          if (isPreservedChoice(question, original)) return;
          choiceCount++;
          if (!result.optionFallbacks[index] && copy.options[index] !== original) translatedChoiceCount++;
        });
        if (!isNeutral(question.explanation)) {
          explanationCount++;
          if (!result.explanationIsFallback && copy.explanation !== question.explanation) translatedExplanationCount++;
        }
      }
      const questionRate = rate(translatedQuestionCount, questions.length);
      const choiceRate = rate(translatedChoiceCount, choiceCount);
      const explanationRate = rate(translatedExplanationCount, explanationCount);
      const complete = titleTranslated && descriptionTranslated && resultTranslated
        && questionRate >= LOCALIZATION_INDEX_THRESHOLD.questionRate
        && choiceRate >= LOCALIZATION_INDEX_THRESHOLD.choiceRate
        && explanationRate >= LOCALIZATION_INDEX_THRESHOLD.explanationRate;
      return {
        complete, indexable: locale === "en" || complete,
        titleTranslated, descriptionTranslated, resultTranslated,
        questionRate, choiceRate, explanationRate,
        questionCount: questions.length, translatedQuestionCount,
        choiceCount, translatedChoiceCount, explanationCount, translatedExplanationCount,
      };
    })();
    qualityCache.set(cacheKey, pending);
  }
  return pending;
}

export async function getIndexableQuizLocales(slug: string): Promise<Locale[]> {
  const quiz = quizzes.find((item) => item.slug === slug && item.isPublic);
  if (!quiz) return [];
  const available: Locale[] = [];
  for (const locale of locales) {
    const quality = await getQuizLocalizationQuality(locale, quiz);
    if (quality.indexable) available.push(locale);
  }
  return available;
}

export async function getLocalizationAudit() {
  const byLocale: Record<Locale, { questionFallbacks: number; choiceFallbacks: number; explanationFallbacks: number; indexableQuizCount: number; noindexQuizCount: number }> = {} as Record<Locale, { questionFallbacks: number; choiceFallbacks: number; explanationFallbacks: number; indexableQuizCount: number; noindexQuizCount: number }>;
  const detailQuizzes = quizzes.filter((quiz) => quiz.isPublic);
  for (const locale of locales) {
    let questionFallbacks = 0;
    let choiceFallbacks = 0;
    let explanationFallbacks = 0;
    let indexableQuizCount = 0;
    for (const quiz of detailQuizzes) {
      const quality = await getQuizLocalizationQuality(locale, quiz);
      if (quality.indexable) indexableQuizCount++;
    }
    if (locale !== "en") {
      for (const question of await getPool("all", locale)) {
        const copy = questionCopyResultForLocale(question, locale).value;
        if (copy.question === question.question) questionFallbacks++;
        question.options.forEach((option, index) => { if (copy.options[index] === option) choiceFallbacks++; });
        if (copy.explanation === question.explanation) explanationFallbacks++;
      }
    }
    byLocale[locale] = {
      questionFallbacks, choiceFallbacks, explanationFallbacks,
      indexableQuizCount,
      noindexQuizCount: detailQuizzes.length - indexableQuizCount,
    };
  }
  const listLocales = getIndexableListLocales();
  const detailUrlCount = Object.values(byLocale).reduce((sum, item) => sum + item.indexableQuizCount, 0);
  return {
    byLocale,
    detailQuizCount: detailQuizzes.length,
    listIndexableLocales: listLocales,
    listPageCount: listLocales.length,
    detailUrlCount,
    sitemapUrlCount: listLocales.length + detailUrlCount,
  };
}

export async function getQuestionLocalizationGaps(locale: Locale): Promise<QuestionLocalizationGap[]> {
  if (locale === "en") return [];
  const gaps: QuestionLocalizationGap[] = [];
  for (const question of await getPool("all", locale)) {
    const copy = questionCopyResultForLocale(question, locale);
    const missingChoiceIndexes = question.options.flatMap((option, index) => copy.optionFallbacks[index] ? [index] : []);
    const missing: QuestionLocalizationGap["missing"] = [];
    if (copy.questionIsFallback) missing.push("question");
    if (missingChoiceIndexes.length) missing.push("choices");
    if (copy.explanationIsFallback) missing.push("explanation");
    if (missing.length) gaps.push({
      questionId: question.id,
      category: question.category,
      englishQuestion: question.question,
      englishChoices: [...question.options],
      englishExplanation: question.explanation,
      missing,
      missingChoiceIndexes,
    });
  }
  return gaps;
}

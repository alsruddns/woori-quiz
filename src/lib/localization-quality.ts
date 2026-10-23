import type { Locale } from "./i18n";
import { detailCopy, discoveryCopy, locales, messages, publishedLocales, uiMessages } from "./i18n";
import { categoryDescription, serviceGuide } from "./content-copy";
import { hasQuizTermTranslations, localizeMathPrompt, quizCategoryName } from "./quiz-copy";
import { categories, quizzes, type Quiz } from "./registry";
import { generateMathQuestion } from "./math";
import { questionCategoryForQuiz, questionCopyResultForLocale, questionTagForQuiz, type QuizQuestion } from "./question-bank/core";
import { loadQuestionBankForCategory } from "./question-bank/select-questions";

export const LOCALIZATION_INDEX_THRESHOLD = {
  questionRate: 1,
  choiceRate: 1,
  explanationRate: 1,
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
const localeContentCache = new Map<Locale, Promise<boolean>>();

function isNeutral(value: string): boolean {
  return /^[\s\p{N}\p{S}\p{P}]+$/u.test(value);
}

const spanishInvariantChoices = new Set([
  "Antonio Vivaldi", "Asia", "Australia", "Austria", "Beagle", "Buchaechum", "Buzz Aldrin",
  "Chuseok", "Galileo", "Gayageum", "Hangul", "Hanok", "Isaac Newton", "Johannes Gutenberg",
  "John Glenn", "Kimchi", "Lava", "Magma", "Marco Polo", "Mayflower", "Neil Armstrong",
  "Newton", "No", "Ondol", "Origami", "Osaka", "Pascal", "Persia", "Piano",
  "Proxima Centauri", "Rugby", "Sapporo", "Ssireum", "Tanzania", "Uganda", "Venus",
  "Yen", "Yuri Gagarin",
]);
const brazilianPortugueseInvariantChoices = new Set([
  "Antonio Vivaldi", "Badminton", "Beagle", "Buchaechum", "Buzz Aldrin", "Chuseok", "Endeavour",
  "Galileo", "Gayageum", "Hangul", "Hanok", "Isaac Newton", "Johannes Gutenberg", "John Glenn",
  "Joule", "Kimchi", "Kyoto", "Lava", "Magma", "Marco Polo", "Mayflower", "Michelangelo",
  "Neil Armstrong", "Newton", "Ondol", "Origami", "Osaka", "Ampere", "Pascal", "Peru",
  "Piano", "Proxima Centauri", "Rugby", "Santa Maria", "Sapporo", "Ssireum", "Uganda", "Watt",
  "Won", "Yuri Gagarin",
]);
const germanInvariantChoices = new Set([
  "Aluminium", "Ampere", "Antonio Vivaldi", "Argon", "Avocado", "Badminton", "Barometer", "Beagle",
  "Buchaechum", "Buzz Aldrin", "Cello", "Chuseok", "Endeavour", "England", "Galileo", "Gayageum",
  "Hangul", "Hanok", "Helium", "Hygrometer", "Isaac Newton", "Johannes Gutenberg", "John Glenn",
  "Joule", "Jupiter", "Kimchi", "Kyoto", "Lava", "Magma", "Marco Polo", "Mars", "Mayflower", "Meter",
  "Michelangelo", "Monitor", "Neil Armstrong", "Neutron", "Newton", "Ondol", "Origami", "Osaka",
  "Pascal", "Peru", "Photon", "Proxima Centauri", "Proton", "Roman", "Router", "Rugby", "Santa Maria",
  "Sapporo", "Saturn", "Seine", "Seoul", "Ssireum", "Sublimation", "Sudan", "Tennis", "Thermometer",
  "Uganda", "Uniform Resource Locator", "Venus", "Vitamin C", "Vitamin D", "Watt", "Yen", "Yuri Gagarin",
]);
const frenchInvariantChoices = new Set([
  "Aluminium", "Argon", "Badminton", "Beagle", "Buchaechum", "Buzz Aldrin", "Canada", "Chuseok",
  "Danube", "Europe", "Gayageum", "Glucose", "Hanok", "Inscription", "Isaac Newton", "Joule",
  "Jupiter", "Kenya", "Kimchi", "Kyoto", "Magma", "Mars", "Marco Polo", "Neutron", "Newton",
  "Octal", "Ondol", "Origami", "Piano", "Photon", "Positive", "Proton", "Ribosome", "Rome",
  "Rugby", "Sapporo", "Seine", "Six", "Sublimation", "Tokyo", "Triangle", "Tennis", "Watt",
  "Yen", "Yuri Gagarin", "Antonio Vivaldi", "Johannes Gutenberg", "Neil Armstrong", "John Glenn",
  "Buzz Aldrin", "Santa Maria", "Mayflower", "Endeavour", "Uganda", "Peru", "Pascal", "Michelangelo",
  "Quartz", "Fruit", "Friction", "Milan", "Naples", "Omnivore", "Ssireum",
]);
const vietnameseInvariantChoices = new Set([
  "Antonio Vivaldi", "Argon", "Buchaechum", "Buzz Aldrin", "Canada", "Cello", "Chuseok", "Corundum",
  "Ethiopia", "Galileo", "Glucose", "Hangul", "Hanok", "Isaac Newton", "Johannes Gutenberg",
  "John Glenn", "Jordan", "Kenya", "Kyoto", "Magma", "Marco Polo", "Michelangelo", "Neil Armstrong",
  "Newton", "Origami", "Osaka", "Pascal", "Peru", "Photon", "Proxima Centauri", "Santa Maria",
  "Sapporo", "Seoul", "Ssireum", "Sudan", "Tanzania", "Tokyo", "Uganda", "Venice", "Vitamin C", "Vitamin D",
]);
const indonesianInvariantChoices = new Set([
  "Aluminium", "Ampere", "Antonio Vivaldi", "Argon", "Asia", "Australia", "Austria", "Barometer",
  "Buchaechum", "Buzz Aldrin", "Chuseok", "Danube", "Denmark", "Galileo", "Gayageum", "Hangul",
  "Hanok", "Helium", "Isaac Newton", "Johannes Gutenberg", "John Glenn", "Joule", "Jupiter", "Kenya",
  "Kimchi", "Kyoto", "Lava", "Magma", "Mars", "Meter", "Michelangelo", "Milan", "Newton", "Nitrogen",
  "Ondol", "Orbit", "Origami", "Osaka", "Pascal", "Persia", "Peru", "Piano", "Proton",
  "Proxima Centauri", "Santa Maria", "Sapporo", "Sudan", "Tanzania", "Tokyo", "Uganda", "Venus",
  "Vitamin C", "Vitamin D", "Watt", "Won", "Yen", "Yuri Gagarin",
]);
const italianInvariantChoices = new Set([
  "Africa", "Ampere", "Antonio Vivaldi", "Argon", "Asia", "Australia", "Austria", "Avocado", "Badminton",
  "Beagle", "Buchaechum", "Buzz Aldrin", "Calcite", "Canada", "Chuseok", "Galileo", "Gayageum", "Hangul",
  "Hanok", "Johannes Gutenberg", "John Glenn", "Joule", "Kimchi", "Kyoto", "Lava", "Magma", "Marco Polo",
  "Mayflower", "Michelangelo", "Neil Armstrong", "Newton", "Ondol", "Origami", "Osaka", "Pascal", "Persia",
  "Router", "Rugby", "Sapporo", "Sudan", "Tanzania", "Tennis", "Uganda", "Watt", "Yen", "Yuri Gagarin",
]);
const dutchInvariantChoices = new Set([
  "Aluminium", "Antarctica", "Antonio Vivaldi", "Argon", "Avocado", "Badminton", "Barometer", "Buchaechum",
  "Buzz Aldrin", "Canada", "Cello", "Chuseok", "Fruit", "Galileo", "Gayageum", "Glucose", "Hangul", "Hanok",
  "Helium", "Hygrometer", "Johannes Gutenberg", "John Glenn", "Joule", "Jupiter", "Kimchi", "Lava", "Magma",
  "Marco Polo", "Mars", "Meter", "Michelangelo", "Monitor", "Neil Armstrong", "Neutron", "Newton", "Ondol",
  "Origami", "Osaka", "Pascal", "Peru", "Piano", "Printer", "Proton", "Proxima Centauri", "Rome", "Router",
  "Rugby", "Santa Maria", "Sapporo", "Seine", "Tanzania", "Tennis", "Thermometer", "Venus", "Watt", "Won", "Yen",
]);
const turkishInvariantChoices = new Set([
  "Antonio Vivaldi", "Argon", "Ampere", "Badminton", "Beagle", "Buchaechum", "Buzz Aldrin",
  "Chuseok", "Endeavour", "Galileo", "Gayageum", "Hangul", "Hanok", "Isaac Newton", "Kenya",
  "Johannes Gutenberg", "John Glenn", "Joule", "Kimchi", "Kyoto", "Marco Polo", "Mayflower", "Mars",
  "Magma", "Michelangelo", "Milan", "Neil Armstrong", "Newton", "Ondol", "Origami", "Osaka",
  "Pascal", "Peru", "Proxima Centauri", "Proton", "Neutron", "Rugby", "Santa Maria", "Sapporo", "Seine",
  "Ssireum", "Sudan", "Thames", "Tokyo", "Topaz", "Uganda", "Watt", "Yen", "Yuri Gagarin",
]);
export const polishInvariantChoices = new Set([
  "0 \u00b0C", "10 \u00b0C", "32 \u00b0C", "50 \u00b0C", "75 \u00b0C", "100 \u00b0C", "150 \u00b0C", "0\u00b0", "15\u00b0", "30\u00b0",
  "C", "S", "T", "U", "V", "O", "Na", "Fe", "Au", "NaCl", "DNA", "Proton", "Neutron", "Argon", "Aluminium",
  "Ampere", "Joule", "Newton", "Pascal", "Saturn", "Magma", "Mars", "Proxima Centauri", "Badminton", "Piano", "Rugby",
  "Hangul", "Ssireum", "Origami", "Buchaechum", "Gayageum", "Ondol", "Canberra", "Australia", "Ottawa", "Bras\u00edlia", "Buenos Aires",
  "Santiago", "Lima", "Berlin", "Oslo", "Helsinki", "Nairobi", "Addis Ababa", "Abuja", "Bangkok", "Hanoi", "Jakarta",
  "Wellington", "Dublin", "Reykjav\u00edk", "Ankara", "Sapporo", "Sudan", "Austria", "Peru", "Tanzania", "Uganda", "Milan",
  "Galileo", "Antonio Vivaldi", "Michelangelo", "Johannes Gutenberg", "Isaac Newton", "Marco Polo", "Buzz Aldrin", "Yuri Gagarin",
  "Neil Armstrong", "John Glenn", "Santa Maria", "Java", "JavaScript", "Swift", "Router", "Monitor", "SQL", "HTML", "CSS", "PNG",
  ".png", ".mp3", ".csv", ".exe", "Islamabad", "Dhaka", "Osaka", "Rabat", "Ulaanbaatar", "Topaz", "Beagle", "Chuseok", "Hanok", "Pentagon",
  "Santa Maria", "Mayflower", "Endeavour",
]);

function isPreservedChoice(question: QuizQuestion, value: string, locale: Locale): boolean {
  if (isNeutral(value)) return true;
  if (locale === "tr" && turkishInvariantChoices.has(value)) return true;
  if (locale === "pl" && polishInvariantChoices.has(value)) return true;
  if (locale === "es" && spanishInvariantChoices.has(value)) return true;
  if (locale === "pt-br" && brazilianPortugueseInvariantChoices.has(value)) return true;
  if (locale === "de" && germanInvariantChoices.has(value)) return true;
  if (locale === "fr" && frenchInvariantChoices.has(value)) return true;
  if (locale === "vi" && vietnameseInvariantChoices.has(value)) return true;
  if (locale === "id" && indonesianInvariantChoices.has(value)) return true;
  if (locale === "it" && italianInvariantChoices.has(value)) return true;
  if (locale === "nl" && dutchInvariantChoices.has(value)) return true;
  if (question.category === "language") return true;
  if (question.category === "brain" && /^[A-Z]$/.test(value)) return true;
  if (/^[\d,.]+\s?(?:°[CF]|km\/s)$/.test(value)) return true;
  if (question.category === "science" && /^(?:CO₂|H₂O|O₂|NaCl)$/.test(value)) return true;
  if (question.category === "geography" && question.id.includes("capital")) return true;
  if (question.category === "history" && /^(?:\d{3,4}(?:\s?(?:BCE|CE|BC|AD))?|Ancient (?:Greece|Rome)|China|The Inca)$/i.test(value)) return true;
  if (question.category === "science" && /^(?:[A-Z][a-z]?|DNA|pH|ATP|UVB|Mohs scale)$/.test(value)) return true;
  if (question.category === "technology" && /^(?:Java|JavaScript|TypeScript|SQL|Git|HTTP(?:S)?|HTML|CSS|TCP|IP|DNS|API|JSON|Linux|Windows|React|Next\.js|CPU|RAM|SSD|C|Swift|PNG|\.(?:png|mp3|csv|exe))$/i.test(value)) return true;
  return false;
}

function differentFromEnglish(value: string, english: string): boolean {
  return value.trim().length > 0 && !/[\uFFFD]|\?{2,}/u.test(value) && value.trim() !== english.trim();
}

function hasLocalizedLabel(locale: Locale, key: string, value: string, english: string): boolean {
  if (/[\uFFFD]|\?{2,}/u.test(value)) return false;
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

export async function getListLocalizationQuality(locale: Locale): Promise<{ complete: boolean; indexable: boolean }> {
  const complete = await localeContentIsComplete(locale);
  return { complete, indexable: complete && publishedLocales.includes(locale as (typeof publishedLocales)[number]) };
}

export async function getIndexableListLocales(): Promise<Locale[]> {
  const available: Locale[] = [];
  for (const locale of publishedLocales) {
    if ((await getListLocalizationQuality(locale)).indexable) available.push(locale);
  }
  return available;
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

async function localeContentIsComplete(locale: Locale): Promise<boolean> {
  if (locale === "en") return true;
  let pending = localeContentCache.get(locale);
  if (!pending) {
    pending = (async () => {
      const questions = await getPool("all", locale);
      for (const question of questions) {
        const result = questionCopyResultForLocale(question, locale);
        if (result.questionIsFallback && !isNeutral(result.value.question)) return false;
        if (question.options.some((option, index) =>
          result.optionFallbacks[index] && !isPreservedChoice(question, option, locale),
        )) return false;
        if (!isNeutral(question.explanation) && result.explanationIsFallback) return false;
      }
      return listPageIsLocalized(locale);
    })();
    localeContentCache.set(locale, pending);
  }
  return pending;
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
      const localeComplete = await localeContentIsComplete(locale);

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
        const complete = localeComplete && titleTranslated && descriptionTranslated && resultTranslated
          && questionRate >= LOCALIZATION_INDEX_THRESHOLD.questionRate;
        return {
          complete, indexable: locale === "en" || (publishedLocales.includes(locale as (typeof publishedLocales)[number]) && complete),
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
          if (isPreservedChoice(question, original, locale)) return;
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
      const complete = localeComplete && titleTranslated && descriptionTranslated && resultTranslated
        && questionRate >= LOCALIZATION_INDEX_THRESHOLD.questionRate
        && choiceRate >= LOCALIZATION_INDEX_THRESHOLD.choiceRate
        && explanationRate >= LOCALIZATION_INDEX_THRESHOLD.explanationRate;
      return {
        complete, indexable: locale === "en" || (publishedLocales.includes(locale as (typeof publishedLocales)[number]) && complete),
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
  for (const locale of publishedLocales) {
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
      if (quality.indexable && publishedLocales.includes(locale as (typeof publishedLocales)[number])) indexableQuizCount++;
    }
    if (locale !== "en") {
      for (const question of await getPool("all", locale)) {
        const copy = questionCopyResultForLocale(question, locale).value;
        if (copy.question === question.question) questionFallbacks++;
        question.options.forEach((option, index) => {
          if (copy.options[index] === option && !isPreservedChoice(question, option, locale)) choiceFallbacks++;
        });
        if (copy.explanation === question.explanation) explanationFallbacks++;
      }
    }
    byLocale[locale] = {
      questionFallbacks, choiceFallbacks, explanationFallbacks,
      indexableQuizCount,
      noindexQuizCount: detailQuizzes.length - indexableQuizCount,
    };
  }
  const listLocales = await getIndexableListLocales();
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
    const missingChoiceIndexes = question.options.flatMap((option, index) =>
      copy.optionFallbacks[index] && !isPreservedChoice(question, option, locale) ? [index] : [],
    );
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

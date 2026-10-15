import { legacyQuestionBank, selectQuestions, type QuestionFilter, type QuizQuestion } from "./core";
import type { Locale } from "../i18n";

export async function loadQuestionBankForCategory(category: string, locale?: Locale): Promise<QuizQuestion[]> {
  let questions: QuizQuestion[];
  if (category === "all") {
    const [general, nonsense, math, brain, history, science, geography, language, it] = await Promise.all([
      import("./general-knowledge"), import("./nonsense"), import("./math"), import("./brain-teaser"),
      import("./history"), import("./science"), import("./geography"), import("./language"), import("./it"),
    ]);
    questions = [...legacyQuestionBank, ...general.generalKnowledgeQuestions, ...nonsense.nonsenseQuestions, ...math.mathQuestions,
      ...brain.brainQuestions, ...history.historyQuestions, ...science.scienceQuestions, ...geography.geographyQuestions,
      ...geography.geographyFeatureQuestions, ...language.languageQuestions, ...it.itQuestions];
  } else {
    const categoryQuestions = category === "general" ? (await import("./general-knowledge")).generalKnowledgeQuestions
    : category === "nonsense" ? (await import("./nonsense")).nonsenseQuestions
      : category === "math" ? (await import("./math")).mathQuestions
        : category === "brain" ? (await import("./brain-teaser")).brainQuestions
          : category === "history" ? (await import("./history")).historyQuestions
            : category === "science" ? (await import("./science")).scienceQuestions
              : category === "geography" ? [...(await import("./geography")).geographyQuestions, ...(await import("./geography")).geographyFeatureQuestions]
                : category === "language" ? (await import("./language")).languageQuestions
                  : category === "technology" ? (await import("./it")).itQuestions : [];
    questions = [...legacyQuestionBank.filter((question) => question.category === category), ...categoryQuestions];
  }
  if (!locale || locale === "en") return questions;
  const { generatedCopiesForLocale } = await import("./locales");
  const copies = await generatedCopiesForLocale(questions, locale);
  return questions.map((question) => {
    const copy = copies.get(question.id);
    return copy ? { ...question, localizations: { ...question.localizations, [locale]: copy } } : question;
  });
}

export function selectQuestionsForCategory(pool: readonly QuizQuestion[], filter: QuestionFilter): QuizQuestion[] {
  return selectQuestions(pool, filter);
}

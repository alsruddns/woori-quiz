import { legacyQuestionBank, selectQuestions, type QuestionFilter, type QuizQuestion } from "./core";

export async function loadQuestionBankForCategory(category: string): Promise<QuizQuestion[]> {
  if (category === "all") {
    const [general, nonsense, math, brain, history, science, geography, language, it] = await Promise.all([
      import("./general-knowledge"), import("./nonsense"), import("./math"), import("./brain-teaser"),
      import("./history"), import("./science"), import("./geography"), import("./language"), import("./it"),
    ]);
    return [...legacyQuestionBank, ...general.generalKnowledgeQuestions, ...nonsense.nonsenseQuestions, ...math.mathQuestions,
      ...brain.brainQuestions, ...history.historyQuestions, ...science.scienceQuestions, ...geography.geographyQuestions,
      ...geography.geographyFeatureQuestions, ...language.languageQuestions, ...it.itQuestions];
  }
  const categoryQuestions = category === "general" ? (await import("./general-knowledge")).generalKnowledgeQuestions
    : category === "nonsense" ? (await import("./nonsense")).nonsenseQuestions
      : category === "math" ? (await import("./math")).mathQuestions
        : category === "brain" ? (await import("./brain-teaser")).brainQuestions
          : category === "history" ? (await import("./history")).historyQuestions
            : category === "science" ? (await import("./science")).scienceQuestions
              : category === "geography" ? [...(await import("./geography")).geographyQuestions, ...(await import("./geography")).geographyFeatureQuestions]
                : category === "language" ? (await import("./language")).languageQuestions
                  : category === "technology" ? (await import("./it")).itQuestions : [];
  return [...legacyQuestionBank.filter((question) => question.category === category), ...categoryQuestions];
}

export function selectQuestionsForCategory(pool: readonly QuizQuestion[], filter: QuestionFilter): QuizQuestion[] {
  return selectQuestions(pool, filter);
}

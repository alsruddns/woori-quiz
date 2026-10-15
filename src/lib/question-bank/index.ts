import { legacyQuestionBank } from "./core";
import { generalKnowledgeQuestions } from "./general-knowledge";
import { nonsenseQuestions } from "./nonsense";
import { mathQuestions } from "./math";
import { brainQuestions } from "./brain-teaser";
import { historyQuestions } from "./history";
import { scienceQuestions } from "./science";
import { geographyQuestions, geographyFeatureQuestions } from "./geography";
import { languageQuestions } from "./language";
import { itQuestions } from "./it";

export * from "./core";
export * from "./types";

export const questionBank = [
  ...legacyQuestionBank,
  ...generalKnowledgeQuestions,
  ...nonsenseQuestions,
  ...mathQuestions,
  ...brainQuestions,
  ...historyQuestions,
  ...scienceQuestions,
  ...geographyQuestions,
  ...geographyFeatureQuestions,
  ...languageQuestions,
  ...itQuestions,
];

import type { QuestionLocaleCopy, QuizQuestion } from "../types";

export type HistoryPhrases = {
  events: readonly string[];
  places: readonly [string, string, string, string]; // Ancient Greece, Ancient Rome, Inca, China
  when: (event: string) => string;
  where: (event: string) => string;
  who: (event: string) => string;
  whenWhy: (event: string, date: string) => string;
  whereWhy: (event: string, place: string) => string;
  whoWhy: (event: string, people: string) => string;
};

const placeAnswers = ["Ancient Greece", "Ancient Rome", "The Inca", "China"];

export function historyCopy(question: QuizQuestion, phrases: HistoryPhrases): QuestionLocaleCopy | undefined {
  const match = /^history-x-(\d+)$/.exec(question.id);
  if (!match) return undefined;
  const index = Number(match[1]) - 1;
  const event = phrases.events[index];
  if (!event || phrases.events.length !== 40 || phrases.places.length !== 4) throw new Error(`Invalid history event: ${question.id}`);
  const options = question.options.map((option) => {
    const placeIndex = placeAnswers.indexOf(option);
    return placeIndex < 0 ? option : phrases.places[placeIndex];
  });
  const answer = options[question.answer];
  const isWhere = index === 21 || index === 22 || index === 24;
  const isWho = index === 23;
  return {
    question: isWho ? phrases.who(event) : isWhere ? phrases.where(event) : phrases.when(event),
    options,
    explanation: isWho ? phrases.whoWhy(event, answer) : isWhere ? phrases.whereWhy(event, answer) : phrases.whenWhy(event, answer),
  };
}

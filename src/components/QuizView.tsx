"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getQuiz, quizzes } from "@/lib/registry";
import { detailCopy, isLocale, messages, uiMessages } from "@/lib/i18n";
import { quizPath } from "@/lib/urls";
import { quizCategoryName, quizTitle, localizeMathPrompt } from "@/lib/quiz-copy";
import { generateMathQuestion, type MathQuestion } from "@/lib/math";
import type { QuizQuestion } from "@/lib/question-bank";
import { saveQuizResult } from "@/lib/storage";
import { InteractiveTest } from "@/components/InteractiveTest";
import { QuizShell } from "@/components/QuizShell";
import { anyDifficultyLabel, categoryDescription, quizDescription, scoreFeedback, serviceGuide } from "@/lib/content-copy";

const allDifficultyBankSlugs = new Set([
  "daily-life-quiz", "space-quiz", "biology-knowledge-quiz", "world-geography", "number-pattern-quiz",
  "sequence-math-quiz", "mental-arithmetic-test", "programming-knowledge-quiz",
]);

export function QuizView({ locale: rawLocale, slug }: { locale: string; slug: string }) {
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = uiMessages[locale];
  const detail = detailCopy[locale];
  const guide = serviceGuide[locale];
  const base = messages[locale];
  const quiz = getQuiz(slug);
  const [q, setQ] = useState<MathQuestion | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "expert">(quiz?.difficulty[0] ?? "medium");
  const [bankDifficulty, setBankDifficulty] = useState<"all" | "easy" | "medium" | "hard" | "expert">(quiz?.slug.startsWith("random-") || quiz?.slug.startsWith("challenge-") || (quiz ? allDifficultyBankSlugs.has(quiz.slug) : false) ? "all" : quiz?.difficulty[0] ?? "medium");
  const [bankDeck, setBankDeck] = useState<QuizQuestion[]>([]);
  const [bankIndex, setBankIndex] = useState(0);
  const [bankReview, setBankReview] = useState<Array<{ question: QuizQuestion; selected: number }>>([]);
  const previousQuestionIds = useRef<string[]>([]);
  const related = useMemo(() => quiz ? quizzes.filter((item) => item.isPublic && item.category === quiz.category && item.slug !== quiz.slug).slice(0, 4) : [], [quiz]);

  if (!quiz) return <main className="not-found"><h1>{t.searchEmpty}</h1><Link href={quizPath(locale)}>{t.back}</Link></main>;

  const title = quizTitle(locale, quiz);
  const begin = () => {
    setStarted(true);
    setStartTime(performance.now());
    localStorage.setItem(`woori-quiz:difficulty:${quiz.slug}`, difficulty);
    setQ(quiz.mode === "dynamic" ? generateMathQuestion(quiz.slug, difficulty) : null);
    if (quiz.mode === "bank") {
      setBankDeck([]);
      const count = quiz.slug === "challenge-20" ? 20 : 10;
      void import("@/lib/question-bank/select-questions").then(async ({ loadQuestionBankForCategory, selectQuestionsForQuiz }) => {
        const { questionCategoryForQuiz, questionTagForQuiz } = await import("@/lib/question-bank/core");
        const category = questionCategoryForQuiz(quiz.slug, quiz.category);
        const tag = questionTagForQuiz(quiz.slug);
        const filter = { category, ...(tag ? { tag } : {}), ...(bankDifficulty === "all" ? {} : { difficulty: bankDifficulty }), count };
        const pool = await loadQuestionBankForCategory(category, locale);
        const fresh = selectQuestionsForQuiz(pool, { ...filter, excludeIds: previousQuestionIds.current });
        const deck = fresh.length >= count ? fresh : selectQuestionsForQuiz(pool, filter);
        setBankDeck(deck);
        previousQuestionIds.current = deck.map((question) => question.id);
        setBankIndex(0);
        setBankReview([]);
      });
    }
  };
  const finish = (finalScore: number) => {
    const duration = Math.round((performance.now() - startTime) / 1000);
    setElapsed(duration);
    setScore(finalScore);
    saveQuizResult(localStorage, quiz.slug, finalScore, difficulty, duration);
    setStarted(false);
    setStep(10);
  };
  const submit = () => {
    const finalScore = score + (answer === q?.answer ? 1 : 0);
    if (step === 9) { finish(finalScore); return; }
    setScore(finalScore);
    setStep(step + 1);
    setAnswer(null);
    setQ(generateMathQuestion(quiz.slug, difficulty));
  };
  const submitBank = () => {
    const current = bankDeck[bankIndex];
    if (!current || answer === null) return;
    setBankReview((review) => [...review, { question: current, selected: answer }]);
    const nextScore = score + (answer === current.answer ? 1 : 0);
    if (bankIndex + 1 >= bankDeck.length) { finish(nextScore); return; }
    setScore(nextScore);
    setBankIndex(bankIndex + 1);
    setStep(bankIndex + 1);
    setAnswer(null);
  };
  const active = started && quiz.mode === "dynamic" && q;
  const currentBankQuestion = bankDeck[bankIndex];
  const currentBankCopy = currentBankQuestion ? currentBankQuestion.localizations?.[locale] ?? currentBankQuestion : null;
  const bankActive = started && quiz.mode === "bank" && currentBankQuestion;
  const sessionLength = quiz.mode === "bank" ? bankDeck.length || (quiz.slug === "challenge-20" ? 20 : 10) : 10;
  const restartSameBank = () => {
    setStarted(true); setStartTime(performance.now()); setStep(0); setScore(0); setBankIndex(0); setAnswer(null); setBankReview([]);
  };

  return <QuizShell locale={locale} logoHref={quizPath(locale)} backHref={quizPath(locale)} mode="detail" activeCategory={quiz.category}>
    <div className="detail-wrap">
      <div className="crumb"><Link href={quizPath(locale)}>{t.back}</Link><span> / </span>{title}</div>
      <section className="detail-hero">
        <span className="eyebrow">{quizCategoryName(locale, quiz.category)}</span>
        <h1>{title}</h1><p>{quizDescription(locale, quiz, title)}</p>
        <div className="detail-tags"><span>{quiz.mode === "interactive" ? t.interactiveTest : quiz.mode === "static" ? t.questionSetReview : t.questionCount(sessionLength)}</span><span>{quiz.mode === "bank" && bankDifficulty === "all" ? anyDifficultyLabel[locale] : quiz.difficulty.map((level) => t.difficultyLabels[level]).join(" · ")}</span><span>{quiz.mode === "bank" || quiz.mode === "dynamic" ? `≈ ${Math.max(60, Math.ceil(sessionLength * 18))} ${t.seconds}` : t.localeCount}</span></div>
      </section>
        {quiz.mode === "interactive" ? <>
          <InteractiveTest slug={slug} locale={locale}/>
          <div className="howto"><h2>{t.aboutQuiz}</h2><p>{t.howToDescription}</p></div>
        </> : <>
          {!started && step < 10 && <div className="start-panel"><h2>{t.startHeading}</h2><p>{t.startDescription}</p>
            {quiz.mode === "dynamic" && <label className="difficulty-select">{t.difficulty}<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}>{quiz.difficulty.map((level) => <option key={level} value={level}>{t.difficultyLabels[level]}</option>)}</select></label>}
            {quiz.mode === "bank" && <label className="difficulty-select">{t.difficulty}<select value={bankDifficulty} onChange={(event) => { const value = event.target.value as typeof bankDifficulty; setBankDifficulty(value); if (value !== "all") setDifficulty(value); }}><option value="all">{anyDifficultyLabel[locale]}</option>{quiz.difficulty.map((level) => <option key={level} value={level}>{t.difficultyLabels[level]}</option>)}</select></label>}
            <button className="button primary" onClick={begin}>{base.play}<span aria-hidden="true">→</span></button>
          </div>}
          {active && <div className="play-panel"><div className="progress-row"><span>{base.question} {step + 1} <i>/ 10</i></span><span>{Math.round(step / 10 * 100)}%</span></div>
            <div className="progress"><span style={{ width: `${step / 10 * 100}%` }}/></div>
            <h2>{localizeMathPrompt(locale, q.prompt)}</h2>
            <div className="answer-grid">{q.options.map((option) => <button key={option} onClick={() => setAnswer(option)} aria-pressed={answer === option} className={answer === option ? "answer selected" : "answer"}>{option}</button>)}</div>
            {answer !== null && <div className={answer === q.answer ? "feedback correct" : "feedback wrong"}>{answer === q.answer ? t.correct : `${t.incorrect} (${q.answer})`}</div>}
            <button disabled={answer === null} className="button primary" onClick={submit}>{step === 9 ? base.result : base.submit}<span aria-hidden="true">→</span></button>
          </div>}
          {bankActive && <div className="play-panel"><div className="progress-row"><span>{base.question} {bankIndex + 1} <i>/ {bankDeck.length}</i></span><span>{Math.round((bankIndex + 1) / bankDeck.length * 100)}%</span></div>
            <div className="progress"><span style={{ width: `${(bankIndex + 1) / bankDeck.length * 100}%` }}/></div>
            <h2>{currentBankCopy?.question}</h2>
            <div className="answer-grid">{currentBankCopy?.options.map((option, index) => <button key={`${currentBankQuestion.id}-${option}`} onClick={() => setAnswer(index)} aria-pressed={answer === index} className={answer === index ? "answer selected" : "answer"}>{option}</button>)}</div>
            {answer !== null && <div className={answer === currentBankQuestion.answer ? "feedback correct" : "feedback wrong"} role="status">{answer === currentBankQuestion.answer ? t.correct : t.incorrect} {currentBankCopy?.explanation}</div>}
            <button disabled={answer === null} className="button primary" onClick={submitBank}>{bankIndex + 1 === bankDeck.length ? base.result : base.submit}<span aria-hidden="true">→</span></button>
          </div>}
          {!started && step === 10 && <div className="start-panel result-panel"><span className="eyebrow">{base.result}</span><h2>{base.score}: {score} / {sessionLength}</h2>
            <div className="result-stats"><span>{detail.correctCount}<strong>{score}</strong></span><span>{detail.incorrectCount}<strong>{Math.max(0, sessionLength - score)}</strong></span><span>{t.accuracy}<strong>{Math.round(score / Math.max(1, sessionLength) * 100)}%</strong></span><span>{t.finishedIn}<strong>{elapsed} {t.seconds}</strong></span></div>
            <h3>{guide.score}</h3><p>{scoreFeedback(locale, score, sessionLength)}</p><p>{guide.scoreNote}</p><p>{t.bestScore}</p>
            {quiz.mode === "bank" ? <div className="result-actions"><button className="button primary" onClick={restartSameBank}>{base.retry}<span aria-hidden="true">↻</span></button><button className="button" onClick={() => { setStep(0); setScore(0); begin(); }}>{detail.newSet}</button><Link className="button" href={quizPath(locale)}>{detail.otherQuizzes}</Link></div> : <div className="result-actions"><button className="button primary" onClick={() => { setStep(0); setScore(0); begin(); }}>{base.retry}<span aria-hidden="true">↻</span></button><Link className="button" href={quizPath(locale)}>{detail.otherQuizzes}</Link></div>}
            {quiz.mode === "bank" && <details className="question-review"><summary>{t.aboutQuiz}</summary><ol>{bankReview.map(({ question, selected }) => { const copy = question.localizations?.[locale] ?? question; return <li key={question.id}><strong>{copy.question}</strong><p>{copy.explanation}</p><small>{selected === question.answer ? t.correct : t.incorrect} · {copy.options[question.answer]}</small></li>; })}</ol></details>}
          </div>}
          {quiz.mode === "static" && <div className="coming-panel"><span aria-hidden="true">✳</span><div><b>{t.reviewHeading}</b><p>{t.reviewDescription}</p></div></div>}
          <div className="howto"><h2>{guide.focus}</h2><p>{categoryDescription(locale, quiz.category)}</p><p>{t.difficulty}: {quiz.difficulty.map((level) => t.difficultyLabels[level]).join(", ")}.</p><h2>{t.howToPlay}</h2><p>{t.howToDescription}</p><h3>{guide.score}</h3><p>{guide.scoreNote}</p><h3>{t.faq}</h3><details><summary>{t.scoreUploadedQuestion}</summary><p>{t.scoreUploadedAnswer}</p></details></div>
        </>}
      {related.length > 0 && <section className="related"><h2>{base.related}</h2><div className="quiz-grid">{related.map((item) => {
        const relatedTitle = quizTitle(locale, item);
        return <Link className="quiz-card" href={quizPath(locale, item.slug)} key={item.slug}><span className="card-category">{quizCategoryName(locale, item.category)}</span><h3>{relatedTitle}</h3><p>{quizDescription(locale, item, relatedTitle)}</p></Link>;
      })}</div></section>}
    </div>
  </QuizShell>;
}

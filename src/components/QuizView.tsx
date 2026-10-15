"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getQuiz, quizzes } from "@/lib/registry";
import { isLocale, messages, uiMessages } from "@/lib/i18n";
import { quizPath } from "@/lib/urls";
import { quizCategoryName, quizSummary, quizTitle, localizeMathPrompt } from "@/lib/quiz-copy";
import { generateMathQuestion, type MathQuestion } from "@/lib/math";
import type { QuizQuestion } from "@/lib/question-bank";
import { saveQuizResult } from "@/lib/storage";
import { InteractiveTest } from "@/components/InteractiveTest";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function QuizView({ locale: rawLocale, slug }: { locale: string; slug: string }) {
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = uiMessages[locale];
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
  const [bankDifficulty, setBankDifficulty] = useState<"all" | "easy" | "medium" | "hard" | "expert">(quiz?.slug.startsWith("random-") || quiz?.slug.startsWith("challenge-") ? "all" : quiz?.difficulty[0] ?? "medium");
  const [bankDeck, setBankDeck] = useState<QuizQuestion[]>([]);
  const [bankIndex, setBankIndex] = useState(0);
  const [bankReview, setBankReview] = useState<Array<{ question: QuizQuestion; selected: number }>>([]);
  const previousQuestionIds = useRef<string[]>([]);
  const related = useMemo(() => quiz ? quizzes.filter((item) => item.category === quiz.category && item.slug !== quiz.slug).slice(0, 4) : [], [quiz]);

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
      void import("@/lib/question-bank").then(({ questionBank, questionCategoryForQuiz, selectQuestions }) => {
        const category = questionCategoryForQuiz(quiz.slug, quiz.category);
        const filter = { category, ...(bankDifficulty === "all" ? {} : { difficulty: bankDifficulty }), count };
        const fresh = selectQuestions(questionBank, { ...filter, excludeIds: previousQuestionIds.current });
        const deck = fresh.length >= count ? fresh : selectQuestions(questionBank, filter);
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

  return <>
    <SiteHeader locale={locale} logoHref={quizPath(locale)} backHref={quizPath(locale)}/>
    <main className="detail-wrap">
      <div className="crumb"><Link href={quizPath(locale)}>{t.back}</Link><span> / </span>{title}</div>
      <div className="detail-hero">
        <span className="eyebrow">{quizCategoryName(locale, quiz.category)}　·　{quiz.mode === "dynamic" ? t.dynamicGeneration : quiz.mode === "interactive" ? t.interactiveTest : t.questionSetReview}</span>
        <h1>{title}</h1><p>{quizSummary(locale, title)}</p>
        <div className="detail-tags"><span>{quiz.mode === "dynamic" ? t.dynamicGeneration : quiz.mode === "interactive" ? t.interactiveTest : quiz.mode === "bank" ? t.questionCount(sessionLength) : t.questionSetReview}</span><span>{quiz.mode === "bank" && bankDifficulty === "all" ? t.dynamicGeneration : quiz.difficulty.map((level) => t.difficultyLabels[level]).join(" · ")}</span><span>{quiz.mode === "bank" ? `≈ ${Math.max(60, Math.ceil(sessionLength * 18))} ${t.seconds}` : t.localeCount}</span></div>

        {quiz.mode === "interactive" ? <>
          <InteractiveTest slug={slug} locale={locale}/>
          <div className="howto"><h2>{t.aboutQuiz}</h2><p>{t.howToDescription}</p></div>
        </> : <>
          {!started && step < 10 && <div className="start-panel"><h2>{t.startHeading}</h2><p>{t.startDescription}</p>
            {quiz.mode === "dynamic" && <label className="difficulty-select">{t.difficulty}<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}>{quiz.difficulty.map((level) => <option key={level} value={level}>{t.difficultyLabels[level]}</option>)}</select></label>}
            {quiz.mode === "bank" && <label className="difficulty-select">{t.difficulty}<select value={bankDifficulty} onChange={(event) => { const value = event.target.value as typeof bankDifficulty; setBankDifficulty(value); if (value !== "all") setDifficulty(value); }}><option value="all">{t.dynamicGeneration}</option>{quiz.difficulty.map((level) => <option key={level} value={level}>{t.difficultyLabels[level]}</option>)}</select></label>}
            <button className="button primary" onClick={begin}>{base.play}<span aria-hidden="true">→</span></button>
          </div>}
          {active && <div className="play-panel"><div className="progress-row"><span>{base.question} {step + 1} <i>/ 10</i></span><span>{Math.round(step / 10 * 100)}%</span></div>
            <div className="progress"><span style={{ width: `${step / 10 * 100}%` }}/></div>
            <h2>{localizeMathPrompt(locale, q.prompt)}</h2>
            <div className="answer-grid">{q.options.map((option) => <button key={option} onClick={() => setAnswer(option)} className={answer === option ? "answer selected" : "answer"}>{option}</button>)}</div>
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
          {!started && step === 10 && <div className="start-panel result-panel"><span className="eyebrow">{base.result.toUpperCase()}</span><h2>{base.score}: {score} / {sessionLength}</h2>
            <p>{t.accuracy}: {Math.round(score / Math.max(1, sessionLength) * 100)}% · {t.difficulty}: {t.difficultyLabels[difficulty]} · {t.finishedIn} {elapsed} {t.seconds}. {t.bestScore}</p>
            {quiz.mode === "bank" ? <div className="result-actions"><button className="button primary" onClick={restartSameBank}>{base.retry}<span aria-hidden="true">↻</span></button><button className="button" onClick={() => { setStep(0); setScore(0); begin(); }}>{t.nextChallenge}</button></div> : <button className="button primary" onClick={() => { setStep(0); setScore(0); begin(); }}>{base.retry}<span aria-hidden="true">↻</span></button>}
            {quiz.mode === "bank" && <details className="question-review"><summary>{t.aboutQuiz}</summary><ol>{bankReview.map(({ question, selected }) => { const copy = question.localizations?.[locale] ?? question; return <li key={question.id}><strong>{copy.question}</strong><p>{copy.explanation}</p><small>{selected === question.answer ? t.correct : t.incorrect} · {copy.options[question.answer]}</small></li>; })}</ol></details>}
          </div>}
          {quiz.mode === "static" && <div className="coming-panel"><span aria-hidden="true">✳</span><div><b>{t.reviewHeading}</b><p>{t.reviewDescription}</p></div></div>}
          <div className="howto"><h2>{t.howToPlay}</h2><p>{t.howToDescription}</p><h3>{t.aboutQuiz}</h3><p>{quizSummary(locale, title)} {t.difficulty}: {quiz.difficulty.map((level) => t.difficultyLabels[level]).join(", ")}.</p><h3>{t.faq}</h3><details><summary>{t.scoreUploadedQuestion}</summary><p>{t.scoreUploadedAnswer}</p></details></div>
        </>}
      </div>
      {related.length > 0 && <section className="related"><h2>{base.related}</h2><div className="quiz-grid">{related.map((item) => {
        const relatedTitle = quizTitle(locale, item);
        return <Link className="quiz-card" href={quizPath(locale, item.slug)} key={item.slug}><span className="card-category">{quizCategoryName(locale, item.category)}</span><h3>{relatedTitle}</h3><p>{quizSummary(locale, relatedTitle)}</p></Link>;
      })}</div></section>}
      <SiteFooter locale={locale}/>
    </main>
  </>;
}

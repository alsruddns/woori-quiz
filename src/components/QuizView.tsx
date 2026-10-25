"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getQuiz, quizzes } from "@/lib/registry";
import { detailCopy, isLocale, messages, uiMessages, type Locale } from "@/lib/i18n";
import { quizPath } from "@/lib/urls";
import { quizCategoryName, quizTitle, localizeMathPrompt } from "@/lib/quiz-copy";
import { generateMathQuestion, type MathQuestion } from "@/lib/math";
import type { QuizQuestion } from "@/lib/question-bank";
import { resolveQuestionCopy } from "@/lib/question-bank/display-copy";
import { saveQuizResult } from "@/lib/storage";
import { InteractiveTest } from "@/components/InteractiveTest";
import { QuizShell } from "@/components/QuizShell";
import { anyDifficultyLabel, categoryDescription, quizDescription, scoreFeedback, serviceGuide } from "@/lib/content-copy";
import { useLocaleCatalog } from "@/lib/use-locale-catalog";

const allDifficultyBankSlugs = new Set([
  "daily-life-quiz", "space-quiz", "biology-knowledge-quiz", "world-geography", "number-pattern-quiz",
  "sequence-math-quiz", "mental-arithmetic-test", "programming-knowledge-quiz",
]);
const questionCounts = [10, 20, 30, 40, 50] as const;
const AUTO_ADVANCE_MS = 850;
const monotonicNow = () => performance.now();
const availableLabel: Record<Locale, string> = {
  ko: "출제 가능", en: "available", ja: "出題可能", zh: "可用", "zh-tw": "可用", es: "disponibles", "pt-br": "disponíveis", de: "verfügbar", fr: "disponibles", vi: "có sẵn", id: "tersedia", th: "พร้อมใช้", it: "disponibili", nl: "beschikbaar", hi: "उपलब्ध", ru: "доступно", tr: "mevcut", pl: "dostępnych", fil: "magagamit", bn: "উপলভ্য", uk: "доступно", ms: "tersedia", sv: "tillgängliga", cs: "dostupných", ro: "disponibile", el: "διαθέσιμες",
};

type ReviewAnswer = { question: QuizQuestion; selected: number };

export function QuizView(props: { locale: string; slug: string }) {
  return <QuizSession key={`${props.locale}:${props.slug}`} {...props} />;
}

function QuizSession({ locale: rawLocale, slug }: { locale: string; slug: string }) {
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  useLocaleCatalog(locale);
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
  const startTime = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "expert">(quiz?.difficulty[0] ?? "medium");
  const [bankDifficulty, setBankDifficulty] = useState<"all" | "easy" | "medium" | "hard" | "expert">(quiz?.slug.startsWith("random-") || quiz?.slug.startsWith("challenge-") || (quiz ? allDifficultyBankSlugs.has(quiz.slug) : false) ? "all" : quiz?.difficulty[0] ?? "medium");
  const [questionCount, setQuestionCount] = useState(20);
  const [bankDeck, setBankDeck] = useState<QuizQuestion[]>([]);
  const [bankIndex, setBankIndex] = useState(0);
  const [bankReview, setBankReview] = useState<ReviewAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [bankError, setBankError] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [poolAvailability, setPoolAvailability] = useState<{ key: string; count: number } | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerLocked = useRef(false);
  const runToken = useRef(0);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const previousQuestionIds = useRef<string[]>([]);
  const related = useMemo(() => quiz ? quizzes.filter((item) => item.isPublic && item.category === quiz.category && item.slug !== quiz.slug).slice(0, 4) : [], [quiz]);
  const availabilityKey = `${slug}:${locale}:${bankDifficulty}`;

  useEffect(() => {
    if (quiz?.mode !== "bank") return;
    let cancelled = false;
    void (async () => {
      try {
        const { loadQuestionBankForCategory, selectQuestionsForQuiz } = await import("@/lib/question-bank/select-questions");
        const { questionCategoryForQuiz, questionTagForQuiz } = await import("@/lib/question-bank/core");
        const category = questionCategoryForQuiz(quiz.slug, quiz.category);
        const tag = questionTagForQuiz(quiz.slug);
        const pool = await loadQuestionBankForCategory(category, locale);
        const available = selectQuestionsForQuiz(pool, { category, ...(tag ? { tag } : {}), ...(bankDifficulty === "all" ? {} : { difficulty: bankDifficulty }), count: 50 });
        if (!cancelled) setPoolAvailability({ key: availabilityKey, count: available.length });
      } catch {
        if (!cancelled) setPoolAvailability({ key: availabilityKey, count: 0 });
      }
    })();
    return () => { cancelled = true; };
  }, [availabilityKey, bankDifficulty, locale, quiz]);

  useEffect(() => {
    if (started) questionHeading.current?.focus({ preventScroll: true });
    else if (step > 0) resultHeading.current?.focus({ preventScroll: true });
  }, [started, step, bankIndex]);

  useEffect(() => () => {
    runToken.current++;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
    answerLocked.current = false;
  }, []);

  if (!quiz) return <main className="not-found"><h1>{t.searchEmpty}</h1><Link href={quizPath(locale)}>{t.back}</Link></main>;

  const title = quizTitle(locale, quiz);
  const clearAdvance = () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); advanceTimer.current = null; answerLocked.current = false; };
  const resetRun = () => {
    runToken.current++;
    clearAdvance(); setAnswer(null); setScore(0); setStep(0); setBankIndex(0); setBankReview([]); setElapsed(0); setLastCorrect(null); setBankError(false);
  };
  const begin = async () => {
    resetRun();
    const token = runToken.current;
    setLoading(quiz.mode === "bank");
    setStarted(quiz.mode === "dynamic");
    startTime.current = monotonicNow();
    localStorage.setItem(`woori-quiz:difficulty:${quiz.slug}`, quiz.mode === "bank" ? bankDifficulty : difficulty);
    if (quiz.mode === "dynamic") { setQ(generateMathQuestion(quiz.slug, difficulty)); return; }
    if (quiz.mode !== "bank") return;
    try {
      const { loadQuestionBankForCategory, selectQuestionsForQuiz } = await import("@/lib/question-bank/select-questions");
      const { questionCategoryForQuiz, questionTagForQuiz } = await import("@/lib/question-bank/core");
      const category = questionCategoryForQuiz(quiz.slug, quiz.category);
      const tag = questionTagForQuiz(quiz.slug);
      const filter = { category, ...(tag ? { tag } : {}), ...(bankDifficulty === "all" ? {} : { difficulty: bankDifficulty }), count: questionCount };
      const pool = await loadQuestionBankForCategory(category, locale);
      if (token !== runToken.current) return;
      const fresh = selectQuestionsForQuiz(pool, { ...filter, excludeIds: previousQuestionIds.current });
      const deck = fresh.length >= questionCount ? fresh : selectQuestionsForQuiz(pool, filter);
      setBankDeck(deck);
      previousQuestionIds.current = deck.map((question) => question.id);
      setBankIndex(0);
      setStarted(deck.length > 0);
      setBankError(deck.length === 0);
    } catch {
      if (token === runToken.current) setBankError(true);
    } finally {
      if (token === runToken.current) setLoading(false);
    }
  };
  const finish = (finalScore: number, total: number) => {
    clearAdvance();
    const duration = Math.round((monotonicNow() - startTime.current) / 1000);
    setElapsed(duration);
    setScore(finalScore);
    saveQuizResult(localStorage, quiz.slug, finalScore, quiz.mode === "bank" ? bankDifficulty : difficulty, duration);
    setStarted(false);
    setStep(total);
  };
  const submitDynamic = (selected: number) => {
    clearAdvance();
    if (!q) return;
    const correct = selected === q.answer;
    setLastCorrect(correct);
    const finalScore = score + (correct ? 1 : 0);
    if (step + 1 >= questionCount) { finish(finalScore, questionCount); return; }
    setScore(finalScore); setStep(step + 1); setAnswer(null); setQ(generateMathQuestion(quiz.slug, difficulty));
  };
  const submitBank = (selected: number) => {
    clearAdvance();
    const current = bankDeck[bankIndex];
    if (!current) return;
    const correct = selected === current.answer;
    setLastCorrect(correct);
    setBankReview((review) => [...review, { question: current, selected }]);
    const finalScore = score + (correct ? 1 : 0);
    if (bankIndex + 1 >= bankDeck.length) { finish(finalScore, bankDeck.length); return; }
    setScore(finalScore); setBankIndex(bankIndex + 1); setStep(bankIndex + 1); setAnswer(null);
  };
  const chooseAnswer = (selected: number, correct: boolean, submit: (value: number) => void) => {
    if (answerLocked.current) return;
    answerLocked.current = true;
    setAnswer(selected); setLastCorrect(correct);
    advanceTimer.current = setTimeout(() => { advanceTimer.current = null; submit(selected); }, AUTO_ADVANCE_MS);
  };
  const active = started && quiz.mode === "dynamic" && q;
  const currentBankQuestion = bankDeck[bankIndex];
  const currentBankCopy = currentBankQuestion ? resolveQuestionCopy(currentBankQuestion, locale) : null;
  const bankActive = started && quiz.mode === "bank" && currentBankQuestion;
  const sessionLength = quiz.mode === "bank" ? bankDeck.length || questionCount : questionCount;
  const availableQuestions = poolAvailability?.key === availabilityKey ? poolAvailability.count : null;
  const retry = () => { void begin(); };

  return <QuizShell locale={locale} logoHref={quizPath(locale)} backHref={quizPath(locale)} mode="detail" activeCategory={quiz.category}>
    <div className="detail-wrap">
      <div className="crumb"><Link href={quizPath(locale)}>{t.back}</Link><span> / </span>{title}</div>
      <section className="detail-hero">
        <span className="eyebrow">{quizCategoryName(locale, quiz.category)}</span>
        <h1>{title}</h1><p>{quizDescription(locale, quiz, title)}</p>
        <div className="detail-tags"><span>{quiz.mode === "interactive" ? t.interactiveTest : quiz.mode === "static" ? t.questionSetReview : t.questionCount(sessionLength)}</span><span>{quiz.mode === "bank" && bankDifficulty === "all" ? anyDifficultyLabel[locale] : quiz.difficulty.map((level) => t.difficultyLabels[level]).join(" · ")}</span><span>{quiz.mode === "bank" || quiz.mode === "dynamic" ? `${Math.max(1, Math.ceil(sessionLength * 18))} ${t.seconds}` : t.localeCount}</span></div>
      </section>
      {quiz.mode === "interactive" ? <><InteractiveTest slug={slug} locale={locale}/><div className="howto"><h2>{t.aboutQuiz}</h2><p>{t.howToDescription}</p></div></> : <>
        {!started && step < 1 && <div className="start-panel"><h2>{t.startHeading}</h2><p>{t.startDescription}</p>
          {quiz.mode === "dynamic" && <label className="difficulty-select">{t.difficulty}<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}>{quiz.difficulty.map((level) => <option key={level} value={level}>{t.difficultyLabels[level]}</option>)}</select></label>}
          {quiz.mode === "bank" && <label className="difficulty-select">{t.difficulty}<select value={bankDifficulty} onChange={(event) => { const value = event.target.value as typeof bankDifficulty; setBankDifficulty(value); if (value !== "all") setDifficulty(value); }}><option value="all">{anyDifficultyLabel[locale]}</option>{quiz.difficulty.map((level) => <option key={level} value={level}>{t.difficultyLabels[level]}</option>)}</select></label>}
          {(quiz.mode === "bank" || quiz.mode === "dynamic") && <fieldset className="count-select"><legend>{t.questionCount(questionCount)}</legend><div>{questionCounts.map((count) => <button type="button" key={count} aria-pressed={questionCount === count} className={questionCount === count ? "count-option selected" : "count-option"} onClick={() => setQuestionCount(count)}>{count}</button>)}</div></fieldset>}
          {availableQuestions !== null && availableQuestions < questionCount && <p className="pool-summary" role="status">{availableQuestions} {availableLabel[locale]} / {questionCount}</p>}
          <button className="button primary" disabled={loading} onClick={() => void begin()}>{loading ? "…" : base.play}<span aria-hidden="true">→</span></button>
          {bankError && <p role="alert">{t.searchEmpty}</p>}
        </div>}
        {active && <div className="play-panel"><div className="progress-row"><span>{base.question} {step + 1} <i>/ {questionCount}</i> · {quizCategoryName(locale, quiz.category)}</span><span>{Math.round((step + 1) / questionCount * 100)}%</span></div>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={questionCount} aria-valuenow={step + 1}><span style={{ width: `${(step + 1) / questionCount * 100}%` }}/></div>
          <h2 ref={questionHeading} tabIndex={-1}>{localizeMathPrompt(locale, q.prompt)}</h2>
          <div className="answer-grid">{q.options.map((option) => <button key={option} disabled={answer !== null} onClick={() => chooseAnswer(option, option === q.answer, submitDynamic)} aria-pressed={answer === option} className={answer === option ? `answer selected ${lastCorrect ? "is-correct" : "is-wrong"}` : "answer"}>{option}</button>)}</div>
          {answer !== null && <div className={lastCorrect ? "feedback correct" : "feedback wrong"} role="status" aria-live="polite">{lastCorrect ? t.correct : `${t.incorrect} · ${q.answer}`}</div>}
        </div>}
        {bankActive && <div className="play-panel"><div className="progress-row"><span>{base.question} {bankIndex + 1} <i>/ {bankDeck.length}</i> · {quizCategoryName(locale, quiz.category)}</span><span>{Math.round((bankIndex + 1) / bankDeck.length * 100)}%</span></div>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={bankDeck.length} aria-valuenow={bankIndex + 1}><span style={{ width: `${(bankIndex + 1) / bankDeck.length * 100}%` }}/></div>
          <h2 ref={questionHeading} tabIndex={-1}>{currentBankCopy?.question}</h2>
          <div className="answer-grid">{currentBankCopy?.options.map((option, index) => <button key={`${currentBankQuestion.id}-${index}`} disabled={answer !== null} onClick={() => chooseAnswer(index, index === currentBankQuestion.answer, submitBank)} aria-pressed={answer === index} className={answer === index ? `answer selected ${lastCorrect ? "is-correct" : "is-wrong"}` : "answer"}>{option}</button>)}</div>
          {answer !== null && <div className={lastCorrect ? "feedback correct" : "feedback wrong"} role="status" aria-live="polite">{lastCorrect ? t.correct : `${t.incorrect} · ${currentBankCopy?.options[currentBankQuestion.answer]}`} {currentBankCopy?.explanation}</div>}
        </div>}
        {!started && step > 0 && <div className="start-panel result-panel"><span className="eyebrow">{base.result}</span><h2 ref={resultHeading} tabIndex={-1}>{base.score}: {score} / {step}</h2>
          <div className="result-stats"><span>{t.questionCount(step)}<strong>{step}</strong></span><span>{detail.correctCount}<strong>{score}</strong></span><span>{detail.incorrectCount}<strong>{Math.max(0, step - score)}</strong></span><span>{t.accuracy}<strong>{Math.round(score / Math.max(1, step) * 100)}%</strong></span><span>{t.category[quiz.category]}<strong>{quizCategoryName(locale, quiz.category)}</strong></span><span>{t.difficulty}<strong>{quiz.mode === "bank" && bankDifficulty === "all" ? anyDifficultyLabel[locale] : t.difficultyLabels[difficulty]}</strong></span><span>{t.finishedIn}<strong>{elapsed} {t.seconds}</strong></span></div>
          <h3>{guide.score}</h3><p>{scoreFeedback(locale, score, step)}</p><p>{guide.scoreNote}</p><p>{t.bestScore}</p>
          <div className="result-actions"><button className="button primary" onClick={retry}>{base.retry}<span aria-hidden="true">↻</span></button>{quiz.mode === "bank" && <button className="button" onClick={() => { setStep(0); setScore(0); setStarted(false); setBankReview([]); }}>{detail.newSet}</button>}<Link className="button" href={quizPath(locale)}>{detail.otherQuizzes}</Link></div>
          {quiz.mode === "bank" && bankReview.some(({ question, selected }) => selected !== question.answer) && <details className="question-review" open><summary>{detail.incorrectCount} ({step - score})</summary><ol>{bankReview.filter(({ question, selected }) => selected !== question.answer).map(({ question, selected }) => { const copy = resolveQuestionCopy(question, locale); const questionNumber = bankReview.findIndex((answerRecord) => answerRecord.question.id === question.id) + 1; return <li key={question.id}><small>{base.question} {questionNumber}</small><strong>{copy.question}</strong><p><b>{t.incorrect}:</b> {copy.options[selected]}</p><p><b>{t.correct}:</b> {copy.options[question.answer]}</p>{copy.explanation && <p>{copy.explanation}</p>}</li>; })}</ol></details>}
        </div>}
        {quiz.mode === "static" && <div className="coming-panel"><span aria-hidden="true">✦</span><div><b>{t.reviewHeading}</b><p>{t.reviewDescription}</p></div></div>}
        <div className="howto"><h2>{guide.focus}</h2><p>{categoryDescription(locale, quiz.category)}</p><p>{t.difficulty}: {quiz.difficulty.map((level) => t.difficultyLabels[level]).join(", ")}.</p><h2>{t.howToPlay}</h2><p>{t.howToDescription}</p><h3>{guide.score}</h3><p>{guide.scoreNote}</p><h3>{t.faq}</h3><details><summary>{t.scoreUploadedQuestion}</summary><p>{t.scoreUploadedAnswer}</p></details></div>
      </>}
      {related.length > 0 && <section className="related"><h2>{base.related}</h2><div className="quiz-grid">{related.map((item) => {
        const relatedTitle = quizTitle(locale, item);
        return <Link className="quiz-card" href={quizPath(locale, item.slug)} key={item.slug}><span className="card-category">{quizCategoryName(locale, item.category)}</span><h3>{relatedTitle}</h3><p>{quizDescription(locale, item, relatedTitle)}</p></Link>;
      })}</div></section>}
    </div>
  </QuizShell>;
}

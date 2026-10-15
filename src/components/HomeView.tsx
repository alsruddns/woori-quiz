"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import { categories, quizzes } from "@/lib/registry";
import { isLocale, messages, uiMessages } from "@/lib/i18n";
import { quizPath } from "@/lib/urls";
import { quizCategoryName, quizSummary, quizTitle } from "@/lib/quiz-copy";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function HomeView({ locale: rawLocale }: { locale: string }) {
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = uiMessages[locale];
  const base = messages[locale];
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");
  const day = useSyncExternalStore(() => () => {}, () => {
    const now = new Date();
    return now.getUTCFullYear() * 372 + (now.getUTCMonth() + 1) * 31 + now.getUTCDate();
  }, () => 0);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sidebarRef.current;
    if (!node) return;
    node.scrollTop = Number(localStorage.getItem("woori-quiz:sidebar-scroll") || 0);
    const save = () => localStorage.setItem("woori-quiz:sidebar-scroll", String(node.scrollTop));
    node.addEventListener("scroll", save, { passive: true });
    return () => node.removeEventListener("scroll", save);
  }, []);

  const visible = useMemo(() => quizzes.filter((quiz) => {
    const title = quizTitle(locale, quiz);
    const category = quizCategoryName(locale, quiz.category);
    return (active === "all" || quiz.category === active)
      && `${title} ${quiz.title} ${quiz.slug} ${category}`.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale));
  }), [active, locale, query]);
  const today = quizzes[day % quizzes.length];
  const todayTitle = quizTitle(locale, today);

  return <>
    <SiteHeader locale={locale} logoHref={`/${locale}`} />
    <div className="layout">
      <aside ref={sidebarRef} className="sidebar" aria-label={base.categories}>
        <div className="side-heading">{base.categories}</div>
        <button className={active === "all" ? "side-link selected" : "side-link"} onClick={() => setActive("all")}>
          <span aria-hidden="true">✦</span>{t.allQuizzes}
        </button>
        {categories.map((category) => <button className={active === category ? "side-link selected" : "side-link"} onClick={() => setActive(category)} key={category}>
          <span aria-hidden="true">{icon[category]}</span>{quizCategoryName(locale, category)}
        </button>)}
        <div className="side-note"><span className="dot"/>{t.freeToPlay}<br/>{t.noAccount}</div>
      </aside>

      <main className="content">
        <div className="hero">
          <div className="hero-copy">
            <span className="eyebrow">{t.heroEyebrow}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroDescription}</p>
            <label className="search"><span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchLabel} aria-label={t.searchLabel}/>
              <kbd>⌘ K</kbd>
            </label>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="sun"/><div className="quiz-card-art"><span>✳</span><b>Q</b><small>{t.quiz}</small></div><div className="spark spark-a">✦</div><div className="spark spark-b">✳</div><div className="art-caption">{t.heroEyebrow}</div></div>
        </div>

        <AdSlot/>
        <section className="today-section">
          <div className="today-card"><div>
            <span className="eyebrow">✦　{base.today}</span>
            <h2>{todayTitle}</h2>
            <p>{quizSummary(locale, todayTitle)}</p>
            <Link className="button primary" href={quizPath(locale, today.slug)}>{base.play}<span aria-hidden="true">→</span></Link>
          </div><div className="today-graphic" aria-hidden="true"><span>✷</span><b>?</b><i>✦</i></div></div>
        </section>

        <section className="quiz-section random-section">
          <div className="section-head"><div><span className="eyebrow">{t.nextChallenge}</span><h2>{t.category.fun}</h2></div></div>
          <div className="quiz-grid">{["random-general-knowledge", "random-math-10", "random-nonsense-10", "random-brain-teaser", "random-quiz", "challenge-10"].map((slug) => {
            const quiz = quizzes.find((item) => item.slug === slug);
            if (!quiz) return null;
            const randomTitle = quizTitle(locale, quiz);
            return <Link className="quiz-card" href={quizPath(locale, slug)} key={slug}>
              <span className="card-category">{quizCategoryName(locale, quiz.category)}</span><h3>{randomTitle}</h3><p>{quizSummary(locale, randomTitle)}</p>
            </Link>;
          })}</div>
        </section>

        <section className="quiz-section">
          <div className="section-head"><div><span className="eyebrow">{t.nextChallenge}</span><h2>{active === "all" ? base.popular : quizCategoryName(locale, active as keyof typeof icon)}</h2></div><span className="result-count">{t.quizCount(visible.length)}</span></div>
          {visible.length === 0 ? <p className="empty-state" role="status">{t.searchEmpty}</p> : <div className="quiz-grid">{visible.map((quiz, index) => {
            const title = quizTitle(locale, quiz);
            return <Link className="quiz-card" href={quizPath(locale, quiz.slug)} key={quiz.slug}>
              <span className={`card-icon color-${index % 6}`} aria-hidden="true">{icon[quiz.category]}</span>
              <span className="card-category">{quizCategoryName(locale, quiz.category)}</span>
              <h3>{title}</h3>
              <p>{quizSummary(locale, title)}</p>
              <div className="card-meta"><span>{quiz.mode === "dynamic" ? t.dynamicGeneration : quiz.mode === "interactive" ? t.interactiveTest : t.questionSetReview}</span><span>{t.difficultyLabels[quiz.difficulty[0]]}</span></div>
            </Link>;
          })}</div>}
        </section>

        <SiteFooter locale={locale}/>
      </main>
    </div>
  </>;
}

const icon: Record<string, string> = { general:"✳", nonsense:"❔", math:"＋", brain:"◇", history:"◷", science:"⚗", geography:"◎", language:"文", technology:"⌘", memory:"▦", random:"⤨", challenge:"⚑", speed:"↯", fun:"☻" };

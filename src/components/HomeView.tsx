"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { discoveryCopy, isLocale, messages, uiMessages } from "@/lib/i18n";
import { categories, quizzes, type Quiz, type Category } from "@/lib/registry";
import { discoveryQuizzes, discoveryState } from "@/lib/discovery";
import { quizCategoryName, quizSummary, quizTitle } from "@/lib/quiz-copy";
import { quizPath } from "@/lib/urls";

const urlEvent = "quiz-discovery-url";
const subscribe = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  window.addEventListener(urlEvent, notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener(urlEvent, notify);
  };
};
const currentSearch = () => window.location.search;
const serverSearch = () => "";

function updateSearch(change: (params: URLSearchParams) => void, push = false) {
  const url = new URL(window.location.href);
  change(url.searchParams);
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (next === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
  window.history[push ? "pushState" : "replaceState"](null, "", next);
  window.dispatchEvent(new Event(urlEvent));
}

const quickSlugs = ["random-quiz", "random-general-knowledge", "random-math-10", "brain-teaser"];
const featuredSlugs = ["general-knowledge", "brain-teaser", "math-basic", "world-geography", "it-development-quiz", "random-quiz"];

export function HomeView({ locale: rawLocale }: { locale: string }) {
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const t = uiMessages[locale];
  const copy = discoveryCopy[locale];
  const base = messages[locale];
  const search = useSyncExternalStore(subscribe, currentSearch, serverSearch);
  const { mode, category, query } = discoveryState(search, categories);
  const visible = discoveryQuizzes(quizzes, locale, search, categories);
  const mainRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (mode === "home") return;
    const node = mainRef.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 82;
    if (window.scrollY > top + 24) window.scrollTo({ top, behavior: "smooth" });
  }, [mode, category]);

  function selectCategory(value: Category | "all") {
    updateSearch((params) => {
      params.set("category", value);
      params.delete("q");
    }, true);
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
    const node = mainRef.current;
    if (node) window.scrollTo({ top: Math.max(0, node.getBoundingClientRect().top + window.scrollY - 82), behavior: "smooth" });
  }

  function setQuery(value: string) {
    updateSearch((params) => value.trim() ? params.set("q", value) : params.delete("q"));
  }

  const searchField = <label className="discovery-search">
    <span className="sr-only">{t.searchLabel}</span>
    <span aria-hidden="true">⌕</span>
    <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchLabel} aria-label={t.searchLabel}/>
    {query && <button type="button" onClick={() => setQuery("")} aria-label={copy.clearSearch}>×</button>}
  </label>;

  const categoryButtons = <>
    <button type="button" className={`side-link${mode === "all" ? " selected" : ""}`} aria-current={mode === "all" ? "page" : undefined} onClick={() => selectCategory("all")}><span aria-hidden="true">▦</span>{t.allQuizzes}</button>
    {categories.map((item) => <button type="button" className={`side-link${mode === "category" && category === item ? " selected" : ""}`} aria-current={mode === "category" && category === item ? "page" : undefined} onClick={() => selectCategory(item)} key={item}><span aria-hidden="true">{icon[item]}</span>{quizCategoryName(locale, item)}</button>)}
  </>;

  const cards = (items: Quiz[]) => <div className="quiz-grid">{items.map((quiz) => {
    const title = quizTitle(locale, quiz);
    return <Link className="quiz-card" href={quizPath(locale, quiz.slug)} key={quiz.slug}>
      <span className="card-category">{quizCategoryName(locale, quiz.category)}</span>
      <h3>{title}</h3>
      <p>{quizSummary(locale, title)}</p>
      <div className="card-meta"><span>{typeof quiz.count === "number" ? t.questionCount(quiz.count) : quiz.mode === "dynamic" ? t.dynamicGeneration : quiz.mode === "interactive" ? t.interactiveTest : t.questionSetReview}</span><span>{t.difficultyLabels[quiz.difficulty[0]]}</span></div>
      <span className="card-action">{base.play}<span aria-hidden="true"> →</span></span>
    </Link>;
  })}</div>;

  const heading = mode === "search" ? copy.searchResults : mode === "category" && category ? quizCategoryName(locale, category) : t.allQuizzes;

  return <div className="discovery-page">
    <SiteHeader locale={locale} logoHref={`/${locale}`} />
    <div className="layout discovery-layout">
      <aside className="sidebar discovery-sidebar" aria-label={base.categories}>
        <div className="desktop-discovery-nav">{searchField}<div className="side-heading">{base.categories}</div>{categoryButtons}</div>
        <div className="mobile-discovery-nav">{searchField}<details ref={mobileMenuRef}><summary>{mode === "category" && category ? quizCategoryName(locale, category) : copy.browseCategories}<span aria-hidden="true">⌄</span></summary><div className="mobile-category-list">{categoryButtons}</div></details></div>
      </aside>

      <main ref={mainRef} className="content discovery-content">
        {mode === "home" ? <>
          <section className="discovery-intro">
            <div><span className="discovery-kicker">woori.today</span><h1>{t.quiz}</h1><p>{copy.intro}</p></div>
            <span className="intro-count">{t.quizCount(quizzes.filter((quiz) => quiz.isPublic).length)}</span>
          </section>
          <AdSlot/>
          <section className="quiz-section quick-section" aria-labelledby="quick-heading">
            <div className="section-head"><h2 id="quick-heading">{copy.quickStart}</h2></div>
            <div className="quick-grid">{quickSlugs.map((slug) => {
              const quiz = quizzes.find((item) => item.slug === slug && item.isPublic);
              if (!quiz) return null;
              return <Link href={quizPath(locale, slug)} className="quick-link" key={slug}><span aria-hidden="true">{icon[quiz.category]}</span>{quizTitle(locale, quiz)}<b aria-hidden="true">↗</b></Link>;
            })}</div>
          </section>
          <section className="quiz-section" aria-labelledby="featured-heading">
            <div className="section-head"><h2 id="featured-heading">{base.popular}</h2><button className="text-action" type="button" onClick={() => selectCategory("all")}>{t.allQuizzes} <span aria-hidden="true">→</span></button></div>
            {cards(featuredSlugs.flatMap((slug) => {
              const quiz = visible.find((item) => item.slug === slug);
              return quiz ? [quiz] : [];
            }))}
          </section>
        </> : <section className="quiz-section results-section" aria-live="polite">
          <div className="results-header"><div><span className="discovery-kicker">{t.quiz}</span><h1>{heading}</h1><p>{mode === "search" ? copy.resultsFor(query, visible.length) : t.quizCount(visible.length)}</p></div></div>
          {visible.length ? cards(visible) : <p className="empty-state" role="status">{t.searchEmpty}</p>}
        </section>}
        <SiteFooter locale={locale}/>
      </main>
    </div>
  </div>;
}

const icon: Record<Category, string> = { general:"✳", nonsense:"?", math:"＋", brain:"◇", history:"◷", science:"⚗", geography:"◎", language:"文", technology:"⌘", memory:"▦", random:"⤨", challenge:"⚑", speed:"↯", fun:"☺" };

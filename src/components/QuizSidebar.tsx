"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories, type Category } from "@/lib/registry";
import { discoveryCopy, messages, uiMessages, type Locale } from "@/lib/i18n";
import { quizCategoryName } from "@/lib/quiz-copy";
import { quizPath } from "@/lib/urls";
import type { DiscoveryMode } from "@/lib/discovery";

type Props = {
  locale: Locale;
  mode: DiscoveryMode | "detail";
  activeCategory: Category | null;
  query?: string;
  onSelectCategory?: (category: Category | "all") => void;
  onSearchChange?: (query: string) => void;
};

const icon: Record<Category, string> = { general:"✳", nonsense:"?", math:"＋", brain:"◇", history:"◷", science:"⚗", geography:"◎", language:"文", technology:"⌘", memory:"▦", random:"⤨", challenge:"⚑", speed:"↯", fun:"☺" };

export function QuizSidebar({ locale, mode, activeCategory, query = "", onSelectCategory, onSearchChange }: Props) {
  const t = uiMessages[locale];
  const copy = discoveryCopy[locale];
  const router = useRouter();
  const [detailQuery, setDetailQuery] = useState("");
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const value = mode === "detail" ? detailQuery : query;

  function select(category: Category | "all") {
    mobileMenuRef.current?.removeAttribute("open");
    onSelectCategory?.(category);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode !== "detail") return;
    const term = detailQuery.trim();
    router.push(term ? `${quizPath(locale)}?q=${encodeURIComponent(term)}` : quizPath(locale));
  }

  const searchField = (placement: "desktop" | "mobile") => <form className="discovery-search" role="search" onSubmit={submitSearch}>
    <label className="sr-only" htmlFor={`quiz-search-${placement}`}>{t.searchLabel}</label>
    <span aria-hidden="true">⌕</span>
    <input id={`quiz-search-${placement}`} type="search" value={value} onChange={(event) => mode === "detail" ? setDetailQuery(event.target.value) : onSearchChange?.(event.target.value)} placeholder={t.searchLabel} aria-label={t.searchLabel}/>
    {mode === "detail" ? <button type="submit" aria-label={t.searchLabel}>→</button> : value && <button type="button" onClick={() => onSearchChange?.("")} aria-label={copy.clearSearch}>×</button>}
  </form>;

  const item = (category: Category | "all") => {
    const active = category === "all" ? mode === "all" : activeCategory === category && (mode === "category" || mode === "detail");
    const label = category === "all" ? t.allQuizzes : quizCategoryName(locale, category);
    const symbol = category === "all" ? "▦" : icon[category];
    const className = `side-link${active ? " selected" : ""}`;
    if (mode === "detail") {
      return <Link className={className} aria-current={active ? "page" : undefined} href={`${quizPath(locale)}?category=${category}`} key={category}><span aria-hidden="true">{symbol}</span>{label}</Link>;
    }
    return <button type="button" className={className} aria-current={active ? "page" : undefined} onClick={() => select(category)} key={category}><span aria-hidden="true">{symbol}</span>{label}</button>;
  };

  const categoryItems = <>{item("all")}{categories.map(item)}</>;

  return <aside className="sidebar discovery-sidebar" aria-label={messages[locale].categories}>
    <div className="desktop-discovery-nav">{searchField("desktop")}<div className="side-heading">{messages[locale].categories}</div>{categoryItems}</div>
    <div className="mobile-discovery-nav">{searchField("mobile")}<details ref={mobileMenuRef}><summary>{activeCategory ? quizCategoryName(locale, activeCategory) : copy.browseCategories}<span aria-hidden="true">⌄</span></summary><div className="mobile-category-list">{categoryItems}</div></details></div>
  </aside>;
}

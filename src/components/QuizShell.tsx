"use client";

import { forwardRef, type ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuizSidebar } from "@/components/QuizSidebar";
import type { Locale } from "@/lib/i18n";
import type { Category } from "@/lib/registry";
import type { DiscoveryMode } from "@/lib/discovery";

type Props = {
  locale: Locale;
  logoHref: string;
  backHref?: string;
  mode: DiscoveryMode | "detail";
  activeCategory: Category | null;
  query?: string;
  onSelectCategory?: (category: Category | "all") => void;
  onSearchChange?: (query: string) => void;
  children: ReactNode;
};

export const QuizShell = forwardRef<HTMLElement, Props>(function QuizShell({
  locale, logoHref, backHref, mode, activeCategory, query, onSelectCategory, onSearchChange, children,
}, ref) {
  return <div className="discovery-page">
    <SiteHeader locale={locale} logoHref={logoHref} backHref={backHref}/>
    <div className="layout discovery-layout">
      <QuizSidebar locale={locale} mode={mode} activeCategory={activeCategory} query={query} onSelectCategory={onSelectCategory} onSearchChange={onSearchChange}/>
      <main ref={ref} className={`content discovery-content${mode === "detail" ? " detail-content" : ""}`}>
        {children}
        <SiteFooter locale={locale}/>
      </main>
    </div>
  </div>;
});

"use client";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import Image from "next/image";
import { categories, categoryLabels, quizzes } from "@/lib/registry";
import { isLocale, locales, localeNames, messages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { familyServiceUrl, quizPath, quizPathForLocale, SITE_ORIGIN } from "@/lib/urls";
export function HomeView({locale:rawLocale}:{locale:string}){
 const locale=isLocale(rawLocale)?rawLocale:"en",t=messages[locale];const router=useRouter();const [query,setQuery]=useState("");const [active,setActive]=useState("all");const day=useSyncExternalStore(()=>()=>{},()=>{const now=new Date();return now.getUTCFullYear()*372+(now.getUTCMonth()+1)*31+now.getUTCDate();},()=>0);const sidebarRef=useRef<HTMLElement>(null);useEffect(()=>{const node=sidebarRef.current;if(!node)return;node.scrollTop=Number(localStorage.getItem("woori-quiz:sidebar-scroll")||0);const save=()=>localStorage.setItem("woori-quiz:sidebar-scroll",String(node.scrollTop));node.addEventListener("scroll",save,{passive:true});return()=>node.removeEventListener("scroll",save);},[]);
 const visible=useMemo(()=>quizzes.filter(q=>(active==="all"||q.category===active)&&`${q.title} ${q.slug} ${q.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())),[query,active]);
 const today=quizzes[day%quizzes.length];
 return <><header className="topbar"><Link className="brand" href={`/${locale}`}><Image src="/_assets/quiz/woori-logo.png" alt="woori.today" width={140} height={33} priority unoptimized /></Link><nav className="family" aria-label="Family sites">{["Portal","Calculator","Online tools","Household ledger","Documents","Quiz"].map((x,i)=><a key={x} href={i===4?familyServiceUrl(locale,"docs"):i===5?quizPath(locale):`${SITE_ORIGIN}/${locale}`} target={i===5?undefined:"_blank"} rel="noreferrer">{x}</a>)}</nav><select aria-label="Language" value={locale} onChange={e=>router.push(quizPathForLocale(window.location.pathname,e.target.value as Locale))} className="language">{locales.map(l=><option value={l} key={l}>{localeNames[l]}</option>)}</select></header>
 <div className="layout"><aside ref={sidebarRef} className="sidebar"><div className="side-heading">{t.categories}</div><button className={active==="all"?"side-link selected":"side-link"} onClick={()=>setActive("all")}>✦　All quizzes</button>{categories.map(c=><button className={active===c?"side-link selected":"side-link"} onClick={()=>setActive(c)} key={c}><span>{icon[c]}</span>{categoryLabels[c]}</button>)}<div className="side-note"><span className="dot"/> Free to play<br/>No account needed</div></aside>
 <main className="content"><div className="hero"><div className="hero-copy"><span className="eyebrow">A MOMENT OF CURIOSITY</span><h1>{t.subtitle}</h1><p>Little challenges, delightful discoveries. Find a quiz that fits your mood.</p><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/><kbd>⌘ K</kbd></label></div><div className="hero-art"><div className="sun"/><div className="quiz-card-art"><span>✳</span><b>Q</b><small>QUIZ TIME</small></div><div className="spark spark-a">✦</div><div className="spark spark-b">✳</div><div className="art-caption">A little brain<br/>break goes a long way.</div></div></div>
 <AdSlot/><section className="today-section"><div className="today-card"><div><span className="eyebrow">✦　{t.today.toUpperCase()}</span><h2>{today.title}</h2><p>{today.summary}</p><Link className="button primary" href={quizPath(locale,today.slug)}>{t.play} <span>→</span></Link></div><div className="today-graphic"><span>✷</span><b>?</b><i>✦</i></div></div></section>
 <section className="quiz-section"><div className="section-head"><div><span className="eyebrow">PICK YOUR NEXT CHALLENGE</span><h2>{active==="all"?t.popular:categoryLabels[active as keyof typeof categoryLabels]}</h2></div><span className="result-count">{visible.length} quizzes</span></div><div className="quiz-grid">{visible.map((q,i)=><Link className="quiz-card" href={quizPath(locale,q.slug)} key={q.slug}><span className={`card-icon color-${i%6}`}>{icon[q.category]}</span><span className="card-category">{categoryLabels[q.category]}</span><h3>{q.title}</h3><p>{q.summary}</p><div className="card-meta"><span>{q.mode==="dynamic"?"∞ questions":`${typeof q.count==="number"?q.count:"Question set in review"}`}</span><span>{q.difficulty[0]} <b>→</b></span></div></Link>)}</div></section>
 <footer className="footer"><div className="brand"><span className="brand-mark">Q</span> woori.quiz</div><div>Made for curious minds, everywhere.</div><nav><a href="#privacy">Privacy</a><a href="#terms">Guidelines</a><a href="mailto:krdd125@gmail.com">Contact</a></nav><small>© 2026 woori.today</small></footer></main></div></>;
}
const icon:Record<string,string>={general:"✳",geography:"◎",science:"⚗",history:"◷",math:"＋",language:"文",technology:"⌘",memory:"▦",speed:"↯",fun:"☻"};






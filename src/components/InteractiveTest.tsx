"use client";
import { useEffect, useRef, useState } from "react";
import { saveQuizResult } from "@/lib/storage";
import { getQuiz } from "@/lib/registry";
import { quizTitle } from "@/lib/quiz-copy";
import { getLoadedLocaleCatalog } from "@/lib/locale-catalog";
import { useLocaleCatalog } from "@/lib/use-locale-catalog";
import type { Locale } from "@/lib/i18n";
import { calculateTypingMetrics, scoreReaction, scoreRecall, scoreVisualRecall } from "@/lib/interactive-metrics";
type Phase="ready"|"waiting"|"showing"|"playing"|"done";
const elapsedSeconds=(start:number)=>Math.round((performance.now()-start)/1000);
const shuffle=<T,>(items:T[])=>[...items].sort(()=>Math.random()-.5);
export function InteractiveTest({slug,locale}:{slug:string;locale:Locale}){
 useLocaleCatalog(locale);
 const catalog = getLoadedLocaleCatalog(locale);
 const t = catalog.interactiveTest.copy;
 const passage = catalog.interactiveTest.passage;
 const memoryWordsForLocale = catalog.interactiveTest.memoryWords;
 const extra = catalog.interactiveTest.extraCopy;
 const [phase,setPhase]=useState<Phase>("ready"),[message,setMessage]=useState(""),[startedAt,setStartedAt]=useState(0),[elapsed,setElapsed]=useState(0),[count,setCount]=useState(0),[value,setValue]=useState("");const [target,setTarget]=useState("");const [grid,setGrid]=useState<number[]>([]),[selected,setSelected]=useState<number[]>([]),[cards,setCards]=useState<string[]>([]),[matched,setMatched]=useState<number[]>([]),[turns,setTurns]=useState(0);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const frame=useRef<number>(0);const goAt=useRef(0);
 const isVisual=slug==="visual-memory-test",isConcentration=slug==="concentration-test",clickCount=useRef(0);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);cancelAnimationFrame(frame.current);},[]);
 const save=(points:number,duration:number)=>{saveQuizResult(localStorage,slug,points,"medium",duration);setElapsed(duration);setPhase("done");};
 const begin=()=>{setMessage("");setValue("");setSelected([]);setMatched([]);setCount(0);clickCount.current=0;setTurns(0);setStartedAt(performance.now());
  if(slug==="reaction-time-test"||slug==="color-reaction-test"){setPhase("waiting");setMessage(t.tap);timer.current=setTimeout(()=>{goAt.current=performance.now();setPhase("playing");setMessage(t.go);},1200+Math.random()*2200);return;}
  if(slug==="click-speed-test"){setPhase("playing");const start=performance.now();const tick=(now:number)=>{const ms=now-start;setElapsed(Math.min(10,ms/1000));if(ms>=10000){save(clickCount.current,10);return;}frame.current=requestAnimationFrame(tick);};frame.current=requestAnimationFrame(tick);return;}
  if(slug==="typing-speed-test"){setPhase("playing");return;}
  if(isConcentration){const deck=shuffle(["🍋","🍋","🌿","🌿","🌙","🌙","☀️","☀️"]);setCards(deck);setPhase("playing");return;}
  if(slug==="pattern-recognition-test"){setTarget("2, 4, 8, 16, ?");setPhase("playing");return;}
  let memory="";if(slug==="number-memory-test")memory=String(Math.floor(100000+Math.random()*900000));else if(slug==="word-memory-test")memory=memoryWordsForLocale;else if(slug==="sequence-memory-test")memory=Array.from({length:6},()=>1+Math.floor(Math.random()*4)).join("");else if(isVisual){const cells=shuffle([0,1,2,3,4,5,6,7,8]).slice(0,4);setGrid(cells);memory=cells.join(",");}setTarget(memory);setPhase("showing");timer.current=setTimeout(()=>setPhase("playing"),2500);
 };
 const reactClick=()=>{if(phase==="waiting"){if(timer.current)clearTimeout(timer.current);setMessage(t.tooSoon);setPhase("done");return;}if(phase==="playing"&&(slug==="reaction-time-test"||slug==="color-reaction-test")){const ms=Math.round(performance.now()-goAt.current);setMessage(`${ms} ms`);save(scoreReaction(ms),Math.round((performance.now()-startedAt)/1000));}};
 const finishRecall=()=>{let points=0;if(isVisual){points=scoreVisualRecall(grid,selected);}else if(slug==="pattern-recognition-test"){points=Number(value)===32?100:0;}else{points=scoreRecall(value,target,locale);}save(Math.max(0,points),elapsedSeconds(startedAt));};
 const typeChange=(next:string)=>{setValue(next);if(slug==="typing-speed-test"&&next.length>=passage.length){const metrics=calculateTypingMetrics(next,passage,performance.now()-startedAt,locale);setMessage(`${t.wpm}: ${metrics.wpm} · ${t.accuracy}: ${metrics.accuracy}% · ${t.errors}: ${metrics.errors} · ${t.time}: ${metrics.seconds.toFixed(1)}s`);save(metrics.accuracy,Math.round(metrics.seconds));}};
 const cardClick=(index:number)=>{if(matched.includes(index)||selected.includes(index)||selected.length===2)return;const next=[...selected,index];setSelected(next);if(next.length===2){setTurns(n=>n+1);if(cards[next[0]]===cards[next[1]]){const pairs=[...matched,...next];setMatched(pairs);setSelected([]);if(pairs.length===cards.length)save(Math.max(0,100-turns*4),elapsedSeconds(startedAt));}else timer.current=setTimeout(()=>setSelected([]),650);}};
 return <section className="play-panel interactive-panel"><div className="progress-row"><span>{phase==="done"?t.done:quizTitle(locale,getQuiz(slug)??{slug,title:slug})}</span>{slug==="click-speed-test"&&phase==="playing"&&<span>{Math.max(0,10-elapsed).toFixed(1)}s</span>}</div>
 {phase==="ready"&&<><p>{slug==="typing-speed-test"?passage:slug==="reaction-time-test"||slug==="color-reaction-test"?t.tap:t.remember}</p><button className="button primary" onClick={begin}>{t.start} →</button></>}
 {phase==="waiting"&&<button className="reaction-pad wait-pad" onClick={reactClick}>{t.tap}</button>}
 {slug==="reaction-time-test"&&phase==="playing"&&<button className="reaction-pad go-pad" onClick={reactClick}>{t.go}</button>}
 {slug==="color-reaction-test"&&phase==="playing"&&<div className="color-target" role="button" aria-label={t.go} tabIndex={0} onClick={reactClick} onKeyDown={e=>e.key==="Enter"&&reactClick()}>●</div>}
 {slug==="click-speed-test"&&phase==="playing"&&<button className="click-pad" onClick={()=>{clickCount.current++;setCount(clickCount.current);}}>{t.clicks}: {count}<small>{extra.tapFast}</small></button>}
 {slug==="typing-speed-test"&&phase==="playing"&&<><p className="typing-passage">{passage}</p><textarea autoFocus value={value} onChange={e=>typeChange(e.target.value)} placeholder={t.type} /></>}
 {phase==="showing"&&<div className="memory-display"><p>{t.remember}</p>{isVisual?<div className="memory-grid">{Array.from({length:9},(_,i)=><span className={grid.includes(i)?"memory-cell on":"memory-cell"} key={i}/>)}</div>:<strong>{target}</strong>}</div>}
 {phase==="playing"&&slug==="visual-memory-test"&&<><div className="memory-grid">{Array.from({length:9},(_,i)=><button aria-label={`${extra.cell} ${i+1}`} className={selected.includes(i)?"memory-cell on":"memory-cell"} onClick={()=>setSelected(v=>v.includes(i)?v.filter(n=>n!==i):[...v,i])} key={i}/>)}</div><button className="button primary" onClick={finishRecall}>{t.submit}</button></>}
 {phase==="playing"&&slug==="concentration-test"&&<><div className="memory-grid cards-grid">{cards.map((card,i)=><button className="memory-card" onClick={()=>cardClick(i)} key={i}>{matched.includes(i)||selected.includes(i)?card:"?"}</button>)}</div><p>{t.matched}: {matched.length/2} · {extra.moves}: {turns}</p></>}
 {phase==="playing"&&!["click-speed-test","typing-speed-test","visual-memory-test","concentration-test","reaction-time-test","color-reaction-test"].includes(slug)&&<><div className="memory-entry">{slug==="pattern-recognition-test"&&<p>{target}</p>}<input value={value} onChange={e=>setValue(e.target.value)} placeholder={t.type}/><button className="button primary" onClick={finishRecall}>{t.submit}</button></div></>}
 {phase==="done"&&<div className="interactive-result"><h2>{message||t.done}</h2>{!message.includes("ms")&&<p>{t.time}: {elapsed}s · {t.clicks}: {count}</p>}<button className="button primary" onClick={()=>setPhase("ready")}>{t.tryAgain} ↻</button></div>}
 </section>;
}





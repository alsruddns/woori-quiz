export function calculateTypingMetrics(input:string,target:string,elapsedMilliseconds:number,locale:string){
 const seconds=Math.max(elapsedMilliseconds/1000,1);
 const correct=[...target].filter((char,index)=>char===input[index]).length;
 const errors=Math.abs(input.length-target.length)+target.length-correct;
 const words=[...new Intl.Segmenter(locale,{granularity:"word"}).segment(input)].filter(part=>part.isWordLike).length;
 return {seconds,wpm:Math.round(words/(seconds/60)),errors,accuracy:Math.max(0,Math.round((1-errors/Math.max(input.length,target.length,1))*100))};
}
export function scoreRecall(input:string,target:string,locale:string){
 const normalize=(text:string)=>text.trim().toLocaleLowerCase(locale).replace(/[\s,，、]+/g,"");
 const actual=normalize(input),expected=normalize(target);
 return actual===expected?100:Math.round(actual.split("").filter((char,index)=>char===expected[index]).length/Math.max(expected.length,1)*100);
}
export function scoreVisualRecall(target:number[],selected:number[]){return Math.max(0,target.filter(cell=>selected.includes(cell)).length*25-selected.filter(cell=>!target.includes(cell)).length*15);}
export function scoreReaction(milliseconds:number){return Math.max(0,1000-milliseconds);}

import React,{useEffect,useState} from 'react';
import {spokenLines} from './presentationCopy.js';

export default function SpokenLine({text,hasChoices,onReady,onDone}){
 const lines=spokenLines(text),[index,setIndex]=useState(0);
 const line=lines[index]||'',last=index>=lines.length-1;
 function advance(){if(!last)setIndex(n=>n+1);else if(hasChoices)onReady();else onDone();}
 useEffect(()=>{const timer=setTimeout(advance,Math.max(3000,line.length*55));return()=>clearTimeout(timer)},[index,text,hasChoices]);
 return <button className="spoken-line" aria-label={last?'Finish reading':'Read next line'} onClick={advance}><span role="status">{line}</span>{!last&&<small aria-hidden="true">· · ·</small>}</button>;
}

import React from 'react';
import './harbourTableau.css';

const SKINS=['#7a4d38','#b96f4a','#d4a276','#e2ba91','#6a4938','#9e6a50'];
const CLOTHES=['#415f66','#8b4d3e','#596849','#8b7048','#534d68','#a36a3d','#4c6175'];
const HAIR=['#2f2a28','#4c352d','#7c5a45','#171b1b','#5a463d'];
const pick=(list,id,offset=0)=>list[(id.length+id.charCodeAt(0)+offset)%list.length];
const loopStyle=item=>({'--loop-duration':`${item.duration}s`,'--travel-x':`${item.motion?.dx||0}px`,'--travel-y':`${item.motion?.dy||0}px`});

function Face({item,cy=-38}){
 const skin=pick(SKINS,item.id),hair=item.age==='elder'?'#c5bdac':pick(HAIR,item.id,2);
 return <><ellipse cy={cy} rx="7" ry="9" fill={skin}/><path d={`M-7 ${cy-3}Q0 ${cy-13} 7 ${cy-3}`} fill="none" stroke={hair} strokeWidth="3"/></>;
}

function StandingPerson({item}){
 const skin=pick(SKINS,item.id),coat=pick(CLOTHES,item.id,3),wide=item.body==='wide',wealthy=item.variant==='wealthy';
 return <g className={`tableau-loop activity-${item.activity}`} style={loopStyle(item)}>
   <Face item={item}/>
   <path d={wide?'M-15-28Q0-35 15-28L12-5H-12Z':'M-10-28Q0-34 10-28L8-5H-8Z'} fill={wealthy?'#393f56':coat}/>
   <path d="M-6-5L-8 17M6-5L8 17" stroke="#3b3935" strokeWidth="3" strokeLinecap="round"/>
   <path d="M-8-24L-16-9M8-24L16-11" stroke={skin} strokeWidth="3" strokeLinecap="round"/>
   {item.activity==='carry'&&<rect x="12" y="-14" width="15" height="12" fill="#9a7048" stroke="#4f463b"/>}
   {item.activity==='basketball'&&<circle cx="18" cy="-8" r="5" fill="#b95f32" stroke="#613b28"/>}
   {item.activity==='music'&&<path d="M13-23L21-7M19-20L12-12" stroke="#624631" strokeWidth="3"/>}
   {item.activity==='glassblow'&&<><path d="M14-19L31-24" stroke="#4c4944" strokeWidth="2"/><circle cx="34" cy="-25" r="5" fill="#d58b48" opacity=".8"/></>}
   {item.activity==='rummage'&&<path d="M13-8L24-1L18 13L8 7Z" fill="#6d665a"/>}
   {wealthy&&<><path d="M-11-49H11L16-44H-16Z" fill="#30343c"/><path d="M18-18V16" stroke="#5d4938" strokeWidth="2"/><rect x="-24" y="-8" width="10" height="16" fill="#7a5d45"/></>}
 </g>;
}

function SeatedPerson({item}){
 const skin=pick(SKINS,item.id),coat=pick(CLOTHES,item.id,4);
 return <g className={`tableau-loop activity-${item.activity}`} style={loopStyle(item)}>
   <Face item={item} cy={-30}/>
   <path d="M-10-20Q0-27 10-20L7-4H-7Z" fill={coat}/>
   <path d="M-6-4L-15 8M6-4L15 8" stroke="#393833" strokeWidth="3" strokeLinecap="round"/>
   <path d="M-13 9H13" stroke="#625846" strokeWidth="3"/>
   {item.activity==='chess'&&<><rect x="14" y="-3" width="18" height="12" fill="#d7c8a2" stroke="#5a5041"/><circle cx="19" cy="1" r="1.4"/><circle cx="25" cy="5" r="1.4"/></>}
   {item.activity==='shisha'&&<><path d="M16 3Q25-8 31-4" fill="none" stroke="#4a4540" strokeWidth="2"/><path d="M30-4V8M26 8H34" stroke="#4a4540" strokeWidth="2"/><ellipse cx="30" cy="-7" rx="4" ry="3" fill="#8d5b45"/></>}
 </g>;
}

function SlumpFigure({item}){
 const skin=pick(SKINS,item.id),coat=pick(CLOTHES,item.id,1);
 return <g className="tableau-loop activity-slump" style={loopStyle(item)} transform="rotate(8)">
   <ellipse cx="-20" cy="-11" rx="7" ry="8" fill={skin}/><path d="M-13-10Q4-18 18-5L12 7H-5Z" fill={coat}/><path d="M8 6L26 14M0 6L-13 18" stroke="#403d38" strokeWidth="3" strokeLinecap="round"/>
 </g>;
}

function SkeletonFigure({item}){
 return <g className="tableau-loop activity-idle tableau-skeleton" style={loopStyle(item)}>
   <circle cy="-35" r="7"/><path d="M0-28V-7M-9-22H9M-6-17L-11-9M6-17L11-9M0-7L-8 13M0-7L8 13"/><path d="M-6-25h12M-6-20h12M-5-15h10"/>
 </g>;
}

function Swimmer({item}){return <g className="tableau-loop activity-swim" style={loopStyle(item)}><ellipse cy="-4" rx="8" ry="7" fill={pick(SKINS,item.id)}/><path d="M-15 2Q0 8 16 2" fill="none" stroke="#e4efe3" strokeWidth="2" opacity=".8"/></g>}
function Sunbather({item}){return <g className="tableau-loop activity-sunbathe" style={loopStyle(item)} transform="rotate(-8)"><ellipse cx="-18" cy="-4" rx="6" ry="5" fill={pick(SKINS,item.id)}/><path d="M-12-4H18" stroke={pick(CLOTHES,item.id)} strokeWidth="7" strokeLinecap="round"/><path d="M18-4L31-8M18-4L31 2" stroke={pick(SKINS,item.id)} strokeWidth="3" strokeLinecap="round"/></g>}

export function CrowdFigure({item,...props}){
 const seated=['chess','shisha','eat'].includes(item.activity),scale=item.scale||1;
 return <g {...props} aria-hidden="true" pointerEvents="none" className={`tableau-crowd tableau-${item.activity} variant-${item.variant||'ordinary'}`} transform={`translate(${item.x} ${item.y}) scale(${scale})`}>
   {item.variant==='skeleton'?<SkeletonFigure item={item}/>:item.activity==='slump'?<SlumpFigure item={item}/>:item.activity==='swim'?<Swimmer item={item}/>:item.activity==='sunbathe'?<Sunbather item={item}/>:seated?<SeatedPerson item={item}/>:<StandingPerson item={item}/>} 
 </g>;
}

export function CreatureFigure({item,...props}){
 const loop={gull:'gull',squirrel:'squirrel',fish:'fish'}[item.activity]||'idle';
 return <g {...props} aria-hidden="true" pointerEvents="none" className={`tableau-creature tableau-${item.species} activity-${loop}`} style={{'--loop-duration':`${item.duration}s`}} transform={`translate(${item.x} ${item.y})`}>
   {item.species==='seagull'?<><path d="M-12 0Q-5-8 0-1Q5-8 12 0" fill="none" stroke="#555b59" strokeWidth="2"/><circle cx="1" cy="3" r="3" fill="#e8e4d7"/></>:item.species==='squirrel'?<><ellipse rx="5" ry="4" fill="#9a633e"/><circle cx="5" cy="-4" r="3" fill="#9a633e"/><path d="M-4-1Q-15-13-15 1Q-13 8-6 5" fill="#ad7048"/></>:<><path d="M-9 0Q0-7 9 0Q0 7-9 0L-14-5V5Z" fill="#d48a53"/><circle cx="5" cy="-1" r="1" fill="#393b3a"/></>}
 </g>;
}

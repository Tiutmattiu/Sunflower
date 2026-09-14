import React from 'react';
import {HARBOUR_WORLD} from './harbourWorld.js';
import './harbourTableau.css';

const SKINS=['#7a4d38','#b96f4a','#d4a276','#e2ba91','#6a4938','#9e6a50'];
const CLOTHES=['#415f66','#8b4d3e','#596849','#8b7048','#534d68','#a36a3d','#4c6175'];
const pick=(list,id,offset=0)=>list[(id.length+id.charCodeAt(0)+offset)%list.length];

export function ExpandedWorldBackdrop() {
  const {width,height}=HARBOUR_WORLD;
  return <g aria-hidden="true" pointerEvents="none" className="expanded-world-backdrop">
    <rect className="world-paper" width={width} height={height}/>
    <path className="world-sea" d="M0 765C320 718 620 785 930 790C1260 796 1570 704 2000 675V1200H0Z"/>
    <path className="world-shore" d="M0 704C305 680 590 734 920 744C1190 752 1460 688 1690 654L1680 722C1435 756 1205 814 920 806C585 797 300 754 0 788Z"/>
    <path className="world-cliff" d="M0 230C80 265 150 344 183 438C213 526 204 650 154 766L0 834Z"/>
    <path className="world-park" d="M475 706C585 666 796 674 950 739L924 934C744 978 560 951 448 858Z"/>
    <path className="world-upper-street" d="M1260 95H2000V656C1814 678 1602 694 1432 651L1282 525Z"/>
    <path className="world-road" d="M108 450C420 420 624 470 820 565C1010 659 1215 652 1510 570C1677 524 1830 493 1972 510"/>
    <path className="world-breakwater" d="M1045 809C1270 840 1515 822 1760 770"/>
    <g className="world-water-lines">
      <path d="M1040 910C1230 884 1425 928 1605 898C1745 876 1855 840 1970 850"/>
      <path d="M1110 1010C1280 986 1485 1026 1680 998C1794 981 1882 955 1978 960"/>
      <path d="M990 1102C1218 1078 1434 1120 1648 1094C1780 1078 1888 1049 1985 1053"/>
    </g>
  </g>;
}

function StandingPerson({item}) {
  const skin=pick(SKINS,item.id), coat=pick(CLOTHES,item.id,3);
  return <g className={`tableau-loop activity-${item.activity}`} style={{'--loop-duration':`${item.duration}s`}}>
    <ellipse cy="-38" rx="7" ry="9" fill={skin}/>
    <path d="M-10-28Q0-34 10-28L8-5H-8Z" fill={coat}/>
    <path d="M-6-5L-8 17M6-5L8 17" stroke="#3b3935" strokeWidth="3" strokeLinecap="round"/>
    <path d="M-8-24L-16-9M8-24L16-11" stroke={skin} strokeWidth="3" strokeLinecap="round"/>
    {item.activity==='carry'&&<rect x="12" y="-14" width="15" height="12" fill="#9a7048" stroke="#4f463b"/>}
    {item.activity==='basketball'&&<circle cx="18" cy="-8" r="5" fill="#b95f32" stroke="#613b28"/>}
    {item.activity==='music'&&<path d="M13-23L21-7M19-20L12-12" stroke="#624631" strokeWidth="3"/>}
    {item.activity==='glassblow'&&<><path d="M14-19L31-24" stroke="#4c4944" strokeWidth="2"/><circle cx="34" cy="-25" r="5" fill="#d58b48" opacity=".8"/></>}
    {item.activity==='rummage'&&<path d="M13-8L24-1L18 13L8 7Z" fill="#6d665a"/>}
  </g>;
}

function SeatedPerson({item}) {
  const skin=pick(SKINS,item.id), coat=pick(CLOTHES,item.id,4);
  return <g className={`tableau-loop activity-${item.activity}`} style={{'--loop-duration':`${item.duration}s`}}>
    <ellipse cy="-30" rx="7" ry="9" fill={skin}/>
    <path d="M-10-20Q0-27 10-20L7-4H-7Z" fill={coat}/>
    <path d="M-6-4L-15 8M6-4L15 8" stroke="#393833" strokeWidth="3" strokeLinecap="round"/>
    <path d="M-13 9H13" stroke="#625846" strokeWidth="3"/>
    {item.activity==='chess'&&<><rect x="14" y="-3" width="18" height="12" fill="#d7c8a2" stroke="#5a5041"/><circle cx="19" cy="1" r="1.4"/><circle cx="25" cy="5" r="1.4"/></>}
    {item.activity==='shisha'&&<><path d="M16 3Q25-8 31-4" fill="none" stroke="#4a4540" strokeWidth="2"/><path d="M30-4V8M26 8H34" stroke="#4a4540" strokeWidth="2"/><ellipse cx="30" cy="-7" rx="4" ry="3" fill="#8d5b45"/></>}
  </g>;
}

function Swimmer({item}) {
  return <g className="tableau-loop activity-swim" style={{'--loop-duration':`${item.duration}s`}}>
    <ellipse cy="-4" rx="8" ry="7" fill={pick(SKINS,item.id)}/>
    <path d="M-15 2Q0 8 16 2" fill="none" stroke="#e4efe3" strokeWidth="2" opacity=".8"/>
  </g>;
}

function Sunbather({item}) {
  return <g className="tableau-loop activity-sunbathe" style={{'--loop-duration':`${item.duration}s`}} transform="rotate(-8)">
    <ellipse cx="-18" cy="-4" rx="6" ry="5" fill={pick(SKINS,item.id)}/>
    <path d="M-12-4H18" stroke={pick(CLOTHES,item.id)} strokeWidth="7" strokeLinecap="round"/>
    <path d="M18-4L31-8M18-4L31 2" stroke={pick(SKINS,item.id)} strokeWidth="3" strokeLinecap="round"/>
  </g>;
}

export function CrowdFigure({item,...props}) {
  const seated=['chess','shisha','eat'].includes(item.activity);
  return <g {...props} aria-hidden="true" pointerEvents="none" className={`tableau-crowd tableau-${item.activity}`} transform={`translate(${item.x} ${item.y})`}>
    {item.activity==='swim'?<Swimmer item={item}/>:item.activity==='sunbathe'?<Sunbather item={item}/>:seated?<SeatedPerson item={item}/>:<StandingPerson item={item}/>} 
  </g>;
}

export function CreatureFigure({item,...props}) {
  const loop={gull:'gull',squirrel:'squirrel',fish:'fish'}[item.activity]||'idle';
  return <g {...props} aria-hidden="true" pointerEvents="none" className={`tableau-creature tableau-${item.species} activity-${loop}`} style={{'--loop-duration':`${item.duration}s`}} transform={`translate(${item.x} ${item.y})`}>
    {item.species==='seagull'?<><path d="M-12 0Q-5-8 0-1Q5-8 12 0" fill="none" stroke="#555b59" strokeWidth="2"/><circle cx="1" cy="3" r="3" fill="#e8e4d7"/></>:
     item.species==='squirrel'?<><ellipse rx="5" ry="4" fill="#9a633e"/><circle cx="5" cy="-4" r="3" fill="#9a633e"/><path d="M-4-1Q-15-13-15 1Q-13 8-6 5" fill="#ad7048"/></>:
     <><path d="M-9 0Q0-7 9 0Q0 7-9 0L-14-5V5Z" fill="#d48a53"/><circle cx="5" cy="-1" r="1" fill="#393b3a"/></>}
  </g>;
}

export function TableauSignals() {
  const {x,y}=HARBOUR_WORLD.legacy;
  return <g aria-hidden="true" pointerEvents="none" className="tableau-signals" transform={`translate(${x} ${y})`}>
    <g transform="translate(1165 425)"><rect x="-45" y="-18" width="90" height="28" rx="4"/><text y="1" textAnchor="middle">WONG • PARCEL • LAUNDRY</text><circle cx="36" cy="23" r="11"/><text x="36" y="27" textAnchor="middle">₿</text></g>
    <g transform="translate(905 585)"><rect x="-42" y="-17" width="84" height="26" rx="13"/><text y="1" textAnchor="middle">OCTOPUS BANK</text></g>
    <g transform="translate(512 453)"><text>SHISHA</text><path d="M15 6V25M8 25H22M10 8Q15 2 20 8"/></g>
    <g transform="translate(688 420)"><rect x="-24" y="-14" width="48" height="23"/><text y="2" textAnchor="middle">PIZZA</text></g>
    <g transform="translate(690 710)"><path d="M-42 7H42M-32 7V-30M32 7V-30M32-30H14"/><circle cx="8" cy="-22" r="5"/></g>
    <g transform="translate(825 735)"><rect x="-25" y="-8" width="50" height="16"/><path d="M-16-8V8M-8-8V8M0-8V8M8-8V8M16-8V8"/></g>
    <g transform="translate(318 510)"><path d="M-12 15V-4Q0-22 12-4V15M-19 15H19"/><circle cx="0" cy="-12" r="4"/></g>
    <g transform="translate(375 445)"><path d="M-18 12H18M-13 12V-15H13V12"/><circle cx="0" cy="-4" r="5"/></g>
  </g>;
}

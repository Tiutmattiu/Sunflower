import {knows} from './playerKnowledge.js';
import React, {useEffect, useRef, useState} from 'react';
import {LOCATION_LABELS} from './presentationCopy.js';
import {UNKNOWN_PEOPLE,visibleNames} from './dialogueContent.js';
import {availableMicroScenes} from './worldLifeContent.js';
import {crowdForWorld,creaturesForWorld,namedActorPoint} from './harbourTableau.js';
import {HARBOUR_WORLD,legacyPoint} from './harbourWorld.js';
import {clampCamera,centeredCamera,coverScale,focusCamera,zoomCamera} from './harbourCamera.js';
import {CrowdFigure,CreatureFigure,ExpandedWorldBackdrop,TableauSignals} from './HarbourTableauLayer.jsx';

const place=(x,y,name)=>{const p=legacyPoint(x,y);return [p.x,p.y,name]};
export const PLACES = {
 harbour_berth:place(930,620,'Berth'), joels_bar:place(590,380,'Bar'), parcel_counter:place(1050,330,'Parcel shop'),
 nursery:place(285,290,'Growing yard'), viewing_room:place(720,130,'Gallery'), back_room:place(1160,150,'Side room'),
 sonyas_kitchen:place(370,120,'Kitchen'), cliff_path:place(120,520,'Cliff path'), public_clearing:place(750,520,'Exchange'), old_hall:place(480,540,'Screening hall')
};
export const PEOPLE = {
 aspen:{name:'Aspen',unknown:'Woman with a blue scarf',coat:'#345779',hair:'#422e29'},
 joel:{name:'Joel',unknown:'Man in a white apron',coat:'#eee4c9',hair:'#34332c'},
 wong:{name:'Wong',unknown:'Copper dog with a parcel',coat:'#b2763f',hair:'#242c30'},
 juan:{name:'Juan',unknown:'White-haired man with soil on his sleeves',coat:'#788451',hair:'#6c4432'},
 yasmin:{name:'Yasmin',unknown:'Woman in a red coat',coat:'#a74739',hair:'#292c33'},
 dima:{name:'Dima',unknown:'Fair-haired man',coat:'#4d5954',hair:'#272b29'}
};
export const personName=(w,id)=>w.actors.player.contacts.includes(id)?PEOPLE[id]?.name:UNKNOWN_PEOPLE[id];
const CAST = {
 juan:[0,433,74],
 joel:[433,332,94,'polygon(0 0,94% 0,94% 84%,100% 90%,100% 100%,0 100%)'],
 aspen:[748,340,84,'polygon(0 0,86% 0,86% 80%,100% 100%,22% 100%,15% 72%,0 62%)'],
 yasmin:[1040,405,87,'polygon(0 0,100% 0,100% 100%,12% 100%,5% 93%,0 87%)'],
 dima:[1445,329,89]
};
export function Figure({id,scale:placeScale=1}) {
 const crop=CAST[id];
 if(crop){const [x,width,baseHeight,clipPath]=crop,height=baseHeight*2.5*placeScale,scale=height/887;return <foreignObject aria-hidden="true" pointerEvents="none" x={-width*scale/2} y={-height} width={width*scale} height={height}><div style={{width:'100%',height:'100%',clipPath,backgroundImage:'url(/art/cast-working.png)',backgroundSize:`${1774*scale}px ${height}px`,backgroundPosition:`${-x*scale}px 0`,backgroundRepeat:'no-repeat'}}/></foreignObject>}
 return <g aria-hidden="true" stroke="#3a332b" strokeWidth="1.5">{id==='wong'?<><path d="M-23-24Q-4-42 17-26L25-48L32-42L28-24L17-17L12 0H8L8-21L-12-20L-15 0H-20L-19-22Q-31-12-33-30" fill="#b47b47"/><path d="M25-47L19-49L22-38" fill="#805333"/></>:<><ellipse cy="-23" rx="16" ry="24" fill="#35383a"/><ellipse cy="-18" rx="10" ry="17" fill="#e6ded0"/><path d="M8-37L22-32L10-28" fill="#bd8547"/></>}</g>;
}
export function ObjectArt({kind=''}) {const k=kind.toLowerCase();return <svg width="46" height="48" viewBox="-25 -28 50 56" aria-hidden="true" className="object-art"><g stroke="#414438" strokeWidth="1.4">
 {k.includes('fish')||k.includes('mackerel')?<><path d="M-20 2 Q0-20 19 0 Q0 18-20 2L-24-7V10Z" fill="#8ba5a0"/><circle cx="12" cy="-2" r="1.5"/><path d="M4-8 2 7M-10-2 0 0" fill="none"/></>:
 k.includes('toad')?<><ellipse cy="8" rx="14" ry="9" fill="#7b844d"/><circle cx="-7" cy="0" r="5" fill="#899655"/><circle cx="7" cy="0" r="5" fill="#899655"/><circle cx="-7" cy="-1" r="1"/><circle cx="7" cy="-1" r="1"/></>:
 k.includes('lime')?<><ellipse rx="13" ry="11" fill="#a7b443"/><path d="M-2-11Q12-24 15-13Q8-8-2-11" fill="#627b40"/></>:
 /bottle|orgeat|rum|soda/.test(k)?<><path d="M-5-23H5V-10L10-4V21H-10V-4L-5-10Z" fill="#779d88"/><path d="M-5-23H5V-18H-5Z" fill="#a84c3a"/><path d="M-9 2H9V14H-9Z" fill="#eee0b7"/></>:
 /wheel|rim|link|cable|tape/.test(k)?<><circle r="18" fill="none" strokeWidth="5"/><circle r="4" fill="#b07c47"/><path d="M0-15V15M-15 0H15M-11-11 11 11M-11 11 11-11"/></>:
 /flower|plant|crop/.test(k)?<><path d="M0 22V-15M0 8Q-20-4-12-8Q0-5 0 8" fill="#7c934f"/>{[0,60,120,180,240,300].map(a=><ellipse key={a} transform={`translate(0 -14) rotate(${a})`} cy="-7" rx="4" ry="8" fill="#d4a132"/>)}<circle cy="-14" r="5" fill="#614b34"/></>:
 /paper|notice|claim|photo/.test(k)?<><path d="M-17-23 18-20 15 23-19 19Z" fill="#eddfb8"/><path d="M-11-11 11-9M-12-4 8-2M-12 4 11 6M-12 12 0 13" fill="none"/></>:
 <><path d="M-20-13 17-18 22 15-16 20Z" fill="#ba8e5b"/><path d="M-20-4 20-8M-18 8 21 5M-8-15-4 19M10-17 14 16" fill="none"/></>}
 </g></svg>}
function Scenery({world}) {
 const art=HARBOUR_WORLD.legacy;
 const boat=legacyPoint(...(world.aspenRoute?.status==='away'?[1330,850]:[1150,735]));
 return <g aria-hidden="true">
  <ExpandedWorldBackdrop/>
  <image href="/art/harbour-working.png" x={art.x} y={art.y} width={art.width} height={art.height} preserveAspectRatio="none"/>
  <g className="boat" transform={`translate(${boat.x} ${boat.y})`} stroke="#393d36" strokeWidth="2"><path d="M-40 0H45L30 22H-25Z" fill="#9f493a"/><path d="M-20-3V-24H20V-3Z" fill="#ded1ac"/><path d="M-12-19H10V-7H-12Z" fill="#406978"/></g>
  {world.weather==='storm'&&<g opacity=".27" stroke="#d1ded5"><rect width={HARBOUR_WORLD.width} height={HARBOUR_WORLD.height} fill="#193948" stroke="none"/>{Array.from({length:70},(_,i)=><path key={i} d={`M${i*31} ${(i*83)%1120}l-16 40`}/>)}</g>}
 </g>
}
const prop=(id,loc,x,y,label)=>{const p=legacyPoint(x,y);return[id,loc,p.x,p.y,label]};
export const PROPS=[prop('crate','harbour_berth',905,590,'Lime crate'),prop('cargo','harbour_berth',978,573,'Cargo'),prop('bottle','joels_bar',555,337,'Bottle'),prop('glass','joels_bar',644,357,'Glass'),prop('packing','joels_bar',498,364,'Packing bundle'),prop('parcel','parcel_counter',1095,309,'Parcel'),prop('parts','parcel_counter',1000,310,'Wheel parts'),prop('plants','nursery',258,297,'Plants'),prop('paper','nursery',337,278,'Paper'),prop('bowl','viewing_room',737,112,'Bowl'),prop('photo','viewing_room',799,114,'Photograph'),prop('envelope','back_room',1185,130,'Envelope'),prop('table','sonyas_kitchen',389,108,'Supper table'),prop('path','cliff_path',105,489,'Path'),prop('orders','public_clearing',737,478,'Posted offers')];
export default function HarbourMap({world,onFocus,selected,activeProps}) {
 const ref=useRef(null), pointers=useRef(new Map()), gesture=useRef(null), moved=useRef(false), initialized=useRef(false);
 const [camera,setCamera]=useState({x:0,y:0,z:1}),[size,setSize]=useState({w:1,h:1});
 useEffect(()=>{const el=ref.current;if(!el)return;const o=new ResizeObserver(([e])=>{const next={w:e.contentRect.width,h:e.contentRect.height};setSize(next);setCamera(c=>{if(!initialized.current){initialized.current=true;return centeredCamera(next,HARBOUR_WORLD,1)}return clampCamera(c,next,HARBOUR_WORLD)})});o.observe(el);return()=>o.disconnect()},[]);
 const base=coverScale(size,HARBOUR_WORLD),scale=base*camera.z;
 const change=fn=>setCamera(c=>clampCamera(fn(c),size,HARBOUR_WORLD));
 const zoom=(factor,x=size.w/2,y=size.h/2)=>setCamera(c=>zoomCamera(c,factor,{x,y},size,HARBOUR_WORLD));
 useEffect(()=>{const el=ref.current;const wheel=e=>{e.preventDefault();const r=el.getBoundingClientRect();if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey)change(c=>({...c,x:c.x-e.deltaX-(e.shiftKey?e.deltaY:0),y:c.y}));else zoom(Math.exp(-e.deltaY*.0015),e.clientX-r.left,e.clientY-r.top)};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel)},[size.w,size.h]);
 function down(e){if((e.button&&e.button!==0)||e.target.closest('button'))return;pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY});moved.current=false;gesture.current=null;}
 function move(e){if(!pointers.current.has(e.pointerId))return;const prev=pointers.current.get(e.pointerId);pointers.current.set(e.pointerId,{...prev,x:e.clientX,y:e.clientY});const a=[...pointers.current.values()];if(a.length===2){const distance=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(gesture.current){const r=ref.current.getBoundingClientRect();zoom(distance/gesture.current,(a[0].x+a[1].x)/2-r.left,(a[0].y+a[1].y)/2-r.top)}gesture.current=distance;moved.current=true;}else{const dx=e.clientX-prev.x,dy=e.clientY-prev.y;if(Math.hypot(e.clientX-prev.startX,e.clientY-prev.startY)>6)moved.current=true;if(moved.current){e.currentTarget.setPointerCapture(e.pointerId);change(c=>({...c,x:c.x+dx,y:c.y+dy}))}}}
 function focus(id,location,x,y){if(moved.current)return;if(camera.z<1.7)setCamera(focusCamera({x,y},size,HARBOUR_WORLD,2.15));onFocus({id,location,x,y});}
 const crowd=crowdForWorld(world),creatures=creaturesForWorld(world);
 const named=Object.keys(PEOPLE).filter(id=>!world.actors[id].removed&&PLACES[world.actors[id].location]).map(id=>{const point=namedActorPoint(world,id);return {kind:'named',id,loc:world.actors[id].location,...point}});
 const depth=[...crowd.map(item=>({kind:'crowd',id:item.id,y:item.y,item})),...creatures.map(item=>({kind:'creature',id:item.id,y:item.y,item})),...named].sort((a,b)=>a.y-b.y);
 const micro=availableMicroScenes(world).filter(scene=>scene.requires.some(([id])=>id===selected?.id))[0];
 const key=e=>{if(e.target!==ref.current)return;const d={ArrowLeft:[45,0],ArrowRight:[-45,0],ArrowUp:[0,45],ArrowDown:[0,-45]}[e.key];if(d){e.preventDefault();change(c=>({...c,x:c.x+d[0],y:c.y+d[1]}))}if(e.key==='+'||e.key==='=')zoom(1.2);if(e.key==='-')zoom(.8)};
 return <section ref={ref} className={`harbour-camera ${camera.z>1.7?'near':''}`} aria-label="Harbour map" tabIndex="0" onKeyDown={key} onPointerDown={down} onPointerMove={move} onPointerUp={e=>{pointers.current.delete(e.pointerId);gesture.current=null}} onPointerCancel={e=>{pointers.current.delete(e.pointerId);gesture.current=null}}>
 <svg width={HARBOUR_WORLD.width} height={HARBOUR_WORLD.height} viewBox={`0 0 ${HARBOUR_WORLD.width} ${HARBOUR_WORLD.height}`} className="harbour-world" style={{transform:`translate(${camera.x}px,${camera.y}px) scale(${scale})`}}><Scenery world={world}/>
 <TableauSignals/>
 {depth.map(entry=>entry.kind==='crowd'?<CrowdFigure key={`crowd-${entry.id}`} item={entry.item} data-crowd-id={entry.id}/>:
  entry.kind==='creature'?<CreatureFigure key={`creature-${entry.id}`} item={entry.item} data-creature-id={entry.id}/>:
  (()=>{const {id,loc,x,y}=entry;return <g key={id} data-actor={id} data-location={loc} role="button" tabIndex="0" aria-label={personName(world,id)} className="map-target person" style={{transform:`translate(${x}px,${y}px)`}} onClick={()=>focus(id,loc,x,y-80)} onKeyDown={e=>{if(e.key==='Enter')focus(id,loc,x,y-80)}}><rect x="-28" y="-235" width="56" height="242" fill="transparent"/><Figure id={id} scale={({viewing_room:.82,sonyas_kitchen:.82,back_room:.85,joels_bar:1,nursery:.95,harbour_berth:1.08,cliff_path:1.1})[loc]||1} pose={world.actors[id].busy?'working':'neutral'}/>{world.actors.player.contacts.includes(id)&&<text className="local-label" y="24" textAnchor="middle">{PEOPLE[id].name}</text>}</g>})())}
 {PROPS.filter(([id])=>!activeProps||activeProps.has(id)).map(([id,loc,x,y,label])=><g key={id} role="button" tabIndex="0" aria-label={label} className={`map-target prop ${selected?.id===id?'focused':''}`} transform={`translate(${x} ${y})`} onClick={()=>focus(id,loc,x,y)} onKeyDown={e=>{if(e.key==='Enter')focus(id,loc,x,y)}}><circle r="24" fill="transparent"/><title>{label}</title></g>)}
 {world.production.toads.filter(t=>t.status==='hidden'&&world.day>=t.availableFrom&&PLACES[t.location]).map(t=>{const [x,y]=PLACES[t.location];return <g key={t.id} role="button" tabIndex="0" aria-label="Something in the leaves" className="map-target toad" transform={`translate(${x-48} ${y+27})`} onClick={()=>focus('toad',t.location,x-48,y+27)} onKeyDown={e=>{if(e.key==='Enter')focus('toad',t.location,x-48,y+27)}}><circle r="18" fill="transparent"/><ellipse rx="6" ry="4" fill="#768454"/><circle cx="-3" cy="-3" r="2" fill="#a3a266"/><circle cx="3" cy="-3" r="2" fill="#a3a266"/></g>})}
 {Object.entries(PLACES).map(([id,[x,y,name]])=><text className="local-label place-label" key={id} x={x} y={y+110} textAnchor="middle">{id==='cliff_path'&&!knows(world,'juan_route')?'Outer path':LOCATION_LABELS[id]||name}</text>)}
 {micro&&camera.z>1.7&&<g className="map-murmur" aria-hidden="true" transform={`translate(${PLACES[micro.requires[0][1]][0]} ${PLACES[micro.requires[0][1]][1]-50})`}><rect x="-130" y="-28" width="260" height="36" rx="8" fill="#f3e8d0"/><text textAnchor="middle" y="-7">{visibleNames(world,micro.lines[(world.relationshipEcology.beats?.length||0)%micro.lines.length])}</text></g>}
 </svg><div className="camera-tools"><button aria-label="Zoom in" onClick={()=>zoom(1.3)}>+</button><button aria-label="Zoom out" onClick={()=>zoom(.77)}>−</button><button aria-label="Reset harbour view" onClick={()=>setCamera(centeredCamera(size,HARBOUR_WORLD,1))}>↔</button></div>
 </section>
}

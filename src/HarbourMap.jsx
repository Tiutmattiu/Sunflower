import {characterGeometry,LOCATION_CHARACTER_SCALE} from './characterPresentation.js';
import {knows} from './playerKnowledge.js';
import React, {useEffect, useRef, useState} from 'react';
import {LOCATION_LABELS} from './presentationCopy.js';
import {UNKNOWN_PEOPLE,visibleNames} from './dialogueContent.js';
import {availableMicroScenes} from './worldLifeContent.js';
import {crowdForWorld,creaturesForWorld,namedActorPoint} from './harbourTableau.js';
import {HARBOUR_WORLD,legacyPoint} from './harbourWorld.js';
import {clampCamera,centeredCamera,coverScale,focusCamera,zoomCamera} from './harbourCamera.js';
import {CrowdFigure,CreatureFigure} from './HarbourTableauLayer.jsx';
import {DISTRICT_LOCATION_POINTS,DISTRICT_PROP_POINTS} from './harbourDistrict.js';
import {DistrictOccluder,HarbourDistrictBase,HarbourWeatherOverlay,districtOccludersForWorld} from './HarbourDistrictLayer.jsx';

export const PLACES = {
 harbour_berth:[930,620,'Berth'], joels_bar:[590,380,'Bar'], parcel_counter:[1050,330,'Parcel shop'],
 nursery:[285,290,'Growing yard'], viewing_room:[720,130,'Gallery'], back_room:[1160,150,'Side room'],
 sonyas_kitchen:[370,120,'Kitchen'], cliff_path:[120,520,'Cliff path'], public_clearing:[750,520,'Exchange'], old_hall:[480,540,'Screening hall']
};
const MAP_PLACES=Object.fromEntries(Object.entries(PLACES).map(([id,[,,name]])=>{const p=DISTRICT_LOCATION_POINTS[id];return [id,[p.x,p.y,name]]}));
export const PEOPLE = {
 aspen:{name:'Aspen',unknown:'Woman with a blue scarf',coat:'#345779',hair:'#422e29'},
 joel:{name:'Joel',unknown:'Man in a white apron',coat:'#eee4c9',hair:'#34332c'},
 wong:{name:'Wong',unknown:'Copper dog with a parcel',coat:'#b2763f',hair:'#242c30'},
 juan:{name:'Juan',unknown:'White-haired man with soil on his sleeves',coat:'#788451',hair:'#6c4432'},
 yasmin:{name:'Yasmin',unknown:'Woman in a red coat',coat:'#a74739',hair:'#292c33'},
 dima:{name:'Dima',unknown:'Fair-haired man',coat:'#4d5954',hair:'#272b29'}
};
export const personName=(w,id)=>w.actors.player.contacts.includes(id)?PEOPLE[id]?.name:UNKNOWN_PEOPLE[id];
export function Figure({id,scale=1}) {
 const c=characterGeometry(id,scale);if(!c)return null;
 return <image aria-hidden="true" pointerEvents="none" href={c.file} x={-c.renderWidth*c.feet[0]} y={-c.renderHeight*c.feet[1]} width={c.renderWidth} height={c.renderHeight}/>;
}
export function ObjectArt({kind=''}) {const k=kind.toLowerCase();return <svg width="46" height="48" viewBox="-25 -28 50 56" aria-hidden="true" className="object-art"><g stroke="#414438" strokeWidth="1.4">
 {k.includes('fish')||k.includes('mackerel')?<><path d="M-20 2 Q0-20 19 0 Q0 18-20 2L-24-7V10Z" fill="#8ba5a0"/><circle cx="12" cy="-2" r="1.5"/><path d="M4-8 2 7M-10-2 0 0" fill="none"/></>:
 k.includes('toad')?<><ellipse cy="8" rx="14" ry="9" fill="#7b844d"/><circle cx="-7" cy="0" r="5" fill="#899655"/><circle cx="7" cy="0" r="5" fill="#899655"/><circle cx="-7" cy="-1" r="1"/><circle cx="7" cy="-1" r="1"/></>:
 k.includes('lime')?<><ellipse rx="13" ry="11" fill="#a7b443"/><path d="M-2-11Q12-24 15-13Q8-8-2-11" fill="#627b40"/></>:
 /bottle|orgeat|rum|soda/.test(k)?<><path d="M-5-23H5V-10L10-4V21H-10V-4L-5-10Z" fill="#779d88"/><path d="M-5-23H5V-18H-5Z" fill="#a84c3a"/><path d="M-9 2H9V14H-9Z" fill="#eee0b7"/></>:
 /wheel|rim|link|cable|tape|parts/.test(k)?<><circle r="18" fill="none" strokeWidth="5"/><circle r="4" fill="#b07c47"/><path d="M0-15V15M-15 0H15M-11-11 11 11M-11 11 11-11"/></>:
 /flower|plant|crop/.test(k)?<><path d="M0 22V-15M0 8Q-20-4-12-8Q0-5 0 8" fill="#7c934f"/>{[0,60,120,180,240,300].map(a=><ellipse key={a} transform={`translate(0 -14) rotate(${a})`} cy="-7" rx="4" ry="8" fill="#d4a132"/>)}<circle cy="-14" r="5" fill="#614b34"/></>:
 /paper|notice|claim|photo|orders/.test(k)?<><path d="M-17-23 18-20 15 23-19 19Z" fill="#eddfb8"/><path d="M-11-11 11-9M-12-4 8-2M-12 4 11 6M-12 12 0 13" fill="none"/></>:
 <><path d="M-20-13 17-18 22 15-16 20Z" fill="#ba8e5b"/><path d="M-20-4 20-8M-18 8 21 5M-8-15-4 19M10-17 14 16" fill="none"/></>}
 </g></svg>}
function Scenery({world}) {
 const boat=legacyPoint(...(world.aspenRoute?.status==='away'?[1330,850]:[1150,735]));
 return <g aria-hidden="true"><HarbourDistrictBase world={world}/><g className="boat" transform={`translate(${boat.x} ${boat.y})`} stroke="#393d36" strokeWidth="2"><path d="M-40 0H45L30 22H-25Z" fill="#9f493a"/><path d="M-20-3V-24H20V-3Z" fill="#ded1ac"/><path d="M-12-19H10V-7H-12Z" fill="#406978"/></g></g>
}
export const PROPS=[['crate','harbour_berth',905,590,'Lime crate'],['cargo','harbour_berth',978,573,'Cargo'],['bottle','joels_bar',555,337,'Bottle'],['glass','joels_bar',644,357,'Glass'],['packing','joels_bar',498,364,'Packing bundle'],['parcel','parcel_counter',1095,309,'Parcel'],['parts','parcel_counter',1000,310,'Wheel parts'],['plants','nursery',258,297,'Plants'],['paper','nursery',337,278,'Paper'],['bowl','viewing_room',737,112,'Bowl'],['photo','viewing_room',799,114,'Photograph'],['envelope','back_room',1185,130,'Envelope'],['table','sonyas_kitchen',389,108,'Supper table'],['path','cliff_path',105,489,'Path'],['orders','public_clearing',737,478,'Posted offers']];
const MAP_PROPS=PROPS.map(([id,loc,,,label])=>{const p=DISTRICT_PROP_POINTS[id]||DISTRICT_LOCATION_POINTS[loc];return [id,loc,p.x,p.y,label]});
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
 const crowd=crowdForWorld(world),creatures=creaturesForWorld(world),occluders=districtOccludersForWorld(world);
 const named=Object.keys(PEOPLE).filter(id=>!world.actors[id].removed&&PLACES[world.actors[id].location]).map(id=>{const point=namedActorPoint(world,id);return {kind:'named',id,loc:world.actors[id].location,...point}});
 const props=MAP_PROPS.filter(([id])=>!activeProps||activeProps.has(id)).map(([id,loc,x,y,label])=>({kind:'prop',id,loc,x,y,label}));
 const toads=world.production.toads.filter(t=>t.status==='hidden'&&world.day>=t.availableFrom&&MAP_PLACES[t.location]).map(t=>{const [x,y]=MAP_PLACES[t.location];return {kind:'toad',id:t.id,loc:t.location,x:x-48,y:y+27}});
 const depth=[...crowd.map(item=>({kind:'crowd',id:item.id,y:item.y,item})),...creatures.map(item=>({kind:'creature',id:item.id,y:item.y,item})),...occluders.map(item=>({kind:'occluder',id:item.id,y:item.depthY,item})),...named.map(item=>({...item,y:item.y})),...props.map(item=>({...item,y:item.y})),...toads.map(item=>({...item,y:item.y}))].sort((a,b)=>a.y-b.y);
 const micro=availableMicroScenes(world).filter(scene=>scene.requires.some(([id])=>id===selected?.id))[0];
 const key=e=>{if(e.target!==ref.current)return;const d={ArrowLeft:[45,0],ArrowRight:[-45,0],ArrowUp:[0,45],ArrowDown:[0,-45]}[e.key];if(d){e.preventDefault();change(c=>({...c,x:c.x+d[0],y:c.y+d[1]}))}if(e.key==='+'||e.key==='=')zoom(1.2);if(e.key==='-')zoom(.8)};
 const renderEntry=entry=>{
  if(entry.kind==='crowd')return <CrowdFigure key={`crowd-${entry.id}`} item={entry.item} data-crowd-id={entry.id}/>;
  if(entry.kind==='creature')return <CreatureFigure key={`creature-${entry.id}`} item={entry.item} data-creature-id={entry.id}/>;
  if(entry.kind==='occluder')return <DistrictOccluder key={`occluder-${entry.id}`} item={entry.item}/>;
  if(entry.kind==='prop'||entry.kind==='prop-hit'){const {id,loc,x,y,label}=entry,hit=entry.kind==='prop-hit';return <g key={`${entry.kind}-${id}`} role={hit?'button':undefined} tabIndex={hit?0:undefined} aria-label={hit?label:undefined} aria-hidden={hit?undefined:true} pointerEvents={hit?'all':'none'} className={hit?`map-target prop ${selected?.id===id?'focused':''}`:undefined} transform={`translate(${x} ${y})`} onClick={hit?()=>focus(id,loc,x,y):undefined} onKeyDown={hit?e=>{if(e.key==='Enter')focus(id,loc,x,y)}:undefined}>{hit?<circle r="25" fill="transparent"/>:<g transform="scale(.7)"><ObjectArt kind={label}/></g>}</g>}
  if(entry.kind==='toad'){const {id,loc,x,y}=entry;return <g key={id} role="button" tabIndex="0" aria-label="Something near the ground" className="map-target toad" transform={`translate(${x} ${y})`} onClick={()=>focus('toad',loc,x,y)} onKeyDown={e=>{if(e.key==='Enter')focus('toad',loc,x,y)}}><circle r="18" fill="transparent"/><ellipse rx="6" ry="4" fill="#768454"/><circle cx="-3" cy="-3" r="2" fill="#a3a266"/><circle cx="3" cy="-3" r="2" fill="#a3a266"/></g>}
  const {id,loc,x,y}=entry,placeScale=LOCATION_CHARACTER_SCALE[loc]||1,geometry=characterGeometry(id,placeScale);return <g key={id} data-actor={id} data-location={loc} role="button" tabIndex="0" aria-label={personName(world,id)} className="map-target person" style={{transform:`translate(${x}px,${y}px)`}} onClick={()=>focus(id,loc,x,y-80)} onKeyDown={e=>{if(e.key==='Enter')focus(id,loc,x,y-80)}}><path d={geometry.hit} fill="transparent"/><Figure id={id} scale={placeScale} pose={world.actors[id].busy?'working':'neutral'}/>{world.actors.player.contacts.includes(id)&&<text className="local-label" y="24" textAnchor="middle">{PEOPLE[id].name}</text>}</g>;
 };
 return <section ref={ref} className={`harbour-camera ${camera.z>1.7?'near':''}`} aria-label="Harbour map" tabIndex="0" onKeyDown={key} onPointerDown={down} onPointerMove={move} onPointerUp={e=>{pointers.current.delete(e.pointerId);gesture.current=null}} onPointerCancel={e=>{pointers.current.delete(e.pointerId);gesture.current=null}}>
 <svg width={HARBOUR_WORLD.width} height={HARBOUR_WORLD.height} viewBox={`0 0 ${HARBOUR_WORLD.width} ${HARBOUR_WORLD.height}`} className="harbour-world" style={{transform:`translate(${camera.x}px,${camera.y}px) scale(${scale})`}}><Scenery world={world}/>
 {depth.map(renderEntry)}
 {props.map(item=>renderEntry({...item,kind:"prop-hit"}))}
 <HarbourWeatherOverlay world={world}/>
 {Object.entries(MAP_PLACES).map(([id,[x,y,name]])=><text className="local-label place-label" key={id} x={x} y={y+110} textAnchor="middle">{id==='cliff_path'&&!knows(world,'juan_route')?'Outer path':LOCATION_LABELS[id]||name}</text>)}
 {micro&&camera.z>1.7&&<g className="map-murmur" aria-hidden="true" transform={`translate(${MAP_PLACES[micro.requires[0][1]][0]} ${MAP_PLACES[micro.requires[0][1]][1]-50})`}><rect x="-130" y="-28" width="260" height="36" rx="8" fill="#f3e8d0"/><text textAnchor="middle" y="-7">{visibleNames(world,micro.lines[(world.relationshipEcology.beats?.length||0)%micro.lines.length])}</text></g>}
 </svg><div className="camera-tools"><button aria-label="Zoom in" onClick={()=>zoom(1.3)}>+</button><button aria-label="Zoom out" onClick={()=>zoom(.77)}>−</button><button aria-label="Reset harbour view" onClick={()=>setCamera(centeredCamera(size,HARBOUR_WORLD,1))}>↔</button></div>
 </section>
}

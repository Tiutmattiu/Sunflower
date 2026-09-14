import React from 'react';
import {HARBOUR_WORLD} from './harbourWorld.js';
import {districtOccluders,districtSignals,districtStateForWorld} from './harbourDistrict.js';
import './harbourDistrict.css';

const Shop=({x,y,w,h,className='',children})=><g className={`district-shop ${className}`} transform={`translate(${x} ${y})`}>
  <rect className="district-wall" width={w} height={h} rx="4"/>
  <rect className="district-awning" y="24" width={w} height="24"/>
  <rect className="district-window" x="16" y="62" width={Math.max(36,w*.42)} height={Math.max(44,h-78)} rx="2"/>
  <rect className="district-door" x={w-52} y="62" width="36" height={Math.max(54,h-62)}/>
  {children}
 </g>;

const Sign=({signal})=><g className={`district-sign ${signal.muted?'muted':''} ${signal.emphasized?'emphasized':''}`} transform={`translate(${signal.x} ${signal.y})`}>
  <rect x="-78" y="-17" width="156" height="30" rx="4"/>
  <text textAnchor="middle" y="2">{signal.label}</text>
 </g>;

export function HarbourDistrictBase({world}) {
  const state=districtStateForWorld(world);
  const signals=districtSignals(world);
  return <g aria-hidden="true" pointerEvents="none" className={`harbour-district sea-${state.seaEnergy} ${state.commercialQuiet?'district-quiet':''}`}>
    <rect className="district-paper" width={HARBOUR_WORLD.width} height={HARBOUR_WORLD.height}/>
    <path className="district-sea" d="M0 825C260 780 540 805 820 835C1110 867 1390 816 1640 745C1780 705 1902 682 2000 696V1200H0Z"/>
    <path className="district-shore" d="M0 742C260 705 510 742 785 778C1040 812 1240 790 1434 742L1466 812C1240 866 1030 884 778 846C515 807 264 784 0 824Z"/>
    <path className="district-wharf" d="M920 590L1750 520L1825 735L1475 824L1010 790Z"/>
    <path className="district-cliff" d="M0 170C106 214 170 318 188 434C208 566 166 706 92 842L0 882Z"/>
    <path className="district-upper-street" d="M1260 36H2000V590L1770 548L1520 596L1260 516Z"/>
    <path className="district-lower-street" d="M210 258C478 212 734 244 956 336C1124 406 1268 452 1460 446L1438 585C1220 604 1045 552 868 474C682 392 470 366 232 406Z"/>
    <path className="district-road-line" d="M246 326C500 286 716 318 918 402C1118 484 1268 515 1440 505"/>
    <path className="district-steps" d="M90 470H232M76 510H220M62 550H207M48 590H196M34 630H184"/>

    <g className="district-craft-quarter">
      <Shop x={205} y={275} w={220} h={172} className="pet-shop"><rect className="pet-tank" x="34" y="86" width="64" height="42"/><circle className="pet-dot" cx="52" cy="105" r="5"/><circle className="pet-dot" cx="78" cy="111" r="4"/><path className="pet-perch" d="M116 110h48M138 80v66"/></Shop>
      <Shop x={360} y={430} w={218} h={160} className="glass-shop"><circle className="kiln" cx="60" cy="112" r="26"/><path className="glass-pipe" d="M88 90l72-28"/><circle className="glass-orb" cx="166" cy="60" r="13"/></Shop>
      <g className="snake-pitch" transform="translate(220 640)"><ellipse rx="92" ry="32"/><path d="M-8 6q35-70 62-14q18 38-12 58"/><circle cx="-42" cy="-6" r="19"/><path d="M-54 8h26M-42 8v30"/></g>
    </g>

    <g className="district-social-quarter">
      <Shop x={675} y={340} w={300} h={218} className="joel-bar"><rect className="bar-opening" x="30" y="80" width="220" height="108"/><path className="music-notes" d="M256 72v46M256 72l26-8v42M282 106q-14-8-16 5q1 14 16 4M256 118q-14-8-16 5q1 14 16 4"/></Shop>
      <g className="shisha-courtyard" transform="translate(520 500)"><path className="courtyard-rug" d="M-90-18H100V92H-90Z"/><circle className="tea-table" cx="0" cy="34" r="34"/><path className="hookah" d="M62 58V18q0-20 14-20q14 0 14 20v44M76-2v-24M67-26h18M52 62h50"/></g>
      <Shop x={1018} y={284} w={226} h={168} className="pizza-shop"><path className="pizza-slice" d="M35 78l48 10l-34 54Z"/><circle cx="54" cy="100" r="4"/><circle cx="64" cy="112" r="4"/></Shop>
    </g>

    <g className="district-services-quarter">
      <Shop x={1470} y={305} w={360} h={252} className="wong-shop"><rect className="laundry-window" x="34" y="92" width="70" height="70"/><circle cx="69" cy="127" r="24"/><rect className="parcel-stack" x="125" y="102" width="64" height="74"/><path d="M125 128h64M157 102v74"/><rect className="atm" x="208" y="92" width="54" height="86"/><rect x="218" y="104" width="34" height="17"/><circle cx="235" cy="154" r="13"/></Shop>
      <g className="ice-cream-truck" transform="translate(1700 590)"><rect x="-82" y="-52" width="150" height="76" rx="8"/><path d="M-62-52v-24h75l28 24"/><circle cx="-48" cy="28" r="17"/><circle cx="42" cy="28" r="17"/><path className="ice-cream-cone" d="M-5-34h18l-9 23Z"/><circle cx="4" cy="-42" r="12"/></g>
      <Shop x={1180} y={430} w={228} h={150} className="octopus-bank"><path className="octopus-mark" d="M104 86q0-30 30-30t30 30q0 18-10 28M114 114q-18 28-34 5M128 114q-8 34-24 30M142 114q8 34 24 30M154 114q18 28 34 5"/></Shop>
    </g>

    <g className="district-upper-block">
      <Shop x={1350} y={120} w={170} h={142} className="barber-shop"><path className="barber-pole" d="M138 54v66M130 60l16 12M130 80l16 12M130 100l16 12"/></Shop>
      <Shop x={1550} y={118} w={180} h={145} className="massage-shop"><path className="massage-mark" d="M40 104q35-36 70 0M75 72v48"/></Shop>
      <g className="synagogue" transform="translate(1660 64)"><path className="faith-building" d="M0 176V56L120 0l120 56v120Z"/><path className="faith-door" d="M95 176v-64q25-30 50 0v64"/><path className="faith-window" d="M52 72l18 32H34Z M34 92h36"/></g>
      <g className="peep-show" transform="translate(1840 292)"><rect width="144" height="184" rx="5"/><rect className="peep-marquee" x="10" y="16" width="124" height="34"/><path className="peep-door" d="M42 184V76h60v108"/><circle className="peep-bulb" cx="22" cy="66" r="4"/><circle className="peep-bulb" cx="122" cy="66" r="4"/></g>
    </g>

    <g className="district-park" transform="translate(440 730)">
      <path className="park-grass" d="M0 24Q200-36 470 14L520 210Q254 286 22 192Z"/>
      <g className="basketball-court" transform="translate(210 46)"><rect width="250" height="138" rx="4"/><path d="M125 0v138M0 69h250M45 0v138M205 0v138"/><path d="M34 28v56h22M216 28v56h-22"/></g>
      <g className="chess-tables" transform="translate(40 62)"><rect x="0" y="0" width="58" height="34"/><rect x="74" y="20" width="58" height="34"/><path d="M8 8h42M8 17h42M8 26h42M16 0v34M29 0v34M42 0v34"/></g>
      <path className="park-path" d="M18 170q185-90 440-32"/>
    </g>

    <g className="district-berth">
      <path className="dock-edge" d="M940 650q260 30 530-10q170-26 322-100"/>
      <g className="cargo-stack" transform="translate(1190 650)"><rect x="0" y="0" width="62" height="48"/><rect x="68" y="-18" width="72" height="66"/><rect x="146" y="8" width="56" height="40"/><path d="M0 24h62M99-18v66M146 28h56"/></g>
      <g className="small-boat" transform="translate(1515 840)"><path d="M-100 0H96L68 58H-66Z"/><path d="M-20 0v-74h68v74"/><path d="M-8-60h42v38H-8Z"/></g>
      <path className="mooring-rope" d="M1418 724q105 98 214 50"/>
    </g>

    <g className="street-furniture">
      <g className="trash-bin" transform="translate(1840 575)"><rect x="-20" y="-20" width="40" height="46" rx="4"/><path d="M-24-20h48M-12-30h24"/></g>
      <g className="bench" transform="translate(710 965)"><path d="M-48 0h96M-42 12h84M-36 12v20M36 12v20"/></g>
      <g className="street-light" transform="translate(1080 610)"><path d="M0 70V-54q0-20 22-20h22"/><rect x="36" y="-82" width="34" height="18" rx="4"/></g>
      <path className="laundry-line" d="M1480 286q122-30 244 0"/>
      <path className="laundry" d="M1510 279v46h40v-54M1580 267v52h44v-60M1652 260v45h38v-51"/>
    </g>

    {signals.map(signal=><Sign key={signal.id} signal={signal}/>)}
  </g>;
}

export function DistrictOccluder({item}) {
  const x=item.x,y=item.y,w=item.w,h=item.h;
  if(item.kind==='bar-counter') return <g className="district-occluder bar-counter" transform={`translate(${x} ${y})`}><rect x={-w/2} y={-h} width={w} height={h} rx="5"/><path d={`M${-w/2+12} ${-h+18}H${w/2-12}`}/><circle cx={-55} cy={-h-8} r="12"/><circle cx={18} cy={-h-10} r="10"/></g>;
  if(item.kind==='wong-counter') return <g className="district-occluder wong-counter" transform={`translate(${x} ${y})`}><rect x={-w/2} y={-h} width={w} height={h}/><path d={`M${-w/2} ${-h}L${-w/2+28} ${-h-24}H${w/2-24}L${w/2} ${-h}`}/><rect x={-80} y={-h-18} width="44" height="28"/><rect x={24} y={-h-20} width="58" height="30"/></g>;
  if(item.kind==='shisha-screen') return <g className="district-occluder shisha-screen" transform={`translate(${x} ${y})`}><path d={`M${-w/2} 0V${-h}H${w/2}V0`}/><path d={`M${-w/2+22} ${-h}V0M${-w/2+66} ${-h}V0M${w/2-64} ${-h}V0M${w/2-20} ${-h}V0`}/></g>;
  if(item.kind==='dock-rail') return <g className="district-occluder dock-rail" transform={`translate(${x} ${y})`}><path d={`M${-w/2} 0H${w/2}M${-w/2+10} 0V${-h}M${-w/6} 0V${-h}M${w/6} 0V${-h}M${w/2-10} 0V${-h}`}/></g>;
  if(item.kind==='park-fence') return <g className="district-occluder park-fence" transform={`translate(${x} ${y})`}><path d={`M${-w/2} 0H${w/2}M${-w/2} ${-h}H${w/2}`}/>{[-.45,-.3,-.15,0,.15,.3,.45].map(n=><path key={n} d={`M${n*w} 0V${-h}`}/>)}</g>;
  return <g className="district-occluder pet-awning" transform={`translate(${x} ${y})`}><path d={`M${-w/2} 0H${w/2}L${w/2-20} ${-h}H${-w/2+18}Z`}/></g>;
}

export function HarbourWeatherOverlay({world}) {
  const state=districtStateForWorld(world);
  if(!state.storm) return <g aria-hidden="true" pointerEvents="none" className="weather-overlay fair-wind"><path d="M80 168q160-28 320 0M1460 650q170-42 350-12"/></g>;
  return <g aria-hidden="true" pointerEvents="none" className="weather-overlay storm-overlay">
    <rect width={HARBOUR_WORLD.width} height={HARBOUR_WORLD.height}/>
    {Array.from({length:76},(_,i)=><path key={i} d={`M${(i*83)%2020} ${(i*137)%1120}l-22 52`}/>) }
  </g>;
}

export const districtOccludersForWorld=world=>districtOccluders(world);

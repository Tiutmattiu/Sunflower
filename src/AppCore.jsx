import {knows,PLAYER_KNOWLEDGE as K} from './playerKnowledge.js';
import React,{useEffect,useRef,useState} from 'react';
import HarbourMap,{PEOPLE,PLACES,PROPS,Figure,ObjectArt,personName} from './HarbourMap.jsx';
import {createHarbourWorld,advanceHarbourWindow,finishPlayerIntervention,availableCash,placePublicOrder,phoneContact} from './harbourSpine.js';
import {performPlayerAction,visibleActions,visitLocation,PLAYER_COUNTERPARTIES,juanRaceChance} from './playerGame.js';
import {diagnosePlayer} from './playerDiagnosis.js';
import {ACTION_COPY,TARGET_ACTIONS,actionLine,reaction,readableResult,friendlyBlock} from './harbourPresentation.js';
import {ECONOMIC_GOODS as GOODS} from './economicContent.js';
import {selectDialogue,visibleNames} from './dialogueContent.js';
import {NEWSPAPER_OVERRIDES,UI_COPY,SCAR_COPY,itemLabel} from './presentationCopy.js';
import {AUDIO_CUES} from './worldLifeContent.js';
import './harbour.css';
import SpokenLine from './SpokenLine.jsx';

const SAVE='sunflower-harbour-map-v1';

function addKnowledge(pg,key){
 pg.knowledge??=[];
 if(!pg.knowledge.includes(key))pg.knowledge.push(key);
}

function migrateSavedWorld(w){
 if(!w?.playerGame?.routes||!w?.actors?.player)return w;
 const pg=w.playerGame,p=w.actors.player;
 pg.knowledge??=[];
 const j=pg.routes.juan??=( {} );
 j.practice=Number.isFinite(j.practice)?j.practice:0;
 j.upgrades=Number.isFinite(j.upgrades)?j.upgrades:0;
 j.races=Number.isFinite(j.races)?j.races:0;
 j.lastRaceDay=Number.isFinite(j.lastRaceDay)?j.lastRaceDay:null;
 j.drinkServed=Boolean(j.drinkServed||pg.knowledge.includes(K.juan_bar_drink));
 j.built=Boolean(j.built||p.inventory?.some(x=>x.kind==='Built Onewheel'));
 if(!pg.sunflower?.owned&&!pg.knowledge.includes(K.juan_route)&&['planning','ready','complete'].includes(j.stage)){
  j.stage=p.contacts?.includes('juan')?'met':'unseen';
  j.planDay=null;
 }
 const sonya=pg.routes.sonya;
 if(sonya?.orgeatSupplied&&!pg.knowledge.includes(K.mai_tai_supplied)){
  for(const key of [K.mai_tai_tasted,K.mai_tai_problem,K.mai_tai_ingredient,K.mai_tai_supplied])addKnowledge(pg,key);
 }
 if(p.inventory?.some(x=>x.kind==='Orgeat')&&!pg.knowledge.includes(K.mai_tai_ingredient)){
  for(const key of [K.mai_tai_tasted,K.mai_tai_problem,K.mai_tai_ingredient])addKnowledge(pg,key);
 }
 if(!pg.knowledge.includes(K.mai_tai_supplied)){
  const joelBottle=w.actors.joel?.inventory?.find(x=>x.kind==='Orgeat');
  const supplierHas=w.actors.wharf_suppliers?.inventory?.some(x=>x.kind==='Orgeat');
  const playerHas=p.inventory?.some(x=>x.kind==='Orgeat');
  if(joelBottle&&!supplierHas&&!playerHas&&w.actors.wharf_suppliers){
   w.actors.joel.inventory.splice(w.actors.joel.inventory.indexOf(joelBottle),1);
   joelBottle.owner='wharf_suppliers';
   joelBottle.source='route_reconciled_save';
   w.actors.wharf_suppliers.inventory.push(joelBottle);
  }
 }
 return w;
}

function initial(){
 try{
  const s=JSON.parse(localStorage.getItem(SAVE));
  if(s?.version===1&&s.world?.production)return migrateSavedWorld(s.world);
 }catch{}
 return createHarbourWorld();
}

function useSound(){
 const audio=useRef(null),[enabled,setEnabled]=useState(false);
 function sound(kind='paper'){
  if(!enabled)return;
  const ctx=audio.current||(audio.current=new AudioContext());ctx.resume();
  const o=ctx.createOscillator(),g=ctx.createGain();o.type=kind==='water'?'sine':'triangle';
  o.frequency.setValueAtTime(kind==='coin'?680:kind==='phone'?180:kind==='water'?90:280,ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(kind==='water'?55:140,ctx.currentTime+.2);
  g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.035,ctx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.3);
  o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.32);
 }
 useEffect(()=>{if(!enabled)return;const timer=setInterval(()=>sound('water'),6500);return()=>clearInterval(timer)},[enabled]);
 return {sound,enabled,toggle:()=>setEnabled(x=>!x)};
}

function Comic({scene,onClose,children}){
 const dialog=useRef(null),[index,setIndex]=useState(0);
 useEffect(()=>{setIndex(0);dialog.current?.querySelector('button')?.focus()},[scene.title]);
 const last=index>=scene.lines.length-1,line=scene.lines[index]||'';
 return <section ref={dialog} className="comic" role="dialog" aria-modal="true" aria-label={scene.title}>
  <button className="close" aria-label="Close comic" onClick={onClose}>×</button><h2>{scene.title}</h2>
  <div className="comic-panels"><article className={`comic-panel panel-${index}`}>
   <svg viewBox={index===1?"70 40 120 100":"35 10 155 140"} aria-hidden="true"><svg width="220" height="150" viewBox={`${(PLACES[scene.location]||PLACES.viewing_room)[0]-150} ${(PLACES[scene.location]||PLACES.viewing_room)[1]-90} 300 200`}><image href="/art/harbour-working.png" width="1400" height="900" preserveAspectRatio="none"/></svg>{(scene.person||scene.people?.length>0)&&<g transform={`translate(${65+index*15} 122) scale(1.2)`}><Figure scale={.43} id={scene.people?.[index%scene.people.length]||scene.person||'aspen'} pose={index%2?'working':'neutral'}/></g>}<g transform="translate(120 65)"><ObjectArt kind={scene.object||'paper'}/></g></svg>
   <p>{line}</p>
  </article></div>
  {!last?<button className="response" onClick={()=>setIndex(n=>n+1)}>Next</button>:<div className="responses">{children||<button className="response" onClick={onClose}>Back to the harbour</button>}</div>}
 </section>;
}

function Ending({world,onReturn}){
 const d=diagnosePlayer(world);const names={valuation:'Judging a price',execution:'Getting things done',commitments:'Keeping promises',liquidityCredit:'Keeping money free',information:'Listening and looking',verificationAdaptation:'Checking and changing your mind',positioningStress:'Deciding under pressure',marketStructure:'Finding someone to trade with'};
 return <section className="ending" role="dialog" aria-label="Your story"><h1>You have the sunflower.</h1><p>The water still moves. Someone is counting glasses.</p><h2>Your time here</h2><p>{d.outcome.startingCash} tins when you arrived. {d.outcome.endingCash} now.</p><p>{d.outcome.fulfilled} promises kept. {d.outcome.breached} missed.</p><h2>What your choices suggest</h2>{d.radar.filter(x=>x.score!==null).map(x=><p key={x.key}>{names[x.key]}: {x.score>=65?'often shaped your choices':x.score<45?'sometimes cost you':'still taking shape'}.</p>)}{d.evidenceCount<3&&<p>There is too little here to call it a pattern.</p>}<h2>What stayed with you</h2>{d.scars.length?d.scars.map(s=><p key={s.name}><strong>{SCAR_COPY[s.name]?.[0]||'An encounter that stayed'}</strong><br/>{SCAR_COPY[s.name]?.[1]||'Your choices left a mark on this visit.'}</p>):<p>No single encounter has left a defining mark yet.</p>}<button className="response" onClick={onReturn}>Keep looking at the harbour</button></section>;
}

export default function AppCore(){
 const [world,setWorld]=useState(initial),[focus,setFocus]=useState(null),[drawer,setDrawer]=useState(null),[message,setMessage]=useState(''),[pending,setPending]=useState(null),[page,setPage]=useState(0),[comic,setComic]=useState(null),[bag,setBag]=useState(null),[contact,setContact]=useState(null),[archive,setArchive]=useState(false),[readDay,setReadDay]=useState(-1),[hint,setHint]=useState(()=>!localStorage.getItem(SAVE)),[price,setPrice]=useState(6),[tradeItem,setTradeItem]=useState('Fresh Mackerel');
 const [readText,setReadText]=useState(null),[restOffer,setRestOffer]=useState(false);
 const {sound,enabled,toggle}=useSound(),pg=world.playerGame,p=world.actors.player;
 useEffect(()=>{try{localStorage.setItem(SAVE,JSON.stringify({version:1,world}))}catch{setMessage('Your browser could not save this visit. Keep this page open.')}},[world]);
 useEffect(()=>{const key=e=>{if(comic||pg.home||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='Escape'){setDrawer(null);setComic(null);setFocus(null);setBag(null)}if(e.key==='n')setDrawer(d=>d==='notes'?null:'notes');if(e.key==='p')setDrawer(d=>d==='phone'?null:'phone');if(e.key==='g')setDrawer(d=>d==='news'?null:'news')};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[comic,pg.home]);

 const scoped=focus?{...world,playerGame:{...pg,location:focus.location}}:world;
 const required=PLAYER_COUNTERPARTIES;
 const personPresent=!focus||!PEOPLE[focus.id]||world.actors[focus.id]?.location===focus.location;
 let actions=focus&&personPresent?visibleActions(scoped).filter(a=>(TARGET_ACTIONS[focus.id]||[]).includes(a.id)&&!a.disabled&&(!required[a.id]||world.actors[required[a.id]].location===focus.location)&&actionLine(a,world)):[];
 if(focus?.id==='crate')actions=actions.filter(a=>a.id!=='lime_represent'||!pg.lime.representation).filter(a=>a.id!=='lime_inspect'||!pg.lime.inspected).filter(a=>a.id!=='lime_deliver'||pg.lime.representation).filter(a=>a.id!=='lime_represent'||pg.lime.inspected||a.payload.mode!=='disclose');
 actions=actions.filter(a=>!world.production.playerActions.some(x=>x.id===a.id&&x.day===world.day));
 const known=focus&&p.contacts.includes(focus.id),isPerson=focus&&PEOPLE[focus.id],pageSize=isPerson?2:3,selectedActions=actions.slice(page*pageSize,page*pageSize+pageSize);

 function select(f){setReadText(null);setRestOffer(false);sound(AUDIO_CUES[f.location]?.[0]||'paper');setFocus(f);setDrawer(null);setPage(0);setPending(null);setMessage('');setHint(false);if(f.id==='orders'){setDrawer('trade');setBag(null)}}
 function blocked(reason){if(/attention|intervention/.test(reason)){setRestOffer(true);setFocus(null);setDrawer(null);setPending(null);setMessage('')}else setMessage(friendlyBlock(reason));}
 function arrive(w,loc){const n=visitLocation(w,loc);if(n.playerGame.location!==loc){blocked(n.playerGame.lastBlock||'attention');return null}return n}
 function choose(a){
  if(a.id==='trade_bridge'&&world.production.tradeStock.length){setPending(a);setMessage(`Sell this bundle for ${world.day%4===0?1:4} tins. It leaves your bag when the buyer pays.`);return}
  if(a.id==='joel_invitation'){setPending(a);setMessage(`Supper is on day ${world.day+4}. Bring the special catch: it costs 10 tins and arrives on day ${world.day+3}. It must still be fresh when you bring it.`);return}
  if(['lime_accept','invest_nursery','finance_receivable','speculate_lot','private_proxy','auction_finance','auction_bid','trade_bridge','misstate_public_listing','assemble_onewheel','race_juan','repay_race_drinks'].includes(a.id)){
   setPending(a);setMessage((ACTION_COPY[a.id]?.[1]||'Confirm this action.')+(a.id==='auction_finance'?` Repay on day ${pg.routes.yasmin.auctionDay+5}; the promised object is ${p.inventory.find(u=>!u.pledgedTo)?.kind||'not available'}.`:''));return;
  }
  execute(a);
 }
 function execute(a){
  setPending(null);if(!personPresent){setMessage('They have moved away. Look for them on the map.');return}
  let before=arrive(world,focus?.location||pg.location);if(!before)return;
  const after=performPlayerAction(before,a.id,a.payload);if(after.playerGame.lastBlock){blocked(after.playerGame.lastBlock);return}
  if(JSON.stringify(after)===JSON.stringify(before)){setMessage('Nothing changed. The person or object is not ready for that today.');return}
  const protectedActors=[focus?.id,required[a.id],...(a.id==='invite_toad_circle'?after.production.toadChat.members:a.id==='sonya_attend'?['joel']:[])];
  if(['joel_serve_juan','race_juan'].includes(a.id))protectedActors.push('joel','juan');
  const advanced=finishPlayerIntervention(world,after,[...new Set(protectedActors.filter(Boolean))]);
  setWorld(advanced);sound('coin');
  const result=a.id==='talk_here'?selectDialogue(after,a.payload.actor).text:readableResult(before,after,a);
  setMessage(result+(advanced.day>world.day?' The light changes. A new day begins.':''));setPage(0);
  if(['lime_inspect','sonya_attend','auction_bid','invite_toad_circle','race_juan'].includes(a.id)){
   const racePeople=a.id==='race_juan'?Object.entries(after.actors).filter(([id,x])=>id!=='player'&&!x.background&&x.location==='joels_bar').map(([id])=>id):[];
   const raceWon=a.id==='race_juan'&&after.playerGame.sunflower.owned&&!before.playerGame.sunflower.owned;
   setComic({
    location:focus?.location,
    title:{lime_inspect:'The short crate',sonya_attend:'Borrowed chairs',auction_bid:'The raised hand',invite_toad_circle:'A little circle',race_juan:'The wager'}[a.id],
    people:a.id==='race_juan'?racePeople:a.id==='invite_toad_circle'?after.production.toadChat.members.filter(id=>id!=='player'):a.id==='sonya_attend'?['joel','sonya']:[],
    person:a.id==='sonya_attend'?'joel':a.id==='auction_bid'?'yasmin':a.id==='race_juan'?null:'aspen',
    object:a.id==='lime_inspect'?'Lime':a.id==='race_juan'?(raceWon?'Sunflower':'glass'):a.id==='invite_toad_circle'?'toad':'paper',
    lines:a.id==='lime_inspect'?['The string comes loose.','Twenty limes. Three bruised.','“That is the whole crate?” The paper says twenty-four.']:a.id==='invite_toad_circle'?['The jar rests between the pots.',result,'For a while, nobody offers a price.']:a.id==='sonya_attend'?['A chair is pulled to the table.',result,'Someone passes the plate. Nobody counts the helpings.']:a.id==='race_juan'?[raceWon?'Juan puts the wheel down first.':'Juan reaches the mark first.',result,raceWon?'He nods toward the way out of the harbour.':'Joel starts counting the people whose drinks you now cover.']:['A hand goes up.',result,'The bowl stays on the cloth until the sale closes.'],
    choices:a.id==='lime_inspect'
   });
  }
 }
 function introduce(){const before=arrive(world,focus.location);if(!before)return;const after=performPlayerAction(before,'meet',{actor:focus.id});if(after.playerGame.lastBlock){blocked(after.playerGame.lastBlock);return}setWorld(finishPlayerIntervention(world,after,[focus.id]));setMessage(`“${PEOPLE[focus.id].name}.” You exchange names and a number. “Leave a message if I’m out.”`);sound('paper')}
 function nextDay(){setRestOffer(false);const next=advanceHarbourWindow(world);setWorld(next);setPage(0);setPending(null);setFocus(null);setDrawer(null);setBag(null);sound('water');const fills=next.market.tape.filter(t=>t.day===next.day&&(t.buyerId==='player'||t.sellerId==='player'));setMessage(fills.length?fills.map(t=>`${t.buyerId==='player'?'Bought':'Sold'} ${t.quantity} ${t.item} for ${t.price*t.quantity} tins.`).join(' '):next.weather!==world.weather?(next.weather==='storm'?'Rain on the water. The stones underfoot are wet.':'The rain has cleared.'): 'A new day. Boats and people have moved.');if(!pg.sunflower.owned&&next.playerGame.sunflower.owned)setComic({title:'A sunflower',person:'yasmin',object:'Sunflower',lines:['The sale is over.','The bowl changes hands. A sunflower comes with it.','You hold it. Nothing supernatural happens.']});}
 function order(side){const before=arrive(world,'public_clearing');if(!before)return;const n=placePublicOrder(before,'player',side,tradeItem,Number(price));if(n.market.orders.length===before.market.orders.length){blocked(n.playerGame.lastBlock||'Octopus cannot take that offer. Check the price, free tins and whether the object is already promised.');return}const settled=finishPlayerIntervention(world,n);setWorld(settled);const fill=settled.market.tape.slice(world.market.tape.length).find(t=>t.buyerId==='player'||t.sellerId==='player');setMessage(fill?`${fill.buyerId==='player'?'Bought':'Sold'} ${fill.quantity} ${itemLabel(fill.item)} for ${fill.price*fill.quantity} tins. ${fill.buyerId==='player'?'It is in your bag.':'It has left your bag.'}`:side==='sell'?`One ${tradeItem} is set aside. If someone pays ${price} tins, it changes hands as the harbour moves. Otherwise it stays yours.`:`${price} tins are set aside. If a seller accepts, you receive one ${tradeItem} as the harbour moves. Otherwise you keep your money.`);sound('paper')}

 const claims=world.claims.filter(c=>c.holderId==='player'||c.issuerId==='player'),inventory=p.inventory;
 const title=focus?(isPerson?personName(world,focus.id):{crate:'The crate',cargo:'The cargo',bowl:'The bowl',plants:'The plants',paper:'The paper',orders:'Octopus orders'}[focus.id]||'A closer look'):'';
 function edge(which){sound('paper');setDrawer(d=>d===which?null:which);if(which==='news')setReadDay(world.day);setFocus(null);setPending(null);setMessage('')}
 const localActions=Object.fromEntries(Object.keys(PLACES).map(location=>[location,visibleActions({...world,playerGame:{...pg,location}}).filter(a=>!a.disabled&&(!required[a.id]||world.actors[required[a.id]].location===location))]));
 const activeProps=new Set(PROPS.filter(([id,loc])=>id==='orders'||localActions[loc]?.some(a=>(TARGET_ACTIONS[id]||[]).includes(a.id))).map(([id])=>id));
 const dialogueText=message||(!personPresent?'They have moved away.':isPerson?selectDialogue(world,focus.id).text:reaction(world,focus?.id));
 const hasChoices=Boolean(pending||personPresent&&(!message||world.attention.used<world.attention.budget)&&(actions.length||isPerson));
 const guide=pg.sunflower.owned?'You have the sunflower. Your pocket book holds the story of this visit.':pg.lime.stage==='held'?'The lime crate is still in your hands. Count it before deciding what to say.':pg.routes.sonya.stage==='invited'?`Supper is on day ${pg.routes.sonya.supperDay+1}; the special catch must still be fresh.`:knows(world,K.mai_tai_ingredient)&&!knows(world,K.mai_tai_supplied)?'You worked out what Joel’s drink is missing. A real bottle still has to change hands.':knows(world,K.mai_tai_problem)&&!knows(world,K.mai_tai_ingredient)?'Joel’s Mai Tai tasted wrong. Look at what is actually on the bar before deciding why.':knows(world,K.juan_route)&&!knows(world,K.onewheel_plan)?'Juan’s wager needs one wheel. You still do not know the build; Aspen works with cargo and hardware at the berth.':knows(world,K.onewheel_plan)&&!pg.routes.juan.built?'Aspen marked the compatible build. Source the real parts, and remember how the short lime crate was handled.':pg.routes.juan.built&&!pg.sunflower.owned?`You can practise on open ground or find Juan at Joel’s Bar. Current race chance: ${Math.round(juanRaceChance(world)*100)}%.`:p.contacts.length?'Ask someone about the harbour, follow what you actually learned, or make a real trade through Octopus.':'You are looking for a sunflower. Someone in the harbour may know a way.';

 return <main className="harbour-game"><div className="world-layer" inert={comic||pg.home?'':undefined}>
  <HarbourMap world={world} selected={focus} onFocus={select} activeProps={activeProps}/>
  <header className="pocket-top"><button onClick={()=>edge('notes')} aria-label="Open money and notes">Sunflower <span>⌄</span></button><span>Day {world.day+1}</span><button onClick={nextDay} aria-label="Next day">☀ <small>Next day</small></button><button onClick={toggle} aria-label={enabled?'Mute sound':'Enable sound'}>{enabled?'♪':'♩'}</button></header>
  <aside className="edge-objects"><button onClick={()=>edge('news')} aria-label="Open newspaper" className={readDay<world.day?'unread':''}>▤<span>Paper</span></button><button onClick={()=>edge('phone')} aria-label="Open phone">▯<span>Phone</span></button></aside>
  {hint&&<p className="gesture-hint" onClick={()=>setHint(false)}>Drag to move · scroll or pinch to look closer<br/><small>Touch a person or an object.</small></p>}
  {message&&!focus&&!drawer&&<div className="world-reaction" role="status">{message}<button className="close" aria-label="Dismiss notice" onClick={()=>setMessage('')}>×</button></div>}

  {focus&&!comic&&drawer!=='trade'&&<section className="conversation" aria-label="Conversation"><button className="close" aria-label="Close conversation" onClick={()=>setFocus(null)}>×</button><strong>{title}</strong><SpokenLine key={dialogueText} text={dialogueText} hasChoices={hasChoices} onReady={()=>setReadText(dialogueText)} onDone={()=>{setFocus(null);setMessage('')}}/>
   {readText===dialogueText&&(pending?<div className="responses"><button className="response" onClick={()=>execute(pending)}>Yes, on those terms.</button><button className="response" onClick={()=>{setPending(null);setMessage('')}}>Let me think.</button></div>:isPerson&&!known?<div className="responses"><button className="response" onClick={introduce}>Hello. Can we keep in touch?</button></div>:<div className="responses">{isPerson&&known&&personPresent&&<button className="response" onClick={()=>execute({id:'talk_here',payload:{actor:focus.id}})}>Stay a moment.</button>}{selectedActions.slice(0,isPerson?2:3).map(a=><button className="response" key={a.id+JSON.stringify(a.payload)} onClick={()=>choose(a)}>{actionLine(a,world)}</button>)}{actions.length>pageSize&&<button className="response secondary" onClick={()=>setPage(n=>(n+1)*pageSize>=actions.length?0:n+1)}>Something else…</button>}{!actions.length&&<p className="quiet">{isPerson?'You can stay a moment, or leave them to it.':'You can leave it here for now.'}</p>}</div>)}
  </section>}

  {drawer&&<section className={`pocket-drawer drawer-${drawer}`} aria-label={drawer==='notes'?'Money and notes':drawer==='news'?'Newspaper':drawer==='phone'?'Phone':drawer==='restart'?'Start a new visit':'Trading'}><button className="close" aria-label="Close drawer" onClick={()=>setDrawer(null)}>×</button>
   {drawer==='news'&&<><h2>The Harbour Paper</h2><small>Day {world.day+1}</small>{world.newspaper.slice(archive?-8:-3).reverse().map(n=><article key={n.id}><h3>{NEWSPAPER_OVERRIDES[n.id]?.headline||visibleNames(world,n.headline)}</h3><p>{NEWSPAPER_OVERRIDES[n.id]?.report||visibleNames(world,n.report)}</p></article>)}<button className="response" onClick={()=>setArchive(x=>!x)}>{archive?'Fold the old pages away':'A few earlier pages'}</button></>}
   {drawer==='phone'&&<><h2>{UI_COPY.phone}</h2>{!p.contacts.length&&<p>No numbers yet. Say hello to someone in the harbour.</p>}{p.contacts.filter(id=>PEOPLE[id]).map(id=><button className="contact-line" key={id} onClick={()=>setContact(id)}>{PEOPLE[id].name}</button>)}{contact&&p.contacts.includes(contact)&&<article><h3>{PEOPLE[contact].name}</h3>{world.messages.filter(m=>m.to===contact||m.from===contact).slice(-4).map(m=><p key={m.id}>{m.from==='player'?'You: ':''}{m.text}</p>)}<button className="response" onClick={()=>{setWorld(phoneContact(world,contact,'Can we talk when you are free?'));setMessage('Message sent.');sound('phone')}}>Can we talk when you are free?</button></article>}{world.production.toadChat&&<article><h3>The little circle</h3><p>🐸 🌒 ?</p><p>A jar. A few people. An unfinished conversation.</p></article>}</>}
   {drawer==='notes'&&<><h2>{UI_COPY.pocketBook}</h2><p><strong>{availableCash(world,'player')} tins</strong> free to spend. A tin is money here.</p>{p.cash!==availableCash(world,'player')&&<p>{p.cash-availableCash(world,'player')} tins already promised.</p>}<p>{world.production.marketStanding.status==='SUSPENDED'?'Octopus will not take your public offers. Correct the record there, or speak to someone who arranges private sales.':world.production.marketStanding.strikes?'Octopus is checking your papers more closely.':'Octopus accepts your public offers.'}</p><h3>Promises</h3>{pg.commitments.filter(c=>c.status==='open').map(c=><p key={c.id}>{c.id==='lime-delivery'?'Return the lime crate':c.id==='grandma-supper'?'Bring the special catch to supper':c.id==='auction-bid'?'Wait for the bowl sale':c.id.startsWith('juan-race-drinks-')?`Pay Joel ${c.amountDue} tins for race drinks`:'Repay the borrowed tins'} · Day {c.dueDay+1}</p>)}{!pg.commitments.some(c=>c.status==='open')&&<p>Nothing due.</p>}{claims.map(c=><p key={c.id}>{c.issuerId==='player'?'You owe':'Owed to you'} {c.face} tins · Day {c.dueDay+1} · {c.status==='open'?'waiting':c.status==='settled'?'paid':'unpaid'}</p>)}<h3>Prices you have seen</h3>{world.market.tape.slice().reverse().map(t=><p key={t.id}>Day {t.day+1} · {t.quantity} {t.item} · {t.price} tins each</p>)}{!world.market.tape.length&&<p>No completed sales seen yet.</p>}{knows(world,K.juan_route)&&<><h3>Juan’s wager</h3><p>Beat Juan on one wheel and he will take you where you are trying to go. Lose and you cover the drinks for everyone actually at Joel’s Bar that day.</p>{knows(world,K.onewheel_plan)&&<p>Aspen’s assessment: steel rim, chain quick-link, brake cable and one compatible finishing piece. The parts must be free, not pledged or reserved. Aspen is also watching how the short lime delivery is handled.</p>}{pg.routes.juan.built&&<p>Practice: {pg.routes.juan.practice||0}. Current race chance: {Math.round(juanRaceChance(world)*100)}%. Same-day reruns are not free.</p>}</>}
   <h3>Your exchanges</h3>{world.production.playerActions.filter(a=>a.counterparty).slice().reverse().map((a,i)=><p key={i}>Day {a.day+1} · {personName(world,a.counterparty)||'At the counter'} · paid {a.cost}, received {a.revenue} tins</p>)}{pg.sunflower.owned&&<button className="response" onClick={()=>setWorld(performPlayerAction(world,'finish_run'))}>Look back on this visit</button>}<button className="response secondary" onClick={()=>setDrawer('restart')}>Start a new visit…</button></>}
   {drawer==='restart'&&<><h2>Start again?</h2><p>This replaces the saved visit in this browser.</p><button className="response" onClick={()=>{setWorld(createHarbourWorld());setDrawer(null);setFocus(null);setContact(null);setMessage('');setHint(true)}}>Yes, a new visit</button><button className="response" onClick={()=>setDrawer('notes')}>Keep this visit</button></>}
   {drawer==='trade'&&<><h2>Octopus</h2><p>“Tell me what you want, and your price. I’ll match it when a buyer and seller agree. I keep the promised money or object aside until then.”</p><label>One object<select value={tradeItem} onChange={e=>setTradeItem(e.target.value)}>{Object.entries(GOODS).filter(([k,v])=>v.mode==='PUBLIC_MARKET'&&(inventory.some(u=>u.kind===k)||world.market.orders.some(o=>o.status==='open'&&o.item===k))).map(([k])=><option key={k}>{k}</option>)}</select></label><label>Tins for one<input type="number" min="1" step="1" value={price} onChange={e=>setPrice(e.target.value)}/></label><div className="responses"><button className="response" onClick={()=>order('buy')}>I’ll pay {price} for one.</button>{inventory.some(u=>u.kind===tradeItem&&!u.pledgedTo)&&<button className="response" onClick={()=>order('sell')}>Sell mine for {price}.</button>}</div><h3>Papers on the counter</h3>{world.market.orders.filter(o=>o.status==='open'&&o.item===tradeItem).slice(0,5).map(o=><p key={o.id}>{o.side==='buy'?'Someone offers':'Someone asks'} {o.price} tins · {o.quantity} {o.item}</p>)}{pending?<div><p>{ACTION_COPY[pending.id]?.[1]}</p><button className="response" onClick={()=>execute(pending)}>Yes, on those terms.</button><button className="response" onClick={()=>setPending(null)}>Let me think.</button></div>:actions.filter(a=>['restitution','fire_sale','misstate_public_listing'].includes(a.id)).map(a=><button className="response" key={a.id} onClick={()=>choose(a)}>{actionLine(a,world)}</button>)}</>}
   {message&&<p role="status" className="receipt">{message}</p>}
  </section>}

  {!focus&&!drawer&&!comic&&!restOffer&&<p className="harbour-guide">{guide}</p>}
  {restOffer&&<section className="conversation" role="dialog" aria-label="Tomorrow"><p>There is not enough time left for that today.</p><button className="response" onClick={nextDay}>Start tomorrow.</button><button className="response" onClick={()=>setRestOffer(false)}>Keep looking around.</button></section>}

  <footer className="inventory-ribbon" aria-label="Your objects">{inventory.map(u=><button key={u.unitId} aria-label={`Your ${itemLabel(u.kind)}`} className={bag===u.unitId?'selected':''} onClick={()=>{setBag(bag===u.unitId?null:u.unitId);setMessage('');sound()}}><ObjectArt kind={u.kind}/><span>{itemLabel(u.kind)}</span>{u.pledgedTo&&<i aria-label="Promised as security">⌁</i>}</button>)}{world.production.tradeStock.length>0&&<button onClick={()=>{select({id:'packing',location:'joels_bar'});setMessage('This bundle is yours. Ask at the bar whether they need packing paper.')}}><ObjectArt kind="parcel"/><span>Packing bundle</span></button>}{world.production.toads.filter(t=>t.status==='held').map(t=><button key={t.id} onClick={()=>select({id:'plants',location:'nursery'})}><ObjectArt kind="toad"/><span>Little jar</span></button>)}{pg.sunflower.owned&&<button aria-label="Your sunflower" onClick={()=>setWorld(performPlayerAction(world,'finish_run'))}><ObjectArt kind="Sunflower"/><span>Sunflower</span></button>}{!inventory.length&&!pg.sunflower.owned&&!world.production.tradeStock.length&&!world.production.toads.some(t=>t.status==='held')&&<p>Your bag is empty.</p>}</footer>

  {bag&&inventory.some(u=>u.unitId===bag)&&<section className="object-slip"><button className="close" aria-label="Close object" onClick={()=>setBag(null)}>×</button><h3>{itemLabel(inventory.find(u=>u.unitId===bag).kind)}</h3><p>{inventory.find(u=>u.unitId===bag).pledgedTo?'Promised against a loan. Repay before offering it elsewhere.':'Yours to carry. A sale needs someone who will pay.'}</p>{GOODS[inventory.find(u=>u.unitId===bag).kind]?.mode==='PUBLIC_MARKET'&&<button className="response" onClick={()=>{setTradeItem(inventory.find(u=>u.unitId===bag).kind);setDrawer('trade');setFocus({id:'orders',location:'public_clearing'});setBag(null)}}>Offer it through Octopus</button>}{inventory.find(u=>u.unitId===bag).kind==='Exceptional Invitation Fish'&&<button className="response" onClick={()=>{select({id:'table',location:'sonyas_kitchen'});setBag(null)}}>Bring the fresh catch to supper</button>}{inventory.find(u=>u.unitId===bag).kind==='Built Onewheel'&&<button className="response" onClick={()=>{select({id:'path',location:'cliff_path'});setBag(null)}}>Take the wheel somewhere open to practise</button>}{inventory.find(u=>u.unitId===bag).kind==='Orgeat'&&<button className="response" onClick={()=>{select({id:'bottle',location:'joels_bar'});setBag(null)}}>Bring the bottle to the bar</button>}</section>}
 </div>
 {comic&&<Comic scene={comic} onClose={()=>setComic(null)}>{comic.choices&&['disclose','ambiguous','misrepresent'].map(mode=><button className="response" key={mode} onClick={()=>{execute({id:'lime_represent',payload:{mode}});setComic(null)}}>{actionLine({id:'lime_represent',payload:{mode}},world)}</button>)}</Comic>}
 {pg.home&&<Ending world={world} onReturn={()=>setWorld({...world,playerGame:{...pg,home:false}})}/>} 
 </main>;
}

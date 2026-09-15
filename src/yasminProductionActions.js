import {sourceState} from './npcEconomy.js';
import {
 arrangeWhaleOilDelivery,
 initializeYasminAccess,
 issueWongFakeTentacle,
 presentYasminCredential,
 proveSettlementCapacity,
 requestDimaFilmBrief,
 shareWhaleOilSourceLead,
} from './yasminAccess.js';

const IDS=new Set(['wong_film_rumor','yasmin_check_tentacle','dima_film_brief','dima_whale_oil_delivery','yasmin_whale_oil_lead','yasmin_prove_capacity']);
const freePlayerUnit=(w,kind)=>{const reserved=new Set((w.market?.reservations||[]).filter(r=>r.actorId==='player'&&r.kind==='unit').map(r=>r.unitId));return w.actors.player.inventory.find(u=>u.kind===kind&&!u.pledgedTo&&!reserved.has(u.unitId));};

export function yasminFilmProductionActions(w){
 const state=initializeYasminAccess(w),l=w.playerGame.location,rows=[];
 const add=(id,label,location,disabled=null)=>{if(l===location)rows.push({id,label,disabled:!!disabled,reason:disabled});};
 const fake=state.credentials.find(c=>c.kind==='Dried Octopus Tentacle'&&c.ownerId==='player');
 if(!state.invited&&!fake)add('wong_film_rumor','Ask Wong about the private film night','parcel_counter');
 if(fake&&!state.fakeTokenChecked)add('yasmin_check_tentacle','Show Yasmin Wong’s “invitation”','viewing_room',w.actors.yasmin.location!=='viewing_room'?'Yasmin is not in the viewing room':null);
 const discoveredEntry=state.fakeTokenChecked||w.actors.player.contacts.includes('yasmin');
 if(discoveredEntry&&!state.dimaBriefKnown)add('dima_film_brief','Ask Dima what Yasmin is actually looking for','back_room',!w.actors.player.contacts.includes('dima')?'Meet Dima first':null);
 if(state.whaleOilNeedKnown&&!state.whaleOilDelivered){
  const oil=freePlayerUnit(w,'Sperm Whale Oil');
  if(oil)add('dima_whale_oil_delivery','Have Dima settle the Whale Oil delivery','back_room',w.actors.dima.location!=='back_room'?'Dima is not in the back room':null);
  else if(!state.playerContribution){
   const source=sourceState(w,'Sperm Whale Oil');
   const usable=['SOURCE_LOCATED','LOCALLY_AVAILABLE'].includes(source.status);
   add('yasmin_whale_oil_lead','Offer Yasmin your Whale Oil source lead','viewing_room',!usable?'You do not have an actionable Whale Oil source yet':null);
  }
 }
 if(state.invited&&!state.capacityApproved)add('yasmin_prove_capacity','Show Yasmin you can settle an auction bid','viewing_room');
 return rows;
}

export function isYasminFilmProductionAction(id){return IDS.has(id);}

export function performYasminFilmProductionAction(w,id){
 const state=initializeYasminAccess(w);let result={ok:false,reason:'unknown film access action'};
 if(id==='wong_film_rumor')result=issueWongFakeTentacle(w);
 if(id==='yasmin_check_tentacle'){
  const fake=state.credentials.find(c=>c.kind==='Dried Octopus Tentacle'&&c.ownerId==='player');
  result=fake?presentYasminCredential(w,fake.id):{ok:false,reason:'no dried tentacle to show'};
  // Rejection is the authored successful consequence of this action.
  if(result.reason==='not_an_invitation')result={...result,ok:true,rejected:true};
 }
 if(id==='dima_film_brief')result=requestDimaFilmBrief(w,{role:'outsider'});
 if(id==='dima_whale_oil_delivery')result=arrangeWhaleOilDelivery(w,{sellerId:'player'});
 if(id==='yasmin_whale_oil_lead')result=shareWhaleOilSourceLead(w,{mode:'sell'});
 if(id==='yasmin_prove_capacity')result=proveSettlementCapacity(w);
 if(!result.ok)w.playerGame.lastBlock=result.reason||'That route is not available now.';
 return result;
}

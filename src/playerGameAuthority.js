import * as legacy from './playerGameLegacy.js';
import {canEnterFilmAuction} from './yasminAccess.js';

const YASMIN_AUCTION_ACTIONS=new Set([
 'auction_preview','auction_inspect','auction_provenance','auction_finance','auction_bid','auction_walk',
]);
const ACCESS_BLOCK='Private auction access requires Yasmin’s invitation and verified settlement capacity.';

function blockedCopy(current){
 const w=structuredClone(current);
 w.playerGame.lastBlock=ACCESS_BLOCK;
 return w;
}

export function visibleActions(w){
 const rows=legacy.visibleActions(w);
 if(canEnterFilmAuction(w))return rows;
 return rows.filter(row=>!YASMIN_AUCTION_ACTIONS.has(row.id));
}

export function performPlayerAction(current,id,payload={}){
 if(YASMIN_AUCTION_ACTIONS.has(id)&&!canEnterFilmAuction(current))return blockedCopy(current);
 return legacy.performPlayerAction(current,id,payload);
}

export function resolvePlayerDay(w){
 if(!canEnterFilmAuction(w)){
  const commitment=w.playerGame?.commitments?.find(c=>c.id==='auction-bid'&&c.status==='open');
  if(commitment){
   commitment.status='released';
   const route=w.playerGame.routes?.yasmin;
   if(route){route.bid=null;if(route.stage==='bid')route.stage='unseen';}
  }
 }
 return legacy.resolvePlayerDay(w);
}

import {ACTION_COPY as COPY, actionIntent, friendlyBlock} from './presentationCopy.js';
import {reactionText} from './dialogueContent.js';
export {friendlyBlock};

export const ACTION_COPY=Object.fromEntries(Object.entries(COPY).map(([id,c])=>[id,[c.intent,c.terms||c.result]]));

export const TARGET_ACTIONS={
  aspen:['aspen_onewheel_plan','assemble_onewheel','aspen_modify_onewheel','operate_inspection'],
  joel:['mai_tai_taste','mai_tai_check_shelf','joel_hear_supper','joel_invitation','joel_supply_orgeat','joel_serve_juan','joel_patronage','joel_help','repay_race_drinks'],
  juan:['juan_explain_goal','juan_race_offer','race_juan','juan_field_trip','invest_nursery','finance_receivable','sell_toad'],
  yasmin:['auction_preview','auction_finance','repay_finance'],
  wong:['sell_toad'],
  dima:['private_proxy'],
  crate:['lime_accept','lime_inspect','lime_represent','lime_refuse','lime_deliver'],
  cargo:['buy_part','source_orgeat','source_invitation_fish','operate_inspection','aspen_onewheel_plan'],
  bottle:['joel_supply_orgeat','mai_tai_check_shelf'],
  glass:['mai_tai_taste','joel_patronage','joel_hear_supper','joel_help','joel_serve_juan','intermediate_lead'],
  packing:['trade_bridge'],
  parcel:[],
  parts:['assemble_onewheel','aspen_modify_onewheel'],
  plants:['invest_nursery','invite_toad_circle'],
  paper:['finance_receivable'],
  bowl:['auction_preview','auction_inspect','auction_bid','auction_walk','speculate_lot'],
  photo:['auction_provenance','share_provenance'],
  envelope:['private_proxy','repay_finance'],
  table:['sonya_attend'],
  path:['practice_onewheel'],
  orders:['restitution','fire_sale','misstate_public_listing'],
  toad:['collect_toad']
};

export function actionLine(a,w){
  if(a.id==='trade_bridge'&&w.production.tradeStock.length)return 'Would you buy the packing bundle?';
  if(a.id==='aspen_modify_onewheel')return 'Could you look at the wheel again?';
  return actionIntent(a);
}

export function reaction(w,id){
  if(w.actors[id])return reactionText(w,id);
  const r=w.playerGame.routes;
  const knowsIngredient=w.playerGame.knowledge?.includes('mai_tai_ingredient');
  const knowsWheelPlan=w.playerGame.knowledge?.includes('onewheel_plan');
  return {
    packing:w.production.tradeStock.length?'Your bundle of packing paper. Someone here may need it.':'A bundle left beside the counter. The price is 2 tins.',
    crate:w.playerGame.lime.inspected?'Twenty limes. Three bruised. A separate paper says 24.':'A tied crate. The paper says 24 limes.',
    cargo:knowsWheelPlan?'A berth manifest with the compatible rim, link, cable and finishing stock Aspen marked for the build.':'A manifest under a stone. Hardware, bottles and packing stock move through with the boats.',
    bottle:knowsIngredient?'The Orgeat bottle you identified from Joel’s shelf and drink card.':'A bottle-shaped gap and several labels behind the glasses. Nothing here is a quest marker.',
    glass:w.playerGame.knowledge?.includes('mai_tai_problem')?'A wet glass from Joel’s unfinished Mai Tai. You remember the missing middle.':'A wet ring on the bar. Someone has just left.',
    parcel:'Paper, twine and a bundle waiting to be used.',
    parts:knowsWheelPlan?'The compatible parts Aspen marked for the one-wheel build.':'Mixed repair hardware. You do not yet know which pieces matter to you.',
    plants:'Pots in rows. Some leaves are greener than others.',
    paper:'A promise to pay, weighted down with a terracotta chip.',
    bowl:'A bowl on folded cloth. Look before offering money.',
    photo:'A photograph beside a label. Their marks can be compared.',
    envelope:'An envelope is pushed to the edge of the table.',
    table:r.sonya.stage==='invited'?`Your chair is waiting on day ${r.sonya.supperDay}. Bring the fresh catch.`:'Borrowed chairs around a kitchen table. This is someone else’s supper.',
    path:r.juan.built?'Open ground where you can practise without pretending one run guarantees anything.':'Loose stones above the sea. The path is steep.',
    orders:'Leave a price with Octopus. As time passes, a matching buyer or seller can take it. Until then, the promised money or object is set aside.',
    toad:'Something moved under that leaf.'
  }[id]||'The harbour carries on.';
}

export function readableResult(before,after,a){
  if(after.playerGame.lastBlock)return friendlyBlock(after.playerGame.lastBlock);
  if(a.id==='trade_bridge')return after.production.tradeStock.length<before.production.tradeStock.length?`The bundle changes hands. You receive ${after.actors.player.cash-before.actors.player.cash} tins.`:'Two tins paid. The bundle is yours now.';
  if(a.id==='lime_represent')return 'She writes your words on the paper. The crate is still waiting for delivery.';
  if(a.id==='lime_deliver')return after.playerGame.lime.representation==='disclose'?'“Twenty, then.” She pays 6 tins and writes the shortage down.':'She pays 8. Later, the count does not match your words. She will remember.';
  if(a.id==='joel_invitation')return `“Day ${after.playerGame.routes.sonya.supperDay}. Bring the special fresh catch; it arrives the day before.”`;
  if(a.id==='buy_part')return `The ${a.payload.kind.toLowerCase()} is in your bag.`;
  if(a.id==='aspen_modify_onewheel')return 'Aspen uses her own torque wrench to true the wheel. The tool stays with her; the favor does not.';
  if(a.id==='auction_finance')return `Eight tins now. Repay nine on day ${after.claims.at(-1).dueDay}. ${after.actors.player.inventory.find(u=>u.pledgedTo)?.kind} is promised until you repay.`;
  if(a.id==='race_juan'){
    if(after.playerGame.routes.juan.stage==='won'&&before.playerGame.routes.juan.stage!=='won')return 'You win. Juan says he will take you there now.';
    const debt=after.playerGame.commitments.find(x=>x.id.startsWith('juan-race-drinks-')&&['open','breached'].includes(x.status));
    const paid=before.actors.player.cash-after.actors.player.cash;
    return debt?`You lose. ${paid} tins go to the bar now; ${debt.amountDue} tins remain owed for the drinks.`:`You lose. ${paid} tins go to Joel for everyone’s drinks.`;
  }
  if(a.id==='juan_field_trip')return 'Juan leads you out beyond the familiar harbour path. The wager is kept before the sunflower changes hands.';
  const delta=after.actors.player.cash-before.actors.player.cash;
  return `${COPY[a.id]?.result||'The exchange is finished.'}${delta?` (${delta>0?'+':''}${delta} tins.)`:''}`;
}

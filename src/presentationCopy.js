// SUNFLOWER — player-facing presentation copy pack
// Keep engine terminology out of this module. Safe to expand without touching simulation logic.

export const LOCATION_LABELS = {
  harbour_berth:'Berth',
  joels_bar:'Bar',
  parcel_counter:'Parcel shop',
  nursery:'Nursery',
  viewing_room:'Gallery',
  back_room:'Back room',
  sonyas_kitchen:'Kitchen',
  cliff_path:'Cliff path',
  public_clearing:'Exchange'
};

export const ACTION_COPY = {
  joel_hear_supper:{intent:'Long evening?',result:'He glances at the nearly empty almond-syrup bottle before answering.'},
  source_orgeat:{intent:'I’ll take the almond syrup. · 6 tins',result:'One sealed bottle goes into your bag.'},
  joel_supply_orgeat:{intent:'This is for the bar.',result:'Joel reads the label twice, then clears a place behind the counter.'},
  joel_patronage:{intent:'A drink, please. · 3 tins',result:'Joel puts a glass down in front of you and waits for your face to answer first.'},
  joel_help:{intent:'I’ll take these.',result:'You move the empty glasses. One is not empty. Joel catches your wrist before you lift it.'},
  joel_invitation:{intent:'You were saying something about supper?',result:'Joel pulls one of the borrowed chairs away from the wall.'},
  source_invitation_fish:{intent:'I’ll take that catch. · 10 tins',result:'The fish is wrapped while it is still cold.'},
  sonya_attend:{intent:'I brought this.',result:'The borrowed chairs do not match. Nobody fixes them.'},
  auction_preview:{intent:'May I look?',result:'The object stays on the cloth. You are allowed closer.'},
  auction_inspect:{intent:'May I turn it over?',result:'A repaired line crosses the glaze. The old label is still attached.'},
  auction_provenance:{intent:'Put the photograph beside it.',result:'The mark in the photograph matches. The repair does not.'},
  auction_bid:{intent:'Sixteen tins.',result:'Your money is held until the sale resolves.'},
  auction_finance:{intent:'Could you advance eight?',result:'Eight tins now. Nine later. One of your objects stays attached to the promise.'},
  repay_finance:{intent:'Here is what I owe.',result:'The debt is closed. The object is no longer attached to it.'},
  auction_walk:{intent:'Not at that price.',result:'You leave without raising your hand.'},
  juan_plan:{intent:'What is up that path?',result:'Juan looks toward the cliff before he answers.'},
  assemble_onewheel:{intent:'Let’s fit these.',result:'The parts become one awkward wheel. The fittings need a night before the cliff.'},
  cliff_commit:{intent:'The fittings are ready.',result:'The sea is below you now.'},
  lime_accept:{intent:'I’ll take the crate. · 5 tins',result:'The paper says twenty-four. The string is still tied.'},
  lime_inspect:{intent:'Let me count.',result:'Twenty. Three bruised. The paper says twenty-four.'},
  lime_refuse:{intent:'I’m returning it.',result:'Most of your money comes back. One tin stays spent on handling.'},
  lime_deliver:{intent:'Here is the crate.',result:'The crate changes hands.'},
  trade_bridge:{intent:'What about this packing bundle?',result:'The bundle has a buyer only if somebody actually wants it.'},
  operate_inspection:{intent:'Want another pair of eyes on that cargo?',result:'You count the lot and hand the paper back.'},
  invest_nursery:{intent:'I’ll put six into this.',result:'Six tins leave your pocket. The plants do not become faster.'},
  finance_receivable:{intent:'Five now for that paper.',result:'Juan gets cash today. You get the right to a later payment.'},
  intermediate_lead:{intent:'I heard something you might use.',result:'Once told, the same fact is no longer new.'},
  speculate_lot:{intent:'Eight on this lot.',result:'Eight tins leave now. The later price is not promised.'},
  private_proxy:{intent:'Can you place this privately?',result:'Dima names his fee before asking anything else.'},
  misstate_public_listing:{intent:'Write “perfect condition.”',result:'The description is now stronger than what you know to be true.'},
  fire_sale:{intent:'I need cash now.',result:'Urgency has a price.'},
  share_provenance:{intent:'You should see this too.',result:'The clue is no longer yours alone.'},
  restitution:{intent:'I’ll correct the paper. · 4 tins',result:'The correction is recorded.'},
  collect_toad:{intent:'There you are.',result:'A cool little weight settles into your palm.'},
  invite_toad_circle:{intent:'Sit for a minute?',result:'Only the people who are actually free come over.'},
  sell_toad:{intent:'Want this little jar? · 2 tins',result:'The jar passes into other hands.'},
  finish_run:{intent:'I’m done.',result:'You still have the sunflower.'}
};

export function actionIntent(action){
  if(!action)return null;
  if(action.id==='buy_part')return `I’ll take the ${String(action.payload?.kind||'part').toLowerCase()}. · ${action.payload?.price} tins`;
  if(action.id==='lime_represent'){
    if(action.payload?.mode==='disclose')return 'I counted twenty. Three are bruised.';
    if(action.payload?.mode==='ambiguous')return 'It is as I received it.';
    return 'All twenty-four are here.';
  }
  return ACTION_COPY[action.id]?.intent||null;
}

export const actionResult=id=>ACTION_COPY[id]?.result||'It is done.';

export function friendlyBlock(raw=''){
  const s=String(raw);
  if(/attention/i.test(s))return 'There is not enough time left today. You can still look around.';
  if(/cash|fund|tin|🥫/i.test(s))return 'You do not have enough unpromised money for that.';
  if(/not present|away|not available|without her|host present/i.test(s))return 'They are somewhere else now.';
  if(/bench.*occupied/i.test(s))return 'The bench is in use.';
  if(/Assembly needs/i.test(s))return 'You are missing parts.';
  if(/storm|unsafe/i.test(s))return 'The path is too wet.';
  if(/fittings|cycle/i.test(s))return 'The fittings need a night.';
  if(/already been taken|no longer hold/i.test(s))return 'That is no longer yours to act on.';
  if(/preview closed/i.test(s))return 'You missed this preview.';
  if(/preview access/i.test(s))return 'You have not been invited close enough to inspect it.';
  return 'Not now.';
}

export const NEWSPAPER_OVERRIDES = {
  'news-opening':{headline:'Parcels accepted',report:'The parcel shop is accepting parcels. Bring yours to the counter.'},
  'news-supper':{headline:'Borrowed chairs',report:'Several chairs crossed the square this morning. Nobody agrees yet who they are for.'},
  'news-auction':{headline:'A bowl for sale',report:'A private preview opens before the sale. Looking is free.'},
  'news-tide':{headline:'Above the wet path',report:'Someone carried a little jar uphill. Nobody would explain.'}
};

export const UI_COPY = {
  nextDay:'Next day',
  phone:'Phone',
  paper:'Paper',
  pocketBook:'Pocket book',
  exchange:'Exchange',
  close:'Close',
  emptyBag:'Your bag is empty.',
  noContacts:'No numbers yet.',
  noPromises:'Nothing due.',
  noSalesSeen:'No completed sales seen yet.'
};

// Terms are shown before accepting a material promise, alongside the authored intent.
const TERMS={
 lime_accept:'Pay 5 tins now. Return the crate within two days. The paper says 24 limes; you can count before saying what you will deliver.',
 auction_bid:'16 tins are held until tomorrow. The highest offer wins the bowl. If someone offers more, you keep your money.',
 auction_finance:'Receive 8 tins now; repay 9. One of your objects is promised until repayment. The due date and object are written below.',
 source_orgeat:'One sealed bottle of almond syrup costs 6 tins. You can bring it to the bar.',
 joel_patronage:'One drink costs 3 tins.',
 invest_nursery:'Pay 6 now. In five days you receive a share of the crop sale. It may return less than you paid.',
 finance_receivable:'Pay Juan 5 now. He promises you 7 from the crop sale in four days. A promise is not money you can spend today.',
 speculate_lot:'Pay 8 now. Your share sells in three days. You may get back less than 8.',
 private_proxy:'Pay 3 tins to arrange a private sale. This does not reopen the public counter.',
 trade_bridge:'Buy the packing bundle for 2 tins. Someone may pay more later; a sale is not promised.',
 assemble_onewheel:'Pay 3 tins. Your rim, chain link, brake cable and finishing piece become one wheel. Wait a night before taking the cliff.',
 juan_plan:'“A sunflower, up there. Bring a steel rim, chain link, brake cable and handlebar tape to the parcel bench. Let the wheel settle overnight. Wait for a dry path.”',
 misstate_public_listing:'You know the object is not as described. A complaint can make the clerk refuse your next offers.'
};
for(const [id,terms] of Object.entries(TERMS))ACTION_COPY[id].terms=terms;

// Display copy only: causal triggers and evidence remain in playerDiagnosis.js.
export const SCAR_COPY = {
 'FIRST THROUGH THE GAP':['Before the price changed','You completed a sale while two prices still differed.'],
 'CLOSED THE SPREAD':['A price someone accepted','You left an offer, and someone traded at it.'],
 'WRONG SIGN':['Bought, then spoiled','Something you bought went bad before it could help you.'],
 'CUT THE MIDDLE':['Dealt directly','You bought goods yourself and completed the crate exchange.'],
 'SOLD IT BEFORE YOU HAD IT':['An unkept promise','You left an offer and later missed a promise.'],
 'RICH, BROKE':['Money out of reach','You tied up money in a bid and missed another promise.'],
 'FIRE SALE':['Sold in a hurry','With a payment pressing, you accepted a sale.'],
 'BORROWED TRUST':['The crate between you','Someone trusted your delivery. The result stayed with both of you.'],
 'EXCLUSIVE':['Looked before bidding','You compared the photograph before committing your money.'],
 'SOLD THE MAP':['A useful introduction','You passed on information that helped a trade happen.'],
 'TAUGHT YOUR RIVAL':['A shared clue','You shared what you found, then lost the sale.'],
 'PAID FOR THE STORY':['Believed enough to bid','You saw the bowl and promised money for it.'],
 'SNAKE OIL':['You knew the count','You counted the shortage, then said the crate was full.'],
 'TECHNICALLY TRUE':['The part left unsaid','Your words left out what the buyer needed to know.'],
 'MADE A MARKET IN LEMONS':['Twenty, then','You showed the damaged limes and agreed on a different price.'],
 'CAUGHT BEFORE DELIVERY':['Opened the crate','You counted the limes before deciding what to say.'],
 'RUN ON YOU':['Asked for cash','People stopped accepting your word, and you had to sell.'],
 'BOUGHT THE PAPER':['The old photograph','What you found in the picture helped you choose the bowl.'],
 'ROLLED IT FORWARD':['Asked for more time','You spoke about the payment and agreed on another date.'],
 'KEPT THE COLLATERAL':['The object stayed','The promised payment did not come; the object was kept instead.'],
 'THE GUARANTEE WAS CALLED':['Your promise cost money','You had vouched for a delivery. When it failed, you paid.'],
 "WINNER'S CURSE":['Paid more to win','You won the bowl, but paid more than your checks supported.'],
 'WALKED AWAY':['Left the bowl there','You saw the asking price and chose to keep your money.'],
 'PYRRHIC BLOOM':['Something left unfinished','You reached the sunflower, but another promise was missed.']
};

export const itemLabel=kind=>({'Exceptional Invitation Fish':'Fresh supper catch','Built Onewheel':'Onewheel','Orgeat':'Almond syrup'})[kind]||kind;

export function spokenLines(text){return String(text).match(/[^.!?。！？\n]+(?:[.!?。！？]+[”"']?|$)/gu)?.map(s=>s.trim()).filter(s=>/[\p{L}\p{N}]/u.test(s))||[''];}
